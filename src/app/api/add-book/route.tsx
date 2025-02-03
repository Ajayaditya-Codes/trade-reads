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

  const { ISBN } = await req.json();
  if (!ISBN) {
    return NextResponse.json({ error: "ISBN is required" }, { status: 400 });
  }

  try {
    const isbn = new Isbn();
    const book = await isbn.resolve(ISBN);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 400 });
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
    return NextResponse.json(
      { error: "Book not found or failed to be created" },
      { status: 400 }
    );
  }
};
