"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Calendar, Database, Mail, Award, TrendingUp, CheckCircle, RefreshCw, Eye } from "lucide-react";
import { menuItems as defaultMenuItems } from "@/lib/data/menuData";
import Image from "next/image";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "bookings" | "menu" | "messages">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    // Load local storage states or insert mock fallbacks if empty
    const savedOrders = JSON.parse(localStorage.getItem("bellaria_orders") || "[]");
    const savedBookings = JSON.parse(localStorage.getItem("bellaria_bookings") || "[]");
    
    // Mock orders if empty
    if (savedOrders.length === 0) {
      const mockOrders = [
        {
          orderId: "BEL-482019",
          customer: { name: "John Miller", email: "john@example.com", phone: "(555) 912-3849" },
          orderType: "delivery",
          address: "742 Evergreen Terrace, Springfield, CA 90210",
          scheduledFor: "2026-05-28 at 02:00 PM - 04:00 PM",
          items: [
            { name: "Classic Chocolate Cake", quantity: 1, price: 45.00 },
            { name: "Caramel Macchiato", quantity: 2, price: 5.00 }
          ],
          totals: { subtotal: 55.00, tax: 4.54, deliveryFee: 5.00, total: 64.54 },
          status: "pending"
        },
        {
          orderId: "CAKE-882941",
          customer: { name: "Alicia Silverstone", email: "alicia@example.com", phone: "(555) 482-9011" },
          cakeDetails: {
            shape: "heart",
            size: "8inch",
            flavour: "redvelvet",
            frosting: "fondant",
            decorations: ["fresh_berries", "gold_leaf"],
            writing: "Happy Anniversary!",
            instructions: "Make the frosting red and white gradients please!"
          },
          price: 93.00,
          type: "custom_cake",
          status: "pending",
          date: "2026-05-26"
        }
      ];
      localStorage.setItem("bellaria_orders", JSON.stringify(mockOrders));
      setOrders(mockOrders);
    } else {
      setOrders(savedOrders);
    }

    // Mock bookings if empty
    if (savedBookings.length === 0) {
      const mockBookings = [
        {
          bookingId: "BOOK-829103",
          customer: { name: "Clara Oswald", email: "clara@tardis.com", phone: "(555) 392-1029" },
          typeLabel: "Wedding Cake Tasting",
          date: "2026-06-12",
          time: "11:30 AM",
          guests: "3",
          price: 30.00,
          notes: "Looking for an elegant pastel color scheme."
        }
      ];
      localStorage.setItem("bellaria_bookings", JSON.stringify(mockBookings));
      setBookings(mockBookings);
    } else {
      setBookings(savedBookings);
    }

    // Load menu items
    setMenuItems(defaultMenuItems);

    // Mock messages
    const mockMessages = [
      { name: "Robert Downey", email: "robert@stark.com", subject: "Catering Inquiry", message: "Do you cater for corporate launch parties? We expect around 120 guests." },
      { name: "Diana Prince", email: "diana@themyscira.gov", subject: "Custom design question", message: "Can you design a cake with a golden lasso emblem on it? Let me know!" }
    ];
    setMessages(mockMessages);
  }, []);

  const updateOrderStatus = (orderId: string, status: string) => {
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem("bellaria_orders", JSON.stringify(updated));
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  const handleClearAll = () => {
    localStorage.removeItem("bellaria_orders");
    localStorage.removeItem("bellaria_bookings");
    window.location.reload();
  };

  return (
    <>
      <section
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}
      >
        <span
          className="block text-sm font-semibold uppercase tracking-widest text-amber-500 mb-2"
        >
          Bakery Administration Portal
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Management Dashboard
        </h1>
      </section>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left panel tabs */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-2">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "orders" ? "bg-amber-600 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ShoppingCart size={18} />
                <span>Orders & Custom Cakes</span>
                <span className="ml-auto bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "bookings" ? "bg-amber-600 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Calendar size={18} />
                <span>Tasting Bookings</span>
                <span className="ml-auto bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {bookings.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("menu")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "menu" ? "bg-amber-600 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Database size={18} />
                <span>Menu Management</span>
              </button>

              <button
                onClick={() => setActiveTab("messages")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === "messages" ? "bg-amber-600 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Mail size={18} />
                <span>Messages & Inquiries</span>
                <span className="ml-auto bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {messages.length}
                </span>
              </button>
            </div>

            <button
              onClick={handleClearAll}
              className="w-full py-3 rounded-2xl bg-white border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              Reset Mock Data Defaults
            </button>
          </div>

          {/* Right Area content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-xl font-bold border-b pb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Customer Orders
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b text-gray-400 text-xs uppercase tracking-wider">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((o) => (
                        <tr key={o.orderId} className="hover:bg-gray-50/50">
                          <td className="py-4 font-bold text-gray-800">{o.orderId}</td>
                          <td className="py-4">
                            <p className="font-semibold">{o.customer.name}</p>
                            <p className="text-xs text-gray-400">{o.customer.phone}</p>
                          </td>
                          <td className="py-4 capitalize">
                            {o.type === "custom_cake" ? (
                              <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded-full text-xs font-semibold">
                                Custom Cake
                              </span>
                            ) : (
                              <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded-full text-xs font-semibold">
                                {o.orderType}
                              </span>
                            )}
                          </td>
                          <td className="py-4 font-semibold text-gray-800">
                            ${o.totals ? o.totals.total.toFixed(2) : o.price.toFixed(2)}
                          </td>
                          <td className="py-4 capitalize">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              o.status === "completed" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {o.status || "pending"}
                            </span>
                          </td>
                          <td className="py-4">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-xl font-bold border-b pb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Tasting Session Slots
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookings.map((b) => (
                    <div key={b.bookingId} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                            {b.bookingId}
                          </span>
                          <h4 className="font-bold text-gray-800 text-base mt-2">{b.typeLabel}</h4>
                        </div>
                        <span className="font-bold text-sm text-gray-800">
                          {b.price > 0 ? `$${b.price.toFixed(2)}` : "Free"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><span className="font-bold text-gray-700">Customer:</span> {b.customer.name} ({b.customer.phone})</p>
                        <p><span className="font-bold text-gray-700">Date & Time:</span> {b.date} at {b.time}</p>
                        <p><span className="font-bold text-gray-700">Guests:</span> {b.guests} persons</p>
                        {b.notes && <p className="italic text-gray-400 mt-2">"{b.notes}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MENU TAB */}
            {activeTab === "menu" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    Menu Inventory Items
                  </h3>
                  <button
                    className="py-2 px-4 rounded-xl text-white font-semibold text-xs transition-all hover:brightness-95"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Add Product
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex gap-4 border p-3 rounded-2xl bg-white border-gray-100 hover:shadow-sm">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="60px" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-gray-800 truncate">{item.name}</h4>
                          <p className="text-xs text-gray-400 capitalize">{item.category}</p>
                        </div>
                        <span className="font-bold text-sm" style={{ color: "var(--color-primary)" }}>
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === "messages" && (
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-xl font-bold border-b pb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  Contact Submissions
                </h3>

                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className="border p-5 rounded-2xl bg-gray-50/50 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-gray-800">{m.name}</h4>
                          <p className="text-xs text-gray-400">{m.email}</p>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          {m.subject}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 italic bg-white p-3 border border-gray-100 rounded-xl">
                        "{m.message}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <h4 className="text-xl font-bold border-b pb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Details for {selectedOrder.orderId}
            </h4>

            {selectedOrder.type === "custom_cake" ? (
              <div className="space-y-3 text-xs">
                <p><span className="font-bold text-gray-700">Customer:</span> {selectedOrder.customer.name} ({selectedOrder.customer.phone})</p>
                <p><span className="font-bold text-gray-700">Cake Specs:</span> {selectedOrder.cakeDetails.size} {selectedOrder.cakeDetails.shape} cake</p>
                <p><span className="font-bold text-gray-700">Flavour:</span> {selectedOrder.cakeDetails.flavour}</p>
                <p><span className="font-bold text-gray-700">Frosting Style:</span> {selectedOrder.cakeDetails.frosting}</p>
                {selectedOrder.cakeDetails.decorations.length > 0 && (
                  <p><span className="font-bold text-gray-700">Decorations:</span> {selectedOrder.cakeDetails.decorations.join(", ")}</p>
                )}
                {selectedOrder.cakeDetails.writing && (
                  <p><span className="font-bold text-gray-700">Inscription:</span> "{selectedOrder.cakeDetails.writing}"</p>
                )}
                {selectedOrder.cakeDetails.instructions && (
                  <p className="bg-yellow-50 p-2 rounded-lg italic">"{selectedOrder.cakeDetails.instructions}"</p>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p><span className="font-bold text-gray-700">Customer:</span> {selectedOrder.customer.name} ({selectedOrder.customer.phone})</p>
                <p><span className="font-bold text-gray-700">Address:</span> {selectedOrder.address || "N/A (Store Pickup)"}</p>
                <p><span className="font-bold text-gray-700">Scheduled Time:</span> {selectedOrder.scheduledFor}</p>
                <div className="border-t pt-3 space-y-2">
                  <span className="font-bold text-gray-700 block">Items ordered</span>
                  {selectedOrder.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between font-semibold">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center border-t pt-4">
              <div className="flex gap-2">
                {selectedOrder.status !== "completed" && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.orderId, "completed")}
                    className="py-2 px-4 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} /> Completed
                  </button>
                )}
                <button
                  onClick={() => updateOrderStatus(selectedOrder.orderId, "pending")}
                  className="py-2 px-4 rounded-xl border text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  Set to Pending
                </button>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2 px-4 rounded-xl text-xs font-bold text-gray-400 hover:text-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
