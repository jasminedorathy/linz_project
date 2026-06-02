"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";

const stats = [
  { end: 12000, suffix: "+", label: "Cakes Delivered" },
  { end: 15, suffix: "+", label: "Years of Experience" },
  { end: 98, suffix: "%", label: "Happy Customers" },
  { end: 50, suffix: "+", label: "Unique Flavours" },
];

export default function StatsSection() {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: "#1a1008" }}
    >
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-primary) 0, var(--color-primary) 1px, transparent 0, transparent 50%)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
