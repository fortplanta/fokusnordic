/**
 * designOverrides
 *
 * Shared module for live CSS-variable overrides that sync across all open
 * tabs (styleguide → main site) via BroadcastChannel and survive page reloads
 * via localStorage.
 *
 * Flow:
 *   1. styleguide picks a new color
 *   2. setOverride() → applies to current tab + saves to localStorage + broadcasts
 *   3. main site tab receives broadcast → applies instantly (no reload needed)
 *   4. on any page load, App.tsx calls bootOverrides() → reads localStorage + listens
 *   5. "Save to index.css" → persists permanently in file → clearAllOverrides() cleans up ls
 */

const STORAGE_KEY = "barnang:design-overrides";
const CHANNEL     = "barnang:design-sync";

// ── Types ─────────────────────────────────────────────────────────────────────

type SyncMessage =
  | { type: "set";   cssVar: string; value: string }
  | { type: "clear"; cssVar: string }
  | { type: "reset" };

// ── Helpers ───────────────────────────────────────────────────────────────────

export function loadOverrides(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function persistOverrides(overrides: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function broadcast(msg: SyncMessage) {
  try {
    const ch = new BroadcastChannel(CHANNEL);
    ch.postMessage(msg);
    ch.close();
  } catch {
    // BroadcastChannel not available (e.g. SSR / old browser) — no-op
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Apply a map of CSS-var overrides to :root on the current page. */
export function applyOverrides(overrides: Record<string, string>) {
  for (const [k, v] of Object.entries(overrides)) {
    document.documentElement.style.setProperty(k, v);
  }
}

/** Set one override, apply it, persist it, and broadcast to all tabs. */
export function setOverride(cssVar: string, value: string) {
  document.documentElement.style.setProperty(cssVar, value);
  const overrides = loadOverrides();
  overrides[cssVar] = value;
  persistOverrides(overrides);
  broadcast({ type: "set", cssVar, value });
}

/** Remove one override, persist the change, and broadcast. */
export function clearOverride(cssVar: string) {
  document.documentElement.style.removeProperty(cssVar);
  const overrides = loadOverrides();
  delete overrides[cssVar];
  persistOverrides(overrides);
  broadcast({ type: "clear", cssVar });
}

/** Remove ALL overrides and broadcast a full reset. */
export function clearAllOverrides() {
  const overrides = loadOverrides();
  for (const k of Object.keys(overrides)) {
    document.documentElement.style.removeProperty(k);
  }
  localStorage.removeItem(STORAGE_KEY);
  broadcast({ type: "reset" });
}

/**
 * Call once from App.tsx on mount.
 * - Reads localStorage and applies any persisted overrides immediately.
 * - Opens a BroadcastChannel listener so this tab receives live updates
 *   from the styleguide tab.
 * Returns a cleanup function (close the channel).
 */
export function bootOverrides(): () => void {
  // Apply any previously saved overrides on load
  applyOverrides(loadOverrides());

  // Listen for live changes broadcast from the styleguide
  let ch: BroadcastChannel | null = null;
  try {
    ch = new BroadcastChannel(CHANNEL);
    ch.onmessage = (e: MessageEvent<SyncMessage>) => {
      const msg = e.data;
      if (msg.type === "set") {
        document.documentElement.style.setProperty(msg.cssVar, msg.value);
      } else if (msg.type === "clear") {
        document.documentElement.style.removeProperty(msg.cssVar);
      } else if (msg.type === "reset") {
        // Re-read localStorage (which was just cleared) to get back to defaults
        applyOverrides(loadOverrides());
        // Remove any leftover inline overrides that are no longer in storage
        const style = document.documentElement.style;
        for (const prop of Array.from({ length: style.length }, (_, i) => style[i])) {
          if (prop.startsWith("--color-") || prop.startsWith("--font-")) {
            style.removeProperty(prop);
          }
        }
      }
    };
  } catch {
    // BroadcastChannel not available — silently skip
  }

  return () => ch?.close();
}
