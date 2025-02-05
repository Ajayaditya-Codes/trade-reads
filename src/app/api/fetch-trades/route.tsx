import { db } from "@/db/drizzle";
import { Books } from "@/db/schema";
import { Book } from "@/db/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Isbn from "@library-pals/isbn";
import { eq, and, sql, inArray } from "drizzle-orm";
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
        exchangeId: Books.exchangeId,
      })
      .from(Books)
      .where(
        and(
          eq(Books.exchanged, state === "true"),
          eq(Books.kindeId, id),
          sql`array_length(${Books.exchangeId}, 1) > 0`
        )
      );

    if (trades.length === 0) {
      return NextResponse.json({ trades: [] }, { status: 200 });
    }

    const isbnResolver = new Isbn();

    const resolvedTrades = await Promise.all(
      trades.map(async (trade) => {
        try {
          const userBookData = await isbnResolver.resolve(trade.isbn);
          if (!userBookData) return null;

          const userBook: Book = {
            id: trade.id,
            title: userBookData.title || "Unknown Title",
            thumbnail: userBookData.thumbnail || "",
            isbn: trade.isbn,
            genre: userBookData.categories || [],
          };

          if (!Array.isArray(trade.exchangeId)) return null;

          const exchangeBooksData = await db
            .select({
              id: Books.id,
              isbn: Books.isbn,
            })
            .from(Books)
            .where(inArray(Books.id, trade.exchangeId));

          const exchangeBooks = await Promise.all(
            exchangeBooksData.map(async (exchangeBook) => {
              try {
                const exchangeBookData = await isbnResolver.resolve(
                  exchangeBook.isbn
                );
                return exchangeBookData
                  ? {
                      id: exchangeBook.id, // Correct ID
                      title: exchangeBookData.title || "Unknown Title",
                      thumbnail: exchangeBookData.thumbnail || "",
                      isbn: exchangeBook.isbn,
                      genre: exchangeBookData.categories || [],
                    }
                  : null;
              } catch (error) {
                console.error(
                  `Failed to fetch details for ISBN: ${exchangeBook.isbn}`,
                  error
                );
                return null;
              }
            })
          );

          return {
            userBook,
            exchangeBooks: exchangeBooks.filter((book) => book !== null),
          };
        } catch (error) {
          console.error(
            `Error resolving book details for ISBN: ${trade.isbn}`,
            error
          );
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
