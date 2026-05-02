import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatNaira } from "@/lib/utils";
import {
  TrendingUp,
  Bot,
  CheckCircle2,
  XCircle,
  Wallet,
  ArrowRight,
  Activity,
  Zap,
  Clock,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  // Get user data and stats
  const [user, userProducts, payments, earnings, logs] = await Promise.all([
    db.user.findUnique({ where: { id: session.user.id } }),
    db.userProduct.findMany({
      where: { userId: session.user.id, isActive: true },
      include: { product: true },
    }),
    db.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.earning.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.agentLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Calculate stats
  const totalEarnings = earnings.reduce((acc, e) => acc + e.amount.toNumber(), 0);
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const monthlyEarnings = earnings
    .filter((e) => new Date(e.createdAt) >= thisMonth)
    .reduce((acc, e) => acc + e.amount.toNumber(), 0);

  const pendingPayment = payments.find((p) => p.status === "PENDING");
  const taskStats = await db.agentLog.groupBy({
    by: ["status"],
    where: { userId: session.user.id },
    _count: true,
  });

  const totalTasks = taskStats.reduce((acc, t) => acc + t._count, 0);
  const completedTasks = taskStats.find((t) => t.status === "SUCCESS")?._count || 0;
  const failedTasks = taskStats.find((t) => t.status === "FAILED")?._count || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {session.user.name}</h1>
          <p className="text-gray-400">Here's what's happening with your agents</p>
        </div>
        <Link href="/dashboard/products">
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 border-0">
            <Zap className="w-4 h-4 mr-2" />
            Browse Products
          </Button>
        </Link>
      </div>

      {/* Balance Card */}
      <Card className="glass-card border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
              <p className="text-4xl font-bold text-gradient">{formatNaira(user?.balance?.toNumber() || 0)}</p>
              <p className="text-sm text-gray-400 mt-2">
                +{formatNaira(monthlyEarnings)} this month
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Agents</CardTitle>
            <Bot className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{userProducts.length}</div>
            <p className="text-xs text-gray-500">Running tasks</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Tasks Completed</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedTasks}</div>
            <p className="text-xs text-gray-500">
              {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">This Month</CardTitle>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNaira(monthlyEarnings)}</div>
            <p className="text-xs text-gray-500">From {completedTasks} tasks</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending Payment</CardTitle>
            <Clock className="w-4 h-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {pendingPayment ? "1" : "0"}
            </div>
            <p className="text-xs text-gray-500">
              {pendingPayment ? "Awaiting verification" : "No pending"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payment Alert */}
      {pendingPayment && (
        <Card className="glass-card border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium">Payment Pending Verification</p>
                  <p className="text-sm text-gray-400">
                    Your payment of {formatNaira(pendingPayment.amount.toNumber())} is being verified
                  </p>
                </div>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-0">
                Pending
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/dashboard/products">
          <Card className="glass-card border-white/5 p-6 hover:border-emerald-500/30 transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Activate New Agent</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Browse and activate income-generating agents
                </p>
                <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  Browse Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/monitor">
          <Card className="glass-card border-white/5 p-6 hover:border-cyan-500/30 transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Monitor Performance</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Track your agent activities and earnings
                </p>
                <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                  View Analytics
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Active Products */}
      {userProducts.length > 0 && (
        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle>My Active Agents</CardTitle>
            <CardDescription>Your currently running income-generating agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProducts.map((up) => (
                <div
                  key={up.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-emerald-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">{up.product.name}</p>
                      <p className="text-xs text-gray-500">{up.product.category}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="glass-card border-white/5">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest agent tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    {log.status === "SUCCESS" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : log.status === "FAILED" ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Activity className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {log.taskType.replace("-", " ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={log.status === "SUCCESS" ? "success" : log.status === "FAILED" ? "destructive" : "secondary"}>
                      {log.status.toLowerCase()}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {log.status === "SUCCESS" && (
                        <span className="text-green-400">+{formatNaira(log.revenue.toNumber())}</span>
                      )}
                      {log.status === "FAILED" && (
                        <span className="text-red-400">-{formatNaira(log.cost.toNumber())}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No agent activity yet</p>
              <Link href="/dashboard/products">
                <Button variant="link" className="text-emerald-400">Activate your first agent</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}