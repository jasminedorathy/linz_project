"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Share2, Copy, CheckCircle2, Users, IndianRupee, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const CAKES = [
  { id: "choc", name: "Classic Chocolate Cake", price: 850, emoji: "🍫" },
  { id: "strawberry", name: "Strawberry Shortcake", price: 750, emoji: "🍓" },
  { id: "custom", name: "Custom Designer Cake (Starter)", price: 1200, emoji: "🎂" },
  { id: "caramel", name: "Salted Caramel Drip Cake", price: 1600, emoji: "🍯" },
  { id: "lemon", name: "Zesty Lemon Berry Cake", price: 1100, emoji: "🍋" },
];

export default function GroupGiftPage() {
  const [step, setStep] = useState<"create" | "share">("create");
  const [selectedCake, setSelectedCake] = useState(CAKES[0]);
  const [form, setForm] = useState({ occasion: "", organisedBy: "", message: "" });
  const [giftId, setGiftId] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.occasion.trim()) e.occasion = "Please enter the occasion";
    if (!form.organisedBy.trim()) e.organisedBy = "Please enter your name";
    return e;
  };

  const createGift = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const id = `BGF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const giftData = {
      id,
      cake: selectedCake,
      occasion: form.occasion,
      organisedBy: form.organisedBy,
      message: form.message,
      target: selectedCake.price,
      collected: 0,
      contributors: [] as any[],
      createdAt: new Date().toLocaleDateString("en-IN"),
    };
    const existing = JSON.parse(localStorage.getItem("linz_baking_gifts") || "[]");
    localStorage.setItem("linz_baking_gifts", JSON.stringify([giftData, ...existing]));
    setGiftId(id);
    setStep("share");
  };

  const giftLink = typeof window !== "undefined" ? `${window.location.origin}/group-gift/${giftId}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(giftLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-pink-200 bg-white";

  return (
    <>
      <section className="py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}>
        <span className="block text-4xl mb-2" style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}>
          Together We Celebrate
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Group Gift a Cake 🎁
        </h1>
        <p className="text-white/50 text-sm mt-2">Pool contributions from friends & family · Everyone chips in!</p>
      </section>

      <section className="py-16 bg-gray-50 min-h-[600px]">
        <div className="max-w-2xl mx-auto px-6">
          {step === "create" ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              {/* Cake selector */}
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  1. Choose the Cake Gift 🎂
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {CAKES.map((cake) => (
                    <button
                      key={cake.id}
                      onClick={() => setSelectedCake(cake)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedCake.id === cake.id ? "border-pink-600 bg-pink-50/30" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cake.emoji}</span>
                        <span className="font-semibold text-sm text-gray-800">{cake.name}</span>
                      </div>
                      <span className="font-bold text-sm" style={{ color: "var(--color-primary)" }}>₹{cake.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  2. Gift Details 🎉
                </h3>
                <div className="space-y-3">
                  <div>
                    <input className={inputClass} placeholder="Occasion (e.g. Priya's 30th Birthday!)"
                      value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} />
                    {errors.occasion && <p className="text-red-500 text-xs mt-1">{errors.occasion}</p>}
                  </div>
                  <div>
                    <input className={inputClass} placeholder="Your name (Organiser)"
                      value={form.organisedBy} onChange={(e) => setForm({ ...form, organisedBy: e.target.value })} />
                    {errors.organisedBy && <p className="text-red-500 text-xs mt-1">{errors.organisedBy}</p>}
                  </div>
                  <textarea className={`${inputClass} resize-none`} rows={3}
                    placeholder="Add a warm message for the recipient... (optional)"
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 flex items-center gap-3">
                <IndianRupee size={20} className="text-pink-600 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-pink-900">Target Amount: ₹{selectedCake.price}</p>
                  <p className="text-pink-700 text-xs">Share the link with friends — each person can contribute any amount</p>
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={createGift}
                className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Gift size={20} /> Create Group Gift Campaign
              </motion.button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
              <div className="bg-white rounded-3xl p-8 shadow-xl space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={44} className="text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    Gift Campaign Created! 🎉
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Campaign ID: <span className="font-mono font-bold text-gray-800">{giftId}</span></p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-left text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Cake</span><span className="font-bold">{selectedCake.emoji} {selectedCake.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Target</span><span className="font-bold">₹{selectedCake.price}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Organised by</span><span className="font-bold">{form.organisedBy}</span></div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Share this link with your friends:</p>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <LinkIcon size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-600 flex-1 truncate font-mono">{giftLink}</span>
                    <button onClick={copyLink} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all hover:brightness-90"
                      style={{ backgroundColor: "var(--color-primary)" }}>
                      {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <Link href={`/group-gift/${giftId}`}
                    className="py-2.5 px-6 rounded-full text-white text-sm font-semibold hover:brightness-95"
                    style={{ backgroundColor: "var(--color-primary)" }}>
                    View Campaign
                  </Link>
                  <button onClick={() => { setStep("create"); setGiftId(""); setForm({ occasion: "", organisedBy: "", message: "" }); }}
                    className="py-2.5 px-6 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                    Start Another
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
