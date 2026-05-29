import { useState } from "react";
import { setGitHubToken, verifyGitHubToken } from "../../lib/githubApi";

interface GitHubSetupProps {
  onConnected: () => void;
}

export function GitHubSetup({ onConnected }: GitHubSetupProps) {
  const [token, setToken]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleConnect = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const valid = await verifyGitHubToken(token.trim());
      if (!valid) throw new Error("Token rejected by GitHub. Check it has repo scope.");
      setGitHubToken(token.trim());
      onConnected();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-sm px-8">

        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-widest mb-3"
            style={{ color: "#274E36", fontFamily: "'Mona Sans',sans-serif" }}>
            ◐ One-time setup
          </p>
          <h2 className="text-[22px] font-light mb-3"
            style={{ fontFamily: "'Petit Serif',serif", color: "#FAF7F2" }}>
            Connect to GitHub
          </h2>
          <p className="text-[13px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Mona Sans',sans-serif" }}>
            Saves from this panel commit directly to{" "}
            <span style={{ color: "rgba(255,255,255,0.65)" }}>fortplanta/fokusnordic</span>{" "}
            and trigger a Netlify rebuild. Your token is stored only in this browser.
          </p>
        </div>

        {/* Token input */}
        <div className="mb-4">
          <label className="block text-[10px] uppercase tracking-widest mb-2"
            style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Mona Sans',sans-serif" }}>
            GitHub Personal Access Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            autoComplete="off"
            className="w-full font-mono text-[13px] px-3 py-2.5 outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#FAF7F2",
            }}
          />
        </div>

        {/* Scope hint */}
        <p className="text-[11px] mb-6"
          style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Mona Sans',sans-serif" }}>
          Needs{" "}
          <code style={{ color: "rgba(255,255,255,0.45)" }}>repo</code> scope. Create one at{" "}
          <a
            href="https://github.com/settings/tokens/new?scopes=repo&description=Barnangshuset+Design+Panel"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#274E36", textDecoration: "underline" }}
          >
            github.com/settings/tokens
          </a>
        </p>

        {error && (
          <p className="text-[12px] mb-4"
            style={{ color: "#C0392B", fontFamily: "'Mona Sans',sans-serif" }}>
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleConnect}
          disabled={loading || !token.trim()}
          className="w-full py-2.5 text-[12px] uppercase tracking-wider transition-all disabled:opacity-40"
          style={{
            fontFamily: "'Mona Sans',sans-serif",
            background: "#274E36",
            color: "#FAF7F2",
            border: "1px solid #274E36",
          }}
        >
          {loading ? "Verifying…" : "Connect"}
        </button>
      </div>
    </div>
  );
}
