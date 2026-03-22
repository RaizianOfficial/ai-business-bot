"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Trash2, CheckCircle, Package, LogOut, Loader2, ChevronDown, Clock, Truck, Gift, XCircle, BoxIcon, Plus, X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending", emoji: "⏳", color: "amber" },
  { value: "Confirmed", label: "Confirmed", emoji: "✅", color: "green" },
  { value: "Packed", label: "Packed", emoji: "📦", color: "blue" },
  { value: "Shipped", label: "Shipped", emoji: "🚚", color: "purple" },
  { value: "Delivered", label: "Delivered", emoji: "🎉", color: "emerald" },
  { value: "Cancelled", label: "Cancelled", emoji: "❌", color: "red" },
];

function getStatusStyle(status: string) {
  const s = status?.toLowerCase() || "pending";
  switch (s) {
    case "pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "confirmed": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "packed": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "shipped": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "delivered": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
    default: return "bg-white/10 text-white/60 border-white/20";
  }
}

export default function AdminDashboard() {
  const [passkey, setPasskey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ product_name: "", product_code: "", description: "", price: "", discount: "" });
  const [addingProduct, setAddingProduct] = useState(false);

  // Common State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/get-product?passkey=${passkey}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

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
        fetchProducts(); // fetch products right after auth
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, passkey }),
      });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      setOpenDropdown(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await fetch("/api/update-order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, passkey, action: "delete" }),
      });
      setOrders(orders.filter(o => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProduct(true);
    try {
      const res = await fetch("/api/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false);
        setNewProduct({ product_name: "", product_code: "", description: "", price: "", discount: "" });
        fetchProducts(); // Refresh
      } else {
        alert(data.error || "Failed to add product");
      }
    } catch (err) {
      alert("Error adding product");
    } finally {
      setAddingProduct(false);
    }
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(o => o.status?.toLowerCase() === statusFilter.toLowerCase());

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
    <div className="min-h-screen bg-[#020617] p-4 md:p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-white/40 hover:text-white'}`}
                >
                  Orders
                </button>
                <button 
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-primary text-white shadow-md' : 'text-white/40 hover:text-white'}`}
                >
                  Products
                </button>
              </div>
            </div>
            <p className="text-white/40 text-sm">
              {activeTab === 'orders' ? `Managing ${orders.length} orders` : `Managing ${products.length} products`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {activeTab === 'products' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold px-4 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
              >
                <Plus size={18} />
                Add Product
              </button>
            )}
            <button
              onClick={() => setIsAuthorized(false)}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors bg-white/5 px-4 py-2.5 rounded-xl border border-white/10"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
              {STATUS_OPTIONS.map((s) => {
                const count = orders.filter(o => o.status === s.value).length;
                return (
                  <button
                    key={s.value}
                    onClick={() => setStatusFilter(statusFilter === s.value.toLowerCase() ? "all" : s.value.toLowerCase())}
                    className={`p-4 rounded-2xl border transition-all duration-200 text-left ${
                      statusFilter === s.value.toLowerCase()
                        ? `${getStatusStyle(s.value)} border-2`
                        : "bg-white/5 border-white/10 hover:bg-white/[0.08]"
                    }`}
                  >
                    <p className="text-lg mb-1">{s.emoji}</p>
                    <p className="text-xs text-white/40 mb-0.5">{s.label}</p>
                    <p className="text-xl font-bold">{count}</p>
                  </button>
                );
              })}
            </div>

            {/* Filter indicator */}
            {statusFilter !== "all" && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-white/40">Filtered by:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(statusFilter)}`}>
                  {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </span>
                <button onClick={() => setStatusFilter("all")} className="text-xs text-white/40 hover:text-white underline ml-2">
                  Clear
                </button>
              </div>
            )}

            {/* Orders Table */}
            <div className={`bg-white/5 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md ${openDropdown ? "relative z-50" : ""}`}>
              <div className="w-full overflow-visible overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-white/40 uppercase tracking-widest text-[10px] md:text-xs">
                      <th className="px-4 md:px-6 py-4 font-bold">Order ID</th>
                      <th className="px-4 md:px-6 py-4 font-bold">Product</th>
                      <th className="px-4 md:px-6 py-4 font-bold">Details</th>
                      <th className="px-4 md:px-6 py-4 font-bold">Delivery</th>
                      <th className="px-4 md:px-6 py-4 font-bold">Status</th>
                      <th className="px-4 md:px-6 py-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <AnimatePresence>
                      {filteredOrders.map((o) => (
                        <motion.tr
                          key={o.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`hover:bg-white/[0.02] transition-colors relative ${openDropdown === o.id ? "z-50" : "z-0"}`}
                        >
                          <td className="px-4 md:px-6 py-4">
                            <span className="font-mono font-bold text-primary text-sm whitespace-nowrap">
                              {o.order_id || "—"}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-white">{o.product_name || o.product_code}</span>
                              <span className="text-xs text-primary/80 font-mono tracking-wider">{o.product_code}</span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <p className="font-medium text-sm text-white/90">{o.name || o.customer_name || "—"}</p>
                            <p className="text-xs text-secondary font-medium tracking-wide">{o.phone}</p>
                            {o.email && o.email !== "Not provided" && <p className="text-[10px] text-white/30">{o.email}</p>}
                          </td>
                          <td className="px-4 md:px-6 py-4 max-w-xs">
                            <p className="text-sm font-semibold text-white/80 truncate">{o.city}</p>
                            <p className="text-xs text-white/40 truncate" title={o.address}>{o.address}</p>
                            {o.custom_message && o.custom_message !== "None" && (
                              <p className="text-xs text-secondary/70 italic mt-1 truncate" title={o.custom_message}>"{o.custom_message}"</p>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-4 relative">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(openDropdown === o.id ? null : o.id);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 w-[fit-content] rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all pointer-events-auto cursor-pointer ${getStatusStyle(o.status)}`}
                              >
                                {o.status || "Pending"}
                                <ChevronDown size={12} className={`transition-transform ${openDropdown === o.id ? "rotate-180" : ""}`} />
                              </button>

                              <AnimatePresence>
                                {openDropdown === o.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                    className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-800 border border-white/10 shadow-2xl z-50 overflow-hidden pointer-events-auto"
                                  >
                                    {STATUS_OPTIONS.map((s) => (
                                      <button
                                        key={s.value}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateStatus(o.id, s.value);
                                        }}
                                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors hover:bg-white/10 cursor-pointer pointer-events-auto ${
                                          o.status === s.value ? "bg-white/5 font-bold" : ""
                                        }`}
                                      >
                                        <span>{s.emoji}</span>
                                        <span>{s.label}</span>
                                        {o.status === s.value && <CheckCircle size={14} className="ml-auto text-green-400" />}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <button
                              onClick={() => deleteOrder(o.id)}
                              className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all cursor-pointer pointer-events-auto"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-white/20 italic">
                          {statusFilter !== "all" ? `No ${statusFilter} orders found` : "No orders found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-white/40 uppercase tracking-widest text-xs">
                    <th className="px-4 md:px-6 py-4 font-bold">Code</th>
                    <th className="px-4 md:px-6 py-4 font-bold">Product Name</th>
                    <th className="px-4 md:px-6 py-4 font-bold">Price</th>
                    <th className="px-4 md:px-6 py-4 font-bold">Discount</th>
                    <th className="px-4 md:px-6 py-4 font-bold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {products.map((p) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 md:px-6 py-4">
                          <span className="bg-primary/20 text-primary font-mono font-bold px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                            {p.product_code}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <p className="font-bold text-sm text-white/90">{p.product_name}</p>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <p className="text-sm font-semibold text-emerald-400">₹{p.price}</p>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <p className="text-sm text-white/60">{p.discount || "—"}</p>
                        </td>
                        <td className="px-4 md:px-6 py-4 max-w-xs">
                          <p className="text-xs text-white/40 truncate">{p.description || "—"}</p>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">
                        No products available in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BoxIcon className="text-primary" />
                  Add New Product
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 px-1">Product Name *</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-white"
                      placeholder="e.g. Deluxe Hamper"
                      value={newProduct.product_name}
                      onChange={e => setNewProduct({...newProduct, product_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 px-1">Code (Unique) *</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono font-bold text-primary placeholder:text-primary/30 uppercase"
                      placeholder="e.g. #VL101"
                      value={newProduct.product_code}
                      onChange={e => setNewProduct({...newProduct, product_code: e.target.value.toUpperCase()})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 px-1">Price (₹) *</label>
                    <input
                      required
                      type="number"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-white"
                      placeholder="e.g. 1500"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 px-1">Discount Info</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white"
                      placeholder="e.g. 10% off"
                      value={newProduct.discount}
                      onChange={e => setNewProduct({...newProduct, discount: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5 px-1">Internal Description</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white resize-none"
                    placeholder="Notes for fulfillment..."
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div className="pt-2">
                  <button
                    disabled={addingProduct}
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    {addingProduct ? <Loader2 className="animate-spin" size={20} /> : "Save Product to DB"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Click outside to close order status dropdown */}
      {openDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
      )}
    </div>
  );
}
