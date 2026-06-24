import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Composite index on the Listings versions table so the admin's
  // "load latest draft" query (WHERE parent_id = ? ORDER BY created_at DESC
  // LIMIT 1) can be satisfied by a single index instead of backward-scanning
  // the whole created_at index. Without this, loading older listings in the
  // admin takes 90s+ and times out on Vercel. Mirrors the afterSchemaInit
  // index declared in payload.config.ts.
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "_listings_v_parent_created_at_idx"
    ON "_listings_v" ("parent_id", "created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "_listings_v_parent_created_at_idx";
  `)
}
