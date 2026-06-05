-- Add category column to transactions
ALTER TABLE "transactions" ADD COLUMN IF NOT EXISTS "category" varchar(100) DEFAULT 'other';

-- Create budgets table
CREATE TABLE IF NOT EXISTS "budgets" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "category" varchar(100) NOT NULL,
  "limit_amount" numeric(14, 2) NOT NULL,
  "month" varchar(7) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Create savings_goals table
CREATE TABLE IF NOT EXISTS "savings_goals" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "name" varchar(255) NOT NULL,
  "target_amount" numeric(14, 2) NOT NULL,
  "saved_amount" numeric(14, 2) NOT NULL DEFAULT '0',
  "deadline" varchar(10),
  "is_completed" boolean NOT NULL DEFAULT false,
  "created_at" timestamp DEFAULT now() NOT NULL
);
