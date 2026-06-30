import { Hono } from "hono";

export function createApp() {
  return new Hono();
}

export type App = ReturnType<typeof createApp>;
