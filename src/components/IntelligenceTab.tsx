"use client";

import { useState, useRef, useEffect } from "react";
import NextGenBadge from "./NextGenBadge";
import UpgradeModal from "./UpgradeModal";

const SYSTEM_MAX = 15;
const PLAN_LIMITS = { standard: 5, premium: 10, enterprise: 15 } as const;
type Plan = keyof typeof PLAN_LIMITS;

const PLAN_LABELS: Record<Plan, string> = {
  standard: "Standard",
  premium: "Premium",
  enterprise: "Enterprise",
};

const NEXT_PLAN: Partial<Record<Plan, { name: string; limit: number }>> = {
  standard: { name: "Premium",    limit: 10 },
  premium:  { name: "Enterprise", limit: 15 },
};

const PLAN_START: Record<Plan, number> = {
  standard:  1,
  premium:   5,
  enterprise: 10,
};

const TIER_MARKS = [
  { value: 1,  label: "Quick" },
  { value: 5,  label: "Focused" },
  { value: 10, label: "Deep" },
  { value: 15, label: "Expert" },
] as const;

const FEATURES = [
  { icon: "ti-git-branch", text: "Multi-step reasoning across your knowledge base" },
  { icon: "ti-list-check", text: "Autonomous task planning per query" },
  { icon: "ti-sparkles",   text: "Deeper, more accurate answers" },
];

interface Props {
  initialNextGen?: boolean;
  plan?: Plan;
}

function pct(value: number) {
  return ((value - 1) / (SYSTEM_MAX - 1)) * 100;
}

export default function IntelligenceTab({ initialNextGen = true, plan = "standard" }: Props) {
  const limit = PLAN_LIMITS[plan];

  const [nextGenEnabled, setNextGenEnabled] = useState(initialNextGen);
  const [maxTasks, setMaxTasks]             = useState<number>(PLAN_START[plan]);
  const [saved, setSaved]                   = useState(false);
  const [justEnabled, setJustEnabled]       = useState(false);
  const [showUpgrade, setShowUpgrade]       = useState(false);

  const wasInitiallyOff = useRef(!initialNextGen);
  const saveTimer       = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMaxTasks(PLAN_START[plan]); }, [plan]);

  const atPlanMax   = maxTasks === limit;
  const nextPlan    = NEXT_PLAN[plan];
  const showUpsell  = atPlanMax && !!nextPlan;

  // Three-zone gradient: filled | unfilled-active | locked
  const valuePct = pct(maxTasks);
  const limitPct = pct(limit);

  const sliderTrack = plan === "enterprise"
    ? `linear-gradient(to right, var(--brand-primary-default) ${valuePct}%, var(--border-default) ${valuePct}%)`
    : `linear-gradient(to right,
        var(--brand-primary-default) ${valuePct}%,
        var(--border-default)        ${valuePct}% ${limitPct}%,
        var(--bg-selected)           ${limitPct}% 100%)`;

  function handleToggle(checked: boolean) {
    setNextGenEnabled(checked);
    if (checked && wasInitiallyOff.current) setJustEnabled(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaved(true);
    saveTimer.current = setTimeout(() => setSaved(false), 2000);
  }

  function handleSlider(raw: number) {
    setMaxTasks(Math.min(raw, limit));
  }

  /* ── Discovery state ── */
  if (!nextGenEnabled && wasInitiallyOff.current) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xl)", alignItems: "flex-start" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
            <span className="badge-premium">
              <i className="ti ti-sparkles" style={{ fontSize: 14 }} />
              New feature
            </span>
            <h3 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--text-heading)", lineHeight: "var(--leading-tight)" }}>
              Unlock NextGen for this agent
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)", maxWidth: 460 }}>
              NextGen lets this agent break down complex questions, plan multi-step tasks, and deliver smarter answers — automatically.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", width: "100%" }}>
            {FEATURES.map(f => (
              <div key={f.icon} style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "var(--radius-md)",
                  background: "var(--brand-primary-tint)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <i className={`ti ${f.icon}`} style={{ color: "var(--brand-primary-default)", fontSize: 16 }} />
                </div>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-body)" }}>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", alignItems: "flex-start" }}>
            <button className="btn btn-primary btn-lg" onClick={() => handleToggle(true)}>
              <i className="ti ti-bolt" />
              Enable NextGen
            </button>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              You can turn this off at any time from this tab.
            </span>
          </div>

        </div>
      </div>
    );
  }

  /* ── Configured state ── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>

      {justEnabled && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "var(--spacing-md)",
          padding: "var(--spacing-lg)",
          background: "var(--color-success-tint)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(40,199,111,.2)",
          animation: "modal-enter 200ms cubic-bezier(.2,.7,.3,1) both",
        }}>
          <i className="ti ti-check" style={{ color: "var(--color-success)", fontSize: 18, flexShrink: 0, marginTop: 1 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-success)" }}>NextGen is on</span>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "var(--leading-relaxed)" }}>
              Try asking your agent a complex, multi-part question to see NextGen in action.
            </p>
          </div>
        </div>
      )}

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>

        {/* Toggle row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--spacing-xl)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <span style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>NextGen</span>
              <NextGenBadge />
              <span style={{
                fontSize: "var(--text-xs)", color: "var(--color-success)", fontWeight: "var(--weight-medium)",
                display: "flex", alignItems: "center", gap: 4,
                opacity: saved ? 1 : 0,
                transition: "opacity 200ms",
              }}>
                <i className="ti ti-check" style={{ fontSize: 12 }} />
                Saved
              </span>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)", maxWidth: 420 }}>
              Enable multi-step reasoning and autonomous task planning for this agent.
            </p>
          </div>

          <label className="toggle-label" style={{ flexShrink: 0, marginTop: 2 }} aria-label="Enable NextGen">
            <input
              type="checkbox"
              role="switch"
              aria-checked={nextGenEnabled}
              checked={nextGenEnabled}
              onChange={e => handleToggle(e.target.checked)}
            />
            <span className="toggle-track" />
          </label>
        </div>

        {/* Slider section */}
        {nextGenEnabled && (
          <div style={{
            borderTop: "1px solid var(--border-default)",
            paddingTop: "var(--spacing-xl)",
            display: "flex", flexDirection: "column", gap: "var(--spacing-md)",
          }}>

            {/* Label row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
                  Max tasks per query
                </span>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                  {PLAN_LABELS[plan]} plan · up to {limit} tasks · System cap: {SYSTEM_MAX}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", flexShrink: 0 }}>
                <span style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-semibold)",
                  color: atPlanMax && plan !== "enterprise" ? "var(--color-warning)" : "var(--brand-primary-default)",
                  transition: "color var(--t-state)",
                }}>
                  {[...TIER_MARKS].reverse().find(m => m.value <= maxTasks)?.label ?? TIER_MARKS[0].label}
                </span>
                <div style={{
                  minWidth: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: atPlanMax && plan !== "enterprise" ? "var(--color-warning-tint)" : "var(--brand-primary-tint)",
                  color: atPlanMax && plan !== "enterprise" ? "var(--color-warning)" : "var(--brand-primary-active)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-md)", fontWeight: "var(--weight-bold)",
                  transition: "background var(--t-state), color var(--t-state)",
                }}>
                  {maxTasks}
                </div>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              className="range-input"
              min={1}
              max={SYSTEM_MAX}
              value={maxTasks}
              style={{ background: sliderTrack }}
              onChange={e => handleSlider(Number(e.target.value))}
              aria-label="Max tasks per query"
              aria-valuemin={1}
              aria-valuemax={limit}
              aria-valuenow={maxTasks}
            />

            {/* Named anchor marks */}
            <div style={{ position: "relative", height: 28 }}>
              {TIER_MARKS.map(mark => {
                const markPct   = pct(mark.value);
                const isActive  = mark.value <= maxTasks;
                const isCurrent = mark.value === maxTasks;
                const isLocked  = mark.value > limit;
                return (
                  <div
                    key={mark.value}
                    style={{
                      position: "absolute",
                      left: mark.value === 1 ? 0 : mark.value === SYSTEM_MAX ? "auto" : `${markPct}%`,
                      right: mark.value === SYSTEM_MAX ? 0 : "auto",
                      transform: mark.value === 1 || mark.value === SYSTEM_MAX ? "none" : "translateX(-50%)",
                      display: "flex", flexDirection: "column",
                      alignItems: mark.value === 1 ? "flex-start" : mark.value === SYSTEM_MAX ? "flex-end" : "center",
                      gap: 3,
                    }}
                  >
                    <div style={{
                      width: 1, height: 6,
                      background: isLocked
                        ? "var(--border-default)"
                        : isActive
                          ? "var(--brand-primary-default)"
                          : "var(--border-emphasis)",
                      transition: "background var(--t-state)",
                    }} />
                    <span style={{
                      fontSize: "var(--text-xs)",
                      whiteSpace: "nowrap",
                      color: isLocked
                        ? "var(--text-disabled)"
                        : isCurrent
                          ? "var(--brand-primary-default)"
                          : isActive
                            ? "var(--text-muted)"
                            : "var(--text-muted)",
                      fontWeight: isCurrent ? "var(--weight-semibold)" : "var(--weight-regular)",
                      transition: "color var(--t-state)",
                    }}>
                      {mark.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Upsell — plan limit hit, not enterprise */}
            {showUpsell && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacing-md)",
                padding: "var(--spacing-md) var(--spacing-lg)",
                background: "var(--color-warning-tint)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(255,159,67,.25)",
                animation: "modal-enter 150ms cubic-bezier(.2,.7,.3,1) both",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--spacing-sm)" }}>
                  <i className="ti ti-lock" style={{ color: "var(--color-warning)", fontSize: 16, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-body)", lineHeight: "var(--leading-relaxed)" }}>
                    You&apos;ve reached your {PLAN_LABELS[plan]} plan limit.{" "}
                    <strong>Upgrade to {nextPlan!.name}</strong> to unlock up to {nextPlan!.limit} tasks per query.
                  </span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flexShrink: 0 }}
                  onClick={() => setShowUpgrade(true)}
                >
                  Upgrade
                </button>
              </div>
            )}

            {/* Enterprise at max — just warn about latency */}
            {atPlanMax && plan === "enterprise" && (
              <div style={{
                display: "flex", alignItems: "flex-start", gap: "var(--spacing-sm)",
                padding: "var(--spacing-sm) var(--spacing-md)",
                background: "var(--color-warning-tint)",
                borderRadius: "var(--radius-md)",
              }}>
                <i className="ti ti-alert-triangle" style={{ color: "var(--color-warning)", fontSize: 14, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-body)", lineHeight: "var(--leading-relaxed)" }}>
                  Expect longer response times at this setting. Reduce if your agent needs to reply quickly.
                </span>
              </div>
            )}

          </div>
        )}
      </div>

      {nextGenEnabled && !atPlanMax && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "var(--spacing-md)",
          padding: "var(--spacing-lg)",
          background: "var(--brand-primary-tint)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(115,103,240,.16)",
        }}>
          <i className="ti ti-info-circle" style={{ color: "var(--brand-primary-default)", fontSize: 18, flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: "var(--text-sm)", color: "var(--brand-primary-active)", lineHeight: "var(--leading-relaxed)" }}>
            Higher task limits allow more thorough reasoning but increase response time and token usage. Start at the default and adjust based on your use case.
          </p>
        </div>
      )}

      {showUpgrade && nextPlan && (
        <UpgradeModal
          targetPlan={nextPlan.name.toLowerCase() as "premium" | "enterprise"}
          onClose={() => setShowUpgrade(false)}
        />
      )}

    </div>
  );
}
