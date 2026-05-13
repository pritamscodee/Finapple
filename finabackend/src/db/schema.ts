import { boolean } from "drizzle-orm/pg-core";
import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    numeric,
    text,
    date,
    pgEnum,
} from "drizzle-orm/pg-core";

export const transactionType = pgEnum("transaction_type", [
    "INCOME",
    "EXPENSE",
]);

export const budgetPeriod = pgEnum("budget_period", [
    "WEEKLY",
    "MONTHLY",
    "YEARLY",
]);


export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),

    fullName: varchar("full_name", { length: 255 }).notNull(),

    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", { length: 255 }).notNull().unique(),

    /** Wallet balance; journal + P2P transfers update this atomically. */
    balance: numeric("balance", { precision: 14, scale: 2 })
        .notNull()
        .default("0"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});



export const transactions = pgTable("transactions", {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id").references(() => users.id).notNull(),

    categoryId: uuid("category_id").references(() => categories.id),

    type: transactionType("type").notNull(),

    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

    description: text("description"),

    date: date("date").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export const categories = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 100 }).notNull(),

    type: transactionType("type").notNull(),

    icon: varchar("icon", { length: 50 }),

    color: varchar("color", { length: 7 }),

    userId: uuid("user_id").references(() => users.id),

    isDefault: boolean("is_default").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const budgets = pgTable("budgets", {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id").references(() => users.id).notNull(),

    categoryId: uuid("category_id")
        .references(() => categories.id)
        .notNull(),

    amount: numeric("amount", {
        precision: 10,
        scale: 2,
    }).notNull().default('0'),

    period: budgetPeriod("period").notNull(),

    startDate: date("start_date").notNull(),

    endDate: date("end_date").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});


export const transfers = pgTable("transfers", {
    id: uuid("id").defaultRandom().primaryKey(),

    fromUserId: uuid("from_user_id")
        .references(() => users.id)
        .notNull(),

    toUserId: uuid("to_user_id")
        .references(() => users.id)
        .notNull(),

    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),

    description: text("description"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
});