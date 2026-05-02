import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const products = [
  {
    id: "content-writer",
    name: "AI Content Writer & Blogger",
    description: "Our AI writes SEO-optimized blog posts and articles for you. Perfect for building a blog,Medium, or running a content agency. Earn through ads, affiliate links, and sponsored content.",
    shortDesc: "AI writes SEO articles for your blog",
    icon: "PenTool",
    price: 5000,
    earningPotential: 15000,
    category: "Content Creation",
    features: ["SEO-optimized articles", "Auto-posting to Medium", "Keyword research", "Affiliate link insertion"],
  },
  {
    id: "lead-generator",
    name: "Automated Lead Generator",
    description: "The AI scrapes and verifies potential clients from LinkedIn, directories, and business sites. Perfect for freelancers, agencies, and sales teams looking for hot leads.",
    shortDesc: "Find and verify potential clients automatically",
    icon: "Users",
    price: 7500,
    earningPotential: 25000,
    category: "Sales & Marketing",
    features: ["LinkedIn lead scraping", "Email verification", "Contact info extraction", "Lead list export"],
  },
  {
    id: "social-scheduler",
    name: "Social Media Content Scheduler",
    description: "Automatically create and post content across Twitter, LinkedIn, and Instagram. Grow your following, engage with audience, and schedule posts in advance.",
    shortDesc: "Auto-post and grow your social media",
    icon: "Share2",
    price: 4000,
    earningPotential: 10000,
    category: "Social Media",
    features: ["Multi-platform posting", "Auto-engagement", "Content suggestions", "Schedule management"],
  },
  {
    id: "image-generator",
    name: "AI Image/Graphics Generator",
    description: "Create stunning images, logos, social media graphics, and presentations for clients. Perfect for freelancers, agencies, or starting a graphics service business.",
    shortDesc: "Create custom images for clients on demand",
    icon: "Image",
    price: 6000,
    earningPotential: 20000,
    category: "Creative Services",
    features: ["Custom image generation", "Logo creation", "Social media graphics", "Presentation designs"],
  },
  {
    id: "proposal-writer",
    name: "Freelance Proposal Writer",
    description: "AI writes professional proposals, project bids, and project descriptions for freelance gigs. Win more clients on Upwork, Fiverr, and direct contracts.",
    shortDesc: "Win more freelance gigs with AI proposals",
    icon: "FileText",
    price: 3500,
    earningPotential: 8000,
    category: "Freelance Tools",
    features: ["Custom proposals", "Pricing calculator", "Portfolio integration", "Template library"],
  },
  {
    id: "youtube-generator",
    name: "YouTube Script & Thumbnail Generator",
    description: "AI generates engaging video scripts, titles, descriptions, and eye-catching thumbnails. Perfect for YouTubers or starting a YouTube management service.",
    shortDesc: "Create YouTube content in minutes",
    icon: "Video",
    price: 8000,
    earningPotential: 30000,
    category: "Video Content",
    features: ["Script generation", "Thumbnail designs", "SEO optimization", "Title suggestions"],
  },
];

export const OPAY_DETAILS = {
  bank: "OPay",
  accountNumber: "8121161202",
  accountName: "Oladotun Alabi",
};

import { PenTool, Users, Share2, Image, FileText, Video } from "lucide-react";

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PenTool,
  Users,
  Share2,
  Image,
  FileText,
  Video,
};