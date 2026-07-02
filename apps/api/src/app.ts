import type { HealthCheckData } from "@northwind-admin/shared";
import { Hono } from "hono";
import {
  customerSortByFields,
  getCustomerById,
  isCustomerSortBy,
  listCustomerOrders,
  listCustomers
} from "./customers.service";
import {
  getProductById,
  isProductSortBy,
  listProducts,
  productSortByFields
} from "./products.service";
import { fail, ok } from "./response";

export function createApp() {
  const app = new Hono();

  app.get("/api/health", (c) => c.json(ok<HealthCheckData>({ status: "OK" })));

  app.get("/api/customers", async (c) => {
    const sortBy = c.req.query("sortBy");
    const customerSortBy =
      sortBy && isCustomerSortBy(sortBy) ? sortBy : undefined;

    if (sortBy && !customerSortBy) {
      return c.json(
        fail("INVALID_SORT_BY", "Invalid customer sort field.", [
          `sortBy must be one of: ${customerSortByFields.join(", ")}`
        ]),
        400
      );
    }

    return c.json(
      ok(
        await listCustomers({
          page: Number(c.req.query("page") ?? 1),
          pageSize: Number(c.req.query("pageSize") ?? 20),
          keyword: c.req.query("keyword"),
          country: c.req.query("country"),
          city: c.req.query("city"),
          sortBy: customerSortBy,
          sortOrder: c.req.query("sortOrder")
        })
      )
    );
  });

  app.get("/api/customers/:id/orders", async (c) =>
    c.json(
      ok(
        await listCustomerOrders(c.req.param("id"), {
          page: Number(c.req.query("page") ?? 1),
          pageSize: Number(c.req.query("pageSize") ?? 20)
        })
      )
    )
  );

  app.get("/api/customers/:id", async (c) => {
    const customer = await getCustomerById(c.req.param("id"));

    if (!customer) {
      return c.json(fail("CUSTOMER_NOT_FOUND", "Customer not found."), 404);
    }

    return c.json(ok(customer));
  });

  app.get("/api/products", async (c) => {
    const discontinued = c.req.query("discontinued");
    const lowStock = c.req.query("lowStock");
    const sortBy = c.req.query("sortBy");
    const productSortBy = sortBy && isProductSortBy(sortBy) ? sortBy : undefined;

    if (sortBy && !productSortBy) {
      return c.json(
        fail("INVALID_SORT_BY", "Invalid product sort field.", [
          `sortBy must be one of: ${productSortByFields.join(", ")}`
        ]),
        400
      );
    }

    return c.json(
      ok(
        await listProducts({
          page: Number(c.req.query("page") ?? 1),
          pageSize: Number(c.req.query("pageSize") ?? 20),
          keyword: c.req.query("keyword"),
          categoryId: c.req.query("categoryId")
            ? Number(c.req.query("categoryId"))
            : undefined,
          supplierId: c.req.query("supplierId")
            ? Number(c.req.query("supplierId"))
            : undefined,
          discontinued:
            discontinued === "true"
              ? true
              : discontinued === "false"
                ? false
                : undefined,
          lowStock:
            lowStock === "true"
              ? true
              : lowStock === "false"
                ? false
                : undefined,
          sortBy: productSortBy,
          sortOrder: c.req.query("sortOrder")
        })
      )
    );
  });

  app.get("/api/products/:id", async (c) => {
    const product = await getProductById(Number(c.req.param("id")));

    if (!product) {
      return c.json(fail("PRODUCT_NOT_FOUND", "Product not found."), 404);
    }

    return c.json(ok(product));
  });

  app.notFound((c) => c.json(fail("NOT_FOUND", "Route not found"), 404));

  return app;
}

export type App = ReturnType<typeof createApp>;
