/*
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC-BY-NC-SA 4.0).
 * See the LICENSE file in the project root for the full license text.
 */

import { join, resolve } from "node:path";
import { serve } from "bun";
import { FRONTEND_PORT, BACKEND_URL, NODE_ENV, FRONTEND_ASSET_PATH } from "../../common/configs/env";
import { Home } from "./pages";

const server = serve({
  port: FRONTEND_PORT,
  routes: {
    "/": async () => Home(),
    "/static/:path": (req) => {
      const { path } = req.params;

      console.log({
        raw: path,
        joined: resolve(join("./static", path))
      })

      return new Response(Bun.file(resolve(join(FRONTEND_ASSET_PATH, path))));
    },
  },
});

console.log(`Frontend listening on http://localhost:${server.port}`);

function htmlResponse(content: unknown): Response {
  try {
    return new Response(String(content), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    return new Response(String(err ?? "error"), { status: 500 });
  }
}






