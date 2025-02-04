import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, unique } from "drizzle-orm/pg-core";

export const Books = pgTable(
  "Books",
  {
    id: integer("ID").primaryKey().generatedAlwaysAsIdentity(),
    kindeId: text("KindeID").notNull(),
    isbn: text("ISBN").notNull(),
    exchangeIsbn: text("ExchangeISBN").array().notNull().default([]),
    exchanged: boolean("Exchanged").notNull().default(false),
  },
  (table) => ({
    uniqueKindeIsbn: unique("unique_kinde_isbn").on(table.kindeId, table.isbn),
  })
);
