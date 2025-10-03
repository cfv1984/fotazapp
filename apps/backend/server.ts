/*
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC-BY-NC-SA 4.0).
 * See the LICENSE file in the project root for the full license text.
 */

import { serve } from "bun";
import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import ENV from "../../common/configs/env";

const dataDir = ENV.DATA_DIR;
mkdirSync(dataDir, { recursive: true });
const dbPath = join(dataDir, "db.sqlite3");
const db = new Database(dbPath);

db.run("CREATE TABLE IF NOT EXISTS key_values (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
const row = db.query("SELECT COUNT(*) as c FROM key_values").get() as { c: number };
if ((row?.c ?? 0) === 0) {
  db.run("INSERT OR REPLACE INTO key_values (key, value) VALUES ('greeting','hello from gasdasd')");
}

const server = serve({
  port: ENV.BACKEND_PORT,
  fetch: async (req) => {
    const url = new URL(req.url);

    if (url.pathname === "/health") {
      return new Response("ok");
    }

    if (url.pathname === "/api/value") {
      const key = url.searchParams.get("key");
      if (!key) {
        return Response.json({ error: "missing key" }, { status: 400 });
      }
      const stmt = db.query("SELECT value FROM key_values WHERE key = ? LIMIT 1");
      const result = stmt.get(key) as { value: string } | null;
      if (!result) {
        return Response.json({ error: "not found" }, { status: 404 });
      }
      return Response.json({ key, value: result.value });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Backend listening on http://localhost:${server.port}`);







