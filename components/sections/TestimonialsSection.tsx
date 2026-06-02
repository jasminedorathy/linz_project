"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/ui/TestimonialCard";
import { testimonials } from "@/lib/data/testimonialsData";

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-4 flex-wrap gap-4">
          <SectionHeading
            subtitle="Testimonials"
            title="What Our Customers Say"
            align="left"
          />
          {/* Arrow controls */}
          <div className="flex gap-3 mb-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("left")}
              id="testimonials-prev-btn"
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white group"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll("right")}
              id="testimonials-next-btn"
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* Scrollable carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="snap-start flex-shrink-0 w-80 md:w-96"
            >
              <TestimonialCard testimonial={t} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
