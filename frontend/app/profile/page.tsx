"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Award, Calendar, ShoppingCart, RefreshCw, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      const currentUser = JSON.parse(localStorage.getItem("bellaria_current_user") || "null");
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      // Load user's orders
      const allOrders = JSON.parse(localStorage.getItem("bellaria_orders") || "[]");
      const userOrders = allOrders.filter((o: any) => o.customer.email === currentUser.email);
      setOrders(userOrders);

      // Load user's bookings
      const allBookings = JSON.parse(localStorage.getItem("bellaria_bookings") || "[]");
      const userBookings = allBookings.filter((b: any) => b.customer.email === currentUser.email);
      setBookings(userBookings);
    };

    checkUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("bellaria_current_user");
    router.push("/login");
    // Force header update
    window.dispatchEvent(new Event("storage"));
  };

  if (!user) return null;

  // Loyalty calculations
  const totalPoints = user.loyaltyPoints || 0;
  const cookieGoal = 200;
  const progressPercent = Math.min((totalPoints / cookieGoal) * 100, 100);

  return (
    <>
      <section
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Sweet Profile
        </h1>
      </section>

      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left profile card & loyalty status */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center text-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <User size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  {user.name}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>

            {/* Loyalty card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <Award size={20} className="text-amber-500" />
                <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">
                  Loyalty Points Status
                </h4>
              </div>

              <div className="text-center py-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                <p className="text-3xl font-extrabold text-amber-700">{totalPoints}</p>
                <p className="text-xs text-amber-900 font-semibold mt-1">Sweet Rewards Points</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">Free Pastry Reward</span>
                  <span className="text-gray-900">{totalPoints}/{cookieGoal} pts</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {totalPoints >= cookieGoal ? (
                  <p className="text-[10px] text-green-600 font-bold mt-1.5 flex items-center gap-1">
                    <Star size={10} /> Reward unlocked! Show barcode to cashier.
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-400 leading-normal mt-1.5">
                    Just {cookieGoal - totalPoints} more points to claim a free chocolate cookie or croissant!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Orders/Bookings panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Orders section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 border-b pb-4">
                <ShoppingCart size={20} style={{ color: "var(--color-primary)" }} />
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  Order History ({orders.length})
                </h3>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-sm text-gray-400">You haven't placed any orders yet.</p>
                  <Link
                    href="/menu"
                    className="inline-block py-2 px-6 rounded-full text-white text-xs font-semibold transition-all hover:brightness-95"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Start Your First Order
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.orderId} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-800">{o.orderId}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold capitalize text-[10px] ${
                          o.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {o.status || "pending"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {o.type === "custom_cake" ? (
                          <p>
                            Custom Cake: <span className="font-bold text-gray-700 capitalize">{o.cakeDetails.size} {o.cakeDetails.shape}</span> cake
                          </p>
                        ) : (
                          <p>
                            Items: {o.items.map((i: any) => `${i.name} (x${i.quantity})`).join(", ")}
                          </p>
                        )}
                        {o.scheduledFor && <p className="mt-1">Scheduled for: {o.scheduledFor}</p>}
                      </div>
                      <div className="flex justify-between border-t pt-2.5 text-xs font-bold text-gray-800">
                        <span>Total Paid</span>
                        <span>${o.totals ? o.totals.total.toFixed(2) : o.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tasting Bookings section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5 border-b pb-4">
                <Calendar size={20} style={{ color: "var(--color-primary)" }} />
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  Tasting Bookings ({bookings.length})
                </h3>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-sm text-gray-400">No wedding tastings scheduled.</p>
                  <Link
                    href="/book-consultation"
                    className="inline-block py-2 px-6 rounded-full text-white text-xs font-semibold transition-all hover:brightness-95"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Book a Tasting Session
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookings.map((b) => (
                    <div key={b.bookingId} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-2 text-xs text-gray-500">
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>{b.bookingId}</span>
                        <span>{b.price > 0 ? `$${b.price.toFixed(2)}` : "Free"}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm">{b.typeLabel}</h4>
                      <p>{b.date} at {b.time}</p>
                      <p>{b.guests} guests attending</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
