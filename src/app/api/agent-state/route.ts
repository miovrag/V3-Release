import { NextResponse } from "next/server";
import type { AgentState } from "@/lib/suggestedActions";

export async function GET() {
  const apiKey = process.env.CUSTOMGPT_API_KEY;
  const projectId = process.env.CUSTOMGPT_PROJECT_ID;

  if (!apiKey || !projectId) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 503 });
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
  };

  const base = `https://app.customgpt.ai/api/v1/projects/${projectId}`;

  const [settingsRes, pagesRes] = await Promise.all([
    fetch(`${base}/settings`, { headers }),
    fetch(`${base}/pages?page=1&per_page=1`, { headers }),
  ]);

  const [settings, pages] = await Promise.all([
    settingsRes.json(),
    pagesRes.json(),
  ]);

  const s = settings.data ?? {};
  const pagesTotal: number = pages.data?.pages?.total ?? 0;
  const project = pages.data?.project ?? {};

  const state: AgentState = {
    persona_configured: !!(s.persona_instructions?.trim()),
    knowledge_sources_count: pagesTotal,
    actions_connected_count: Array.isArray(s.tools_enabled) ? s.tools_enabled.length : 0,
    automations_count: 0,
    branding_configured: !!(s.chatbot_title?.trim()),
    published: project.is_shared === true,
    citations_tested: (s.enable_citations ?? 0) > 0,
  };

  return NextResponse.json(state);
}
