import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

// Simulated earnings for each product type
const PRODUCT_EARNINGS = {
  "content-writer": { min: 200, max: 500, cost: 50 },
  "lead-generator": { min: 500, max: 1200, cost: 100 },
  "social-scheduler": { min: 150, max: 400, cost: 30 },
  "image-generator": { min: 300, max: 800, cost: 80 },
  "proposal-writer": { min: 100, max: 300, cost: 20 },
  "youtube-generator": { min: 400, max: 1000, cost: 90 },
};

interface AgentTask {
  id: string;
  productId: string;
  userId: string;
  taskType: string;
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";
  revenue: number;
  cost: number;
  createdAt: Date;
}

// Mock API calls for each product type
const mockContentWriter = async (): Promise<Record<string, unknown>> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const articles = [
    "10 Ways to Boost Your Productivity in 2024",
    "The Ultimate Guide to Remote Work Success",
    "How to Start a Profitable Online Business",
    "AI Tools That Will Change Your Life",
    "Building Wealth: A Step-by-Step Guide",
  ];
  const titles = [
    "5 Habits of Highly Successful Entrepreneurs",
    "Mastering Digital Marketing in 2024",
    "The Future of Work: Trends to Watch",
  ];
  return {
    articlesCreated: Math.floor(Math.random() * 3) + 1,
    wordsGenerated: Math.floor(Math.random() * 5000) + 2000,
    platforms: ["Medium", "Dev.to", "Personal Blog"],
    sampleTitle: articles[Math.floor(Math.random() * articles.length)],
    seoScore: Math.floor(Math.random() * 20) + 80,
  };
};

const mockLeadGenerator = async (): Promise<Record<string, unknown>> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const leads = Math.floor(Math.random() * 50) + 20;
  return {
    leadsGenerated: leads,
    verifiedEmails: Math.floor(leads * 0.7),
    phoneNumbers: Math.floor(leads * 0.5),
    sources: ["LinkedIn", "Company Websites", "Directories"],
    industries: ["Tech", "Finance", "Healthcare", "Retail"],
  };
};

const mockSocialScheduler = async (): Promise<Record<string, unknown>> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    postsScheduled: Math.floor(Math.random() * 20) + 10,
    platforms: ["Twitter", "LinkedIn", "Instagram"],
    engagementRate: (Math.random() * 5 + 2).toFixed(2),
    newFollowers: Math.floor(Math.random() * 100) + 20,
  };
};

const mockImageGenerator = async (): Promise<Record<string, unknown>> => {
  await new Promise((resolve) => setTimeout(resolve, 2500));
  return {
    imagesCreated: Math.floor(Math.random() * 10) + 5,
    types: ["Logos", "Social Media", "Presentations", "Banners"],
    resolution: "4K",
    formats: ["PNG", "SVG", "PDF"],
  };
};

const mockProposalWriter = async (): Promise<Record<string, unknown>> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    proposalsWritten: Math.floor(Math.random() * 5) + 2,
    estimatedValue: Math.floor(Math.random() * 100000) + 20000,
    platforms: ["Upwork", "Fiverr", "Direct"],
    winRate: (Math.random() * 30 + 40).toFixed(1),
  };
};

const mockYouTubeGenerator = async (): Promise<Record<string, unknown>> => {
  await new Promise((resolve) => setTimeout(resolve, 2800));
  return {
    scriptsWritten: Math.floor(Math.random() * 8) + 3,
    thumbnailsCreated: Math.floor(Math.random() * 8) + 3,
    videoIdeas: ["Tech Review", "Tutorial", "Vlog", "Comparison"],
    seoScore: Math.floor(Math.random() * 15) + 85,
  };
};

const runProductTask = async (productId: string): Promise<Record<string, unknown>> => {
  switch (productId) {
    case "content-writer":
      return mockContentWriter();
    case "lead-generator":
      return mockLeadGenerator();
    case "social-scheduler":
      return mockSocialScheduler();
    case "image-generator":
      return mockImageGenerator();
    case "proposal-writer":
      return mockProposalWriter();
    case "youtube-generator":
      return mockYouTubeGenerator();
    default:
      return { message: "Unknown product" };
  }
};

export async function runAgentTaskForUser(userId: string, productId: string) {
  const productConfig = PRODUCT_EARNINGS[productId as keyof typeof PRODUCT_EARNINGS];
  
  if (!productConfig) {
    throw new Error(`Unknown product: ${productId}`);
  }

  // Create agent log entry
  const agentLog = await db.agentLog.create({
    data: {
      userId,
      productId,
      taskType: productId,
      input: { productId, startedAt: new Date().toISOString() },
      status: "RUNNING",
      cost: productConfig.cost,
      revenue: 0,
    },
  });

  try {
    // Execute the task
    const result = await runProductTask(productId);

    // Calculate revenue (random between min and max)
    const revenue = Math.random() * (productConfig.max - productConfig.min) + productConfig.min;

    // Update log with results
    await db.agentLog.update({
      where: { id: agentLog.id },
      data: {
        status: "SUCCESS",
        output: result as Prisma.JsonObject,
        revenue: revenue,
      },
    });

    // Create earning record
    await db.earning.create({
      data: {
        userId,
        amount: revenue,
        source: productId,
        description: `Agent task: ${productId} completed`,
      },
    });

    // Update user balance
    const user = await db.user.findUnique({ where: { id: userId } });
    if (user) {
      const currentBalance = user.balance?.toNumber() || 0;
      await db.user.update({
        where: { id: userId },
        data: { balance: currentBalance + revenue },
      });
    }

    return { success: true, revenue, logId: agentLog.id };
  } catch (error) {
    // Mark as failed
    await db.agentLog.update({
      where: { id: agentLog.id },
      data: {
        status: "FAILED",
        output: { error: error instanceof Error ? error.message : "Unknown error" } as Prisma.JsonObject,
      },
    });

    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Get user's active products and their stats
export async function getUserAgentStats(userId: string) {
  const userProducts = await db.userProduct.findMany({
    where: { userId, isActive: true },
    include: { product: true },
  });

  const stats = await Promise.all(
    userProducts.map(async (up) => {
      const logs = await db.agentLog.findMany({
        where: { userId, productId: up.productId },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      const totalRevenue = logs
        .filter((l) => l.status === "SUCCESS")
        .reduce((acc, l) => acc + l.revenue.toNumber(), 0);

      const totalCost = logs.reduce((acc, l) => acc + l.cost.toNumber(), 0);
      const totalTasks = logs.length;
      const completedTasks = logs.filter((l) => l.status === "SUCCESS").length;

      return {
        product: up.product,
        totalRevenue,
        totalCost,
        totalTasks,
        completedTasks,
        successRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        recentLogs: logs,
      };
    })
  );

  return stats;
}

// Start background task processor (for demo purposes)
export async function startAgentProcessor(userId: string, productId: string, intervalMs: number = 60000) {
  console.log(`Starting agent processor for user ${userId}, product ${productId}, interval ${intervalMs}ms`);
  
  // This would normally be handled by a proper job queue
  // For demo, we'll just return the interval ID
  return setInterval(async () => {
    try {
      await runAgentTaskForUser(userId, productId);
      console.log(`Agent task executed for user ${userId}, product ${productId}`);
    } catch (error) {
      console.error("Agent task failed:", error);
    }
  }, intervalMs);
}

export async function stopAgentProcessor(intervalId: NodeJS.Timeout) {
  clearInterval(intervalId);
}