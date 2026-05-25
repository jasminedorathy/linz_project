"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Phone, Mail } from "lucide-react";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div
        className="hidden md:flex items-center justify-between px-8 py-2 text-xs"
        style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
      >
        <div className="flex items-center gap-6">
          <a href="tel:+15551234567" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Phone size={12} />
            +1 (555) 123-4567
          </a>
          <a href="mailto:hello@bellaria.com" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Mail size={12} />
            hello@bellaria.com
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span>Mon – Sat: 7:00 AM – 9:00 PM</span>
        </div>
      </div>

      {/* Main header */}
      <motion.header
        initial={false}
        animate={
          scrolled
            ? { backgroundColor: "rgba(255,255,255,0.97)", boxShadow: "0 2px 24px rgba(0,0,0,0.10)" }
            : { backgroundColor: "rgba(255,255,255,0.0)", boxShadow: "0 0 0 rgba(0,0,0,0)" }
        }
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-30 w-full"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span
              className="text-4xl leading-none"
              style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}
            >
              Bellaria
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mt-0.5">
              Cakes & Bakery
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors group"
                  style={{ color: isActive ? "var(--color-primary)" : "var(--color-text)" }}
                >
                  {link.label}
                  {/* Underline slide-in */}
                  <span
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full origin-left transition-transform duration-300"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                  <span
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/contact"
                className="text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Order Now
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} color="var(--color-text)" />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
