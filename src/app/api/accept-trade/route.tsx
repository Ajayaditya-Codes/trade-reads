import { db } from "@/db/drizzle";
import { Books } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, eq } from "drizzle-orm";
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

    const { userBookID, exchangeBookID } = await req.json();
    if (!userBookID || !exchangeBookID) {
      return NextResponse.json(
        { error: "Valid book IDs are required" },
        { status: 400 }
      );
    }

    await db
      .update(Books)
      .set({ exchanged: true, exchangeId: [exchangeBookID] })
      .where(and(eq(Books.id, userBookID), eq(Books.kindeId, id)))
      .execute();

    await db
      .update(Books)
      .set({ exchanged: true, exchangeId: [userBookID] })
      .where(eq(Books.id, exchangeBookID))
      .execute();

    return NextResponse.json(
      { success: "Trade request accepted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting trade:", error);
    return NextResponse.json(
      { error: "Failed to accept trade request" },
      { status: 500 }
    );
  }
};
