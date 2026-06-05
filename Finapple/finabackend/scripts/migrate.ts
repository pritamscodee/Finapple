import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = `
CREATE TYPE IF NOT EXISTS "public"."transaction_type" AS ENUM('deposit', 'withdrawal', 'transfer_in', 'transfer_out');

CREATE TABLE IF NOT EXISTS "transactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" "transaction_type" NOT NULL,
  "amount" numeric(14, 2) NOT NULL,
  "balance_after" numeric(14, 2) NOT NULL,
  "description" varchar(255),
  "recipient_id" uuid REFERENCES "users"("id"),
  "recipient_email" varchar(255),
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "analysis_results" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_id" integer NOT NULL REFERENCES "files"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "document_type" varchar(100),
  "summary" text,
  "entities" text,
  "dates" text,
  "amounts" text,
  "key_terms" text,
  "risk_flags" text,
  "confidence" numeric(4, 2),
  "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_password_unique";

ALTER TABLE "files" ADD COLUMN IF NOT EXISTS "public_id" varchar(255) NOT NULL DEFAULT '';
ALTER TABLE "files" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
`;

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(sql);
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
