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
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Try to serve the exact static asset.
    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) return asset;

    // 2. Dynamic project route: /work/<slug>
    //    Serve a pre-rendered project shell — all shells are identical
    //    (loading state), so any one works. The client JS will read the
    //    actual slug from window.location and fetch from Firestore.
    const segments = url.pathname.replace(/\/$/, "").split("/");
    if (segments[1] === "work" && segments.length === 3 && segments[2]) {
      const shell = await env.ASSETS.fetch(
        new Request(new URL("/work/obsidian-echoes", url.origin), request),
      );
      if (shell.ok) {
        return new Response(shell.body, {
          status: 200,
          headers: shell.headers,
        });
      }
    }

    // 3. Everything else: serve the custom 404 page.
    const notFoundPage = await env.ASSETS.fetch(
      new Request(new URL("/404", url.origin), request),
    );
    return new Response(notFoundPage.body, {
      status: 404,
      headers: notFoundPage.headers,
    });
  },
};
