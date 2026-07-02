import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { closeDb } from "../../infrastructure/db";

describe("Orders 订单读路径 [Orders Read Path]", () => {
  afterAll(async () => {
    await closeDb();
  });

  it("GET /api/orders 返回默认分页订单列表 [Paginated Orders List]", async () => {
    const app = createApp();

    const response = await app.request("/api/orders");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.page).toBe(1);
    expect(body.data.pageSize).toBe(20);
    expect(body.data.total).toBeGreaterThan(0);
    expect(body.data.items[0]).toEqual(
      expect.objectContaining({
        orderId: expect.any(Number),
        customerName: expect.any(String),
        employeeName: expect.any(String),
        shipperName: expect.any(String),
        orderDate: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
        ),
        requiredDate: expect.any(String),
        shippedDate: expect.any(String),
        freight: expect.stringMatching(/^\d+\.\d{2}$/),
        shipCountry: expect.any(String),
        orderTotal: expect.stringMatching(/^\d+\.\d{2}$/),
        status: expect.stringMatching(/^(Pending|Shipped|Late|On Time)$/)
      })
    );
  });

  it("GET /api/orders 支持分页查询参数 [Pagination Query Params]", async () => {
    const app = createApp();

    const response = await app.request("/api/orders?page=2&pageSize=5");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.page).toBe(2);
    expect(body.data.pageSize).toBe(5);
    expect(body.data.items).toHaveLength(5);
  });

  it("GET /api/orders 支持按订单号关键词精确搜索 [Order ID Keyword Search]", async () => {
    const app = createApp();

    const response = await app.request("/api/orders?keyword=10248");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBe(1);
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].orderId).toBe(10248);
  });
});
