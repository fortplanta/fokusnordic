import { useState, useEffect, useCallback } from "react";
import { githubReadFile, githubWriteFile } from "../../lib/githubApi";

const IS_DEV = import.meta.env.DEV;

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

async function readFile(path: string): Promise<string> {
  if (IS_DEV) {
    const r = await fetch(`/api/dev/file?path=${encodeURIComponent(path)}`);
    if (!r.ok) throw new Error(`${r.status}`);
    const data = await r.json() as { content: string };
    return data.content;
  }
  return githubReadFile(path);
}

async function writeFile(path: string, content: string): Promise<void> {
  if (IS_DEV) {
    const r = await fetch("/api/dev/file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, content }),
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return;
  }
  return githubWriteFile(path, content);
}

export function useDevFile(filePath: string): DevFileState {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [rev, setRev]         = useState(0);

  useEffect(() => {
    if (!filePath) return;
    setLoading(true);
    setError(null);
    readFile(filePath)
      .then((c) => { setContent(c); setLoading(false); })
      .catch((e) => { setError(String(e)); setLoading(false); });
  }, [filePath, rev]);

  const save = useCallback(async (override?: string) => {
    const body = override ?? content;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await writeFile(filePath, body);
      setContent(body);
      setSaved(true);
      // In production keep the "saved" state longer — rebuild takes ~60s
      setTimeout(() => setSaved(false), IS_DEV ? 2000 : 10000);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }, [filePath, content]);

  const reload = useCallback(() => setRev((v) => v + 1), []);

  return { content, setContent, loading, saving, saved, error, save, reload };
}
