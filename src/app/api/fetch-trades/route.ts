import { db } from "@/db/drizzle";
import { BooksTable } from "@/db/schema";
import { Book } from "@/db/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Isbn from "@library-pals/isbn";
import { eq, and, isNotNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  const id = kindeUser?.id;

  if (!id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state")?.trim();

  if (!state) {
    return NextResponse.json({ error: "State is required" }, { status: 400 });
  }

  try {
    const trades = await db
      .select({
        isbn: BooksTable.isbn,
        id: BooksTable.id,
        exchange: BooksTable.exchangeId,
      })
      .from(BooksTable)
      .where(
        and(
          eq(BooksTable.state, state),
          eq(BooksTable.kindeId, id),
          isNotNull(BooksTable.exchangeId)
        )
      );

    const isbn = new Isbn();
    const tradesWithDetails = await Promise.all(
      trades.map(async (trade) => {
        const data = await isbn.resolve(trade.isbn);
        const exchangeData = await isbn.resolve(trade.exchange as string);

        if (data && exchangeData) {
          return [
            {
              id: trade.id,
              title: data.title,
              thumbnail: data.thumbnail || "",
              isbn: trade.isbn,
              genre: data.categories,
            },
            {
              id: trade.id,
              title: exchangeData.title,
              thumbnail: exchangeData.thumbnail || "",
              isbn: exchangeData.isbn,
              genre: exchangeData.categories,
            },
          ];
        }

        return null;
      })
    );

    const validTrades = tradesWithDetails.filter(
      (trade): trade is Book[] => trade !== null
    );

    return NextResponse.json({ trades: validTrades }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json(
      { error: "Failed to retrieve trades" },
      { status: 500 }
    );
  }
}
