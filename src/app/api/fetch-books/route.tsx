import { db } from "@/db/drizzle";
import { BooksTable } from "@/db/schema";
import { Book } from "@/db/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Isbn from "@library-pals/isbn";
import { eq, and } from "drizzle-orm";
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
    const books = await db
      .select({ isbn: BooksTable.isbn, id: BooksTable.id })
      .from(BooksTable)
      .where(and(eq(BooksTable.state, state), eq(BooksTable.kindeId, id)));

    const isbn = new Isbn();
    const booksWithDetails = await Promise.all(
      books.map(async (book) => {
        const data = await isbn.resolve(book.isbn);

        if (data) {
          return {
            id: book.id,
            title: data.title,
            thumbnail: data.thumbnail || "",
            isbn: book.isbn,
            genre: data.categories,
          };
        }

        return null;
      })
    );

    const validBooks = booksWithDetails.filter(
      (book): book is Book => book !== null
    );

    return NextResponse.json({ books: validBooks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to retrieve books" },
      { status: 500 }
    );
  }
}
