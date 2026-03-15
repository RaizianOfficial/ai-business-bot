"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Trash2, CheckCircle, Package, LogOut, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [passkey, setPasskey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/orders?passkey=${passkey}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setIsAuthorized(true);
      } else {
        setError("Invalid Passkey");
      }
    } catch (err) {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/update-order", {
        method: "PATCH",
        body: JSON.stringify({ id, status, passkey }),
      });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await fetch("/api/update-order", {
        method: "PATCH",
        body: JSON.stringify({ id, passkey, action: "delete" }),
      });
      setOrders(orders.filter(o => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-primary" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
          <p className="text-center text-white/40 mb-8 font-light">Please enter your security passkey</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Secret Passkey"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-center text-xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Access Dashboard"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-1 italic">Order Dashboard</h1>
            <p className="text-white/40 text-sm">Managing ${orders.length} active orders</p>
          </div>
          <button 
            onClick={() => setIsAuthorized(false)} 
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Orders", value: orders.length, icon: <Package className="text-primary" /> },
            { label: "Pending", value: orders.filter(o => o.status === "pending").length, icon: <Loader2 className="text-secondary" /> },
            { label: "Completed", value: orders.filter(o => o.status === "confirmed").length, icon: <CheckCircle className="text-green-400" /> },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/40 mb-1">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">{s.icon}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Delivery</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Customer Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {orders.map((o) => (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="bg-primary/20 text-primary text-xs font-black w-10 h-10 rounded-lg flex items-center justify-center">
                          {o.product_code}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm">{o.delivery_date}</p>
                        <p className="text-xs text-white/40">{o.city}</p>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm truncate">{o.address}</p>
                        <p className="text-xs text-secondary font-medium">{o.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.status === "pending" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                          o.status === "confirmed" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                          "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateStatus(o.id, "confirmed")}
                            className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                            title="Confirm Order"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => updateStatus(o.id, "shipped")}
                            className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                            title="Mark Shipped"
                          >
                            <Package size={16} />
                          </button>
                          <button 
                            onClick={() => deleteOrder(o.id)}
                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
