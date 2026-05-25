"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#1a1008" }}
    >
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(195,146,95,0.18) 0%, transparent 70%), linear-gradient(135deg, rgba(26,16,8,0.95) 0%, rgba(50,28,8,0.85) 100%)",
        }}
      />

      {/* Decorative circles */}
      <div
        className="absolute top-24 right-16 w-72 h-72 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: "var(--color-primary)" }}
      />
      <div
        className="absolute bottom-16 left-10 w-56 h-56 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: "var(--color-primary)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Script subtitle */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="block text-5xl mb-4"
          style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}
        >
          Welcome to Bellaria
        </motion.span>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Baked with{" "}
          <span style={{ color: "var(--color-primary)" }}>Love</span>
          ,<br />
          Crafted with{" "}
          <span style={{ color: "var(--color-primary)" }}>Passion</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Discover our world of handcrafted cakes, artisan pastries, and freshly baked delights — made fresh every morning for every special moment.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/menu"
              id="hero-explore-menu-btn"
              className="inline-block text-white font-semibold px-8 py-4 rounded-full text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Explore Our Menu
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/contact"
              id="hero-order-btn"
              className="inline-block font-semibold px-8 py-4 rounded-full text-base border-2 text-white transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.4)" }}
            >
              Order a Custom Cake
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 cursor-pointer"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
