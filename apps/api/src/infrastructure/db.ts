import postgres from "postgres";
import { loadEnv } from "../config/env";

type DatabaseClient = ReturnType<typeof postgres>;

let db: DatabaseClient | undefined;

export function getDb() {
  loadEnv();

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required.");
  }

  db ??= postgres(connectionString, {
    connect_timeout: 10,
    idle_timeout: 5,
    max: 1
  });

  return db;
}

export async function closeDb() {
  if (!db) {
    return;
  }

  const currentDb = db;
  db = undefined;
  await currentDb.end({ timeout: 5 });
}
