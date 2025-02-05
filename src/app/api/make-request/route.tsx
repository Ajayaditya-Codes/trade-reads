import { db } from "@/db/drizzle";
import { Books } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();
    const userId = kindeUser?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { userBookID, exchangeBookID } = await req.json();

    if (!userBookID || !exchangeBookID) {
      return NextResponse.json(
        { error: "Both ISBNs are required" },
        { status: 400 }
      );
    }

    await db
      .update(Books)
      .set({
        exchangeId: sql`array_append(${Books.exchangeId}, ${exchangeBookID})`,
      })
      .where(eq(Books.id, userBookID))
      .execute();

    return NextResponse.json(
      { success: "Trade request submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error making trade request:", error);
    return NextResponse.json(
      { error: "Failed to process trade request" },
      { status: 500 }
    );
  }
}
