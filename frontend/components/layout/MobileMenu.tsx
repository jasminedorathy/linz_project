"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/quiz", label: "🎂 Cake Quiz" },
  { href: "/festive", label: "🪤 Festive" },
  { href: "/community", label: "📸 Gallery" },
  { href: "/group-gift", label: "🎁 Group Gift" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

export default function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-pink-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "var(--color-secondary)" }}
            >
              <span
                className="text-3xl"
                style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}
              >
                Bellaria
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} color="#333" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col p-6 gap-1 flex-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block px-4 py-3 rounded-xl text-base font-medium transition-colors"
                    style={{
                      color: pathname === link.href ? "var(--color-primary)" : "var(--color-text)",
                      backgroundColor:
                        pathname === link.href ? "var(--color-secondary)" : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* CTA */}
            <div className="p-6 border-t" style={{ borderColor: "var(--color-secondary)" }}>
              <Link
                href="/contact"
                onClick={onClose}
                className="block w-full text-center text-white font-semibold py-3 rounded-full transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Order Now
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
