import { db } from "@/db/drizzle";
import { BooksTable } from "@/db/schema";
import { Book } from "@/db/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Isbn from "@library-pals/isbn";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  const id = kindeUser?.id;

  if (!id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const books = await db
      .select({ isbn: BooksTable.isbn, id: BooksTable.id })
      .from(BooksTable)
      .where(eq(BooksTable.kindeId, id));

    if (books.length === 0) {
      return NextResponse.json({ books: [] }, { status: 200 });
    }

    const isbn = new Isbn();
    const booksWithDetails = await Promise.all(
      books.map(async (book) => {
        try {
          const data = await isbn.resolve(book.isbn);
          return data
            ? {
                id: book.id,
                title: data.title,
                thumbnail: data.thumbnail || "",
                isbn: book.isbn,
                genre: data.categories || [],
              }
            : null;
        } catch {
          return null;
        }
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
