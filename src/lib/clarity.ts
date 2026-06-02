declare global {
  interface Window {
    clarity?: (command: string, ...args: string[]) => void;
  }
}

export function clarityEvent(name: string, properties?: Record<string, string>) {
  if (typeof window === "undefined" || typeof window.clarity !== "function") return;
  window.clarity("event", name);
  if (properties) {
    Object.entries(properties).forEach(([k, v]) => window.clarity?.("set", k, v));
  }
}
