"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AdminGuard } from "@/components/admin-guard";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  RefreshCw,
  User,
  Wallet,
  Image,
  ArrowRight,
} from "lucide-react";

interface PaymentWithUser {
  id: string;
  amount: number;
  transactionRef: string;
  proofImage: string | null;
  status: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  };
  product: {
    name: string;
    category: string;
  };
}

export default function AdminPaymentsPage() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<PaymentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithUser | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const verifyPayment = async (paymentId: string) => {
    setProcessing(paymentId);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Payment verified! Agent activated.");
        fetchPayments();
        setSelectedPayment(null);
      } else {
        toast.error(data.error || "Failed to verify payment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setProcessing(null);
  };

  const rejectPayment = async (paymentId: string) => {
    setProcessing(paymentId);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/reject`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Payment rejected.");
        fetchPayments();
        setSelectedPayment(null);
      } else {
        toast.error(data.error || "Failed to reject payment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setProcessing(null);
  };

  const filteredPayments = payments.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.user.email.toLowerCase().includes(search) ||
      p.user.name?.toLowerCase().includes(search) ||
      p.product.name.toLowerCase().includes(search) ||
      p.transactionRef.toLowerCase().includes(search)
    );
  });

  const pendingPayments = filteredPayments.filter((p) => p.status === "PENDING");
  const verifiedPayments = filteredPayments.filter((p) => p.status === "VERIFIED");
  const rejectedPayments = filteredPayments.filter((p) => p.status === "REJECTED");

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
          <h1 className="text-3xl font-bold">Payment Verification</h1>
          <p className="text-gray-400">Review and verify user payments</p>
        </div>
        <Button variant="outline" onClick={fetchPayments}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingPayments.length}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{verifiedPayments.length}</p>
              <p className="text-sm text-gray-400">Verified</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rejectedPayments.length}</p>
              <p className="text-sm text-gray-400">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search by email, name, product, or transaction ref..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#1a1a25] border-white/10"
        />
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg"
          >
            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedPayment.user.name || "Unknown"}</p>
                    <p className="text-sm text-gray-400">{selectedPayment.user.email}</p>
                  </div>
                </div>

                {/* Product & Amount */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-sm text-gray-400">Product</p>
                    <p className="font-medium">{selectedPayment.product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="text-xl font-bold text-emerald-400">
                      {formatNaira(selectedPayment.amount)}
                    </p>
                  </div>
                </div>

                {/* Transaction Ref */}
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-gray-400 mb-1">Transaction Reference</p>
                  <p className="font-mono text-cyan-400">{selectedPayment.transactionRef}</p>
                </div>

                {/* Proof Image */}
                {selectedPayment.proofImage && (
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-sm text-gray-400 mb-2">Proof of Payment</p>
                    <a
                      href={selectedPayment.proofImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden border border-white/10"
                    >
                      <img
                        src={selectedPayment.proofImage}
                        alt="Proof of payment"
                        className="w-full h-48 object-cover hover:scale-105 transition-transform"
                      />
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() => rejectPayment(selectedPayment.id)}
                    disabled={processing === selectedPayment.id}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 border-0"
                    onClick={() => verifyPayment(selectedPayment.id)}
                    disabled={processing === selectedPayment.id}
                  >
                    {processing === selectedPayment.id ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Verify & Activate
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="w-full text-gray-400"
                  onClick={() => setSelectedPayment(null)}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Payments List */}
      <Card className="glass-card border-white/5">
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>{filteredPayments.length} total payments</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPayments.length > 0 ? (
            <div className="space-y-3">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      payment.status === "PENDING" ? "bg-yellow-500/20" :
                      payment.status === "VERIFIED" ? "bg-emerald-500/20" :
                      "bg-red-500/20"
                    }`}>
                      {payment.status === "PENDING" ? (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      ) : payment.status === "VERIFIED" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{payment.user.name || payment.user.email}</p>
                      <p className="text-sm text-gray-400">{payment.product.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">{formatNaira(payment.amount)}</p>
                      <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleString()}</p>
                    </div>
                    
                    <Badge className={
                      payment.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400 border-0" :
                      payment.status === "VERIFIED" ? "bg-emerald-500/20 text-emerald-400 border-0" :
                      "bg-red-500/20 text-red-400 border-0"
                    }>
                      {payment.status}
                    </Badge>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No payments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}