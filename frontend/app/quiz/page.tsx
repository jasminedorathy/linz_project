"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, RefreshCw, Sparkles } from "lucide-react";

const questions = [
  {
    id: "occasion",
    question: "What's the occasion? 🎉",
    subtitle: "Help us set the mood right",
    options: [
      { id: "birthday", label: "🎂 Birthday", value: "birthday" },
      { id: "wedding", label: "💍 Wedding / Engagement", value: "wedding" },
      { id: "anniversary", label: "💑 Anniversary", value: "anniversary" },
      { id: "corporate", label: "🏢 Corporate Event", value: "corporate" },
      { id: "justbecause", label: "🌸 Just Because!", value: "justbecause" },
    ],
  },
  {
    id: "vibe",
    question: "Pick your vibe ✨",
    subtitle: "What feeling do you want this cake to give?",
    options: [
      { id: "indulgent", label: "🍫 Rich & Indulgent", value: "indulgent" },
      { id: "fresh", label: "🍋 Light & Fresh", value: "fresh" },
      { id: "elegant", label: "🤍 Classic & Elegant", value: "elegant" },
      { id: "bold", label: "🔥 Bold & Adventurous", value: "bold" },
    ],
  },
  {
    id: "flavour",
    question: "Your flavour soul 👅",
    subtitle: "Which family speaks to you?",
    options: [
      { id: "chocolate", label: "🍫 Chocolate & Coffee", value: "chocolate" },
      { id: "fruit", label: "🍓 Fruits & Florals", value: "fruit" },
      { id: "vanilla", label: "🍦 Vanilla & Cream", value: "vanilla" },
      { id: "caramel", label: "🍯 Caramel & Toffee", value: "caramel" },
    ],
  },
  {
    id: "colour",
    question: "Choose a colour palette 🎨",
    subtitle: "Colours speak louder than words",
    options: [
      { id: "pastel", label: "🌸 Soft Pastels", value: "pastel" },
      { id: "jewel", label: "💎 Rich Jewel Tones", value: "jewel" },
      { id: "white", label: "🤍 Classic White & Gold", value: "white" },
      { id: "earth", label: "🍂 Warm Earthy Tones", value: "earth" },
    ],
  },
  {
    id: "size",
    question: "How many people? 👥",
    subtitle: "So we pick the right size",
    options: [
      { id: "solo", label: "👤 Just Me", value: "solo" },
      { id: "small", label: "👨‍👩‍👧 5–10 People", value: "small" },
      { id: "medium", label: "🎊 15–20 People", value: "medium" },
      { id: "large", label: "🎉 30+ People", value: "large" },
    ],
  },
];

interface Recommendation {
  name: string;
  emoji: string;
  description: string;
  tag: string;
  link: string;
  colour: string;
}

function getRecommendation(answers: Record<string, string>): Recommendation {
  const { vibe, flavour, occasion, colour } = answers;

  if (occasion === "wedding" || colour === "white") {
    return {
      name: "Bespoke Wedding Cake",
      emoji: "💍",
      description: "An elegant multi-tier masterpiece — customised with your chosen palette, floral accents & premium fondant finish. Crafted to make your day unforgettable.",
      tag: "Most Popular · Wedding",
      link: "/custom-cake",
      colour: "#B09060",
    };
  }
  if (flavour === "chocolate" || vibe === "indulgent") {
    return {
      name: "Double Chocolate Decadence Cake",
      emoji: "🍫",
      description: "Four layers of rich Belgian chocolate sponge, filled with dark ganache and finished with smooth chocolate buttercream. Pure indulgence.",
      tag: "Bestseller · All Occasions",
      link: "/menu",
      colour: "#5C3317",
    };
  }
  if (flavour === "caramel" || vibe === "bold") {
    return {
      name: "Salted Caramel Drip Cake",
      emoji: "🍯",
      description: "A showstopper! Luscious caramel sponge, silky buttercream, a generous salted caramel drip, and golden decorations. Bold, beautiful, unforgettable.",
      tag: "Trending · Birthday",
      link: "/menu",
      colour: "#C87941",
    };
  }
  if (flavour === "fruit" || vibe === "fresh") {
    return {
      name: "Zesty Lemon Berry Cake",
      emoji: "🍓",
      description: "A light, airy lemon sponge with fresh raspberry compote filling, topped with seasonal berries and a cloud of lemon cream. Sunshine in every slice!",
      tag: "Summer Favourite",
      link: "/menu",
      colour: "#E8A020",
    };
  }
  return {
    name: "Madagascar Vanilla Dream Cake",
    emoji: "🍦",
    description: "The timeless classic — fragrant vanilla bean sponge with silky smooth buttercream, fresh flowers, and a touch of gold leaf. Elegant in its simplicity.",
    tag: "Classic Choice · Any Occasion",
    link: "/menu",
    colour: "#A07848",
  };
}

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const q = questions[step];
  const progress = ((step) / questions.length) * 100;

  const handleSelect = (value: string) => {
    setSelected(value);
    setTimeout(() => {
      const newAnswers = { ...answers, [q.id]: value };
      setAnswers(newAnswers);
      setSelected(null);
      if (step + 1 < questions.length) {
        setStep((s) => s + 1);
      } else {
        setFinished(true);
      }
    }, 350);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setSelected(null);
    setFinished(false);
  };

  const recommendation = finished ? getRecommendation(answers) : null;

  return (
    <>
      <section
        className="py-16 text-center"
        style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}
      >
        <span className="block text-4xl mb-2" style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}>
          Find Your Cake
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Cake Personality Quiz
        </h1>
        <p className="text-white/50 text-sm mt-2">5 quick questions · Get your perfect cake match</p>
      </section>

      <section className="py-20 bg-gray-50 min-h-[600px] flex items-center justify-center">
        <div className="w-full max-w-2xl mx-6">
          {!finished ? (
            <div className="space-y-8">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400 font-semibold">
                  <span>Question {step + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}% done</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "var(--color-primary)" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 shadow-sm space-y-6"
                >
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                      {q.question}
                    </h2>
                    <p className="text-sm text-gray-400">{q.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt) => (
                      <motion.button
                        key={opt.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSelect(opt.value)}
                        className={`p-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all flex items-center gap-3 ${
                          selected === opt.value
                            ? "border-amber-600 bg-amber-50 scale-98"
                            : "border-gray-200 bg-gray-50 hover:border-amber-300"
                        }`}
                      >
                        <span className="text-2xl">{opt.label.split(" ")[0]}</span>
                        <span className="text-gray-800">{opt.label.split(" ").slice(1).join(" ")}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : recommendation ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 shadow-xl space-y-6 text-center"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Perfect Match 🎯</p>
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto my-4 shadow-inner"
                    style={{ backgroundColor: `${recommendation.colour}22` }}
                  >
                    {recommendation.emoji}
                  </div>
                  <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)", color: recommendation.colour }}>
                    {recommendation.name}
                  </h2>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ backgroundColor: recommendation.colour }}>
                    {recommendation.tag}
                  </span>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
                  {recommendation.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    href={recommendation.link}
                    className="flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-white font-bold text-sm hover:brightness-95 transition-all"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <Sparkles size={16} /> Order This Cake
                  </Link>
                  <button
                    onClick={restart}
                    className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-full border-2 border-gray-200 font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <RefreshCw size={14} /> Retake Quiz
                  </button>
                </div>

                <p className="text-xs text-gray-300 mt-2">Share your result with friends! ✨</p>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </section>
    </>
  );
}
