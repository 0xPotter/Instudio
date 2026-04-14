/**
 * Cloudflare Worker entry point.
 *
 * Serves static assets and handles dynamic project routes.
 * For unknown /work/<slug> paths, serves a pre-rendered shell page
 * whose client-side JS reads the real slug and fetches from Firestore.
 */

import { SHELL_HTML } from "./shell";

interface Env {
  ASSETS: { fetch(input: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Try to serve the exact static asset.
    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset.ok) return asset;
    } catch {
      // Asset not found — continue.
    }

    // 2. Dynamic project route: /work/<slug>
    const clean = url.pathname.replace(/\/$/, "");
    const segments = clean.split("/");
    if (segments[1] === "work" && segments.length === 3 && segments[2]) {
      return new Response(SHELL_HTML, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    // 3. Fallback: 404
    try {
      const notFoundReq = new Request(new URL("/404.html", url.origin), {
        method: "GET",
      });
      const notFound = await env.ASSETS.fetch(notFoundReq);
      if (notFound) {
        return new Response(notFound.body, {
          status: 404,
          headers: notFound.headers,
        });
      }
    } catch {}

    return new Response("Not Found", { status: 404 });
  },
};
