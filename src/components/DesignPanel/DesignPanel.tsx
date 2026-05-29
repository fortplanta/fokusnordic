import { useState } from "react";
import { TokensTab } from "./TokensTab";
import { ComponentsTab } from "./ComponentsTab";

type Tab = "tokens" | "components";

// ── Panel header ──────────────────────────────────────────────────────────────

function Header({ tab, onTabChange }: { tab: Tab; onTabChange: (t: Tab) => void }) {
  return (
    <div
      className="flex items-center justify-between px-6 border-b flex-shrink-0"
      style={{
        height: 52,
        borderBottomColor: "rgba(255,255,255,0.08)",
        background: "#0E0C0A",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <span style={{ color: "#274E36", fontSize: 15, lineHeight: 1 }}>◐</span>
        <span
          className="text-[12px] uppercase tracking-widest"
          style={{ fontFamily: "'Mona Sans', sans-serif", color: "rgba(255,255,255,0.35)" }}
        >
          Barnängs Design System
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1">
        {(["tokens", "components"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTabChange(t)}
            className="px-4 py-1.5 text-[11px] uppercase tracking-wider transition-colors"
            style={{
              fontFamily: "'Mona Sans', sans-serif",
              color: tab === t ? "#FAF7F2" : "rgba(255,255,255,0.3)",
              background: tab === t ? "rgba(255,255,255,0.07)" : "transparent",
              border: "1px solid",
              borderColor: tab === t ? "rgba(255,255,255,0.12)" : "transparent",
            }}
          >
            {t === "tokens" ? "Style Guide" : "Components"}
          </button>
        ))}
      </div>

      {/* Back link */}
      <a
        href="/"
        className="text-[11px] uppercase tracking-wider transition-opacity hover:opacity-100"
        style={{
          fontFamily: "'Mona Sans', sans-serif",
          color: "rgba(255,255,255,0.3)",
          opacity: 0.6,
          textDecoration: "none",
        }}
      >
        ← Back to site
      </a>
    </div>
  );
}

// ── Full-page panel ───────────────────────────────────────────────────────────

export function DesignPanel() {
  const [tab, setTab] = useState<Tab>("tokens");

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#13100D" }}>
      <Header tab={tab} onTabChange={setTab} />
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {tab === "tokens"     && <TokensTab />}
        {tab === "components" && <ComponentsTab />}
      </div>
    </div>
  );
}
