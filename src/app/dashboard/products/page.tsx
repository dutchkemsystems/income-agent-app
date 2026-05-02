"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products, formatNaira, iconMap } from "@/lib/utils";
import {
  Bot,
  Zap,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Star,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeProducts, setActiveProducts] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/products/active")
        .then((res) => res.json())
        .then((data) => setActiveProducts(data.activeProducts || []))
        .catch(console.error);
    }
  }, [session]);

  const handleActivate = async (productId: string, price: number) => {
    router.push(`/dashboard/payment?product=${productId}&price=${price}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Income-Generating Agents</h1>
          <p className="text-gray-400">Choose the perfect agent to start earning</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0 px-4 py-1.5">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {activeProducts.length} Active
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Agents</p>
              <p className="text-2xl font-bold">{activeProducts.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/5 bg-gradient-to-r from-cyan-500/10 to-transparent">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Est. Weekly Potential</p>
              <p className="text-2xl font-bold">{formatNaira(products.reduce((acc, p) => acc + (activeProducts.includes(p.id) ? p.earningPotential : 0), 0))}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/5 bg-gradient-to-r from-purple-500/10 to-transparent">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Available to Activate</p>
              <p className="text-2xl font-bold">{products.length - activeProducts.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => {
          const isActive = activeProducts.includes(product.id);
          const IconComponent = iconMap[product.icon] || Bot;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`glass-card border-white/5 h-full flex flex-col transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 ${isActive ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isActive ? 'bg-emerald-500' : 'bg-gradient-to-br from-emerald-500/30 to-cyan-500/30'}`}>
                      <IconComponent className={`w-7 h-7 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    </div>
                    {isActive && (
                      <Badge className="bg-emerald-500 text-white border-0">
                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-3 leading-tight">{product.name}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5">
                      {product.features.slice(0, 3).map((feature) => (
                        <span 
                          key={feature} 
                          className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
                        >
                          {feature}
                        </span>
                      ))}
                      {product.features.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                          +{product.features.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-lg bg-white/5">
                        <p className="text-xs text-gray-500 mb-1">Activation</p>
                        <p className="font-bold text-emerald-400">{formatNaira(product.price)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/5">
                        <p className="text-xs text-gray-500 mb-1">Est. Weekly</p>
                        <p className="font-bold text-cyan-400">Up to {formatNaira(product.earningPotential)}</p>
                      </div>
                    </div>

                    {/* ROI Badge */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>ROI: {Math.round((product.earningPotential / product.price) * 100)}% in 7 days</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleActivate(product.id, product.price)}
                    disabled={isActive}
                    className={`w-full mt-4 h-11 ${isActive ? 'bg-gray-700 cursor-default' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 border-0 hover:from-emerald-600 hover:to-cyan-600'}`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Already Active
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Activate Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Box */}
      <Card className="glass-card border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How Activation Works</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">1</span>
                  <p>Click "Activate Now" on your chosen agent</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">2</span>
                  <p>Pay via OPay and upload payment proof</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
                  <p>We verify and activate your agent within 24h</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}