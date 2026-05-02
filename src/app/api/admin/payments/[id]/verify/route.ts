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
      await logAudit("ADMIN_VERIFY_DENIED", session.user.id, "Non-admin attempted verify");
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;

    // Get payment to verify
    const payment = await db.payment.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status !== "PENDING") {
      return NextResponse.json({ error: "Payment is not pending" }, { status: 400 });
    }

    // Update payment status
    const updatedPayment = await db.payment.update({
      where: { id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
    });

    // Activate the product for the user
    await db.userProduct.upsert({
      where: {
        userId_productId: {
          userId: payment.userId,
          productId: payment.productId,
        },
      },
      create: {
        userId: payment.userId,
        productId: payment.productId,
        isActive: true,
      },
      update: {
        isActive: true,
      },
    });

    // Audit log
    await logAudit(
      "PAYMENT_VERIFIED", 
      session.user.id, 
      `Payment ${id} verified - User: ${payment.userId}, Product: ${payment.productId}, Amount: ${payment.amount}`
    );

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}