"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import SectionHeading from "@/components/ui/SectionHeading";
import { ZoomIn } from "lucide-react";

const galleryImages = [
  { src: "/images/cake-1.png",    alt: "Classic Chocolate Cake",  caption: "Chocolate Layer Cake" },
  { src: "/images/cake-2.png",    alt: "Strawberry Shortcake",    caption: "Strawberry Shortcake" },
  { src: "/images/pastry-1.png",  alt: "Almond Croissant",        caption: "Almond Croissant" },
  { src: "/images/pastry-2.png",  alt: "Blueberry Muffin",        caption: "Blueberry Muffin" },
  { src: "/images/drink-1.png",   alt: "Caramel Macchiato",       caption: "Caramel Macchiato" },
  { src: "/images/about-main.png",alt: "Our Bakery Kitchen",      caption: "Our Kitchen" },
  { src: "/images/blog-1.png",    alt: "Chocolate Baking",        caption: "Baking Process" },
  { src: "/images/blog-2.png",    alt: "Berry Tart",              caption: "Summer Berry Tart" },
  { src: "/images/blog-3.png",    alt: "Croissant Dough",         caption: "Croissant Making" },
];

export default function GalleryPage() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = galleryImages.map((img) => ({ src: img.src, alt: img.alt }));

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
          Our Work
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Photo Gallery
        </h1>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center">
            <SectionHeading
              subtitle="Sweet Moments"
              title="A Taste of What We Do"
              description="Every creation tells a story. Click any image to view it in full."
              align="center"
            />
          </div>

          {/* Masonry-style grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="relative group overflow-hidden rounded-2xl cursor-pointer break-inside-avoid"
                onClick={() => { setIndex(i); setOpen(true); }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-pink-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <ZoomIn size={24} color="#fff" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-pink-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Lightbox open={open} close={() => setOpen(false)} index={index} slides={slides} />
    </>
  );
}
