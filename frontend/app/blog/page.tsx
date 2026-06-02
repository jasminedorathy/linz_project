import type { Metadata } from "next";
import BlogCard from "@/components/ui/BlogCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { blogPosts } from "@/lib/data/blogData";

export const metadata: Metadata = {
  title: "Blog | Linz Baking Cakes & Bakery",
  description: "Baking tips, seasonal recipes, and behind-the-scenes stories from the Linz Baking kitchen.",
};

export default function BlogPage() {
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
          From Our Kitchen
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Our Blog
        </h1>
      </section>

      <section className="py-20" style={{ backgroundColor: "var(--color-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center">
            <SectionHeading
              subtitle="Stories & Recipes"
              title="Latest from Linz Baking"
              description="Discover tips, behind-the-scenes moments, and seasonal recipes from our master bakers."
              align="center"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
