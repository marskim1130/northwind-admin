import { config } from "dotenv";
import pg from "pg";

config();

const requiredTables = [
  "categories",
  "products",
  "suppliers",
  "customers",
  "orders",
  "order_details",
  "employees",
  "shippers",
  "employee_territories",
  "territories",
  "region",
  "customer_customer_demo",
  "customer_demographics",
  "us_states"
];

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for read-only database inspection.");
  }

  const client = new pg.Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query<{
      table_name: string;
      column_name: string;
      data_type: string;
    }>(
      `
        select table_name, column_name, data_type
        from information_schema.columns
        where table_schema = 'public'
          and table_name = any($1)
        order by table_name, ordinal_position
      `,
      [requiredTables]
    );

    const foundTables = new Set(result.rows.map((row) => row.table_name));
    const missingTables = requiredTables.filter((tableName) => !foundTables.has(tableName));

    console.log("Read-only database inspection complete.");
    console.log(`Tables inspected: ${foundTables.size}`);

    if (missingTables.length > 0) {
      console.log(`Missing tables: ${missingTables.join(", ")}`);
    } else {
      console.log("Missing tables: none");
    }
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
