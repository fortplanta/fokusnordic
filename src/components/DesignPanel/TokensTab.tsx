import React, { useRef, useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useDevFile } from "./useDevFile";
import { setOverride, clearOverride, clearAllOverrides, loadOverrides } from "../../lib/designOverrides";

// ── Token definitions ─────────────────────────────────────────────────────────

interface ColorToken { label: string; var: string; default: string }
interface ColorGroup  { id: string; label: string; tokens: ColorToken[] }

const COLOR_GROUPS: ColorGroup[] = [
  { id: "cream",   label: "Cream / Background", tokens: [
    { label: "Cream 50",  var: "--color-cream-50",  default: "#F6F2EA" },
    { label: "Cream 100", var: "--color-cream-100", default: "#FAF7F2" },
    { label: "Cream 200", var: "--color-cream-200", default: "#EDE7DA" },
  ]},
  { id: "dark",    label: "Dark / Near-black", tokens: [
    { label: "Deep",     var: "--color-deep",     default: "#13100D" },
    { label: "Navy 900", var: "--color-navy-900", default: "#1a1a1a" },
    { label: "Navy 800", var: "--color-navy-800", default: "#2d2d2d" },
    { label: "Navy 700", var: "--color-navy-700", default: "#3d3d3d" },
  ]},
  { id: "green",   label: "Forest Green", tokens: [
    { label: "Dark",  var: "--color-green-dark",  default: "#274E36" },
    { label: "Mid",   var: "--color-green-mid",   default: "#336348" },
    { label: "Light", var: "--color-green-light", default: "#E4EDE6" },
  ]},
  { id: "terra",   label: "Terracotta", tokens: [
    { label: "Default", var: "--color-terra",       default: "#A05C3B" },
    { label: "Light",   var: "--color-terra-light", default: "#F0E6DF" },
  ]},
  { id: "stone",   label: "Stone / Putty", tokens: [
    { label: "200", var: "--color-stone-200", default: "#DDD8D0" },
    { label: "300", var: "--color-stone-300", default: "#C4BAB0" },
    { label: "400", var: "--color-stone-400", default: "#A89B8C" },
  ]},
  { id: "text",    label: "Text Semantic", tokens: [
    { label: "Primary",   var: "--color-text-primary",   default: "#13100D" },
    { label: "Secondary", var: "--color-text-secondary", default: "#5C544A" },
    { label: "Muted",     var: "--color-text-muted",     default: "#9E9087" },
    { label: "Inverse",   var: "--color-text-inverse",   default: "#FAF7F2" },
  ]},
  { id: "borders", label: "Borders", tokens: [
    { label: "Light", var: "--color-border-light", default: "#E4DDD4" },
    { label: "Mid",   var: "--color-border-mid",   default: "#C4BAB0" },
    { label: "Dark",  var: "--color-border-dark",  default: "#2d2d2d" },
  ]},
];

const TYPE_SCALE = [
  { label: "Display XL",  size: "clamp(48px,7vw,72px)", family: "'Petit Serif', serif",    weight: 400, tracking: "-0.03em", specimen: "A world away from the noise."                },
  { label: "H1",          size: "56px",                  family: "'Petit Serif', serif",    weight: 400, tracking: "-0.02em", specimen: "Space that works around you."                },
  { label: "H2",          size: "42px",                  family: "'Petit Serif', serif",    weight: 400, tracking: "-0.02em", specimen: "A century of character."                     },
  { label: "H3",          size: "32px",                  family: "'Petit Serif', serif",    weight: 400, tracking: "0",       specimen: "Floor 2 North — 450 sqm"                     },
  { label: "H4",          size: "24px",                  family: "'Petit Serif', serif",    weight: 400, tracking: "0",       specimen: "Studio Gym"                                  },
  { label: "Body LG",     size: "20px",                  family: "'Mona Sans', sans-serif", weight: 400, tracking: "-0.015em",specimen: "Calm focus, proximity to nature, and curated access to the best cafés in Södermalm." },
  { label: "Body MD",     size: "16px",                  family: "'Mona Sans', sans-serif", weight: 400, tracking: "-0.015em",specimen: "Originally a textile mill on the edge of Södermalm, Barnängshuset has been reimagined as a workspace where history and modernity coexist." },
  { label: "Body SM",     size: "14px",                  family: "'Mona Sans', sans-serif", weight: 400, tracking: "-0.015em",specimen: "Bright corner space with windows on two sides. Includes shared kitchen and meeting areas." },
  { label: "Label / Cap", size: "12px",                  family: "'Mona Sans', sans-serif", weight: 500, tracking: "0.12em",  specimen: "Est. 1899 — Reimagined", uppercase: true      },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function escapeCssVarName(name: string) {
  return name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/** Patch a set of CSS variable overrides into an index.css string */
function patchCssVariables(css: string, overrides: Record<string, string>): string {
  let result = css;
  for (const [varName, value] of Object.entries(overrides)) {
    result = result.replace(
      new RegExp(`(${escapeCssVarName(varName)}:\\s*)[^;\\n]+`),
      `$1${value}`
    );
  }
  return result;
}

// ── Swatch row ────────────────────────────────────────────────────────────────

function ColorSwatch({
  token, value, onChange, onReset, modified,
}: {
  token: ColorToken; value: string;
  onChange: (v: string, val: string) => void;
  onReset:  (v: string) => void;
  modified: boolean;
}) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const [hex, setHex] = useState(value);
  React.useEffect(() => setHex(value), [value]);

  return (
    <div className="flex items-center gap-3 py-1.5 group">
      <div
        className="w-8 h-8 flex-shrink-0 cursor-pointer border border-white/10 hover:border-white/30 transition-colors"
        style={{ backgroundColor: value }}
        onClick={() => pickerRef.current?.click()}
        title="Open colour picker"
      />
      <input ref={pickerRef} type="color" value={value}
        onChange={(e) => { setHex(e.target.value); onChange(token.var, e.target.value); }}
        className="sr-only" tabIndex={-1}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">{token.label}</p>
        <div className="flex items-center gap-3">
          <input type="text" value={hex}
            onChange={(e) => setHex(e.target.value)}
            onBlur={() => {
              const v = /^#[0-9a-fA-F]{3,6}$/.test(hex.trim()) ? hex.trim() : value;
              setHex(v); onChange(token.var, v);
            }}
            className="font-mono text-[12px] text-white/80 bg-transparent border-none outline-none w-24"
            spellCheck={false}
          />
          <span className="text-[10px] text-white/20 font-mono truncate">{token.var}</span>
        </div>
      </div>
      {modified && (
        <button type="button"
          onClick={() => { onReset(token.var); setHex(token.default); }}
          className="text-[11px] text-white/25 hover:text-white/60 transition-colors flex-shrink-0"
          title="Reset"
        >↺</button>
      )}
    </div>
  );
}

// ── Save bar ──────────────────────────────────────────────────────────────────

function SaveBar({
  overrides, onSave, onReset, saving, saved,
}: {
  overrides: Record<string, string>;
  onSave:  () => void;
  onReset: () => void;
  saving: boolean;
  saved:  boolean;
}) {
  const count = Object.keys(overrides).length;
  if (count === 0) return null;
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-2.5 text-[12px]"
      style={{ background: "#1A2E22", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Mona Sans',sans-serif" }}>
        {count} token{count > 1 ? "s" : ""} modified
      </span>
      <div className="flex items-center gap-4">
        <button type="button" onClick={onSave} disabled={saving}
          className="transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{ color: "#E4EDE6", fontFamily: "'Mona Sans',sans-serif" }}>
          {saving ? "Saving…" : saved ? "✓ Saved to index.css" : "Save to index.css"}
        </button>
        <button type="button" onClick={onReset}
          className="opacity-40 hover:opacity-70 transition-opacity"
          style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Mona Sans',sans-serif" }}>
          Reset all
        </button>
      </div>
    </div>
  );
}

// ── Section types ─────────────────────────────────────────────────────────────

type TokensSection = "colors" | "typography" | "spacing" | "raw";

// ── Main component ────────────────────────────────────────────────────────────

export function TokensTab() {
  const [section, setSection] = useState<TokensSection>("colors");
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const cssFile = useDevFile("src/index.css");

  // Seed local state from localStorage so the UI reflects any persisted overrides
  const [_init] = useState(() => loadOverrides());
  React.useEffect(() => { setOverrides(loadOverrides()); }, []);

  const getValue = useCallback(
    (token: ColorToken) => overrides[token.var] ?? token.default,
    [overrides]
  );

  const handleChange = useCallback((cssVar: string, val: string) => {
    setOverride(cssVar, val);          // applies + persists + broadcasts
    setOverrides((prev) => ({ ...prev, [cssVar]: val }));
  }, []);

  const handleReset = useCallback((cssVar: string) => {
    clearOverride(cssVar);             // removes + persists + broadcasts
    setOverrides((prev) => { const n = { ...prev }; delete n[cssVar]; return n; });
  }, []);

  const handleResetAll = useCallback(() => {
    clearAllOverrides();               // removes all + persists + broadcasts
    setOverrides({});
  }, []);

  const handleSaveToCss = useCallback(async () => {
    if (!cssFile.content) return;
    const patched = patchCssVariables(cssFile.content, overrides);
    await cssFile.save(patched);
    // Values are now baked into index.css — clear localStorage overrides so
    // the main site loads the file values directly (no inline style duplication)
    clearAllOverrides();
    setOverrides({});
  }, [cssFile, overrides]);

  const NAV: { id: TokensSection; label: string }[] = [
    { id: "colors",     label: "Colors"     },
    { id: "typography", label: "Typography" },
    { id: "spacing",    label: "Spacing"    },
    { id: "raw",        label: "Raw CSS"    },
  ];

  return (
    <div className="flex h-full">
      {/* Sub-nav */}
      <nav className="w-40 flex-shrink-0 border-r py-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {NAV.map((item) => (
          <button key={item.id} type="button" onClick={() => setSection(item.id)}
            className="w-full text-left px-5 py-2 text-[12px] uppercase tracking-wider transition-colors"
            style={{
              fontFamily: "'Mona Sans',sans-serif",
              color: section === item.id ? "#FAF7F2" : "rgba(255,255,255,0.3)",
            }}>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex flex-col">

        {/* ── Colors ─────────────────────────────────────────────────────── */}
        {section === "colors" && (
          <>
            <SaveBar
              overrides={overrides}
              onSave={handleSaveToCss}
              onReset={handleResetAll}
              saving={cssFile.saving}
              saved={cssFile.saved}
            />
            <div className="p-6 space-y-8">
              {COLOR_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="text-[10px] uppercase tracking-widest mb-3 pb-2"
                    style={{ color: "rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.tokens.map((token) => (
                      <ColorSwatch
                        key={token.var} token={token} value={getValue(token)}
                        onChange={handleChange} onReset={handleReset}
                        modified={token.var in overrides}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Typography ─────────────────────────────────────────────────── */}
        {section === "typography" && (
          <div className="p-6 space-y-10 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-widest pb-3"
              style={{ color: "rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              Type Scale — Petit Serif + Mona Sans
            </p>
            {TYPE_SCALE.map((entry) => (
              <div key={entry.label} className="pb-8 last:pb-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-[10px] uppercase tracking-wider w-28 flex-shrink-0"
                    style={{ color: "rgba(255,255,255,0.25)" }}>{entry.label}</span>
                  <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.18)" }}>{entry.size}</span>
                  <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.18)" }}>{entry.weight}</span>
                  {entry.uppercase && <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.18)" }}>uppercase</span>}
                </div>
                <div className="px-5 py-4 rounded-sm" style={{ background: "#F6F2EA" }}>
                  <span style={{
                    fontFamily: entry.family, fontSize: entry.size, fontWeight: entry.weight,
                    letterSpacing: entry.tracking, color: "#13100D", lineHeight: 1.3,
                    textTransform: entry.uppercase ? "uppercase" : undefined,
                  }}>
                    {entry.specimen}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Spacing ────────────────────────────────────────────────────── */}
        {section === "spacing" && (
          <div className="p-6 space-y-2">
            <p className="text-[10px] uppercase tracking-widest mb-6 pb-3"
              style={{ color: "rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              Spacing Scale
            </p>
            {[4,8,12,16,20,24,32,40,48,64,80,96,128].map((px) => (
              <div key={px} className="flex items-center gap-4">
                <span className="font-mono text-[11px] text-right w-10 flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.3)" }}>{px}</span>
                <div className="h-4 rounded-sm" style={{
                  width: Math.min(px * 2.5, 400), background: "rgba(39,78,54,0.5)"
                }} />
                <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {px / 16}rem
                </span>
              </div>
            ))}
            <div className="mt-8 pt-6 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>Section Rhythm</p>
              {[
                { label: "Section",         value: "96px"  },
                { label: "Section Compact", value: "64px"  },
                { label: "Gutter",          value: "64px"  },
                { label: "Gutter SM",       value: "24px"  },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-4">
                  <span className="text-[12px] w-36" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Mona Sans',sans-serif" }}>{row.label}</span>
                  <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Raw CSS ────────────────────────────────────────────────────── */}
        {section === "raw" && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 flex-shrink-0"
              style={{ background: "#0E0C0A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                src/index.css
              </span>
              <div className="flex items-center gap-3">
                {cssFile.error && (
                  <span className="text-[11px] text-red-400">{cssFile.error}</span>
                )}
                <button type="button"
                  onClick={() => cssFile.save()}
                  disabled={cssFile.saving || cssFile.loading}
                  className="px-3 py-1 text-[11px] uppercase tracking-wider transition-colors disabled:opacity-40"
                  style={{
                    fontFamily: "'Mona Sans',sans-serif",
                    background: cssFile.saved ? "#274E36" : "rgba(255,255,255,0.08)",
                    color: "#FAF7F2",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}>
                  {cssFile.saving ? "Saving…" : cssFile.saved ? "✓ Saved" : "Save"}
                </button>
              </div>
            </div>
            {/* Editor */}
            <div className="flex-1 min-h-0">
              {cssFile.loading ? (
                <div className="flex items-center justify-center h-full"
                  style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Mona Sans',sans-serif", fontSize: 12 }}>
                  Loading…
                </div>
              ) : (
                <Editor
                  height="100%"
                  language="css"
                  theme="vs-dark"
                  value={cssFile.content}
                  onChange={(v) => cssFile.setContent(v ?? "")}
                  options={{
                    fontSize: 12,
                    lineHeight: 20,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    tabSize: 2,
                    fontFamily: "'Fira Code', 'Cascadia Code', Menlo, monospace",
                    padding: { top: 12, bottom: 12 },
                  }}
                />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
