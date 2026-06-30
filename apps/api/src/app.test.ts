import { describe, expect, it } from "vitest";
import { createApp } from "./app";

describe("健康检查 [Health Check]", () => {
  it("GET /api/health 返回统一成功响应 [Unified Success Response]", async () => {
    const app = createApp();

    const response = await app.request("/api/health");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      data: { status: "OK" },
      message: "OK"
    });
  });
});
