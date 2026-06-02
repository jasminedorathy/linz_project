"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import {
  CreditCard, Calendar, Truck, Store, MapPin, Phone, Mail,
  User, CheckCircle2, Smartphone, IndianRupee,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Schema ───────────────────────────────────────────────────────────────────
const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid 10-digit mobile number"),
  orderType: z.enum(["delivery", "pickup"]),
  address: z.string().optional(),
  date: z.string().min(1, "Please select an order date"),
  time: z.string().min(1, "Please select a time slot"),
  paymentMethod: z.enum(["upi", "card"]),
  upiId: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.orderType === "delivery" && (!data.address || data.address.trim().length < 5)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Delivery address is required", path: ["address"] });
  }
  if (data.paymentMethod === "upi") {
    if (!data.upiId || !/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(data.upiId)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid UPI ID (e.g. name@upi)", path: ["upiId"] });
    }
  }
  if (data.paymentMethod === "card") {
    if (!data.cardNumber || !/^\d{16}$/.test(data.cardNumber)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Card number must be 16 digits", path: ["cardNumber"] });
    }
    if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(data.cardExpiry)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Use MM/YY format", path: ["cardExpiry"] });
    }
    if (!data.cardCvc || !/^\d{3,4}$/.test(data.cardCvc)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CVC must be 3 or 4 digits", path: ["cardCvc"] });
    }
  }
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

// ─── Razorpay type helper ─────────────────────────────────────────────────────
declare global {
  interface Window { Razorpay: any; }
}

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("pickup");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Load Razorpay checkout script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { orderType: "pickup", paymentMethod: "upi" },
  });

  // Indian pricing
  const DELIVERY_FEE = 50;       // ₹50
  const GST_RATE    = 0.18;      // 18% GST
  const deliveryFee  = orderType === "delivery" ? DELIVERY_FEE : 0;
  const gst          = cartTotal * GST_RATE;
  const finalTotal   = cartTotal + gst + deliveryFee;
  const amountPaise  = Math.round(finalTotal * 100); // Razorpay uses paise

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      // 1. Create a Razorpay order on our backend
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt: `bel_${Date.now()}` }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Could not initiate payment. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXXXXXXXXX",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Linz Baking Cakes & Bakery",
        description: "Fresh Baked Goods Order",
        order_id: orderData.orderId,
        prefill: {
          name: data.name,
          email: data.email,
          contact: `+91${data.phone}`,
          ...(data.paymentMethod === "upi" && { vpa: data.upiId }),
          method: data.paymentMethod === "upi" ? "upi" : "card",
        },
        theme: { color: "#EC4899" },
        handler: async (response: any) => {
          // 3. Verify payment on our backend
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // 4. Store order locally
            const orderResult = {
              orderId: `BEL-${Math.floor(100000 + Math.random() * 900000)}`,
              paymentId: response.razorpay_payment_id,
              customer: { name: data.name, email: data.email, phone: data.phone },
              orderType: data.orderType,
              address: data.address,
              scheduledFor: `${data.date} at ${data.time}`,
              items: cart.map((item) => ({ name: item.product.name, quantity: item.quantity, price: item.product.price })),
              totals: { subtotal: cartTotal, gst, deliveryFee, total: finalTotal },
              paymentMethod: data.paymentMethod,
              status: "paid",
            };
            const existingOrders = JSON.parse(localStorage.getItem("linz_baking_orders") || "[]");
            localStorage.setItem("linz_baking_orders", JSON.stringify([orderResult, ...existingOrders]));
            setCreatedOrder(orderResult);
            setOrderSuccess(true);
            clearCart();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
          setIsSubmitting(false);
        },
        modal: {
          ondismiss: () => { setIsSubmitting(false); }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-white";
  const inputStyle = { borderColor: "#e5e7eb", color: "var(--color-text)" };

  // ─── Success Screen ──────────────────────────────────────────────────────────
  if (orderSuccess && createdOrder) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full mx-6 bg-white rounded-3xl p-8 shadow-xl text-center flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={44} className="text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Order Placed!</h1>
            <p className="text-gray-500 text-sm mt-1">
              Order <span className="font-semibold text-pink-950">{createdOrder.orderId}</span> confirmed · Payment ID: <span className="font-mono text-xs">{createdOrder.paymentId}</span>
            </p>
          </div>

          <div className="w-full bg-gray-50 rounded-2xl p-6 text-left space-y-4 text-sm">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-400">Scheduled</span>
              <span className="font-medium">{createdOrder.scheduledFor}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-400">Type</span>
              <span className="font-medium capitalize">{createdOrder.orderType}</span>
            </div>
            <div className="space-y-2 border-b pb-3">
              <span className="text-gray-400 block mb-1">Items</span>
              {createdOrder.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between font-medium">
                  <span>{item.name} <span className="text-xs text-gray-400">×{item.quantity}</span></span>
                  <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex justify-between"><span>GST (18%)</span><span>₹{createdOrder.totals.gst.toFixed(0)}</span></div>
              {createdOrder.totals.deliveryFee > 0 && (
                <div className="flex justify-between"><span>Delivery</span><span>₹{createdOrder.totals.deliveryFee}</span></div>
              )}
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-3">
              <span>Total Paid</span>
              <span>₹{createdOrder.totals.total.toFixed(0)}</span>
            </div>
          </div>

          <Link href="/menu" className="py-3.5 px-8 rounded-full text-white text-sm font-semibold transition-all hover:brightness-95" style={{ backgroundColor: "var(--color-primary)" }}>
            Back to Menu
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Empty Cart ──────────────────────────────────────────────────────────────
  if (cartCount === 0) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Your Cart is Empty</h2>
          <Link href="/menu" className="inline-block py-3 px-8 rounded-full text-white text-sm font-semibold" style={{ backgroundColor: "var(--color-primary)" }}>Go to Menu</Link>
        </div>
      </div>
    );
  }

  // ─── Checkout Form ───────────────────────────────────────────────────────────
  return (
    <>
      <section className="py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}>
        <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Secure Checkout
        </h1>
        <p className="text-white/50 text-sm mt-2">Payments secured by Razorpay · UPI · Cards accepted</p>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── Form ── */}
          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Order Type */}
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>Order Option</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "pickup", Icon: Store, label: "Store Pickup", sub: "Free" },
                    { id: "delivery", Icon: Truck, label: "Home Delivery", sub: "₹50 fee" },
                  ].map(({ id, Icon, label, sub }) => (
                    <button
                      key={id} type="button"
                      onClick={() => { setOrderType(id as any); setValue("orderType", id as any); }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${orderType === id ? "border-pink-600 bg-pink-50/30" : "border-gray-200 bg-white"}`}
                    >
                      <Icon size={24} style={{ color: orderType === id ? "var(--color-primary)" : "#6b7280" }} />
                      <span className="text-sm font-semibold">{label}</span>
                      <span className="text-xs text-gray-400">{sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>Customer Details</h3>

                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-4 text-gray-400" />
                  <input placeholder="Full Name" {...register("name")} className={inputClass} style={inputStyle} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-4 text-gray-400" />
                    <input type="email" placeholder="Email Address" {...register("email")} className={inputClass} style={inputStyle} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-4 text-gray-400" />
                    <input type="tel" placeholder="10-digit Mobile Number" {...register("phone")} className={inputClass} style={inputStyle} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                {orderType === "delivery" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-4 text-gray-400" />
                    <input placeholder="Full Delivery Address with Pincode" {...register("address")} className={inputClass} style={inputStyle} />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </motion.div>
                )}
              </div>

              {/* Schedule */}
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>Schedule</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-4 text-gray-400" />
                    <input type="date" {...register("date")} className={inputClass} style={inputStyle} min={new Date().toISOString().split("T")[0]} />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                  </div>
                  <div>
                    <select {...register("time")} className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white" style={inputStyle}>
                      <option value="">Select Time Slot</option>
                      <option>08:00 AM – 10:00 AM</option>
                      <option>10:00 AM – 12:00 PM</option>
                      <option>12:00 PM – 02:00 PM</option>
                      <option>02:00 PM – 04:00 PM</option>
                      <option>04:00 PM – 06:00 PM</option>
                      <option>06:00 PM – 08:00 PM</option>
                    </select>
                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>Payment Method</h3>

                {/* Tab switcher */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "upi", Icon: Smartphone, label: "UPI Payment", sub: "GPay · PhonePe · Paytm" },
                    { id: "card", Icon: CreditCard, label: "Debit / Credit Card", sub: "Visa · Mastercard · RuPay" },
                  ].map(({ id, Icon, label, sub }) => (
                    <button
                      key={id} type="button"
                      onClick={() => { setPaymentMethod(id as any); setValue("paymentMethod", id as any); }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${paymentMethod === id ? "border-pink-600 bg-pink-50/30" : "border-gray-200 bg-white"}`}
                    >
                      <Icon size={22} style={{ color: paymentMethod === id ? "var(--color-primary)" : "#6b7280" }} />
                      <span className="text-sm font-bold">{label}</span>
                      <span className="text-[10px] text-gray-400">{sub}</span>
                    </button>
                  ))}
                </div>

                {/* UPI ID field */}
                {paymentMethod === "upi" && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Your UPI ID</label>
                    <div className="relative">
                      <Smartphone size={16} className="absolute left-3.5 top-4 text-gray-400" />
                      <input
                        placeholder="yourname@upi / 98765@paytm"
                        {...register("upiId")}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    {errors.upiId && <p className="text-red-500 text-xs">{errors.upiId.message}</p>}
                    <p className="text-[11px] text-gray-400 mt-1">
                      The UPI payment will open in the Razorpay gateway — you can also scan QR, use any UPI app.
                    </p>
                  </motion.div>
                )}

                {/* Card fields */}
                {paymentMethod === "card" && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="relative">
                      <CreditCard size={16} className="absolute left-3.5 top-4 text-gray-400" />
                      <input placeholder="Card Number (16 digits)" {...register("cardNumber")} className={inputClass} style={inputStyle} />
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input placeholder="MM/YY Expiry" {...register("cardExpiry")} className={inputClass} style={inputStyle} />
                        {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry.message}</p>}
                      </div>
                      <div>
                        <input placeholder="CVV" type="password" {...register("cardCvc")} className={inputClass} style={inputStyle} />
                        {errors.cardCvc && <p className="text-red-500 text-xs mt-1">{errors.cardCvc.message}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Razorpay badge */}
                <div className="flex items-center gap-2 pt-2 border-t text-xs text-gray-400">
                  <IndianRupee size={13} />
                  <span>Payments are processed securely via <strong>Razorpay</strong>. We never store your card or UPI details.</span>
                </div>
              </div>

              {/* Pay Button */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:brightness-95 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <IndianRupee size={18} />
                {isSubmitting ? "Redirecting to Payment..." : `Pay ₹${finalTotal.toFixed(0)}`}
              </motion.button>
            </form>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6 sticky top-28">
              <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>Order Summary</h3>

              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 items-center">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="60px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate text-gray-800">{item.product.name}</h4>
                      <p className="text-xs text-gray-400 capitalize">Qty: {item.quantity} · ₹{item.product.price}</p>
                    </div>
                    <span className="font-bold text-sm" style={{ color: "var(--color-primary)" }}>
                      ₹{(item.product.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-pink-950">₹{cartTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-pink-950">₹{gst.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Order Type</span>
                  <span className="font-semibold text-pink-950 capitalize">{orderType}</span>
                </div>
                {orderType === "delivery" && (
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-pink-950">₹{DELIVERY_FEE}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span style={{ color: "var(--color-primary)" }}>₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
