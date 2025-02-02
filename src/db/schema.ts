import { sql } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const BooksTable = pgTable("Books", {
  id: integer("ID").primaryKey().generatedAlwaysAsIdentity(),
  isbn: text("ISBN").notNull(),
  kindeId: text("KindeID").notNull(),
  state: text("State").notNull().default("open"),
  createdAt: text("CreatedAt").notNull().default("now()"),
  exchangeId: integer("ExchangeID"),
  location: text("Location").notNull(),
  genre: text("Genre")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
});
