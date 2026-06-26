import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";

import { router } from "@repo/api/orpc/router";

const api = new Hono<HonoContext>();
const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

api.use("/*", async (c, next) => {
  const start = performance.now();
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: "/api/v1/rpc",
    context: {
      headers: c.req.raw.headers,
      clientIP: c.var.clientIP,
    },
  });

  if (matched) {
    // Lightweight observability: structured per-request latency log. In a real
    // deployment this is where we'd emit a metric / trace span instead.
    console.info(
      JSON.stringify({
        scope: "rpc",
        method: c.req.method,
        path: new URL(c.req.url).pathname,
        status: response.status,
        durationMs: Math.round((performance.now() - start) * 10) / 10,
        clientIP: c.var.clientIP,
      })
    );
    return c.newResponse(response.body, response);
  }

  await next();
});

export default api;
