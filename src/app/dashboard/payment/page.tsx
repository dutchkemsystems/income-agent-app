"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { products, formatNaira, OPAY_DETAILS } from "@/lib/utils";
import { toast } from "sonner";
import {
  CreditCard,
  Upload,
  CheckCircle2,
  Copy,
  ArrowLeft,
  DollarSign,
  Shield,
  Wallet,
  Image as ImageIcon,
  FileText,
  X,
  Loader2,
  Building2,
  User,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const productId = searchParams.get("product");
  const priceParam = searchParams.get("price");
  const price = priceParam ? parseInt(priceParam) : 0;

  const [transactionRef, setTransactionRef] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = products.find((p) => p.id === productId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be less than 5MB");
        return;
      }
      setProofFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setProofPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setProofFile(null);
    setProofPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionRef.trim()) {
      toast.error("Please enter transaction reference");
      return;
    }

    if (!proofFile) {
      toast.error("Please upload proof of payment");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("productId", productId || "");
      formData.append("amount", price.toString());
      formData.append("transactionRef", transactionRef.trim());
      formData.append("proof", proofFile);

      const res = await fetch("/api/payments/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Payment submitted! We'll verify and activate your agent within 24 hours.");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Failed to submit payment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-gray-400 mb-4">No product selected</p>
        <Button onClick={() => router.push("/dashboard/products")}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/products")}
        className="text-gray-400 hover:text-white -ml-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Complete Payment</h1>
        <p className="text-gray-400">Activate your {product.name} agent</p>
      </div>

      {/* Product Summary */}
      <Card className="glass-card border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Wallet className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-400">{product.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-400">{formatNaira(price)}</p>
              <p className="text-xs text-gray-500">One-time activation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card className="glass-card border-white/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            Transfer Payment
          </CardTitle>
          <CardDescription className="text-gray-400">
            Transfer exactly <span className="text-emerald-400 font-semibold">{formatNaira(price)}</span> to the account below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Account Details Card */}
          <div className="rounded-xl bg-gradient-to-br from-[#1a1a25] to-[#0f0f17] border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium text-gray-300">Payment Details</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">Bank</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg text-white">{OPAY_DETAILS.bank}</span>
                  <button
                    onClick={() => copyToClipboard(OPAY_DETAILS.bank)}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">Account Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{OPAY_DETAILS.accountName}</span>
                  <button
                    onClick={() => copyToClipboard(OPAY_DETAILS.accountName)}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 text-sm">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-2xl text-emerald-400 tracking-wider font-mono">
                    {OPAY_DETAILS.accountNumber}
                  </span>
                  <button
                    onClick={() => copyToClipboard(OPAY_DETAILS.accountNumber)}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Amount to pay */}
            <div className="mt-5 pt-4 border-t border-emerald-500/20">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">Amount to Pay</span>
                <span className="text-3xl font-bold text-gradient">{formatNaira(price)}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-400 space-y-2 bg-white/5 rounded-lg p-4">
            <p className="font-medium text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              How to pay:
            </p>
            <ul className="list-decimal list-inside space-y-1 ml-6">
              <li>Open your OPay app or any banking app</li>
              <li>Transfer exactly <span className="text-emerald-400 font-semibold">{formatNaira(price)}</span> to the account above</li>
              <li>Screenshot your payment receipt</li>
              <li>Upload the screenshot and enter your transaction reference below</li>
            </ul>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Transaction Reference */}
            <div className="space-y-2">
              <Label htmlFor="transactionRef" className="text-gray-300 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Transaction Reference / ID
              </Label>
              <Input
                id="transactionRef"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g., TRX123456789 or 9876543210"
                className="bg-[#1a1a25] border-white/10 text-white placeholder:text-gray-600 h-11"
              />
              <p className="text-xs text-gray-500">
                Found in your transfer confirmation message or receipt
              </p>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Proof of Payment (Screenshot)
              </Label>
              
              <AnimatePresence mode="wait">
                {proofPreview ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative rounded-xl overflow-hidden border border-emerald-500/30"
                  >
                    <img 
                      src={proofPreview} 
                      alt="Proof of payment" 
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center">
                      <p className="text-xs text-white truncate">{proofFile?.name}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-emerald-400" />
                    </div>
                    <p className="text-sm text-gray-400 mb-1">
                      <span className="text-emerald-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 border-0 h-12 text-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Submit Payment Details
                </>
              )}
            </Button>
          </form>

          {/* Security Note */}
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 rounded-lg p-3">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Your payment is secure. We'll verify your payment within 24 hours and activate your agent automatically.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-400">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}