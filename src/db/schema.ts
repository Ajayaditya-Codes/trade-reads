import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, unique } from "drizzle-orm/pg-core";

export const Books = pgTable(
  "Books",
  {
    id: integer("ID").primaryKey().generatedAlwaysAsIdentity(),
    kindeId: text("KindeID").notNull(),
    isbn: text("ISBN").notNull(),
    exchangeId: integer("ExchangeID")
      .array()
      .notNull()
      .default(sql`ARRAY[]::integer[]`),
    exchanged: boolean("Exchanged").notNull().default(false),
  },
  (table) => ({
    uniqueKindeIsbn: unique("unique_kinde_isbn").on(table.kindeId, table.isbn),
  })
);
