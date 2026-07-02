import postgres from "postgres";
import { summarizeInspection } from "../src/db-inspection";
import { loadEnv } from "../src/env";

loadEnv();

const requiredColumnsByTable = {
  categories: ["category_id", "category_name", "description", "picture"],
  products: [
    "product_id",
    "product_name",
    "supplier_id",
    "category_id",
    "quantity_per_unit",
    "unit_price",
    "units_in_stock",
    "units_on_order",
    "reorder_level",
    "discontinued"
  ],
  suppliers: [
    "supplier_id",
    "company_name",
    "contact_name",
    "contact_title",
    "address",
    "city",
    "region",
    "postal_code",
    "country",
    "phone",
    "fax",
    "homepage"
  ],
  customers: [
    "customer_id",
    "company_name",
    "contact_name",
    "contact_title",
    "address",
    "city",
    "region",
    "postal_code",
    "country",
    "phone",
    "fax"
  ],
  orders: [
    "order_id",
    "customer_id",
    "employee_id",
    "order_date",
    "required_date",
    "shipped_date",
    "ship_via",
    "freight",
    "ship_name",
    "ship_address",
    "ship_city",
    "ship_region",
    "ship_postal_code",
    "ship_country"
  ],
  order_details: ["order_id", "product_id", "unit_price", "quantity", "discount"],
  employees: [
    "employee_id",
    "last_name",
    "first_name",
    "title",
    "title_of_courtesy",
    "birth_date",
    "hire_date",
    "address",
    "city",
    "region",
    "postal_code",
    "country",
    "home_phone",
    "extension",
    "photo",
    "notes",
    "reports_to",
    "photo_path"
  ],
  shippers: ["shipper_id", "company_name", "phone"],
  employee_territories: ["employee_id", "territory_id"],
  territories: ["territory_id", "territory_description", "region_id"],
  region: ["region_id", "region_description"],
  customer_customer_demo: ["customer_id", "customer_type_id"],
  customer_demographics: ["customer_type_id", "customer_desc"],
  us_states: ["state_id", "state_name", "state_abbr", "state_region"]
} satisfies Record<string, string[]>;

const requiredTables = Object.keys(requiredColumnsByTable);

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for read-only database inspection.");
  }

  const sql = postgres(connectionString, { connect_timeout: 10 });

  try {
    const rows = await sql<
      {
      table_name: string;
      column_name: string;
      data_type: string;
      }[]
    >`
        select table_name, column_name, data_type
        from information_schema.columns
        where table_schema = 'public'
          and table_name in ${sql(requiredTables)}
        order by table_name, ordinal_position
      `
    ;

    const summary = summarizeInspection({
      requiredTables,
      requiredColumnsByTable,
      rows: rows.map((row) => ({
        tableName: row.table_name,
        columnName: row.column_name,
        dataType: row.data_type
      }))
    });

    console.log("Read-only database inspection complete.");
    console.log(`Tables inspected: ${summary.tablesInspected}`);

    if (summary.missingTables.length > 0) {
      console.log(`Missing tables: ${summary.missingTables.join(", ")}`);
    } else {
      console.log("Missing tables: none");
    }

    if (summary.missingColumns.length > 0) {
      console.log(
        `Missing columns: ${summary.missingColumns
          .map((column) => `${column.tableName}.${column.columnName}`)
          .join(", ")}`
      );
    } else {
      console.log("Missing columns: none");
    }
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
