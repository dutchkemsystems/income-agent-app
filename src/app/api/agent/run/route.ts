import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runAgentTaskForUser } from "@/lib/agent";
import { db } from "@/lib/db";
import { z } from "zod";

// Strict validation for agent run
const agentRunSchema = z.object({
  productId: z.string()
    .min(1, "Product ID is required")
    .max(100, "Product ID too long")
    .regex(/^[a-zA-Z0-9-_]+$/, "Invalid product ID format"),
});

// Allowed product IDs (whitelist)
const ALLOWED_PRODUCTS = [
  "content-writer",
  "lead-generator", 
  "social-scheduler",
  "image-generator",
  "proposal-writer",
  "youtube-generator",
];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = agentRunSchema.parse(body);

    // Whitelist validation - only allow known products
    if (!ALLOWED_PRODUCTS.includes(productId)) {
      console.log(`[SECURITY] Invalid product attempt: ${productId} by user ${session.user.id}`);
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    // Check if user has this product active
    const userProduct = await db.userProduct.findFirst({
      where: {
        userId: session.user.id,
        productId,
        isActive: true,
      },
    });

    if (!userProduct) {
      return NextResponse.json({ error: "Product not activated or not paid for" }, { status: 400 });
    }

    // Run the agent task (sandboxed in lib/agent.ts)
    const result = await runAgentTaskForUser(session.user.id, productId);

    // Log agent execution for auditing
    console.log(`[AUDIT] Agent executed: product=${productId}, user=${session.user.id}, success=${result.success}`);

    if (result.success) {
      return NextResponse.json({ success: true, revenue: result.revenue });
    } else {
      return NextResponse.json({ error: result.error || "Task failed" }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("[SECURITY] Agent run error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100); // Cap at 100

    // Only allow users to see their own logs
    const logs = await db.agentLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const runningLogs = await db.agentLog.findMany({
      where: { userId: session.user.id, status: "RUNNING" },
      take: 1,
    });

    return NextResponse.json({ 
      status: { isRunning: runningLogs.length > 0 },
      logs 
    });
  } catch (error) {
    console.error("Agent status error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}