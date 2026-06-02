import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data/blogData";
import { Calendar, ArrowLeft, Tag } from "lucide-react";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found | Linz Baking" };
  return {
    title: `${post.title} | Linz Baking Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article>
      {/* Hero image */}
      <div className="relative h-72 md:h-96 w-full">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
          >
            {post.category}
          </span>
          <h1
            className="text-3xl md:text-5xl font-bold text-white max-w-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
          <span className="flex items-center gap-2"><Calendar size={14} />{post.date}</span>
          <span className="flex items-center gap-2"><Tag size={14} />{post.category}</span>
        </div>

        <p className="text-lg text-gray-600 leading-relaxed mb-6">{post.excerpt}</p>
        <p className="text-base text-gray-600 leading-relaxed mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ornare dui at velit tincidunt, vel blandit nibh feugiat. Vivamus vel arcu vel ligula scelerisque facilisis. Phasellus tincidunt, enim nec bibendum fermentum, est sapien tincidunt leo, non vehicula libero turpis in libero.
        </p>
        <p className="text-base text-gray-600 leading-relaxed mb-6">
          Sed fermentum, libero non tincidunt mollis, est nisi molestie lorem, a pellentesque leo est non lorem. Donec eget ante a nisi dignissim tincidunt. Nullam at velit id arcu elementum vulputate. Aenean vel lorem vel nunc feugiat interdum.
        </p>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-semibold mt-4"
          style={{ color: "var(--color-primary)" }}
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    </article>
  );
}
