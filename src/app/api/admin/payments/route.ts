import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Simple audit log function
async function logAudit(action: string, userId: string, details: string) {
  console.log(`[AUDIT ${new Date().toISOString()}] ${action} | User: ${userId} | ${details}`);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (server-side)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      // Log unauthorized access attempt
      await logAudit("ADMIN_ACCESS_DENIED", session.user.id, "Attempted to access admin payments");
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const payments = await db.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        product: {
          select: { name: true, category: true },
        },
      },
    });

    await logAudit("ADMIN_VIEW_PAYMENTS", session.user.id, `Viewed ${payments.length} payments`);

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Get payments error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}