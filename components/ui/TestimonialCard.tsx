"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/lib/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-5 h-full">
      {/* Quote icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "var(--color-secondary)" }}
      >
        <Quote size={18} style={{ color: "var(--color-primary)" }} />
      </div>

      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < testimonial.rating ? "var(--color-primary)" : "transparent"}
            stroke={i < testimonial.rating ? "var(--color-primary)" : "#ccc"}
          />
        ))}
      </div>

      {/* Review text */}
      <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      {/* Customer */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
            {testimonial.name}
          </p>
          <p className="text-xs text-gray-400">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
