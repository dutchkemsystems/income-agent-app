import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProducts = await db.userProduct.findMany({
      where: { userId: session.user.id, isActive: true },
      select: { productId: true },
    });

    return NextResponse.json({
      activeProducts: userProducts.map((up) => up.productId),
    });
  } catch (error) {
    console.error("Get active products error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}