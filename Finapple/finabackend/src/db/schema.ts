
import { serial } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
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




export const files = pgTable('files', {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    height: varchar('height', { length: 50 }).notNull(),
    width: varchar('width', { length: 50 }).notNull(),
     publicId: varchar('public_id', { length: 255 }).notNull(),


    resource_type: varchar('resource_type', { length: 50 }).notNull(),

    url: varchar('url', { length: 500 }).notNull(),

    page: integer('page').notNull(),
});







