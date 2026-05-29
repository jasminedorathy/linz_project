"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

interface Festival {
  id: string;
  name: string;
  emoji: string;
  date: string;
  dateObj: Date;
  theme: string;
  description: string;
  colour: string;
  bgColour: string;
  cakes: { name: string; price: string; desc: string }[];
}

const FESTIVALS: Festival[] = [
  {
    id: "eid",
    name: "Eid al-Adha",
    emoji: "🌙",
    date: "6 Jun 2026",
    dateObj: new Date("2026-06-06"),
    theme: "Saffron & Rose",
    description: "Celebrate Eid with our special Middle-Eastern inspired creations — fragrant with saffron, pistachio and rose water.",
    colour: "#7C3AED",
    bgColour: "#EDE9FE",
    cakes: [
      { name: "Saffron Pistachio Cake", price: "₹1,400", desc: "Fragrant saffron sponge with pistachio cream" },
      { name: "Rose Water Baklava Cake", price: "₹1,600", desc: "Honey, rose and walnut layered delight" },
      { name: "Dates & Cardamom Cake", price: "₹1,200", desc: "Rich date paste with cardamom buttercream" },
    ],
  },
  {
    id: "independence",
    name: "Independence Day",
    emoji: "🇮🇳",
    date: "15 Aug 2026",
    dateObj: new Date("2026-08-15"),
    theme: "Tiranga Edition",
    description: "A special tricolour collection to celebrate India's independence. Saffron, white and green — baked with pride.",
    colour: "#FF6B00",
    bgColour: "#FFF3E0",
    cakes: [
      { name: "Tiranga Layer Cake", price: "₹1,800", desc: "3-layer saffron, vanilla & pista sponge" },
      { name: "Mango Kesari Cake", price: "₹1,100", desc: "Alphonso mango with saffron cream" },
      { name: "Pistachio & Coconut Cake", price: "₹950", desc: "Festive green pistachio cake" },
    ],
  },
  {
    id: "onam",
    name: "Onam",
    emoji: "🌸",
    date: "5 Sep 2026",
    dateObj: new Date("2026-09-05"),
    theme: "Floral & Traditional",
    description: "Celebrate the harvest festival with our Kerala-inspired collection — coconut, banana, and fresh tropical flavours.",
    colour: "#059669",
    bgColour: "#D1FAE5",
    cakes: [
      { name: "Coconut Banana Cake", price: "₹900", desc: "Fresh coconut cream with ripe banana sponge" },
      { name: "Payasam Cake", price: "₹1,100", desc: "Classic milk & cardamom inspired cake" },
      { name: "Jackfruit & Jaggery Cake", price: "₹1,000", desc: "Traditional flavours in a modern form" },
    ],
  },
  {
    id: "navratri",
    name: "Navratri / Dussehra",
    emoji: "🪔",
    date: "13 Oct 2026",
    dateObj: new Date("2026-10-13"),
    theme: "Festive Glow",
    description: "Nine nights of celebration deserve nine-fold indulgence. Our Navratri specials use no onion/garlic and are perfect for all.",
    colour: "#D97706",
    bgColour: "#FEF3C7",
    cakes: [
      { name: "Sabudana & Coconut Cake", price: "₹850", desc: "Vrat-friendly festive dessert cake" },
      { name: "Kesar Rabdi Cake", price: "₹1,200", desc: "Saffron milk reduction layered cake" },
      { name: "Dry Fruit & Honey Cake", price: "₹1,300", desc: "Loaded with cashews, almonds, raisins" },
    ],
  },
  {
    id: "diwali",
    name: "Diwali",
    emoji: "✨",
    date: "20 Oct 2026",
    dateObj: new Date("2026-10-20"),
    theme: "Mithai Fusion",
    description: "Brighten the Festival of Lights with our Diwali exclusive collection — traditional Indian sweets reimagined as premium cakes.",
    colour: "#B45309",
    bgColour: "#FEF3C7",
    cakes: [
      { name: "Gulab Jamun Drip Cake", price: "₹1,600", desc: "Soft gulab jamun embedded in rose sponge" },
      { name: "Kaju Katli Fusion Cake", price: "₹2,000", desc: "White cashew fudge layered masterpiece" },
      { name: "Motichoor Laddoo Cake", price: "₹1,800", desc: "Orange boondi-inspired celebration cake" },
    ],
  },
  {
    id: "christmas",
    name: "Christmas",
    emoji: "🎄",
    date: "25 Dec 2026",
    dateObj: new Date("2026-12-25"),
    theme: "Winter Spice",
    description: "Our beloved Christmas collection returns with gingerbread, cinnamon, cranberry and festive plum goodness.",
    colour: "#DC2626",
    bgColour: "#FEE2E2",
    cakes: [
      { name: "Plum Christmas Cake", price: "₹1,500", desc: "Dark rum-soaked fruits & spiced sponge" },
      { name: "Gingerbread Vanilla Log", price: "₹1,300", desc: "Yule log with ginger cream filling" },
      { name: "Cranberry White Chocolate", price: "₹1,400", desc: "Tart cranberry & creamy white choc" },
    ],
  },
  {
    id: "newyear",
    name: "New Year",
    emoji: "🎆",
    date: "1 Jan 2027",
    dateObj: new Date("2027-01-01"),
    theme: "Champagne & Gold",
    description: "Ring in the New Year with our most glamorous, gold-dusted celebration cakes. The perfect centrepiece for your party.",
    colour: "#92400E",
    bgColour: "#FEF3C7",
    cakes: [
      { name: "Gold Leaf Celebration Cake", price: "₹2,500", desc: "4-tier sequined gold fondant masterpiece" },
      { name: "Bubbly Champagne Cake", price: "₹1,800", desc: "Champagne-infused buttercream & lychee" },
      { name: "Midnight Black Forest", price: "₹1,600", desc: "Dark cherry & cream noir elegance" },
    ],
  },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, mins: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [targetDate]);

  return timeLeft;
}

function FestivalCard({ f, isNext }: { f: Festival; isNext: boolean }) {
  const countdown = useCountdown(f.dateObj);
  const isPast = f.dateObj < new Date();
  const [open, setOpen] = useState(isNext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl overflow-hidden border-2 transition-all ${isNext ? "border-amber-400 shadow-xl" : "border-gray-100 shadow-sm"}`}
      style={{ backgroundColor: f.bgColour }}
    >
      {isNext && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: f.colour }}>
          <Sparkles size={12} /> Next Upcoming Festival
        </div>
      )}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{f.emoji}</span>
            <div>
              <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: f.colour }}>{f.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                <Calendar size={11} /> {f.date} · {f.theme}
              </div>
            </div>
          </div>
          {!isPast && (
            <div className="text-right flex-shrink-0">
              <div className="flex gap-2">
                {[{ v: countdown.days, l: "d" }, { v: countdown.hours, l: "h" }, { v: countdown.mins, l: "m" }].map(({ v, l }) => (
                  <div key={l} className="text-center">
                    <div className="text-lg font-extrabold leading-none" style={{ color: f.colour }}>{v}</div>
                    <div className="text-[9px] text-gray-400 font-bold">{l}</div>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-gray-400 mt-1 flex items-center justify-end gap-0.5"><Clock size={9} />Countdown</p>
            </div>
          )}
          {isPast && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Passed</span>}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>

        <button onClick={() => setOpen(!open)}
          className="text-xs font-bold flex items-center gap-1 transition-colors hover:opacity-70"
          style={{ color: f.colour }}>
          {open ? "▲ Hide" : "▼ View"} Special Menu ({f.cakes.length} items)
        </button>

        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {f.cakes.map((cake, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 space-y-1 border border-white">
                <p className="font-bold text-sm text-gray-800">{cake.name}</p>
                <p className="text-xs text-gray-500 leading-snug">{cake.desc}</p>
                <p className="font-bold text-sm mt-1" style={{ color: f.colour }}>{cake.price}</p>
              </div>
            ))}
          </motion.div>
        )}

        {!isPast && (
          <Link href="/custom-cake"
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full text-white text-xs font-bold hover:brightness-95 transition-all"
            style={{ backgroundColor: f.colour }}>
            <ShoppingBag size={13} /> Pre-Order for {f.name}
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function FestivePage() {
  const now = new Date();
  const upcoming = FESTIVALS.filter((f) => f.dateObj >= now).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  const nextFestival = upcoming[0];

  return (
    <>
      <section className="py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}>
        <span className="block text-4xl mb-2" style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}>
          Celebrate Every Moment
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Festive Calendar 🪔
        </h1>
        <p className="text-white/50 text-sm mt-2">Special limited-edition collections for every Indian festival</p>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          {FESTIVALS.map((f) => (
            <FestivalCard key={f.id} f={f} isNext={nextFestival?.id === f.id} />
          ))}
        </div>
      </section>
    </>
  );
}
