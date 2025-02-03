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
  const bookIdNumber = Number(bookID);

  if (!bookIdNumber || isNaN(bookIdNumber)) {
    return NextResponse.json({ error: "Invalid Book ID" }, { status: 400 });
  }

  try {
    const deleted = await db
      .delete(BooksTable)
      .where(
        and(
          eq(BooksTable.id, bookIdNumber),
          eq(BooksTable.kindeId, id),
          eq(BooksTable.state, "open")
        )
      )
      .execute();

    if (deleted.rowCount === 0) {
      return NextResponse.json(
        { error: "Book not found or not deletable" },
        { status: 404 }
      );
    }

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
