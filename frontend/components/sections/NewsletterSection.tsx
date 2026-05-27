"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("http://localhost:5000/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "12px 12px",
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        <span className="text-5xl text-white/80" style={{ fontFamily: "var(--font-script)" }}>
          Stay Sweet
        </span>
        <h2
          className="text-3xl md:text-4xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Subscribe for Recipes & Offers
        </h2>
        <p className="text-white/80 text-base max-w-md">
          Join our community and get early access to seasonal specials, baking tips, and exclusive discounts.
        </p>

        {status === "success" ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-semibold bg-white/20 px-6 py-3 rounded-full"
          >
            {message}
          </motion.p>
        ) : (
          <form
            onSubmit={handleSubmit}
            id="newsletter-form"
            className="flex flex-col sm:flex-row gap-3 w-full max-w-lg"
          >
            <input
              type="email"
              id="newsletter-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-full bg-white text-gray-700 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/50"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={status === "loading"}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#1a1008" }}
            >
              <Send size={15} />
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </motion.button>
          </form>
        )}

        {status === "error" && (
          <p className="text-white/80 text-sm">{message}</p>
        )}
      </div>
    </section>
  );
}
