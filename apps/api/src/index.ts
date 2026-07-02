import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { loadEnv } from "./config/env";

loadEnv();

const port = Number.parseInt(process.env.API_PORT ?? "3000", 10);
const app = createApp();

serve(
  {
    fetch: app.fetch,
    port
  },
  () => {
    console.log(`API listening on http://localhost:${port}`);
  }
);
