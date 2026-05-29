/**
 * githubApi
 *
 * Reads and writes files in the GitHub repo directly from the browser.
 * Used by the /styleguide design panel on the live Netlify site so that
 * "Save" commits the file, triggering an automatic Netlify rebuild.
 *
 * Credentials (token only — owner/repo are hardcoded) are stored in
 * localStorage so the user only enters them once.
 */

const OWNER  = "fortplanta";
const REPO   = "fokusnordic";
const BRANCH = "main";

const TOKEN_KEY = "barnang:github-token";

// ── Credential helpers ────────────────────────────────────────────────────────

export function getGitHubToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setGitHubToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token.trim());
}

export function clearGitHubToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Base64 helpers (UTF-8 safe) ───────────────────────────────────────────────

function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g, ""))));
}

// ── API calls ─────────────────────────────────────────────────────────────────

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

interface GitHubFileResponse {
  content: string;
  sha: string;
  name: string;
}

/** Read a file from the repo. Returns the decoded UTF-8 content. */
export async function githubReadFile(path: string): Promise<string> {
  const token = getGitHubToken();
  if (!token) throw new Error("No GitHub token configured.");

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
  const r = await fetch(url, { headers: headers(token) });

  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(`GitHub read failed (${r.status}): ${(err as { message?: string }).message ?? r.statusText}`);
  }

  const data = (await r.json()) as GitHubFileResponse;
  return fromBase64(data.content);
}

/** Write (create or update) a file in the repo. Triggers a Netlify rebuild. */
export async function githubWriteFile(
  path: string,
  content: string,
  commitMessage?: string
): Promise<void> {
  const token = getGitHubToken();
  if (!token) throw new Error("No GitHub token configured.");

  const base = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;

  // Fetch current SHA — required for updates (not creates)
  const existing = await fetch(`${base}?ref=${BRANCH}`, { headers: headers(token) });
  const sha: string | undefined = existing.ok
    ? ((await existing.json()) as GitHubFileResponse).sha
    : undefined;

  const body: Record<string, string> = {
    message: commitMessage ?? `design: update ${path} via /styleguide`,
    content: toBase64(content),
    branch:  BRANCH,
  };
  if (sha) body.sha = sha;

  const r = await fetch(base, {
    method:  "PUT",
    headers: headers(token),
    body:    JSON.stringify(body),
  });

  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(`GitHub write failed (${r.status}): ${(err as { message?: string }).message ?? r.statusText}`);
  }
}

/** Verify a token works (rate-limit check — no scopes needed). */
export async function verifyGitHubToken(token: string): Promise<boolean> {
  const r = await fetch("https://api.github.com/rate_limit", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return r.ok;
}
