import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { polar } from "./subscriptions";

const http = httpRouter();

auth.addHttpRoutes(http);

// Register the webhook handler at /polar/events
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
polar.registerRoutes(http as any);

// --- Hybrid adapter WEBHOOK PATH: external backend posts results/events here ---
http.route({
  path: "/backend/webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const secret = req.headers.get("x-webhook-secret");
    if (!secret || secret !== process.env.BACKEND_WEBHOOK_SECRET) {
      return new Response("unauthorized", { status: 401 });
    }
    const payload = (await req.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const type = typeof payload.type === "string" ? payload.type : "event";

    if (type === "job.result" && typeof payload.jobId === "string") {
      await ctx.runMutation(internal.jobs.complete, {
        // biome-ignore lint/suspicious/noExplicitAny: id validated by Convex
        jobId: payload.jobId as any,
        result: payload.result,
        error: typeof payload.error === "string" ? payload.error : undefined,
      });
    } else {
      await ctx.runMutation(internal.backend.ingestEvent, {
        workspaceId:
          typeof payload.workspaceId === "string"
            ? // biome-ignore lint/suspicious/noExplicitAny: id validated by Convex
              (payload.workspaceId as any)
            : undefined,
        source: "backend",
        type,
        payload,
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }),
});

// --- API key verification (programmatic access) ---
http.route({
  path: "/api/verify-key",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const key = req.headers.get("x-api-key") ?? "";
    const json = (body: unknown, status: number) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      });
    if (!key) return json({ valid: false }, 401);
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(key),
    );
    const hash = Array.from(new Uint8Array(buf), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
    const found = await ctx.runQuery(internal.apiKeys.resolveByHash, { hash });
    return json({ valid: !!found, ...(found ?? {}) }, found ? 200 : 401);
  }),
});

// -----------------------------------------------------------------------------
// Biometric Hardware Webhook: POST /api/biometric/push
// -----------------------------------------------------------------------------
http.route({
  path: '/api/biometric/push',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    const jsonResponse = (body: unknown, status: number) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      });

    // 1. Validate payload size (< 5MB)
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 5 * 1024 * 1024) {
      return jsonResponse({ error: 'payload_too_large', message: 'Payload exceeds 5MB limit' }, 413);
    }

    // 2. Extract Auth Headers
    const deviceSerial = req.headers.get('x-device-serial');
    const signature = req.headers.get('x-signature');
    const timestampHeader = req.headers.get('x-timestamp');
    const nonce = req.headers.get('x-nonce');
    const workspaceIdHeader = req.headers.get('x-workspace-id');

    if (!deviceSerial || !signature || !timestampHeader || !nonce) {
      return jsonResponse({
        error: 'missing_headers',
        message: 'Missing required headers: x-device-serial, x-signature, x-timestamp, x-nonce',
      }, 400);
    }

    // 3. Timestamp Freshness Check (+/- 300 seconds)
    const reqTimestamp = Number(timestampHeader);
    if (isNaN(reqTimestamp)) {
      return jsonResponse({ error: 'invalid_timestamp', message: 'x-timestamp must be an integer epoch ms or seconds' }, 400);
    }
    const now = Date.now();
    const reqTimeMs = reqTimestamp < 10000000000 ? reqTimestamp * 1000 : reqTimestamp;
    const timeDiffSeconds = Math.abs(now - reqTimeMs) / 1000;
    if (timeDiffSeconds > 300) {
      return jsonResponse({ error: 'timestamp_expired', message: 'Request timestamp is outside the 300s acceptable window' }, 401);
    }

    // 4. Resolve Device & Secret
    let targetWorkspaceId = workspaceIdHeader;
    let device = null;

    if (targetWorkspaceId) {
      device = await ctx.runQuery(internal.biometric.getDeviceForAuth, {
        workspaceId: targetWorkspaceId as any,
        deviceSerial,
      });
    } else {
      const matchingDevices = await ctx.runQuery(internal.biometric.getDevicesBySerial, { deviceSerial });
      if (matchingDevices.length === 1 && matchingDevices[0]) {
        const singleMatch = matchingDevices[0];
        targetWorkspaceId = singleMatch.workspaceId;
        device = await ctx.runQuery(internal.biometric.getDeviceForAuth, {
          workspaceId: singleMatch.workspaceId,
          deviceSerial,
        });
      } else if (matchingDevices.length > 1) {
        return jsonResponse({
          error: 'ambiguous_device_serial',
          message: 'Device serial exists in multiple workspaces; x-workspace-id header is required',
        }, 400);
      }
    }

    if (!device || !device.secret) {
      return jsonResponse({ error: 'device_not_found', message: 'Device not recognized or credentials corrupted' }, 401);
    }

    // 5. Device Status Check
    if (device.status !== 'active') {
      return jsonResponse({
        error: 'device_inactive',
        message: 'Device is ' + device.status + '; communication rejected',
      }, 403);
    }

        // 6. Verify HMAC-SHA256 Signature over exact raw body using Web Crypto API
    const rawBody = await req.text();
    const signaturePayload = timestampHeader + '.' + nonce + '.' + rawBody;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(device.secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
    const expectedSigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(signaturePayload));
    const expectedSignature = Array.from(new Uint8Array(expectedSigBuf), (b) =>
      b.toString(16).padStart(2, '0')
    ).join('');

    if (signature.length !== expectedSignature.length) {
      return jsonResponse({ error: 'invalid_signature', message: 'HMAC signature verification failed' }, 401);
    }
    let diff = 0;
    for (let i = 0; i < signature.length; i++) {
      diff |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    if (diff !== 0) {
      return jsonResponse({ error: 'invalid_signature', message: 'HMAC signature verification failed' }, 401);
    }
    // 7. Atomic Replay Protection (Nonce Claim)
    const nonceClaim = await ctx.runMutation(internal.biometric.claimNonce, {
      workspaceId: device.workspaceId,
      deviceSerial,
      nonce,
      timestamp: reqTimeMs,
    });

    if (!nonceClaim.accepted) {
      return jsonResponse({ error: 'replay_detected', message: 'Nonce has already been used within replay window' }, 409);
    }

    // 8. Parse and Validate Payload Structure
    let parsedPayload: any;
    try {
      parsedPayload = JSON.parse(rawBody);
    } catch (e) {
      return jsonResponse({ error: 'invalid_json', message: 'Request body could not be parsed as JSON' }, 400);
    }

    // 9. Process Heartbeat if present
    if (parsedPayload.type === 'heartbeat') {
      await ctx.runMutation(internal.biometric.recordHeartbeat, {
        workspaceId: device.workspaceId,
        deviceSerial,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || undefined,
        timestamp: reqTimeMs,
      });
      return jsonResponse({ success: true, type: 'heartbeat_acknowledged', timestamp: now }, 200);
    }

    // 10. Process Punches Ingestion
    const rawPunches = Array.isArray(parsedPayload.punches) ? parsedPayload.punches : [];
    if (rawPunches.length === 0 && parsedPayload.type !== 'heartbeat') {
      return jsonResponse({ error: 'empty_payload', message: 'No valid punches found in payload' }, 400);
    }

    const validatedPunches: Array<{
      biometricUserId: string;
      punchTimestamp: number;
      punchType: 'check_in' | 'check_out' | 'break_out' | 'break_in' | 'auto';
      punchDate: string;
    }> = [];

    for (const p of rawPunches) {
      if (!p.biometricUserId || !p.punchTimestamp) continue;
      const pTimeMs = Number(p.punchTimestamp) < 10000000000 ? Number(p.punchTimestamp) * 1000 : Number(p.punchTimestamp);
      const punchDate = p.punchDate || new Date(pTimeMs).toISOString().slice(0, 10);
      const allowedTypes = ['check_in', 'check_out', 'break_out', 'break_in', 'auto'];
      const punchType = allowedTypes.includes(p.punchType) ? p.punchType : 'auto';
      validatedPunches.push({
        biometricUserId: String(p.biometricUserId).trim(),
        punchTimestamp: pTimeMs,
        punchType,
        punchDate,
      });
    }

    const ingestionResult = await ctx.runMutation(internal.biometric.ingestRawPunches, {
      workspaceId: device.workspaceId,
      deviceId: device._id,
      deviceSerial,
      punches: validatedPunches,
    });

    return jsonResponse({
      success: true,
      deviceSerial,
      ingestion: ingestionResult,
    }, 200);
  }),
});

export default http;
