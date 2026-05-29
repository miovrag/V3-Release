import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.CUSTOMGPT_API_KEY;
  const projectId = process.env.CUSTOMGPT_PROJECT_ID;

  if (!apiKey || !projectId) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 503 });
  }

  const { message, conversationId } = await req.json();

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const base = `https://app.customgpt.ai/api/v1/projects/${projectId}`;

  // Create conversation on first message
  let convId: number = conversationId;
  if (!convId) {
    const convRes = await fetch(`${base}/conversations`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name: "demo" }),
    });
    const conv = await convRes.json();
    convId = conv.data?.id;
    if (!convId) {
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 502 });
    }
  }

  // Send message
  const msgRes = await fetch(`${base}/conversations/${convId}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt: message, stream: false }),
  });

  const msg = await msgRes.json();

  if (msg.status !== "success") {
    return NextResponse.json({ error: "API error" }, { status: 502 });
  }

  return NextResponse.json({
    reply: msg.data?.openai_response ?? "",
    conversationId: convId,
    citations: msg.data?.citations ?? [],
  });
}
