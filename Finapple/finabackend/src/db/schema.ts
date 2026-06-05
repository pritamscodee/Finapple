import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
  integer,
  serial,
  text,
  pgEnum,
  boolean,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  balance: numeric('balance', { precision: 14, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  height: varchar('height', { length: 50 }).notNull(),
  width: varchar('width', { length: 50 }).notNull(),
  publicId: varchar('public_id', { length: 255 }).notNull(),
  resource_type: varchar('resource_type', { length: 50 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  page: integer('page').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactionTypeEnum = pgEnum('transaction_type', [
  'deposit',
  'withdrawal',
  'transfer_in',
  'transfer_out',
]);

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: transactionTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
  balanceAfter: numeric('balance_after', { precision: 14, scale: 2 }).notNull(),
  description: varchar('description', { length: 255 }),
  category: varchar('category', { length: 100 }).default('other'),
  recipientId: uuid('recipient_id').references(() => users.id),
  recipientEmail: varchar('recipient_email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const analysisResults = pgTable('analysis_results', {
  id: serial('id').primaryKey(),
  fileId: integer('file_id').notNull().references(() => files.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 100 }),
  summary: text('summary'),
  entities: text('entities'),
  dates: text('dates'),
  amounts: text('amounts'),
  keyTerms: text('key_terms'),
  riskFlags: text('risk_flags'),
  confidence: numeric('confidence', { precision: 4, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Budget goals per category per month
export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: varchar('category', { length: 100 }).notNull(),
  limitAmount: numeric('limit_amount', { precision: 14, scale: 2 }).notNull(),
  month: varchar('month', { length: 7 }).notNull(), // e.g. "2025-05"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Savings goals
export const savingsGoals = pgTable('savings_goals', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  targetAmount: numeric('target_amount', { precision: 14, scale: 2 }).notNull(),
  savedAmount: numeric('saved_amount', { precision: 14, scale: 2 }).notNull().default('0'),
  deadline: varchar('deadline', { length: 10 }), // ISO date string
  isCompleted: boolean('is_completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
