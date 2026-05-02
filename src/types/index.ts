import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export type TaskType = "content_creation" | "seo_optimization" | "affiliate_link" | "social_posting";

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  earningPotential: number;
  category: string;
}

export interface AgentTask {
  id: string;
  type: TaskType;
  params: Record<string, unknown>;
  status: "pending" | "running" | "completed" | "failed";
  result?: unknown;
  cost: number;
  revenue: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface DashboardStats {
  totalEarnings: number;
  monthlyEarnings: number;
  weeklyEarnings: number;
  dailyEarnings: number;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  successRate: number;
}

export interface EarningsChartData {
  date: string;
  amount: number;
}

export interface AgentLogEntry {
  id: string;
  taskType: string;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  cost: number;
  revenue: number;
  status: string;
  createdAt: Date;
}