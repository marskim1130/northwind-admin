import type { CustomerListQuery, ProductListQuery } from "@northwind-admin/shared";

export const queryKeys = {
  dashboard: {
    summary: ["dashboard", "summary"] as const
  },
  products: {
    list: (query: ProductListQuery) => ["products", "list", query] as const,
    detail: (productId: number) => ["products", "detail", productId] as const
  },
  customers: {
    list: (query: CustomerListQuery) => ["customers", "list", query] as const,
    detail: (customerId: string) => ["customers", "detail", customerId] as const,
    orders: (customerId: string) => ["customers", "orders", customerId] as const
  }
};
