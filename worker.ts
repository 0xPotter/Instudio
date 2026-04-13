/**
 * Cloudflare Worker entry point.
 *
 * Serves static assets from the Next.js export (`out/`) and handles
 * dynamic project routes: when a user visits `/work/<new-slug>` that
 * wasn't pre-rendered, the Worker serves a pre-rendered project shell
 * page instead of returning 404. The shell's client-side JS reads the
 * real slug from the URL and fetches project data from Firestore.
 */

interface Env {
  ASSETS: { fetch(input: RequestInfo): Promise<Response> };
}

async function tryAsset(env: Env, url: string): Promise<Response | null> {
  try {
    const res = await env.ASSETS.fetch(url);
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // 1. Try to serve the exact static asset.
      try {
        const asset = await env.ASSETS.fetch(request);
        if (asset.ok) return asset;
      } catch {
        // Asset not found — continue to dynamic routing.
      }

      const url = new URL(request.url);

      // 2. Dynamic project route: /work/<slug>
      const clean = url.pathname.replace(/\/$/, "");
      const segments = clean.split("/");
      if (segments[1] === "work" && segments.length === 3 && segments[2]) {
        const shell = await tryAsset(
          env,
          new URL("/work/obsidian-echoes/", url.origin).toString(),
        );
        if (shell) {
          return new Response(shell.body, {
            status: 200,
            headers: shell.headers,
          });
        }
      }

      // 3. Fallback: 404 page
      const notFound = await tryAsset(
        env,
        new URL("/404.html", url.origin).toString(),
      );
      if (notFound) {
        return new Response(notFound.body, {
          status: 404,
          headers: notFound.headers,
        });
      }

      return new Response("Not Found", { status: 404 });
    } catch {
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
