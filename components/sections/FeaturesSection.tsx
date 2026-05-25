"use client";

import { motion } from "framer-motion";
import { Wheat, Heart, Award, Clock, Leaf, ShoppingBag } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const features = [
  {
    icon: Wheat,
    title: "Premium Ingredients",
    description: "We use only the finest local flour, farm-fresh eggs, and real butter — never shortcuts.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every product is handcrafted by our passionate bakers who treat each order as their own.",
  },
  {
    icon: Award,
    title: "Award-Winning Recipes",
    description: "Our signature recipes have won multiple regional bakery competitions since 2015.",
  },
  {
    icon: Clock,
    title: "Freshly Baked Daily",
    description: "Everything is baked fresh each morning. No freezing, no preservatives — ever.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Packaging",
    description: "We care for the planet. All our packaging is biodegradable and sustainably sourced.",
  },
  {
    icon: ShoppingBag,
    title: "Custom Orders Welcome",
    description: "Tell us your vision and we'll bring it to life — any shape, size, flavour, or occasion.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center">
          <SectionHeading
            subtitle="Why Choose Us"
            title="What Makes Bellaria Special"
            description="More than a bakery — we're a place where every bite tells a story and every cake is a memory waiting to happen."
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col items-start gap-4 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: "#FAFAF8" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors group-hover:scale-110 duration-300"
                style={{ backgroundColor: "var(--color-secondary)" }}
              >
                <feature.icon size={26} style={{ color: "var(--color-primary)" }} />
              </div>
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
