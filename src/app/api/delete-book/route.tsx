import { db } from "@/db/drizzle";
import { Books } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, arrayContains, eq, sql } from "drizzle-orm";
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

  const { book_id } = await req.json();

  if (!book_id) {
    return NextResponse.json({ error: "Invalid Book ID" }, { status: 400 });
  }

  try {
    await db
      .delete(Books)
      .where(and(eq(Books.id, book_id), eq(Books.kindeId, id)))
      .execute();

    await db
      .update(Books)
      .set({
        exchangeId: sql`array_remove(${Books.exchangeId}, ${book_id})`,
      })
      .where(arrayContains(Books.exchangeId, [book_id]))
      .execute();

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
};
