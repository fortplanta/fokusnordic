/**
 * vite-plugin-dev-files
 *
 * Adds two HTTP endpoints to the Vite dev server so the DesignPanel
 * can read and write source files from the browser:
 *
 *   GET  /api/dev/file?path=src/...   → { content: string }
 *   POST /api/dev/file                → { path, content }  → { ok: true }
 *
 * Only active in dev mode (`apply: "serve"`).
 * Vite HMR automatically picks up saved files.
 */

import type { Plugin } from "vite";
import fs from "fs/promises";
import path from "path";

export function devFilesPlugin(): Plugin {
  return {
    name: "dev-files",
    apply: "serve",

    configureServer(server) {
      server.middlewares.use("/api/dev/file", async (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        const url = new URL(req.url!, `http://localhost`);

        // ── GET: read file ───────────────────────────────────────────────────
        if (req.method === "GET") {
          const filePath = url.searchParams.get("path");
          if (!filePath) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "missing ?path=" }));
            return;
          }
          try {
            const abs = path.resolve(process.cwd(), filePath);
            const content = await fs.readFile(abs, "utf-8");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ content }));
          } catch {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "file not found" }));
          }
          return;
        }

        // ── POST: write file ─────────────────────────────────────────────────
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", async () => {
            try {
              const { path: filePath, content } = JSON.parse(body) as {
                path: string;
                content: string;
              };
              const abs = path.resolve(process.cwd(), filePath);
              await fs.writeFile(abs, content, "utf-8");
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(e) }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end("method not allowed");
      });
    },
  };
}
