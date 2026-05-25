import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import StatsSection from "@/components/sections/StatsSection";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About Us | Bellaria Cakes & Bakery",
  description: "Learn the story behind Bellaria — our passion, our team, and our commitment to handcrafted excellence.",
};

const team = [
  { name: "Sarah Bellini", role: "Head Baker & Founder", image: "/images/avatar-1.png" },
  { name: "Marco Chen",    role: "Pastry Chef",          image: "/images/avatar-2.png" },
  { name: "Emily Davis",   role: "Cake Designer",        image: "/images/avatar-3.png" },
];

export default function AboutPage() {
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
          Our Story
        </span>
        <h1
          className="text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          About Bellaria
        </h1>
      </section>

      <AboutSection />
      <FeaturesSection />
      <StatsSection />

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center">
            <SectionHeading subtitle="Our People" title="Meet the Team" align="center" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-4">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center gap-4 text-center">
                <div
                  className="w-36 h-36 rounded-full overflow-hidden border-4"
                  style={{ borderColor: "var(--color-primary)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-lg" style={{ fontFamily: "var(--font-heading)" }}>{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
