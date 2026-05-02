import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserAgentStats } from "@/lib/agent";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getUserAgentStats(session.user.id);

    return NextResponse.json({
      stats,
      runningAgents: stats.filter((s) => s.totalTasks > 0).map((s) => s.product.id),
    });
  } catch (error) {
    console.error("Get agent stats error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}