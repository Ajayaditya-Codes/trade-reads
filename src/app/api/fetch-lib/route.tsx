import { db } from "@/db/drizzle";
import { Books } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Isbn from "@library-pals/isbn";
import { eq, and, not } from "drizzle-orm";
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
      .where(and(not(eq(Books.kindeId, id)), eq(Books.exchanged, false)));

    if (books.length === 0) {
      return NextResponse.json({ books: [] }, { status: 200 });
    }

    const isbnResolver = new Isbn();

    const userBooks = await db
      .select({ isbn: Books.isbn, id: Books.id })
      .from(Books)
      .where(eq(Books.kindeId, id));

    // Fetch genres for user's books
    const userGenresSet = new Set<string>();

    await Promise.all(
      userBooks.map(async (book) => {
        try {
          const data = await isbnResolver.resolve(book.isbn);
          if (data?.categories) {
            data.categories.forEach((genre: string) =>
              userGenresSet.add(genre)
            );
          }
        } catch (error) {
          console.error(`Failed to fetch genres for ISBN: ${book.isbn}`, error);
        }
      })
    );

    const userGenres = Array.from(userGenresSet); // Convert Set to Array

    const booksWithDetails = await Promise.all(
      books.map(async (book) => {
        try {
          const data = await isbnResolver.resolve(book.isbn);
          const bookGenres = data?.categories || [];

          const recommended = bookGenres.some((genre) =>
            userGenres.includes(genre)
          );

          return {
            id: book.id,
            title: data?.title || "Unknown Title",
            thumbnail: data?.thumbnail || "",
            isbn: book.isbn,
            genre: bookGenres,
            recommended,
          };
        } catch (error) {
          console.error(
            `Failed to fetch details for ISBN: ${book.isbn}`,
            error
          );
          return null;
        }
      })
    );

    const validBooks = booksWithDetails.filter(
      (book): book is NonNullable<typeof book> => book !== null
    );

    return NextResponse.json({ books: validBooks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
