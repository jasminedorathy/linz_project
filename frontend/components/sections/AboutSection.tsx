"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { CheckCircle2 } from "lucide-react";

const highlights = [
  "100% natural ingredients, no preservatives",
  "Custom designs for every occasion",
  "Experienced bakers with 15+ years in the craft",
  "Made fresh daily — never frozen",
];

export default function AboutSection() {
  return (
    <section className="py-24 overflow-hidden" style={{ backgroundColor: "var(--color-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/about-main.png"
              alt="Our bakery kitchen"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl px-6 py-5 flex flex-col items-center"
          >
            <span
              className="text-5xl font-bold leading-none"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-primary)" }}
            >
              15+
            </span>
            <span className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Years of Baking</span>
          </motion.div>
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6"
        >
          <SectionHeading
            subtitle="Our Story"
            title="A Passion for Baking, A Love for People"
            align="left"
          />

          <p className="text-gray-600 leading-relaxed">
            Linz Baking was born in a small home kitchen in 2010, driven by a simple belief: that every occasion deserves a truly exceptional cake. Today, our boutique bakery serves hundreds of happy families, couples, and businesses with the same warmth and dedication.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We source the finest local ingredients, collaborate closely with our clients, and pour our hearts into every creation — from a simple birthday cupcake to a 7-tier wedding masterpiece.
          </p>

          {/* Highlights */}
          <ul className="flex flex-col gap-3 mt-2">
            {highlights.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-gray-700">
                <CheckCircle2
                  size={18}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: "var(--color-primary)" }}
                />
                {point}
              </li>
            ))}
          </ul>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="mt-2 self-start">
            <Link
              href="/about"
              id="about-learn-more-btn"
              className="inline-block text-white font-semibold px-8 py-3 rounded-full"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Learn More About Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
