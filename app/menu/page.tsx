"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import { menuItems } from "@/lib/data/menuData";

const categories = ["All", "Cakes", "Pastries", "Drinks"];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Page hero */}
      <section
        className="py-24 text-center"
        style={{ background: "linear-gradient(135deg,#1a1008 0%,#3a1e08 100%)" }}
      >
        <span
          className="block text-5xl mb-3"
          style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}
        >
          What We Bake
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Our Full Menu
        </h1>
      </section>

      <section className="py-20" style={{ backgroundColor: "var(--color-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center">
            <SectionHeading
              subtitle="Handcrafted Selections"
              title="Browse Our Creations"
              description="Every item is made fresh daily. Filter by category to find your favourite."
              align="center"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                id={`menu-page-tab-${cat.toLowerCase()}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 shadow-xs cursor-pointer"
                style={{
                  backgroundColor: activeCategory === cat ? "var(--color-primary)" : "#ffffff",
                  color: activeCategory === cat ? "#ffffff" : "var(--color-primary)",
                  borderColor: activeCategory === cat ? "var(--color-primary)" : "rgba(194, 26, 67, 0.25)",
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((item, i) => (
                <ProductCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
