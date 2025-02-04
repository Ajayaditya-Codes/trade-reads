import { db } from "@/db/drizzle";
import { Books } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Isbn from "@library-pals/isbn";
import { and, eq } from "drizzle-orm";
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
      .select({ isbn: Books.isbn, id: Books.id })
      .from(Books)
      .where(and(eq(Books.kindeId, id), eq(Books.exchanged, false)));

    const isbnResolver = new Isbn();

    const booksWithDetails = await Promise.all(
      books.map(async (book) => {
        try {
          const data = await isbnResolver.resolve(book.isbn);

          return {
            id: book.id,
            title: data?.title || "Unknown Title",
            thumbnail: data?.thumbnail || "",
            isbn: book.isbn,
            genre: data?.categories || [],
          };
        } catch (error) {
          console.error(`Error resolving ISBN ${book.isbn}:`, error);
          return null;
        }
      })
    );

    const validBooks = booksWithDetails.filter((book) => book !== null);

    return NextResponse.json({ books: validBooks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to retrieve books" },
      { status: 500 }
    );
  }
}
