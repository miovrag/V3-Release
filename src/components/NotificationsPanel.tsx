"use client";

import { useState } from "react";

interface Notification {
  id: number;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  action?: { label: string; onClick?: () => void };
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    icon: "ti-bolt",
    iconColor: "var(--brand-primary-default)",
    iconBg: "var(--brand-primary-tint)",
    title: "NextGen is now available",
    body: "Enable multi-step reasoning on your agents for deeper, more accurate answers.",
    time: "Just now",
    unread: true,
    action: { label: "Enable on agents" },
  },
  {
    id: 2,
    icon: "ti-chart-bar",
    iconColor: "var(--color-info)",
    iconBg: "var(--color-info-tint)",
    title: "Weekly usage report ready",
    body: "Your agents processed 2,847 queries this week — up 12% from last week.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    icon: "ti-check",
    iconColor: "var(--color-success)",
    iconBg: "var(--color-success-tint)",
    title: "Support Agent updated",
    body: "Knowledge base sync completed — 142 new documents indexed.",
    time: "Yesterday",
    unread: false,
  },
];

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState<number[]>([]);

  const unreadCount = NOTIFICATIONS.filter(n => n.unread && !read.includes(n.id)).length;

  function markAllRead() {
    setRead(NOTIFICATIONS.map(n => n.id));
  }

  return (
    <div style={{ position: "relative" }}>

      {/* Bell trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "relative",
          width: 40, height: 40,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-default)",
          background: open ? "var(--bg-selected)" : "var(--bg-surface)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          color: "var(--text-muted)",
          transition: "background var(--t-state)",
        }}
        aria-label="Notifications"
      >
        <i className="ti ti-bell" style={{ fontSize: 18 }} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 8, height: 8,
            borderRadius: "var(--radius-full)",
            background: "var(--color-error)",
            border: "2px solid var(--bg-surface)",
          }} />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + var(--spacing-sm))", right: 0,
          width: 360,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-default)",
          overflow: "hidden",
          zIndex: 50,
          animation: "modal-enter 150ms cubic-bezier(.2,.7,.3,1) both",
        }}>

          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "var(--spacing-md) var(--spacing-lg)",
            borderBottom: "1px solid var(--border-default)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="badge badge-primary">{unreadCount}</span>
              )}
            </div>
            <button
              onClick={markAllRead}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "var(--text-xs)", color: "var(--brand-primary-default)",
                fontFamily: "inherit", fontWeight: "var(--weight-medium)",
              }}
            >
              Mark all read
            </button>
          </div>

          {/* Items */}
          {NOTIFICATIONS.map((n, i) => {
            const isUnread = n.unread && !read.includes(n.id);
            return (
              <div
                key={n.id}
                style={{
                  display: "flex", gap: "var(--spacing-md)",
                  padding: "var(--spacing-md) var(--spacing-lg)",
                  borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid var(--border-default)" : "none",
                  background: isUnread ? "rgba(115,103,240,.04)" : "transparent",
                  cursor: "pointer",
                  transition: "background var(--t-state)",
                }}
                onClick={() => setRead(r => [...r, n.id])}
              >
                {/* Icon */}
                <div style={{
                  width: 36, height: 36, flexShrink: 0,
                  borderRadius: "var(--radius-md)",
                  background: n.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={`ti ${n.icon}`} style={{ color: n.iconColor, fontSize: 16 }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--spacing-sm)" }}>
                    <span style={{
                      fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)",
                      color: "var(--text-heading)", lineHeight: "var(--leading-tight)",
                    }}>
                      {n.title}
                    </span>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", flexShrink: 0 }}>
                      {n.time}
                    </span>
                  </div>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)" }}>
                    {n.body}
                  </p>
                  {n.action && (
                    <button style={{
                      alignSelf: "flex-start", marginTop: 4,
                      background: "none", border: "none", padding: 0,
                      fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
                      color: "var(--brand-primary-default)", cursor: "pointer",
                      fontFamily: "inherit",
                    }}>
                      {n.action.label} →
                    </button>
                  )}
                </div>

                {/* Unread dot */}
                {isUnread && (
                  <div style={{
                    width: 8, height: 8, flexShrink: 0, marginTop: 6,
                    borderRadius: "var(--radius-full)",
                    background: "var(--brand-primary-default)",
                  }} />
                )}
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}
