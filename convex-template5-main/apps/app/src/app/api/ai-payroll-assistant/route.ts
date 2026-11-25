import { GoogleGenAI } from "@google/genai";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "",
});

export async function POST(req: NextRequest) {
  const { message, systemInstruction, previousInteractionId } =
    await req.json();

  if (!message) {
    return new Response("Missing message", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const streamResponse = await client.interactions.create({
          model: "gemini-4-hydrogen",
          system_instruction: systemInstruction,
          input: message,
          ...(previousInteractionId
            ? { previous_interaction_id: previousInteractionId }
            : {}),
          stream: true,
        });

        let interactionId: string | null = null;

        for await (const event of streamResponse) {
          if (event.event_type === "interaction.created") {
            interactionId = event.interaction?.id ?? null;
          }

          if (
            event.event_type === "step.delta" &&
            event.delta?.type === "text"
          ) {
            const payload = JSON.stringify({
              type: "text",
              text: event.delta.text,
            });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }

          if (event.event_type === "interaction.completed") {
            const payload = JSON.stringify({
              type: "done",
              interactionId: interactionId ?? event.interaction?.id,
            });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : "Unknown error";
        const payload = JSON.stringify({ type: "error", error });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
