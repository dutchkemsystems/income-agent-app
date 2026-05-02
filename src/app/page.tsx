"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  TrendingUp,
  Shield,
  BarChart3,
  Bot,
  Globe,
  ArrowRight,
  CheckCircle2,
  Star,
  Play,
  Wallet,
  Target,
  Clock,
  Users,
  DollarSign,
  Sparkles,
  Lock,
  Verified,
  HeadphonesIcon,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Automation",
    description: "Intelligent agents that work 24/7 to generate income without supervision.",
  },
  {
    icon: TrendingUp,
    title: "Real Earnings Tracking",
    description: "Watch your money grow with detailed analytics and performance metrics.",
  },
  {
    icon: Shield,
    title: "Secure & Verified",
    description: "Transparent payment system with verified transactions and instant activation.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Data-driven insights to optimize your agent's performance and maximize returns.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    avatar: "S",
    quote: "My agent generated ₦320,000 in just 3 weeks! The passive income is incredible.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Small Business Owner",
    avatar: "M",
    quote: "The lead generation agent brought me 50+ qualified leads worth ₦500K+ in potential deals.",
    rating: 5,
  },
  {
    name: "Grace Williams",
    role: "Freelancer",
    avatar: "G",
    quote: "I set up the social media bot and now earn ₦50,000 monthly while I sleep. Best investment!",
    rating: 5,
  },
  {
    name: "David Okonkwo",
    role: "Tech Entrepreneur",
    avatar: "D",
    quote: "The YouTube content generator helped me grow my channel to 10K subscribers in 2 months!",
    rating: 5,
  },
];

const stats = [
  { value: "₦24.8M+", label: "Total Earnings" },
  { value: "2,847", label: "Active Agents" },
  { value: "98.2%", label: "Success Rate" },
  { value: "150+", label: "Countries" },
];

const trustBadges = [
  { icon: Shield, label: "Secure Payments" },
  { icon: Verified, label: "Verified Platform" },
  { icon: HeadphonesIcon, label: "24/7 Support" },
  { icon: Lock, label: "Bank-Level Security" },
];

const howItWorks = [
  {
    step: "01",
    title: "Choose Your Agent",
    description: "Browse our income-generating products and select the ones that match your goals.",
  },
  {
    step: "02",
    title: "Make Payment",
    description: "Pay securely via OPay and receive instant activation of your chosen agent.",
  },
  {
    step: "03",
    title: "Watch It Earn",
    description: "Your AI agent starts working immediately. Monitor earnings in real-time.",
  },
];

const earningsExamples = [
  { product: "AI Content Writer", initial: "₦5,000", weekly: "₦15,000", monthly: "₦60,000" },
  { product: "Lead Generator", initial: "₦7,500", weekly: "₦25,000", monthly: "₦100,000" },
  { product: "Social Media Bot", initial: "₦4,000", weekly: "₦10,000", monthly: "₦40,000" },
  { product: "YouTube Generator", initial: "₦8,000", weekly: "₦30,000", monthly: "₦120,000" },
];

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">IncomeAgent</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">
                Success Stories
              </a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Floating elements */}
        <motion.div style={{ y: y1 }} className="absolute top-40 left-10 w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20" />
        <motion.div style={{ y: y2 }} className="absolute top-60 right-20 w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-6 px-4 py-1.5">
                <Zap className="w-3 h-3 mr-1" />
                Automated Income Generation
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              Let Our AI Agent Earn Money{" "}
              <span className="gradient-text">For You While You Relax</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              Deploy autonomous AI agents that generate consistent income through content creation, 
              lead generation, social automation, and more. Your personal money-making machine runs 24/7.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 px-8 h-12 text-lg"
                >
                  Start Earning Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white px-8 h-12 text-lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  See How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap justify-center gap-6 mt-8"
            >
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-gray-500 text-sm">
                  <badge.icon className="w-4 h-4 text-emerald-400" />
                  {badge.label}
                </div>
              ))}
            </motion.div>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-xl p-4 animate-fade-in"
                  style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 relative"
          >
            <div className="glass-card rounded-2xl p-1 max-w-5xl mx-auto">
              <div className="bg-[#0f0f17] rounded-xl p-6 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Active Agent</div>
                      <div className="font-semibold">Content Creation AI</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                    Running
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-[#1a1a25] rounded-lg p-4">
                    <div className="text-2xl font-bold text-emerald-400">₦45,230</div>
                    <div className="text-xs text-gray-500">Today's Earnings</div>
                  </div>
                  <div className="bg-[#1a1a25] rounded-lg p-4">
                    <div className="text-2xl font-bold">127</div>
                    <div className="text-xs text-gray-500">Tasks Completed</div>
                  </div>
                  <div className="bg-[#1a1a25] rounded-lg p-4">
                    <div className="text-2xl font-bold text-cyan-400">98.5%</div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>
                <div className="h-2 bg-[#1a1a25] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-3/4 rounded-full" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Earnings Examples */}
      <section className="py-16 bg-gradient-to-b from-transparent to-emerald-5/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 mb-4">
              <DollarSign className="w-3 h-3 mr-1" />
              Real Earnings Potential
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Start with ₦3,500 - ₦8,000
              <span className="gradient-text"> Earn ₦10,000 - ₦120,000/month</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {earningsExamples.map((example, i) => (
              <motion.div
                key={example.product}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card border-white/5 p-4 h-full">
                  <h3 className="font-semibold mb-3">{example.product}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Activation</span>
                      <span className="text-emerald-400 font-bold">{example.initial}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weekly</span>
                      <span className="text-cyan-400 font-bold">{example.weekly}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly</span>
                      <span className="text-white font-bold">{example.monthly}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 mb-4">
                Powerful Features
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything You Need to{" "}
                <span className="gradient-text">Generate Income</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our platform provides all the tools and automation you need to build a sustainable passive income stream.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card border-white/5 p-6 h-full hover:border-emerald-500/30 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-5/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Start Earning in{" "}
              <span className="gradient-text">3 Easy Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <Card className="glass-card rounded-2xl p-8 border-white/5 h-full">
                  <div className="text-6xl font-bold text-white/5 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </Card>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-4">
              Success Stories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Our{" "}
              <span className="gradient-text">Users Say</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card border-white/5 p-6 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-10/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Start Your{" "}
              <span className="gradient-text">Passive Income Journey?</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of users already earning with AI agents. 
              Your first income-generating agent is just a few clicks away.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 px-10 h-14 text-lg"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Start Earning Today
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • Start with ₦3,500 • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">IncomeAgent</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 IncomeAgent. All rights reserved. Secure payments via OPay.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}