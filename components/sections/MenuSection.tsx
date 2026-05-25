"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import { menuItems } from "@/lib/data/menuData";

const categories = ["All", "Cakes", "Pastries", "Drinks"];

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section className="py-24" style={{ backgroundColor: "var(--color-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center">
          <SectionHeading
            subtitle="Our Menu"
            title="Sweet Creations for Every Occasion"
            description="From classic favourites to seasonal specials — browse our handcrafted selection."
            align="center"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              id={`menu-tab-${cat.toLowerCase()}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(cat)}
              className="px-6 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors duration-200"
              style={{
                backgroundColor: activeCategory === cat ? "var(--color-primary)" : "transparent",
                color: activeCategory === cat ? "#fff" : "var(--color-primary)",
                borderColor: "var(--color-primary)",
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Products Grid */}
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

        {/* View full menu link */}
        <div className="flex justify-center mt-12">
          <motion.a
            href="/menu"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block text-white font-semibold px-10 py-3.5 rounded-full"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            View Full Menu
          </motion.a>
        </div>
      </div>
    </section>
  );
}
