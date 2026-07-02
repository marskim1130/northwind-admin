import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "./app";
import { closeDb } from "./db";

describe("Customers 客户读路径 [Customers Read Path]", () => {
  afterAll(async () => {
    await closeDb();
  });

  it("GET /api/customers 返回默认分页客户列表 [Paginated Customers List]", async () => {
    const app = createApp();

    const response = await app.request("/api/customers");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.page).toBe(1);
    expect(body.data.pageSize).toBe(20);
    expect(body.data.total).toBeGreaterThan(0);
    expect(body.data.items[0]).toEqual(
      expect.objectContaining({
        customerId: expect.any(String),
        companyName: expect.any(String),
        contactName: expect.any(String),
        country: expect.any(String),
        city: expect.any(String),
        orderCount: expect.any(Number),
        totalSales: expect.stringMatching(/^\d+\.\d{2}$/)
      })
    );
  });

  it("GET /api/customers 支持分页查询参数 [Pagination Query Params]", async () => {
    const app = createApp();

    const response = await app.request("/api/customers?page=2&pageSize=5");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.page).toBe(2);
    expect(body.data.pageSize).toBe(5);
    expect(body.data.items).toHaveLength(5);
  });

  it("GET /api/customers 支持公司名或联系人关键词搜索 [Company Or Contact Keyword Search]", async () => {
    const app = createApp();

    const response = await app.request("/api/customers?keyword=alfreds");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBeGreaterThan(0);
    expect(
      body.data.items.every(
        (item: { companyName: string; contactName: string }) => {
          const haystack = `${item.companyName} ${item.contactName}`.toLowerCase();

          return haystack.includes("alfreds");
        }
      )
    ).toBe(true);
  });

  it("GET /api/customers 支持按国家筛选 [Country Filter]", async () => {
    const app = createApp();

    const response = await app.request(
      "/api/customers?country=Germany&pageSize=50"
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBeGreaterThan(0);
    expect(
      body.data.items.every((item: { country: string }) => item.country === "Germany")
    ).toBe(true);
  });

  it("GET /api/customers 支持按城市筛选 [City Filter]", async () => {
    const app = createApp();

    const response = await app.request("/api/customers?city=Berlin&pageSize=50");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBeGreaterThan(0);
    expect(
      body.data.items.every((item: { city: string }) => item.city === "Berlin")
    ).toBe(true);
  });

  it("GET /api/customers 支持按总销售额降序排序 [Total Sales Desc Sort]", async () => {
    const app = createApp();

    const response = await app.request(
      "/api/customers?sortBy=totalSales&sortOrder=desc&pageSize=5"
    );
    const body = await response.json();

    const totalSales = body.data.items.map((item: { totalSales: string }) =>
      Number(item.totalSales)
    );

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(totalSales).toEqual([...totalSales].sort((a, b) => b - a));
  });

  it("GET /api/customers 拒绝非法排序字段 [Invalid Sort Field]", async () => {
    const app = createApp();

    const response = await app.request("/api/customers?sortBy=dropTable");
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: {
        code: "INVALID_SORT_BY",
        message: "Invalid customer sort field.",
        details: [
          "sortBy must be one of: customerId, companyName, contactName, country, city, orderCount, totalSales"
        ]
      }
    });
  });

  it("GET /api/customers/:id 返回客户详情 [Customer Detail]", async () => {
    const app = createApp();

    const response = await app.request("/api/customers/ALFKI");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: expect.objectContaining({
        customerId: "ALFKI",
        companyName: "Alfreds Futterkiste",
        contactName: expect.any(String),
        country: expect.any(String),
        city: expect.any(String),
        orderCount: expect.any(Number),
        totalSales: expect.stringMatching(/^\d+\.\d{2}$/),
        recentOrderDate: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
        )
      }),
      message: "OK"
    });
  });

  it("GET /api/customers/:id/orders 返回客户订单列表 [Customer Orders List]", async () => {
    const app = createApp();

    const response = await app.request("/api/customers/ALFKI/orders");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.page).toBe(1);
    expect(body.data.pageSize).toBe(20);
    expect(body.data.total).toBeGreaterThan(0);
    expect(body.data.items[0]).toEqual(
      expect.objectContaining({
        orderId: expect.any(Number),
        orderDate: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
        ),
        orderTotal: expect.stringMatching(/^\d+\.\d{2}$/)
      })
    );
  });
});
