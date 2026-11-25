import { ConvexError, v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';
import { internalMutation, internalQuery, mutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { audit } from './auditLog';
import { requireRole } from './orgs';

function bufToHex(buf: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function getMasterAesKey(): Promise<CryptoKey> {
  const envKey = process.env.BIOMETRIC_ENCRYPTION_KEY || 'indiapay-biometric-default-enc-key';
  const enc = new TextEncoder();
  const rawHash = await crypto.subtle.digest('SHA-256', enc.encode(envKey));
  return await crypto.subtle.importKey('raw', rawHash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function encryptSecret(secret: string): Promise<{ ciphertext: string; iv: string }> {
  const key = await getMasterAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(secret));
  return {
    ciphertext: bufToHex(cipherBuf),
    iv: bufToHex(iv),
  };
}

export async function decryptSecret(ciphertextHex: string, ivHex: string): Promise<string> {
  const key = await getMasterAesKey();
  const cipherBuf = hexToBuf(ciphertextHex);
  const iv = hexToBuf(ivHex);
  const decryptedBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBuf);
  return new TextDecoder().decode(decryptedBuf);
}

export async function generateFingerprint(secret: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuf = await crypto.subtle.digest('SHA-256', enc.encode(secret));
  return bufToHex(hashBuf).slice(0, 16);
}

export async function computeSha256(data: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuf = await crypto.subtle.digest('SHA-256', enc.encode(data));
  return bufToHex(hashBuf);
}

export const registerDevice = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    name: v.string(),
    deviceSerial: v.string(),
    deviceModel: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('Unauthenticated');
    await requireRole(ctx, userId, args.workspaceId, ['admin']);

    const cleanSerial = args.deviceSerial.trim();
    if (!cleanSerial) throw new ConvexError('Device serial number cannot be empty');

    const existing = await ctx.db
      .query('biometricDevices')
      .withIndex('by_workspace_serial', (q2) =>
        q2.eq('workspaceId', args.workspaceId).eq('deviceSerial', cleanSerial)
      )
      .first();

    if (existing) {
      throw new ConvexError(
        'Device with serial ' + cleanSerial + ' is already registered in this workspace'
      );
    }

    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const rawSecret = bufToHex(randomBytes);
    const { ciphertext, iv } = await encryptSecret(rawSecret);
    const keyFingerprint = await generateFingerprint(rawSecret);
    const now = Date.now();

    const deviceId = await ctx.db.insert('biometricDevices', {
      workspaceId: args.workspaceId,
      name: args.name.trim(),
      deviceSerial: cleanSerial,
      deviceModel: args.deviceModel?.trim(),
      ipAddress: args.ipAddress?.trim(),
      keyFingerprint,
      secretCiphertext: ciphertext,
      secretIv: iv,
      keyVersion: 1,
      status: 'active',
      createdById: userId,
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, 'biometric.device_registered', {
      deviceId,
      deviceSerial: cleanSerial,
      keyFingerprint,
      keyVersion: 1,
    });

    return {
      deviceId,
      deviceSerial: cleanSerial,
      keyFingerprint,
      keyVersion: 1,
      deviceSecret: rawSecret,
    };
  },
});

export const rotateDeviceKey = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    deviceId: v.id('biometricDevices'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('Unauthenticated');
    await requireRole(ctx, userId, args.workspaceId, ['admin']);

    const device = await ctx.db.get(args.deviceId);
    if (!device || device.workspaceId !== args.workspaceId) {
      throw new ConvexError('Device not found in this workspace');
    }

    if (device.status === 'deactivated') {
      throw new ConvexError('Cannot rotate key for a deactivated device');
    }

    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const newRawSecret = bufToHex(randomBytes);
    const { ciphertext, iv } = await encryptSecret(newRawSecret);
    const newFingerprint = await generateFingerprint(newRawSecret);
    const nextKeyVersion = device.keyVersion + 1;
    const now = Date.now();

    await ctx.db.patch(device._id, {
      secretCiphertext: ciphertext,
      secretIv: iv,
      keyFingerprint: newFingerprint,
      keyVersion: nextKeyVersion,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, 'biometric.key_rotated', {
      deviceId: device._id,
      deviceSerial: device.deviceSerial,
      previousKeyVersion: device.keyVersion,
      newKeyVersion: nextKeyVersion,
      newFingerprint,
    });

    return {
      deviceId: device._id,
      deviceSerial: device.deviceSerial,
      keyFingerprint: newFingerprint,
      keyVersion: nextKeyVersion,
      deviceSecret: newRawSecret,
    };
  },
});

export const deactivateDevice = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    deviceId: v.id('biometricDevices'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('Unauthenticated');
    await requireRole(ctx, userId, args.workspaceId, ['admin']);

    const device = await ctx.db.get(args.deviceId);
    if (!device || device.workspaceId !== args.workspaceId) {
      throw new ConvexError('Device not found in this workspace');
    }

    const now = Date.now();
    await ctx.db.patch(device._id, {
      status: 'deactivated',
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, 'biometric.device_deactivated', {
      deviceId: device._id,
      deviceSerial: device.deviceSerial,
    });

    return { success: true };
  },
});

export const listDevices = query({
  args: { workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    await requireRole(ctx, userId, args.workspaceId, ['admin']);

    const devices = await ctx.db
      .query('biometricDevices')
      .withIndex('by_workspace', (q2) => q2.eq('workspaceId', args.workspaceId))
      .collect();

    return devices.map((d2) => ({
      _id: d2._id,
      workspaceId: d2.workspaceId,
      name: d2.name,
      deviceSerial: d2.deviceSerial,
      deviceModel: d2.deviceModel,
      ipAddress: d2.ipAddress,
      keyFingerprint: d2.keyFingerprint,
      keyVersion: d2.keyVersion,
      status: d2.status,
      lastHeartbeatAt: d2.lastHeartbeatAt,
      lastSyncAt: d2.lastSyncAt,
      createdAt: d2.createdAt,
      updatedAt: d2.updatedAt,
    }));
  },
});

export const getDeviceForAuth = internalQuery({
  args: {
    workspaceId: v.id('workspaces'),
    deviceSerial: v.string(),
  },
  handler: async (ctx, args) => {
    const device = await ctx.db
      .query('biometricDevices')
      .withIndex('by_workspace_serial', (q2) =>
        q2.eq('workspaceId', args.workspaceId).eq('deviceSerial', args.deviceSerial)
      )
      .first();

    if (!device) return null;

    try {
      const secret = await decryptSecret(device.secretCiphertext, device.secretIv);
      return {
        _id: device._id,
        workspaceId: device.workspaceId,
        deviceSerial: device.deviceSerial,
        status: device.status,
        keyVersion: device.keyVersion,
        secret,
      };
    } catch (err) {
      console.error('Failed to decrypt device secret for serial:', args.deviceSerial, err);
      return null;
    }
  },
});

export const getDevicesBySerial = internalQuery({
  args: { deviceSerial: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('biometricDevices')
      .filter((q2) => q2.eq(q2.field('deviceSerial'), args.deviceSerial))
      .collect();
  },
});

export const claimNonce = internalMutation({
  args: {
    workspaceId: v.id('workspaces'),
    deviceSerial: v.string(),
    nonce: v.string(),
    timestamp: v.number(),
    ttlMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('biometricNonces')
      .withIndex('by_device_nonce', (q2) =>
        q2
          .eq('workspaceId', args.workspaceId)
          .eq('deviceSerial', args.deviceSerial)
          .eq('nonce', args.nonce)
      )
      .first();

    if (existing) {
      return { accepted: false, reason: 'nonce_already_used' };
    }

    const now = Date.now();
    const ttl = args.ttlMs ?? 300000;
    await ctx.db.insert('biometricNonces', {
      workspaceId: args.workspaceId,
      deviceSerial: args.deviceSerial,
      nonce: args.nonce,
      timestamp: args.timestamp,
      expiresAt: now + ttl,
      createdAt: now,
    });

    return { accepted: true };
  },
});

export const recordHeartbeat = internalMutation({
  args: {
    workspaceId: v.id('workspaces'),
    deviceSerial: v.string(),
    ipAddress: v.optional(v.string()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const device = await ctx.db
      .query('biometricDevices')
      .withIndex('by_workspace_serial', (q2) =>
        q2.eq('workspaceId', args.workspaceId).eq('deviceSerial', args.deviceSerial)
      )
      .first();

    if (!device) return { recorded: false, error: 'device_not_found' };

    await ctx.db.patch(device._id, {
      lastHeartbeatAt: args.timestamp || Date.now(),
      ipAddress: args.ipAddress ?? device.ipAddress,
      updatedAt: Date.now(),
    });

    return { recorded: true, deviceId: device._id };
  },
});

export const ingestRawPunches = internalMutation({
  args: {
    workspaceId: v.id('workspaces'),
    deviceId: v.optional(v.id('biometricDevices')),
    deviceSerial: v.string(),
    punches: v.array(
      v.object({
        biometricUserId: v.string(),
        punchTimestamp: v.number(),
        punchType: v.union(
          v.literal('check_in'),
          v.literal('check_out'),
          v.literal('break_out'),
          v.literal('break_in'),
          v.literal('auto')
        ),
        punchDate: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = [];
    let insertedCount = 0;
    let duplicateCount = 0;
    let unmappedCount = 0;
    const now = Date.now();

    for (const p of args.punches) {
      const rawKeyString = args.workspaceId + ':' + args.deviceSerial + ':' + p.biometricUserId + ':' + p.punchTimestamp + ':' + p.punchType;
      const idempotencyKey = await computeSha256(rawKeyString);

      const existing = await ctx.db
        .query('rawPunchLogs')
        .withIndex('by_idempotency', (q2) => q2.eq('idempotencyKey', idempotencyKey))
        .first();

      if (existing) {
        duplicateCount++;
        results.push({
          biometricUserId: p.biometricUserId,
          punchTimestamp: p.punchTimestamp,
          status: 'duplicate',
          logId: existing._id,
        });
        continue;
      }

      const employee = await ctx.db
        .query('employees')
        .withIndex('by_workspace_employee_id', (q2) =>
          q2.eq('workspaceId', args.workspaceId).eq('employeeIdNumber', p.biometricUserId)
        )
        .first();

      const processedStatus = employee ? 'pending' : 'unmapped';
      if (!employee) {
        unmappedCount++;
      }

      const logId = await ctx.db.insert('rawPunchLogs', {
        workspaceId: args.workspaceId,
        deviceId: args.deviceId,
        deviceSerial: args.deviceSerial,
        biometricUserId: p.biometricUserId,
        employeeId: employee?._id,
        punchTimestamp: p.punchTimestamp,
        punchType: p.punchType,
        punchDate: p.punchDate,
        idempotencyKey,
        processedStatus,
        createdAt: now,
      });

      insertedCount++;
      results.push({
        biometricUserId: p.biometricUserId,
        punchTimestamp: p.punchTimestamp,
        status: processedStatus,
        employeeId: employee?._id,
        logId,
      });

      // If mapped to an active employee, automatically process attendance shift cycle
      if (employee) {
        try {
          await ctx.runMutation(internal.attendance.processPunchesForShiftCycle, {
            workspaceId: args.workspaceId,
            employeeId: employee._id,
            shiftDate: p.punchDate,
          });
        } catch (err) {
          // Log or continue without failing ingestion transaction
        }
      }
    }

    if (args.deviceId && insertedCount > 0) {
      await ctx.db.patch(args.deviceId, {
        lastSyncAt: now,
        updatedAt: now,
      });
    }

    return {
      total: args.punches.length,
      inserted: insertedCount,
      duplicates: duplicateCount,
      unmapped: unmappedCount,
      results,
    };
  },
});