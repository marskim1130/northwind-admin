import { getDb } from "./db";

export const productSortByFields = [
  "productId",
  "productName",
  "categoryName",
  "supplierName",
  "unitPrice"
] as const;

type ProductSortBy = (typeof productSortByFields)[number];

export function isProductSortBy(value: string): value is ProductSortBy {
  return (productSortByFields as readonly string[]).includes(value);
}

interface ProductListRow {
  product_id: number;
  product_name: string;
  category_name: string;
  supplier_name: string;
  unit_price: string | number;
  units_in_stock: number;
  reorder_level: number;
}

interface ListProductsOptions {
  page?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
  supplierId?: number;
  discontinued?: boolean;
  lowStock?: boolean;
  sortBy?: ProductSortBy;
  sortOrder?: string;
}

function mapProductRow(row: ProductListRow) {
  return {
    productId: row.product_id,
    productName: row.product_name,
    categoryName: row.category_name,
    supplierName: row.supplier_name,
    unitPrice: Number(row.unit_price).toFixed(2),
    lowStock: row.units_in_stock <= row.reorder_level
  };
}

export async function listProducts(options: ListProductsOptions = {}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const offset = (page - 1) * pageSize;
  const sql = getDb();
  const keyword = options.keyword?.trim();
  const keywordFilter = keyword
    ? sql`p.product_name ilike ${`%${keyword}%`}`
    : sql`true`;
  const categoryFilter = options.categoryId
    ? sql`p.category_id = ${options.categoryId}`
    : sql`true`;
  const supplierFilter = options.supplierId
    ? sql`p.supplier_id = ${options.supplierId}`
    : sql`true`;
  const discontinuedFilter =
    typeof options.discontinued === "boolean"
      ? sql`p.discontinued = ${options.discontinued ? 1 : 0}`
      : sql`true`;
  const lowStockFilter =
    typeof options.lowStock === "boolean"
      ? options.lowStock
        ? sql`p.units_in_stock <= p.reorder_level`
        : sql`p.units_in_stock > p.reorder_level`
      : sql`true`;
  const sortFields = {
    productId: sql`p.product_id`,
    productName: sql`p.product_name`,
    categoryName: sql`c.category_name`,
    supplierName: sql`s.company_name`,
    unitPrice: sql`p.unit_price`
  };
  const sortField = options.sortBy
    ? sortFields[options.sortBy]
    : sortFields.productId;
  const sortDirection = options.sortOrder === "desc" ? sql`desc` : sql`asc`;

  const [totalRow] = await sql<{ total: number }[]>`
    select count(*)::int as total
    from products p
      where ${keywordFilter}
        and ${categoryFilter}
        and ${supplierFilter}
        and ${discontinuedFilter}
        and ${lowStockFilter}
  `;

  const rows = await sql<ProductListRow[]>`
    select
      p.product_id,
      p.product_name,
      coalesce(c.category_name, '') as category_name,
      coalesce(s.company_name, '') as supplier_name,
      p.unit_price,
      p.units_in_stock,
      p.reorder_level
    from products p
    left join categories c on c.category_id = p.category_id
    left join suppliers s on s.supplier_id = p.supplier_id
      where ${keywordFilter}
        and ${categoryFilter}
        and ${supplierFilter}
        and ${discontinuedFilter}
        and ${lowStockFilter}
    order by ${sortField} ${sortDirection}
    limit ${pageSize}
    offset ${offset}
  `;

  return {
    items: rows.map(mapProductRow),
    page,
    pageSize,
    total: totalRow?.total ?? 0
  };
}

export async function getProductById(productId: number) {
  const sql = getDb();

  const [row] = await sql<ProductListRow[]>`
    select
      p.product_id,
      p.product_name,
      coalesce(c.category_name, '') as category_name,
      coalesce(s.company_name, '') as supplier_name,
      p.unit_price,
      p.units_in_stock,
      p.reorder_level
    from products p
    left join categories c on c.category_id = p.category_id
    left join suppliers s on s.supplier_id = p.supplier_id
    where p.product_id = ${productId}
    limit 1
  `;

  return row ? mapProductRow(row) : undefined;
}
