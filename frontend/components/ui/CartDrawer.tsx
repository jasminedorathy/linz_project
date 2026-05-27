"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} style={{ color: "var(--color-primary)" }} />
                <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  Your Basket ({cartCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    <ShoppingBag size={28} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Your cart is empty</h3>
                    <p className="text-sm text-gray-500 max-w-xs mt-1">
                      Explore our delicious freshly baked selection and add some sweetness to your basket!
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 px-6 py-2.5 rounded-full text-white font-semibold text-sm transition-all hover:brightness-95"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border-b pb-4 border-gray-100">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm leading-tight text-gray-800">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 capitalize">{item.product.category}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity selector */}
                        <div className="flex items-center border border-gray-200 rounded-full px-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-black transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-black transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-semibold text-sm" style={{ color: "var(--color-primary)" }}>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400">
                  Taxes, shipping, or pickup fees calculated at checkout.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button
                    onClick={onClose}
                    className="py-3 px-4 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Close Cart
                  </button>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="py-3 px-4 rounded-xl text-center text-white text-sm font-semibold transition-all hover:brightness-95 block"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Go to Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
