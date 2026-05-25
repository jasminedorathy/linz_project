"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { MenuItem } from "@/lib/types";

interface ProductCardProps {
  item: MenuItem;
  index?: number;
}

export default function ProductCard({ item, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {item.featured && (
          <div
            className="absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>
          {item.category}
        </span>
        <h3
          className="text-lg font-semibold mt-1 mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>
            ${item.price.toFixed(2)}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <ShoppingBag size={14} />
            Order
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
