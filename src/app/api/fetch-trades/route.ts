import { db } from "@/db/drizzle";
import { Books } from "@/db/schema";
import { Book } from "@/db/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Isbn from "@library-pals/isbn";
import { eq, and, isNotNull, not } from "drizzle-orm";
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
        isbn: Books.isbn,
        id: Books.id,
        exchangeIsbn: Books.exchangeIsbn,
      })
      .from(Books)
      .where(
        and(
          eq(Books.exchanged, state === "true"),
          eq(Books.kindeId, id),
          not(eq(Books.exchangeIsbn, []))
        )
      );

    const isbn = new Isbn();

    const resolvedTrades = await Promise.all(
      trades.map(async (trade) => {
        try {
          const userBookData = await isbn.resolve(trade.isbn);
          if (!userBookData) return null;

          const userBook: Book = {
            id: trade.id,
            title: userBookData.title,
            thumbnail: userBookData.thumbnail || "",
            isbn: trade.isbn,
            genre: userBookData.categories || [],
          };

          const exchangeBooks = await Promise.all(
            trade.exchangeIsbn.map(async (exchangeIsbn: string) => {
              try {
                const exchangeBookData = await isbn.resolve(exchangeIsbn);
                return exchangeBookData
                  ? {
                      id: trade.id,
                      title: exchangeBookData.title,
                      thumbnail: exchangeBookData.thumbnail || "",
                      isbn: exchangeIsbn,
                      genre: exchangeBookData.categories || [],
                    }
                  : null;
              } catch {
                return null;
              }
            })
          );

          return {
            userBook,
            exchangeBooks: exchangeBooks.filter((book) => book !== null),
          };
        } catch {
          return null;
        }
      })
    );

    const validTrades = resolvedTrades.filter((trade) => trade !== null);

    return NextResponse.json({ trades: validTrades }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json(
      { error: "Failed to retrieve trades" },
      { status: 500 }
    );
  }
}
