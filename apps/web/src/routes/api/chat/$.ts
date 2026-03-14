import { handleChatStream } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse } from "ai";
import { createFileRoute } from "@tanstack/react-router";
import { mastra } from "@core/mastra";

async function handle({ request }: { request: Request }) {
  const params = await request.json();

  const stream = await handleChatStream({
    mastra,
    agentId: "weatherAgent",
    params,
  });

  return createUIMessageStreamResponse({ stream });
}

export const Route = createFileRoute("/api/chat/$")({
  server: {
    handlers: {
      POST: handle,
    },
  },
});
