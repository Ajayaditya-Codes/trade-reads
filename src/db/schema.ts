import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const BooksTable = pgTable("Books", {
  id: integer("ID").primaryKey().generatedAlwaysAsIdentity(),
  isbn: text("ISBN").notNull(),
  kindeId: text("KindeID").notNull(),
  state: text("State").notNull().default("open"),
  exchangeId: integer("ExchangeID"),
});
