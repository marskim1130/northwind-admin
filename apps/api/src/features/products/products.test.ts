import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../app";
import { closeDb } from "../../infrastructure/db";

describe("Products 商品读路径 [Products Read Path]", () => {
  afterAll(async () => {
    await closeDb();
  });

  it("GET /api/products 返回默认分页商品列表 [Paginated Products List]", async () => {
    const app = createApp();

    const response = await app.request("/api/products");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.page).toBe(1);
    expect(body.data.pageSize).toBe(20);
    expect(body.data.total).toBeGreaterThan(0);
    expect(body.data.items[0]).toEqual(
      expect.objectContaining({
        productId: expect.any(Number),
        productName: expect.any(String),
        categoryName: expect.any(String),
        supplierName: expect.any(String),
        unitPrice: expect.stringMatching(/^\d+\.\d{2}$/),
        lowStock: expect.any(Boolean)
      })
    );
  });

  it("GET /api/products 支持分页查询参数 [Pagination Query Params]", async () => {
    const app = createApp();

    const response = await app.request("/api/products?page=2&pageSize=5");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.page).toBe(2);
    expect(body.data.pageSize).toBe(5);
    expect(body.data.items).toHaveLength(5);
  });

  it("GET /api/products 支持按商品名关键词搜索 [Product Name Keyword Search]", async () => {
    const app = createApp();

    const response = await app.request("/api/products?keyword=chai");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBeGreaterThan(0);
    expect(
      body.data.items.every((item: { productName: string }) =>
        item.productName.toLowerCase().includes("chai")
      )
    ).toBe(true);
  });

  it("GET /api/products 支持按分类筛选 [Category Filter]", async () => {
    const app = createApp();

    const response = await app.request("/api/products?categoryId=1");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBeGreaterThan(0);
    expect(
      body.data.items.every(
        (item: { categoryName: string }) => item.categoryName === "Beverages"
      )
    ).toBe(true);
  });

  it("GET /api/products 支持按供应商筛选 [Supplier Filter]", async () => {
    const app = createApp();

    const response = await app.request("/api/products?supplierId=1");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBeGreaterThan(0);
    expect(
      body.data.items.every(
        (item: { supplierName: string }) => item.supplierName === "Exotic Liquids"
      )
    ).toBe(true);
  });

  it("GET /api/products 支持按停产状态筛选 [Discontinued Filter]", async () => {
    const app = createApp();

    const response = await app.request(
      "/api/products?discontinued=true&pageSize=20"
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBe(10);
    expect(
      body.data.items.map((item: { productId: number }) => item.productId)
    ).toEqual([1, 2, 5, 9, 17, 24, 28, 29, 42, 53]);
  });

  it("GET /api/products 支持按低库存筛选 [Low Stock Filter]", async () => {
    const app = createApp();

    const response = await app.request("/api/products?lowStock=true&pageSize=100");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.total).toBeGreaterThan(0);
    expect(
      body.data.items.every((item: { lowStock: boolean }) => item.lowStock)
    ).toBe(true);
  });

  it("GET /api/products 支持按单价降序排序 [Unit Price Desc Sort]", async () => {
    const app = createApp();

    const response = await app.request(
      "/api/products?sortBy=unitPrice&sortOrder=desc&pageSize=5"
    );
    const body = await response.json();

    const unitPrices = body.data.items.map((item: { unitPrice: string }) =>
      Number(item.unitPrice)
    );

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(unitPrices).toEqual([...unitPrices].sort((a, b) => b - a));
  });

  it("GET /api/products 拒绝非法排序字段 [Invalid Sort Field]", async () => {
    const app = createApp();

    const response = await app.request("/api/products?sortBy=dropTable");
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: {
        code: "INVALID_SORT_BY",
        message: "Invalid product sort field.",
        details: [
          "sortBy must be one of: productId, productName, categoryName, supplierName, unitPrice"
        ]
      }
    });
  });

  it("GET /api/products/:id 返回商品详情 [Product Detail]", async () => {
    const app = createApp();

    const response = await app.request("/api/products/1");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: expect.objectContaining({
        productId: 1,
        productName: "Chai",
        categoryName: "Beverages",
        supplierName: "Specialty Biscuits, Ltd.",
        unitPrice: expect.stringMatching(/^\d+\.\d{2}$/),
        lowStock: expect.any(Boolean)
      }),
      message: "OK"
    });
  });
});
