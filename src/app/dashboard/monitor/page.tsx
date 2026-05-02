"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNaira } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  TrendingUp,
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  RefreshCw,
  Play,
  Square,
  Zap,
  DollarSign,
} from "lucide-react";

const COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function MonitorPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [agentStats, setAgentStats] = useState<any[]>([]);
  const [runningAgents, setRunningAgents] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/agent/stats");
      const data = await res.json();
      setAgentStats(data.stats || []);
      setRunningAgents(data.runningAgents || []);
    } catch (error) {
      console.error("Failed to fetch agent stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleAgent = async (productId: string) => {
    const isRunning = runningAgents.includes(productId);
    
    try {
      if (isRunning) {
        await fetch("/api/agent/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      } else {
        await fetch("/api/agent/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
      }
      fetchData();
    } catch (error) {
      console.error("Failed to toggle agent:", error);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  // Mock data for demo - in production this comes from the API
  const stats = {
    totalEarnings: agentStats.reduce((acc, s) => acc + s.totalRevenue, 0) || 15650,
    weeklyEarnings: agentStats.reduce((acc, s) => acc + s.totalRevenue, 0) * 0.6 || 9390,
    dailyEarnings: agentStats.reduce((acc, s) => acc + s.totalRevenue, 0) * 0.15 || 2348,
    totalTasks: agentStats.reduce((acc, s) => acc + s.totalTasks, 0) || 127,
    completedTasks: agentStats.reduce((acc, s) => acc + s.completedTasks, 0) || 118,
    failedTasks: agentStats.reduce((acc, s) => acc + (s.totalTasks - s.completedTasks), 0) || 9,
  };

  const weeklyData = [
    { day: "Mon", earnings: 2500 },
    { day: "Tue", earnings: 3200 },
    { day: "Wed", earnings: 1800 },
    { day: "Thu", earnings: 4500 },
    { day: "Fri", earnings: 3800 },
    { day: "Sat", earnings: 5200 },
    { day: "Sun", earnings: 2900 },
  ];

  const taskTypeData = agentStats.map((s, i) => ({
    name: s.product?.name || "Agent",
    value: s.totalTasks || 20,
    color: COLORS[i % COLORS.length],
  })) || [
    { name: "Content Writer", value: 45, color: "#10b981" },
    { name: "Lead Generator", value: 25, color: "#06b6d4" },
    { name: "Social Scheduler", value: 20, color: "#8b5cf6" },
    { name: "Image Generator", value: 10, color: "#f59e0b" },
  ];

  const logs = agentStats.flatMap((s) => s.recentLogs || []).slice(0, 10) || [
    { id: "1", taskType: "content-writer", status: "SUCCESS", revenue: 450, cost: 50, createdAt: new Date(Date.now() - 1000 * 60 * 5) },
    { id: "2", taskType: "lead-generator", status: "SUCCESS", revenue: 800, cost: 100, createdAt: new Date(Date.now() - 1000 * 60 * 30) },
    { id: "3", taskType: "social-scheduler", status: "RUNNING", revenue: 0, cost: 20, createdAt: new Date(Date.now() - 1000 * 60 * 45) },
    { id: "4", taskType: "image-generator", status: "SUCCESS", revenue: 1200, cost: 80, createdAt: new Date(Date.now() - 1000 * 60 * 60) },
    { id: "5", taskType: "proposal-writer", status: "SUCCESS", revenue: 250, cost: 20, createdAt: new Date(Date.now() - 1000 * 60 * 90) },
  ];

  const exportCSV = () => {
    const headers = ["Date", "Task Type", "Status", "Revenue", "Cost"];
    const rows = logs.map((l) => [
      l.createdAt.toISOString(),
      l.taskType,
      l.status,
      l.revenue,
      l.cost,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agent_logs.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Monitor</h1>
          <p className="text-gray-400">Track your agent activities and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={refreshData}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-white/5 bg-gradient-to-r from-emerald-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Earnings</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{formatNaira(stats.totalEarnings)}</div>
            <p className="text-xs text-green-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-gradient-to-r from-cyan-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">This Week</CardTitle>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNaira(stats.weeklyEarnings)}</div>
            <p className="text-xs text-gray-500">From {stats.completedTasks} tasks</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Tasks Completed</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.completedTasks}</div>
            <p className="text-xs text-gray-500">of {stats.totalTasks} total</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Success Rate</CardTitle>
            <Bot className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalTasks > 0 ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-green-400">+2.1% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="earnings" className="space-y-4">
        <TabsList className="bg-[#1a1a25] border border-white/5">
          <TabsTrigger value="earnings" className="data-[state=active]:bg-emerald-500/20">Earnings</TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-emerald-500/20">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings">
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle>Weekly Earnings</CardTitle>
              <CardDescription>Daily breakdown for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a25",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [formatNaira(value), "Earnings"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#10b981"
                    fill="url(#earningsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>By agent type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={taskTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {taskTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a25",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle>Success vs Failed</CardTitle>
                <CardDescription>Task completion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: "Success", value: stats.completedTasks, fill: "#10b981" },
                    { name: "Failed", value: stats.failedTasks, fill: "#ef4444" },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a25",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Activity Log */}
      <Card className="glass-card border-white/5">
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Recent agent tasks and their results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {log.status === "SUCCESS" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : log.status === "FAILED" ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Activity className="w-5 h-5 text-yellow-500 animate-pulse" />
                  )}
                  <div>
                    <p className="font-medium capitalize">{log.taskType.replace("-", " ")}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      log.status === "SUCCESS"
                        ? "success"
                        : log.status === "FAILED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {log.status.toLowerCase()}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {log.revenue > 0 ? (
                      <span className="text-green-400">+{formatNaira(log.revenue)}</span>
                    ) : log.status === "RUNNING" ? (
                      <span className="text-yellow-400">Processing...</span>
                    ) : (
                      <span className="text-red-400">-{formatNaira(log.cost)}</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}