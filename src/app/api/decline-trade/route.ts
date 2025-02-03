import { db } from "@/db/drizzle";
import { BooksTable } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();
    const id = kindeUser?.id;

    if (!id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { isbn1, isbn2 } = await req.json();
    if (!isbn1 || !isbn2) {
      return NextResponse.json(
        { error: "Valid ISBNs are required" },
        { status: 400 }
      );
    }

    const result = await db
      .update(BooksTable)
      .set({ exchangeIsbn: null, state: "open" })
      .where(
        and(
          or(
            eq(BooksTable.exchangeIsbn, isbn1),
            eq(BooksTable.exchangeIsbn, isbn2)
          ),
          eq(BooksTable.state, "requested")
        )
      )
      .execute();

    if (!result.rowCount) {
      return NextResponse.json(
        { error: "No matching trades found or already updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: "Trade request canceled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error canceling trade:", error);
    return NextResponse.json(
      { error: "Failed to cancel trade request" },
      { status: 500 }
    );
  }
};
