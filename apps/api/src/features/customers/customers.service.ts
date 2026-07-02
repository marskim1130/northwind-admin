import { getDb } from "../../infrastructure/db";

export const customerSortByFields = [
  "customerId",
  "companyName",
  "contactName",
  "country",
  "city",
  "orderCount",
  "totalSales"
] as const;

type CustomerSortBy = (typeof customerSortByFields)[number];

export function isCustomerSortBy(value: string): value is CustomerSortBy {
  return (customerSortByFields as readonly string[]).includes(value);
}

interface CustomerListRow {
  customer_id: string;
  company_name: string;
  contact_name: string | null;
  country: string | null;
  city: string | null;
  order_count: number;
  total_sales: string | number;
}

interface CustomerDetailRow extends CustomerListRow {
  recent_order_date: Date | string | null;
}

interface CustomerOrderRow {
  order_id: number;
  order_date: Date | string;
  order_total: string | number;
}

interface ListCustomersOptions {
  page?: number;
  pageSize?: number;
  keyword?: string;
  country?: string;
  city?: string;
  sortBy?: CustomerSortBy;
  sortOrder?: string;
}

function mapCustomerListRow(row: CustomerListRow) {
  return {
    customerId: row.customer_id,
    companyName: row.company_name,
    contactName: row.contact_name ?? "",
    country: row.country ?? "",
    city: row.city ?? "",
    orderCount: row.order_count,
    totalSales: Number(row.total_sales).toFixed(2)
  };
}

function toIsoString(value: Date | string | null) {
  return value ? new Date(value).toISOString() : null;
}

export async function listCustomers(options: ListCustomersOptions = {}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const offset = (page - 1) * pageSize;
  const sql = getDb();
  const keyword = options.keyword?.trim();
  const keywordFilter = keyword
    ? sql`(c.company_name ilike ${`%${keyword}%`} or c.contact_name ilike ${`%${keyword}%`})`
    : sql`true`;
  const country = options.country?.trim();
  const countryFilter = country ? sql`c.country = ${country}` : sql`true`;
  const city = options.city?.trim();
  const cityFilter = city ? sql`c.city = ${city}` : sql`true`;
  const sortFields = {
    customerId: sql`c.customer_id`,
    companyName: sql`c.company_name`,
    contactName: sql`c.contact_name`,
    country: sql`c.country`,
    city: sql`c.city`,
    orderCount: sql`count(distinct o.order_id)`,
    totalSales: sql`coalesce(sum(od.unit_price * od.quantity * (1 - od.discount)), 0)`
  };
  const sortField = options.sortBy
    ? sortFields[options.sortBy]
    : sortFields.customerId;
  const sortDirection = options.sortOrder === "desc" ? sql`desc` : sql`asc`;

  const [totalRow] = await sql<{ total: number }[]>`
    select count(*)::int as total
    from customers c
    where ${keywordFilter}
      and ${countryFilter}
      and ${cityFilter}
  `;

  const rows = await sql<CustomerListRow[]>`
    select
      c.customer_id,
      c.company_name,
      c.contact_name,
      c.country,
      c.city,
      count(distinct o.order_id)::int as order_count,
      coalesce(sum(od.unit_price * od.quantity * (1 - od.discount)), 0) as total_sales
    from customers c
    left join orders o on o.customer_id = c.customer_id
    left join order_details od on od.order_id = o.order_id
    where ${keywordFilter}
      and ${countryFilter}
      and ${cityFilter}
    group by
      c.customer_id,
      c.company_name,
      c.contact_name,
      c.country,
      c.city
    order by ${sortField} ${sortDirection}
    limit ${pageSize}
    offset ${offset}
  `;

  return {
    items: rows.map(mapCustomerListRow),
    page,
    pageSize,
    total: totalRow?.total ?? 0
  };
}

export async function getCustomerById(customerId: string) {
  const sql = getDb();

  const [row] = await sql<CustomerDetailRow[]>`
    select
      c.customer_id,
      c.company_name,
      c.contact_name,
      c.country,
      c.city,
      count(distinct o.order_id)::int as order_count,
      coalesce(sum(od.unit_price * od.quantity * (1 - od.discount)), 0) as total_sales,
      max(o.order_date) as recent_order_date
    from customers c
    left join orders o on o.customer_id = c.customer_id
    left join order_details od on od.order_id = o.order_id
    where c.customer_id = ${customerId}
    group by
      c.customer_id,
      c.company_name,
      c.contact_name,
      c.country,
      c.city
    limit 1
  `;

  return row
    ? {
        ...mapCustomerListRow(row),
        recentOrderDate: toIsoString(row.recent_order_date)
      }
    : undefined;
}

export async function listCustomerOrders(
  customerId: string,
  options: Pick<ListCustomersOptions, "page" | "pageSize"> = {}
) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const offset = (page - 1) * pageSize;
  const sql = getDb();

  const [totalRow] = await sql<{ total: number }[]>`
    select count(*)::int as total
    from orders
    where customer_id = ${customerId}
  `;

  const rows = await sql<CustomerOrderRow[]>`
    select
      o.order_id,
      o.order_date,
      coalesce(sum(od.unit_price * od.quantity * (1 - od.discount)), 0) as order_total
    from orders o
    left join order_details od on od.order_id = o.order_id
    where o.customer_id = ${customerId}
    group by o.order_id, o.order_date
    order by o.order_date desc, o.order_id desc
    limit ${pageSize}
    offset ${offset}
  `;

  return {
    items: rows.map((row) => ({
      orderId: row.order_id,
      orderDate: toIsoString(row.order_date) ?? "",
      orderTotal: Number(row.order_total).toFixed(2)
    })),
    page,
    pageSize,
    total: totalRow?.total ?? 0
  };
}
