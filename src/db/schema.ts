import { integer, pgTable, text, unique } from "drizzle-orm/pg-core";

export const BooksTable = pgTable(
  "Books",
  {
    id: integer("ID").primaryKey().generatedAlwaysAsIdentity(),
    kindeId: text("KindeID").notNull(),
    isbn: text("ISBN").notNull(),
    exchangeIsbn: text("ExchangeISBN"),
    state: text("State").notNull().default("open"),
  },
  (table) => ({
    uniqueKindeIsbn: unique("unique_kinde_isbn").on(table.kindeId, table.isbn),
  })
);
