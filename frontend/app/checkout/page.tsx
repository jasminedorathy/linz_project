"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { CreditCard, Calendar, Truck, Store, MapPin, Phone, Mail, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number"),
  orderType: z.enum(["delivery", "pickup"]),
  address: z.string().optional(),
  date: z.string().min(1, "Please select an order date"),
  time: z.string().min(1, "Please select a pickup/delivery time"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Use MM/YY format"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
}).superRefine((data, ctx) => {
  if (data.orderType === "delivery" && (!data.address || data.address.trim().length < 5)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Delivery address is required",
      path: ["address"],
    });
  }
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("pickup");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orderType: "pickup",
    },
  });

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const deliveryFee = data.orderType === "delivery" ? 5 : 0;
    const tax = cartTotal * 0.0825;
    const finalTotal = cartTotal + tax + deliveryFee;

    const orderResult = {
      orderId: `BEL-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: { name: data.name, email: data.email, phone: data.phone },
      orderType: data.orderType,
      address: data.address,
      scheduledFor: `${data.date} at ${data.time}`,
      items: cart.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totals: {
        subtotal: cartTotal,
        tax,
        deliveryFee,
        total: finalTotal,
      },
    };

    // Store in localStorage to simulate order tracking
    const existingOrders = JSON.parse(localStorage.getItem("bellaria_orders") || "[]");
    localStorage.setItem("bellaria_orders", JSON.stringify([orderResult, ...existingOrders]));

    setCreatedOrder(orderResult);
    setIsSubmitting(false);
    setOrderSuccess(true);
    clearCart();
  };

  const deliveryFee = orderType === "delivery" ? 5 : 0;
  const tax = cartTotal * 0.0825;
  const finalTotal = cartTotal + tax + deliveryFee;

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-white";
  const inputStyle = { borderColor: "#e5e7eb", color: "var(--color-text)" };

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
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Order Placed!
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Thank you for ordering from Bellaria. Your order code is{" "}
              <span className="font-semibold text-black">{createdOrder.orderId}</span>.
            </p>
          </div>

          <div className="w-full bg-gray-50 rounded-2xl p-6 text-left space-y-4 text-sm">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-400">Scheduled Time</span>
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
                  <span>
                    {item.name} <span className="text-xs text-gray-400">x{item.quantity}</span>
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total Paid</span>
              <span>${createdOrder.totals.total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/menu"
            className="py-3.5 px-8 rounded-full text-white text-sm font-semibold transition-all hover:brightness-95"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Back to Menu
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            You need to add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/menu"
            className="inline-block py-3 px-8 rounded-full text-white text-sm font-semibold transition-all hover:brightness-95"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

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
          Secure Checkout
        </h1>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-3 space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Delivery Option Selector */}
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  Order Option
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType("pickup");
                      setValue("orderType", "pickup");
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      orderType === "pickup"
                        ? "border-amber-600 bg-amber-50/30"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Store size={24} style={{ color: orderType === "pickup" ? "var(--color-primary)" : "#6b7280" }} />
                    <span className="text-sm font-semibold">Store Pickup</span>
                    <span className="text-xs text-gray-400">Free</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType("delivery");
                      setValue("orderType", "delivery");
                    }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      orderType === "delivery"
                        ? "border-amber-600 bg-amber-50/30"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Truck size={24} style={{ color: orderType === "delivery" ? "var(--color-primary)" : "#6b7280" }} />
                    <span className="text-sm font-semibold">Delivery</span>
                    <span className="text-xs text-gray-400">$5.00 fee</span>
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  Customer Details
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-4 text-gray-400" />
                    <input
                      placeholder="Full Name"
                      {...register("name")}
                      className={inputClass}
                      style={inputStyle}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        {...register("email")}
                        className={inputClass}
                        style={inputStyle}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        {...register("phone")}
                        className={inputClass}
                        style={inputStyle}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {orderType === "delivery" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative"
                    >
                      <MapPin size={16} className="absolute left-3.5 top-4 text-gray-400" />
                      <input
                        placeholder="Delivery Address"
                        {...register("address")}
                        className={inputClass}
                        style={inputStyle}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  Schedule Time
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-4 text-gray-400" />
                    <input
                      type="date"
                      {...register("date")}
                      className={inputClass}
                      style={inputStyle}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                  </div>
                  <div>
                    <select
                      {...register("time")}
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white"
                      style={inputStyle}
                    >
                      <option value="">Select Time Slot</option>
                      <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                      <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                    </select>
                    {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
                  </div>
                </div>
              </div>

              {/* Payment details */}
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  Payment Details
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3.5 top-4 text-gray-400" />
                    <input
                      placeholder="Card Number (16 digits)"
                      {...register("cardNumber")}
                      className={inputClass}
                      style={inputStyle}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        placeholder="MM/YY Expiry"
                        {...register("cardExpiry")}
                        className={inputClass}
                        style={inputStyle}
                      />
                      {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry.message}</p>}
                    </div>
                    <div>
                      <input
                        placeholder="CVC"
                        type="password"
                        {...register("cardCvc")}
                        className={inputClass}
                        style={inputStyle}
                      />
                      {errors.cardCvc && <p className="text-red-500 text-xs mt-1">{errors.cardCvc.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:brightness-95 disabled:opacity-60"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {isSubmitting ? "Processing Payment..." : `Pay $${finalTotal.toFixed(2)}`}
              </motion.button>
            </form>
          </div>

          {/* Order Summary Side-Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                Order Summary
              </h3>

              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 items-center">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="60px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate text-gray-800">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-400 capitalize">
                        Qty: {item.quantity} · ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-bold text-sm" style={{ color: "var(--color-primary)" }}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Tax (8.25%)</span>
                  <span className="font-semibold text-black">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Order Type</span>
                  <span className="font-semibold text-black capitalize">{orderType}</span>
                </div>
                {orderType === "delivery" && (
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-black">$5.00</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span style={{ color: "var(--color-primary)" }}>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
