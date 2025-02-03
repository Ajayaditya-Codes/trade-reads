import { db } from "@/db/drizzle";
import { BooksTable } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  const id = kindeUser?.id;

  if (!id) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const { bookID } = await req.json();

  if (!bookID) {
    return NextResponse.json(
      { error: "Book ID not provided" },
      { status: 400 }
    );
  }

  try {
    await db
      .delete(BooksTable)
      .where(and(eq(BooksTable.id, bookID), eq(BooksTable.state, "open")))
      .execute();
    return NextResponse.json({ message: "Book deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
};
