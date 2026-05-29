export type IntentCategory =
  | "persona" | "knowledge_sources" | "actions" | "automations"
  | "publishing" | "analytics" | "billing" | "security" | "branding"
  | "testing" | "citations" | "integrations" | "permissions" | "unknown";

export interface SuggestedCard {
  priority: "primary" | "secondary";
  title: string;
  description: string;
  cta: string;
  target: string;
  target_url: string;
  icon: string;
}

export interface SuggestedActionsResult {
  show: boolean;
  intent: IntentCategory;
  confidence: number;
  header: string | null;
  reason: string;
  cards: SuggestedCard[];
}

export interface AgentState {
  persona_configured: boolean;
  knowledge_sources_count: number;
  actions_connected_count: number;
  automations_count: number;
  branding_configured: boolean;
  published: boolean;
  citations_tested: boolean;
}

export interface SuggestInput {
  locale: string;
  conversation: {
    user_message: string;
    assistant_answer: string;
    recent_user_messages: string[];
  };
  agent_state: AgentState;
  current_section: string;
  session: {
    dismissed_categories: string[];
  };
}

const TARGET_URLS: Record<string, string> = {
  persona: "https://agent-personalize-persona-blue.vercel.app",
  knowledge_sources: "https://app.customgpt.ai/",
  actions: "https://agent-personalize.vercel.app",
  testing: "https://app.customgpt.ai/",
  publishing: "https://app.customgpt.ai/",
  citations: "https://app.customgpt.ai/",
  permissions: "https://app.customgpt.ai/",
  automations: "https://app.customgpt.ai/",
  analytics: "https://app.customgpt.ai/",
  integrations: "https://app.customgpt.ai/",
  billing: "https://app.customgpt.ai/",
  security: "https://app.customgpt.ai/",
  branding: "https://app.customgpt.ai/",
};

const TARGET_ICONS: Record<string, string> = {
  persona: "ti-user-circle",
  knowledge_sources: "ti-database",
  actions: "ti-apps",
  testing: "ti-test-pipe",
  publishing: "ti-world",
  citations: "ti-quote",
  permissions: "ti-lock",
  automations: "ti-bolt",
  analytics: "ti-chart-bar",
  integrations: "ti-plug",
  billing: "ti-credit-card",
  security: "ti-shield-check",
  branding: "ti-palette",
};

export function resolveCard(
  c: Omit<SuggestedCard, "target_url" | "icon">
): SuggestedCard {
  return {
    ...c,
    target_url: TARGET_URLS[c.target] ?? "#",
    icon: TARGET_ICONS[c.target] ?? "ti-arrow-right",
  };
}

export function resolveCards(
  cards: Omit<SuggestedCard, "target_url" | "icon">[]
): SuggestedCard[] {
  return cards.map(resolveCard);
}

function noShow(intent: IntentCategory, confidence: number): SuggestedActionsResult {
  return {
    show: false,
    intent,
    confidence,
    header: null,
    reason: "Informational answer; no contextual next step.",
    cards: [],
  };
}

export function classifyStatic(input: SuggestInput): SuggestedActionsResult {
  const { conversation, agent_state, current_section, session } = input;
  const msg = conversation.user_message.toLowerCase();
  const dismissed = new Set(session.dismissed_categories);

  if (/persona|tone|voice|personali[sz]e/.test(msg)) {
    if (dismissed.has("persona") || current_section === "persona") return noShow("persona", 0.91);
    if (!agent_state.persona_configured) {
      return {
        show: true, intent: "persona", confidence: 0.93,
        header: "Recommended next action",
        reason: "Persona not configured and answer described setting the agent's tone.",
        cards: [
          resolveCard({ priority: "primary", title: "Open Persona settings", description: "Set the agent's role, tone, instructions, and response boundaries.", cta: "Open Persona", target: "persona" }),
        ],
      };
    }
  }

  if (/connect|integrat|tool|action|slack|gmail|hubspot|crm/.test(msg)) {
    if (dismissed.has("actions") || current_section === "actions") return noShow("actions", 0.88);
    if (agent_state.actions_connected_count === 0) {
      return {
        show: true, intent: "actions", confidence: 0.88,
        header: "Next step",
        reason: "No actions connected and user asked how to connect tools.",
        cards: [
          resolveCard({ priority: "primary", title: "Connect your first tool", description: "Link an external app so the agent can act outside the chat.", cta: "Open Actions", target: "actions" }),
          resolveCard({ priority: "secondary", title: "Set action permissions", description: "Control which tools the agent can use and when confirmation is required.", cta: "Set permissions", target: "permissions" }),
        ],
      };
    }
  }

  if (/knowledge|upload|source|document|file|pdf|website|data/.test(msg)) {
    if (dismissed.has("knowledge_sources") || current_section === "knowledge_sources") return noShow("knowledge_sources", 0.85);
    if (agent_state.knowledge_sources_count === 0) {
      return {
        show: true, intent: "knowledge_sources", confidence: 0.85,
        header: "Next step",
        reason: "No knowledge sources and user asked about adding content.",
        cards: [
          resolveCard({ priority: "primary", title: "Add knowledge source", description: "Upload files or connect approved content so the agent answers from trusted information.", cta: "Add source", target: "knowledge_sources" }),
          resolveCard({ priority: "secondary", title: "Review citations", description: "Check whether answers show clear references to the source content.", cta: "Review citations", target: "citations" }),
        ],
      };
    }
  }

  if (/publish|deploy|go live|share|embed|launch/.test(msg)) {
    if (dismissed.has("publishing") || current_section === "publishing") return noShow("publishing", 0.82);
    if (!agent_state.published) {
      return {
        show: true, intent: "publishing", confidence: 0.82,
        header: "Continue setup",
        reason: "Agent not published and user asked about publishing.",
        cards: [
          resolveCard({ priority: "primary", title: "Publish agent", description: "Make the latest version available to users.", cta: "Publish agent", target: "publishing" }),
          resolveCard({ priority: "secondary", title: "Preview live version", description: "Check what users will see before sharing.", cta: "Preview agent", target: "publishing" }),
        ],
      };
    }
  }

  if (/automat|workflow|schedule|trigger/.test(msg)) {
    if (dismissed.has("automations") || current_section === "automations") return noShow("automations", 0.80);
    if (agent_state.automations_count === 0) {
      return {
        show: true, intent: "automations", confidence: 0.80,
        header: "Next step",
        reason: "No automations and user asked about workflows.",
        cards: [
          resolveCard({ priority: "primary", title: "Create your first automation", description: "Set up triggers and actions to automate recurring workflows.", cta: "Open Automations", target: "automations" }),
        ],
      };
    }
  }

  return noShow("unknown", 0.4);
}
