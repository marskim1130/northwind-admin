import { getDb } from "../../infrastructure/db";
import { calculateOrderMoney } from "./orders-money";
import { deriveOrderStatus } from "./orders-status";

interface OrderListRow {
  order_id: number;
  customer_name: string | null;
  employee_name: string | null;
  shipper_name: string | null;
  order_date: Date | string;
  required_date: Date | string | null;
  shipped_date: Date | string | null;
  freight: string | number;
  ship_country: string | null;
  items_total: string | number;
}

interface ListOrdersOptions {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

function toIsoString(value: Date | string | null) {
  return value ? new Date(value).toISOString() : "";
}

export async function listOrders(options: ListOrdersOptions = {}) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const offset = (page - 1) * pageSize;
  const sql = getDb();
  const keyword = options.keyword?.trim();
  const orderId = keyword && /^\d+$/.test(keyword) ? Number(keyword) : undefined;
  const keywordFilter = orderId ? sql`o.order_id = ${orderId}` : sql`true`;

  const [totalRow] = await sql<{ total: number }[]>`
    select count(*)::int as total
    from orders o
    where ${keywordFilter}
  `;

  const rows = await sql<OrderListRow[]>`
    select
      o.order_id,
      c.company_name as customer_name,
      concat(e.first_name, ' ', e.last_name) as employee_name,
      s.company_name as shipper_name,
      o.order_date,
      o.required_date,
      o.shipped_date,
      o.freight,
      o.ship_country,
      coalesce(sum(od.unit_price * od.quantity * (1 - od.discount)), 0) as items_total
    from orders o
    left join customers c on c.customer_id = o.customer_id
    left join employees e on e.employee_id = o.employee_id
    left join shippers s on s.shipper_id = o.ship_via
    left join order_details od on od.order_id = o.order_id
    where ${keywordFilter}
    group by
      o.order_id,
      c.company_name,
      e.first_name,
      e.last_name,
      s.company_name,
      o.order_date,
      o.required_date,
      o.shipped_date,
      o.freight,
      o.ship_country
    order by o.order_id asc
    limit ${pageSize}
    offset ${offset}
  `;

  return {
    items: rows.map((row) => {
      const money = calculateOrderMoney({
        freight: row.freight,
        items: [{ unitPrice: row.items_total, quantity: 1, discount: 0 }]
      });

      return {
        orderId: row.order_id,
        customerName: row.customer_name ?? "",
        employeeName: row.employee_name ?? "",
        shipperName: row.shipper_name ?? "",
        orderDate: toIsoString(row.order_date),
        requiredDate: toIsoString(row.required_date),
        shippedDate: toIsoString(row.shipped_date),
        freight: money.freight,
        shipCountry: row.ship_country ?? "",
        orderTotal: money.orderTotal,
        status: deriveOrderStatus({
          shippedDate: row.shipped_date,
          requiredDate: row.required_date
        })
      };
    }),
    page,
    pageSize,
    total: totalRow?.total ?? 0
  };
}
