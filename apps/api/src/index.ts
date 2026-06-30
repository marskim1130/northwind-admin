import { serve } from "@hono/node-server";
import { config } from "dotenv";
import { createApp } from "./app";

config();

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
