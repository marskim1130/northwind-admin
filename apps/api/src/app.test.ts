import type { HealthCheckData, SuccessResponse } from "@northwind-admin/shared";
import { describe, expect, it } from "vitest";
import { createApp } from "./app";

describe("健康检查 [Health Check]", () => {
  it("GET /api/health 返回统一成功响应 [Unified Success Response]", async () => {
    const app = createApp();
    const expectedBody: SuccessResponse<HealthCheckData> = {
      success: true,
      data: { status: "OK" },
      message: "OK"
    };

    const response = await app.request("/api/health");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expectedBody);
  });
});

describe("错误响应 [Error Response]", () => {
  it("未知 API 路由返回统一错误响应 [Unified Error Response]", async () => {
    const app = createApp();

    const response = await app.request("/api/missing-route");

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
        details: []
      }
    });
  });
});
