"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
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
      <div className="relative h-52 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div
          className="absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {post.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Calendar size={12} />
          <span>{post.date}</span>
        </div>

        <h3
          className="text-lg font-semibold mb-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          {post.title}
        </h3>

        <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          Read More
          <motion.span whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
            <ArrowRight size={14} />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}
