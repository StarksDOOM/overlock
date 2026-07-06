import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

export const pgPool = new Pool({
  connectionString: databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection on initialization
pgPool.query("SELECT 1")
  .then(() => {
    console.log("Successfully connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("Failed to connect to PostgreSQL:", err.message);
  });
