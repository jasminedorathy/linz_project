"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogCard from "@/components/ui/BlogCard";
import { blogPosts } from "@/lib/data/blogData";
import Link from "next/link";

export default function BlogSection() {
  const latest = blogPosts.slice(0, 3);

  return (
    <section className="py-24" style={{ backgroundColor: "var(--color-secondary)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center">
          <SectionHeading
            subtitle="From Our Kitchen"
            title="Latest Stories & Recipes"
            description="Tips, tricks, and tales straight from our bakery."
            align="center"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latest.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/blog"
              id="blog-view-all-btn"
              className="inline-block text-white font-semibold px-10 py-3.5 rounded-full"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              View All Posts
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
