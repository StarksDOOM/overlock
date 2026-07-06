import fs from "fs";
import path from "path";
import { pgPool } from "./postgres";

export async function runMigrations() {
  const client = await pgPool.connect();
  try {
    // 1. Ensure schema_migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Read all files from migrations directory
    const migrationsDir = path.resolve(__dirname, "../../migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.warn("Migrations directory not found at:", migrationsDir);
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    console.log(`Found ${files.length} migration file(s)`);

    // 3. Apply migrations in order
    for (const file of files) {
      const { rows } = await client.query(
        "SELECT 1 FROM schema_migrations WHERE version = $1",
        [file]
      );

      if (rows.length === 0) {
        console.log(`Applying migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
        
        // Execute DDL inside a transaction
        await client.query("BEGIN");
        try {
          await client.query(sql);
          await client.query(
            "INSERT INTO schema_migrations (version) VALUES ($1)",
            [file]
          );
          await client.query("COMMIT");
          console.log(`Successfully applied migration: ${file}`);
        } catch (err: any) {
          await client.query("ROLLBACK");
          throw new Error(`Migration ${file} failed: ${err.message}`);
        }
      } else {
        console.log(`Migration ${file} already applied`);
      }
    }
    console.log("All migrations checked and up-to-date");
  } catch (err: any) {
    console.error("Migration execution failed:", err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Allow direct execution
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("Migration script finished successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration script failed:", err);
      process.exit(1);
    });
}
