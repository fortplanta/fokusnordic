import { useState, useEffect, useCallback } from "react";

interface DevFileState {
  content: string;
  setContent: (c: string) => void;
  loading: boolean;
  saving: boolean;
  saved: boolean;
  error: string | null;
  save: (content?: string) => Promise<void>;
  reload: () => void;
}

export function useDevFile(filePath: string): DevFileState {
  const [content, setContent]   = useState("");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [rev, setRev]           = useState(0);

  useEffect(() => {
    if (!filePath) return;
    setLoading(true);
    setError(null);
    fetch(`/api/dev/file?path=${encodeURIComponent(filePath)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<{ content: string }>;
      })
      .then(({ content }) => {
        setContent(content);
        setLoading(false);
      })
      .catch((e) => {
        setError(String(e));
        setLoading(false);
      });
  }, [filePath, rev]);

  const save = useCallback(
    async (override?: string) => {
      const body = override ?? content;
      setSaving(true);
      setSaved(false);
      try {
        const r = await fetch("/api/dev/file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: filePath, content: body }),
        });
        if (!r.ok) throw new Error(`${r.status}`);
        setContent(body);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        setError(String(e));
      } finally {
        setSaving(false);
      }
    },
    [filePath, content]
  );

  const reload = useCallback(() => setRev((v) => v + 1), []);

  return { content, setContent, loading, saving, saved, error, save, reload };
}
