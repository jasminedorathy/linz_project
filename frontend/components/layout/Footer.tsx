import Link from "next/link";
import { Share2, Camera, MessageCircle, Play, MapPin, Phone, Mail, Clock } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/menu", label: "Our Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const services = [
  "Custom Cakes",
  "Wedding Cakes",
  "Birthday Cakes",
  "Pastries & Breads",
  "Catering",
  "Gift Hampers",
];

const socialLinks = [
  { icon: Share2, href: "#", label: "Facebook" },
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: Play, href: "#", label: "YouTube" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#1a1008", color: "rgba(255,255,255,0.7)" }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="flex flex-col gap-5">
          <div>
            <span
              className="text-4xl block leading-none"
              style={{ fontFamily: "var(--font-script)", color: "var(--color-primary)" }}
            >
              Bellaria
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1 block">
              Cakes & Bakery
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Handcrafted with love since 2010. Every cake tells a story — let us make yours unforgettable.
          </p>
          {/* Social icons */}
          <div className="flex gap-3 mt-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            className="text-white font-semibold mb-5 text-sm uppercase tracking-widest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 group"
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4
            className="text-white font-semibold mb-5 text-sm uppercase tracking-widest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Services
          </h4>
          <ul className="flex flex-col gap-2">
            {services.map((service) => (
              <li key={service} className="text-sm flex items-center gap-2">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4
            className="text-white font-semibold mb-5 text-sm uppercase tracking-widest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contact Us
          </h4>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-3 text-sm">
              <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
              <span>42, Anna Salai, Nungambakkam, Chennai – 600 006, Tamil Nadu</span>
            </li>
            <li className="flex gap-3 text-sm">
              <Phone size={16} className="flex-shrink-0" style={{ color: "var(--color-primary)" }} />
              <a href="tel:+919876543210" className="hover:text-[var(--color-primary)] transition-colors">
                +91 98765 43210
              </a>
            </li>
            <li className="flex gap-3 text-sm">
              <Mail size={16} className="flex-shrink-0" style={{ color: "var(--color-primary)" }} />
              <a href="mailto:hello@bellaria.in" className="hover:text-[var(--color-primary)] transition-colors">
                hello@bellaria.in
              </a>
            </li>
            <li className="flex gap-3 text-sm">
              <Clock size={16} className="flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
              <span>Mon–Sat: 8:00 AM – 9:00 PM<br />Sun: 9:00 AM – 6:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>&copy; {year} Bellaria Cakes & Bakery. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
