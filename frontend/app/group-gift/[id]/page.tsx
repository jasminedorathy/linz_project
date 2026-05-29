"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { IndianRupee, Heart, Users, CheckCircle2, Gift } from "lucide-react";
import Link from "next/link";

export default function GroupGiftContributePage() {
  const params = useParams();
  const giftId = params.id as string;
  const [gift, setGift] = useState<any>(null);
  const [contributed, setContributed] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const gifts = JSON.parse(localStorage.getItem("bellaria_gifts") || "[]");
    const found = gifts.find((g: any) => g.id === giftId);
    setGift(found || null);
  }, [giftId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt < 10) e.amount = "Minimum contribution is ₹10";
    if (gift && amt > gift.target) e.amount = `Max is ₹${gift.target}`;
    return e;
  };

  const contribute = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const gifts = JSON.parse(localStorage.getItem("bellaria_gifts") || "[]");
    const updated = gifts.map((g: any) => {
      if (g.id === giftId) {
        const newCollected = Math.min(g.collected + parseFloat(form.amount), g.target);
        return {
          ...g,
          collected: newCollected,
          contributors: [...g.contributors, { name: form.name, amount: parseFloat(form.amount), at: new Date().toLocaleDateString("en-IN") }],
        };
      }
      return g;
    });
    localStorage.setItem("bellaria_gifts", JSON.stringify(updated));
    const updatedGift = updated.find((g: any) => g.id === giftId);
    setGift(updatedGift);
    setContributed(true);
  };

  if (!gift) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4 text-center min-h-screen bg-gray-50">
        <Gift size={52} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-400">Campaign Not Found</h2>
        <p className="text-sm text-gray-400 max-w-xs">This gift campaign may have expired or the link is incorrect.</p>
        <Link href="/group-gift" className="py-2.5 px-6 rounded-full text-white text-sm font-semibold" style={{ backgroundColor: "var(--color-primary)" }}>
          Start a New Campaign
        </Link>
      </div>
    );
  }

  const percent = Math.min(Math.round((gift.collected / gift.target) * 100), 100);
  const remaining = gift.target - gift.collected;
  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-amber-200 bg-white";

  return (
    <>
      <section className="py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}>
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          🎁 Group Cake Gift
        </h1>
        <p className="text-white/50 text-sm mt-2">Campaign {gift.id}</p>
      </section>

      <section className="py-16 bg-gray-50 min-h-[600px]">
        <div className="max-w-lg mx-auto px-6 space-y-6">

          {/* Gift summary card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-5">
            <div className="text-center space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Organised by {gift.organisedBy}</p>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{gift.occasion}</h2>
              {gift.message && <p className="text-sm text-gray-500 italic mt-2">"{gift.message}"</p>}
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-3xl">{gift.cake.emoji}</span>
              <div>
                <p className="font-bold text-sm text-gray-800">{gift.cake.name}</p>
                <p className="text-xs text-gray-500">Target: ₹{gift.target.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-gray-600">₹{gift.collected.toLocaleString("en-IN")} collected</span>
                <span style={{ color: "var(--color-primary)" }}>{percent}%</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: "var(--color-primary)" }}
                  animate={{ width: `${percent}%` }} transition={{ duration: 0.8 }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1"><Users size={11} /> {gift.contributors.length} contributors</span>
                {remaining > 0 && <span>₹{remaining.toLocaleString("en-IN")} remaining</span>}
                {remaining <= 0 && <span className="text-green-600 font-bold">🎉 Goal Reached!</span>}
              </div>
            </div>

            {/* Contributors list */}
            {gift.contributors.length > 0 && (
              <div className="border-t pt-4 space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Contributors</p>
                {gift.contributors.map((c: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                      <Heart size={11} className="text-rose-400" /> {c.name}
                    </span>
                    <span className="font-bold text-gray-800">₹{c.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contribute form */}
          {!contributed ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                Add Your Contribution 💝
              </h3>
              <div>
                <input className={inputClass} placeholder="Your Name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="relative">
                <IndianRupee size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input className={`${inputClass} pl-9`} placeholder="Amount (₹)" type="number" min="10"
                  value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>
              <div className="flex gap-2 flex-wrap">
                {[100, 200, 500].map((amt) => (
                  <button key={amt} onClick={() => setForm({ ...form, amount: String(amt) })}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors">
                    ₹{amt}
                  </button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={contribute}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--color-primary)" }}>
                <Heart size={16} /> Contribute with Love
              </motion.button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-sm text-center space-y-4">
              <CheckCircle2 size={44} className="text-green-500 mx-auto" />
              <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Thank you, {form.name}! 🎉
              </h3>
              <p className="text-sm text-gray-500">Your contribution of <strong>₹{form.amount}</strong> has been added.</p>
              <Link href="/" className="inline-block py-2.5 px-6 rounded-full text-white text-sm font-semibold hover:brightness-95"
                style={{ backgroundColor: "var(--color-primary)" }}>
                Back to Home
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
