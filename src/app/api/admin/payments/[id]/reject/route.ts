import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function logAudit(action: string, userId: string, details: string) {
  console.log(`[AUDIT ${new Date().toISOString()}] ${action} | Admin: ${userId} | ${details}`);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Server-side admin check
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      await logAudit("ADMIN_REJECT_DENIED", session.user.id, "Non-admin attempted reject");
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;

    const payment = await db.payment.findUnique({ where: { id } });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const updatedPayment = await db.payment.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    // Audit log
    await logAudit(
      "PAYMENT_REJECTED", 
      session.user.id, 
      `Payment ${id} rejected - User: ${payment.userId}, Amount: ${payment.amount}`
    );

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error("Reject payment error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}