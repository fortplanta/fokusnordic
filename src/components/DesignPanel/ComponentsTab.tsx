import { useState } from "react";

const IS_DEV = import.meta.env.DEV;
import Editor from "@monaco-editor/react";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Input, Textarea, Select } from "../ui/Input";
import { useDevFile } from "./useDevFile";
import type { ChipVariant } from "../ui/Chip";
import type { BadgeStatus } from "../ui/Badge";

// ── Component → source file map ───────────────────────────────────────────────

type ComponentId = "buttons" | "chips" | "badges" | "inputs" | "cards" | "nav" | "footer";

const COMPONENT_FILE: Record<ComponentId, string> = {
  buttons: "src/components/ui/Button.tsx",
  chips:   "src/components/ui/Chip.tsx",
  badges:  "src/components/ui/Badge.tsx",
  inputs:  "src/components/ui/Input.tsx",
  cards:   "src/components/ui/Card.tsx",
  nav:     "src/components/Nav/Nav.tsx",
  footer:  "src/components/sections/Footer/Footer.tsx",
};

const NAV_ITEMS: { id: ComponentId; label: string }[] = [
  { id: "buttons", label: "Buttons"    },
  { id: "chips",   label: "Chips & Tags" },
  { id: "badges",  label: "Badges"     },
  { id: "inputs",  label: "Inputs"     },
  { id: "cards",   label: "Cards"      },
  { id: "nav",     label: "Navigation" },
  { id: "footer",  label: "Footer"     },
];

// ── Small UI helpers ──────────────────────────────────────────────────────────

function Preview({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="rounded-sm p-6 min-h-[100px] flex flex-wrap items-start gap-4"
      style={{ background: dark ? "#13100D" : "#F6F2EA" }}>
      {children}
    </div>
  );
}

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mt-3">
      <span className="text-[10px] uppercase tracking-wider w-24 flex-shrink-0"
        style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Mona Sans',sans-serif" }}>
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors"
      style={{
        fontFamily: "'Mona Sans',sans-serif",
        border: "1px solid",
        borderColor: active ? "#274E36" : "rgba(255,255,255,0.12)",
        background:  active ? "rgba(39,78,54,0.3)" : "transparent",
        color:       active ? "#FAF7F2" : "rgba(255,255,255,0.35)",
      }}>
      {label}
    </button>
  );
}

// ── Preview panels ────────────────────────────────────────────────────────────

function ButtonsPreview() {
  const [variant, setVariant] = useState<"primary"|"secondary"|"tertiary"|"ghost">("primary");
  const [fullWidth, setFullWidth] = useState(false);
  const [dark, setDark] = useState(false);
  return (
    <div>
      <Preview dark={dark || variant === "ghost"}>
        <Button label="Book a viewing" variant={variant} fullWidth={fullWidth} />
        <Button label="Learn more"     variant={variant} fullWidth={fullWidth} />
      </Preview>
      <PropRow label="variant">
        {(["primary","secondary","tertiary","ghost"] as const).map((v) => (
          <Toggle key={v} label={v} active={variant === v}
            onClick={() => { setVariant(v); if (v === "ghost") setDark(true); }} />
        ))}
      </PropRow>
      <PropRow label="fullWidth">
        <Toggle label="false" active={!fullWidth} onClick={() => setFullWidth(false)} />
        <Toggle label="true"  active={fullWidth}  onClick={() => setFullWidth(true)} />
      </PropRow>
      <PropRow label="bg">
        <Toggle label="light" active={!dark} onClick={() => setDark(false)} />
        <Toggle label="dark"  active={dark}  onClick={() => setDark(true)} />
      </PropRow>
    </div>
  );
}

function ChipsPreview() {
  const [variant, setVariant] = useState<ChipVariant>("outline");
  const [size, setSize]       = useState<"sm"|"md">("md");
  const [active, setActive]   = useState(false);
  return (
    <div>
      <Preview>
        {["Architecture","Technology","Stockholm","Creative"].map((l, i) => (
          <Chip key={l} label={l} variant={variant} size={size} active={i === 0 && active} />
        ))}
      </Preview>
      <p className="text-[10px] mt-3 mb-1.5" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Mona Sans',sans-serif" }}>
        With dismiss
      </p>
      <Preview>
        {["Filter A","Filter B","Filter C"].map((l) => (
          <Chip key={l} label={l} variant={variant} size={size} onDismiss={() => {}} />
        ))}
      </Preview>
      <PropRow label="variant">
        {(["outline","solid","ghost","green","terra"] as ChipVariant[]).map((v) => (
          <Toggle key={v} label={v} active={variant === v} onClick={() => setVariant(v)} />
        ))}
      </PropRow>
      <PropRow label="size">
        <Toggle label="sm" active={size === "sm"} onClick={() => setSize("sm")} />
        <Toggle label="md" active={size === "md"} onClick={() => setSize("md")} />
      </PropRow>
      <PropRow label="active">
        <Toggle label="false" active={!active} onClick={() => setActive(false)} />
        <Toggle label="true"  active={active}  onClick={() => setActive(true)} />
      </PropRow>
    </div>
  );
}

function BadgesPreview() {
  return (
    <div>
      <Preview>
        {(["available","reserved","leased","new","coming"] as BadgeStatus[]).map((s) => (
          <Badge key={s} status={s} />
        ))}
      </Preview>
    </div>
  );
}

function InputsPreview() {
  const [errState, setErrState] = useState(false);
  return (
    <div>
      <Preview>
        <div className="w-full max-w-xs space-y-6">
          <Input label="Name" placeholder="Your name" required error={errState ? "This field is required." : undefined} />
          <Textarea label="Message" placeholder="Tell us what you're looking for…" rows={3} />
          <Select label="Interest" placeholder="Select…"
            options={[{ value:"office", label:"Office Space" },{ value:"conf", label:"Conference Room" },{ value:"general", label:"General Enquiry" }]}
          />
        </div>
      </Preview>
      <PropRow label="error">
        <Toggle label="off" active={!errState} onClick={() => setErrState(false)} />
        <Toggle label="on"  active={errState}  onClick={() => setErrState(true)} />
      </PropRow>
    </div>
  );
}

function CardsPreview() {
  const [variant, setVariant] = useState<"light"|"dark">("light");
  return (
    <div>
      <Preview dark={variant === "dark"}>
        <Card variant={variant} className="w-56">
          <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "#9E9087", fontFamily: "'Mona Sans',sans-serif" }}>Floor 2 North</p>
          <p className="text-[20px] mb-1" style={{ fontFamily: "'Petit Serif',serif", color: variant === "dark" ? "#FAF7F2" : "#13100D" }}>450 sqm</p>
          <p className="text-[14px] leading-relaxed" style={{ color: "#5C544A", fontFamily: "'Mona Sans',sans-serif" }}>Bright corner space with windows on two sides.</p>
          <div className="mt-4"><Badge status="available" /></div>
        </Card>
        <Card variant={variant} className="w-56">
          <p className="text-[11px] uppercase tracking-wider mb-2" style={{ color: "#9E9087", fontFamily: "'Mona Sans',sans-serif" }}>Floor 4 Open Plan</p>
          <p className="text-[20px] mb-1" style={{ fontFamily: "'Petit Serif',serif", color: variant === "dark" ? "#FAF7F2" : "#13100D" }}>680 sqm</p>
          <p className="text-[14px] leading-relaxed" style={{ color: "#5C544A", fontFamily: "'Mona Sans',sans-serif" }}>Flexible layout for growing teams.</p>
          <div className="mt-4"><Badge status="reserved" /></div>
        </Card>
      </Preview>
      <PropRow label="variant">
        <Toggle label="light" active={variant === "light"} onClick={() => setVariant("light")} />
        <Toggle label="dark"  active={variant === "dark"}  onClick={() => setVariant("dark")} />
      </PropRow>
    </div>
  );
}

function NavPreview() {
  const [scrolled, setScrolled] = useState(false);
  return (
    <div>
      <div className="rounded-sm overflow-hidden" style={{ background: scrolled ? "#F6F2EA" : "#13100D", minHeight: 64 }}>
        <div className="w-full px-6 py-4 flex items-start justify-between gap-4 border-b transition-colors"
          style={{ borderBottomColor: scrolled ? "#E4DDD4" : "transparent" }}>
          <span className="text-[13px] font-medium tracking-wide"
            style={{ fontFamily: "'Mona Sans',sans-serif", color: scrolled ? "#13100D" : "#FAF7F2" }}>
            BARNÄNGSHUSET
          </span>
          <div className="hidden md:flex items-start gap-6">
            {["Spaces","Amenities","Neighborhood","Contact"].map((l) => (
              <span key={l} className="text-[13px]"
                style={{ fontFamily: "'Mona Sans',sans-serif", color: scrolled ? "#13100D" : "#FAF7F2" }}>{l}</span>
            ))}
          </div>
          <button className="px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-colors"
            style={{
              fontFamily: "'Mona Sans',sans-serif",
              borderColor: scrolled ? "#274E36" : "rgba(250,247,242,0.45)",
              color: scrolled ? "#FAF7F2" : "#FAF7F2",
              background: scrolled ? "#274E36" : "transparent",
            }}>
            Book a viewing
          </button>
        </div>
      </div>
      <PropRow label="state">
        <Toggle label="transparent" active={!scrolled} onClick={() => setScrolled(false)} />
        <Toggle label="scrolled"    active={scrolled}  onClick={() => setScrolled(true)} />
      </PropRow>
    </div>
  );
}

function FooterPreview() {
  return (
    <div className="rounded-sm overflow-hidden" style={{ background: "#13100D", padding: "24px" }}>
      <div className="grid grid-cols-3 gap-6 pb-6 mb-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Mona Sans',sans-serif" }}>(Explore)</p>
          {["Spaces","Amenities","Neighbourhood","Contact"].map((l) => (
            <p key={l} className="text-[12px] mb-1.5" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Mona Sans',sans-serif" }}>{l}</p>
          ))}
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Mona Sans',sans-serif" }}>Visit</p>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Mona Sans',sans-serif" }}>Nackagatan 4<br />116 40 Stockholm</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Mona Sans',sans-serif" }}>Newsletter</p>
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Mona Sans',sans-serif" }}>Join our circle of architects and founders.</p>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.18)", fontFamily: "'Mona Sans',sans-serif" }}>Barnängshuset AB. Org. nr 556000-0000.</p>
        <p className="text-[28px]" style={{ fontFamily: "'Petit Serif',serif", color: "rgba(255,255,255,0.08)" }}>Barnängshuset</p>
      </div>
    </div>
  );
}

const PREVIEW_MAP: Record<ComponentId, React.FC> = {
  buttons: ButtonsPreview,
  chips:   ChipsPreview,
  badges:  BadgesPreview,
  inputs:  InputsPreview,
  cards:   CardsPreview,
  nav:     NavPreview,
  footer:  FooterPreview,
};

// ── Editor pane ───────────────────────────────────────────────────────────────

function EditorPane({ componentId }: { componentId: ComponentId }) {
  const filePath = COMPONENT_FILE[componentId];
  const { content, setContent, loading, saving, saved, error, save } = useDevFile(filePath);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ background: "#0E0C0A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          {filePath}
        </span>
        <div className="flex items-center gap-3">
          {error && <span className="text-[11px] text-red-400">{error}</span>}
          <button type="button" onClick={() => save()} disabled={saving || loading}
            className="px-3 py-1 text-[11px] uppercase tracking-wider transition-all disabled:opacity-40"
            style={{
              fontFamily: "'Mona Sans',sans-serif",
              background: saved ? "#274E36" : "rgba(255,255,255,0.07)",
              color: "#FAF7F2",
              border: "1px solid",
              borderColor: saved ? "#274E36" : "rgba(255,255,255,0.12)",
            }}>
            {saving ? "Committing…" : saved ? (IS_DEV ? "✓ Saved" : "✓ Committed — rebuilding") : (IS_DEV ? "Save" : "Commit & Rebuild")}
          </button>
        </div>
      </div>

      {/* Monaco */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Mona Sans',sans-serif", fontSize: 12 }}>
            Loading {filePath}…
          </div>
        ) : (
          <Editor
            height="100%"
            language="typescript"
            theme="vs-dark"
            path={filePath}
            value={content}
            onChange={(v: string | undefined) => setContent(v ?? "")}
            options={{
              fontSize: 12,
              lineHeight: 20,
              minimap: { enabled: true, scale: 1 },
              scrollBeyondLastLine: false,
              wordWrap: "off",
              tabSize: 2,
              fontFamily: "'Fira Code','Cascadia Code',Menlo,monospace",
              fontLigatures: true,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: "gutter",
              bracketPairColorization: { enabled: true },
            }}
          />
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ComponentsTab() {
  const [active, setActive] = useState<ComponentId>("buttons");
  const PreviewPanel = PREVIEW_MAP[active];

  return (
    <div className="flex h-full min-h-0">

      {/* Sidebar */}
      <nav className="w-40 flex-shrink-0 border-r py-6" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {NAV_ITEMS.map((item) => (
          <button key={item.id} type="button" onClick={() => setActive(item.id)}
            className="w-full text-left px-5 py-2 text-[12px] uppercase tracking-wider transition-colors"
            style={{
              fontFamily: "'Mona Sans',sans-serif",
              color: active === item.id ? "#FAF7F2" : "rgba(255,255,255,0.3)",
              background: active === item.id ? "rgba(255,255,255,0.04)" : "transparent",
            }}>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Split: preview (left 38%) + editor (right 62%) */}
      <div className="flex flex-1 min-w-0 min-h-0">

        {/* Preview + controls */}
        <div className="w-[38%] flex-shrink-0 overflow-y-auto p-5 border-r"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] uppercase tracking-widest mb-4"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Mona Sans',sans-serif" }}>
            Preview
          </p>
          <PreviewPanel />
        </div>

        {/* Source editor */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          <EditorPane key={active} componentId={active} />
        </div>

      </div>
    </div>
  );
}
