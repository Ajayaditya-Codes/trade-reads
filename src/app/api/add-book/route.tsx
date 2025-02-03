import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Isbn from "@library-pals/isbn";
import { db } from "@/db/drizzle";
import { BooksTable } from "@/db/schema";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  const id = kindeUser?.id;

  if (!id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { isbn } = await req.json();
  console.log(isbn);
  if (!isbn || typeof isbn !== "string") {
    return NextResponse.json(
      { error: "Valid ISBN is required" },
      { status: 400 }
    );
  }

  try {
    const isbnInstance = new Isbn();
    const book = await isbnInstance.resolve(isbn.trim());

    if (!book?.isbn) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    await db.insert(BooksTable).values({
      isbn: book.isbn,
      kindeId: id,
    });

    return NextResponse.json(
      { success: "Book added successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
};
