"use client";

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  light?: boolean;
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[align];

  return (
    <div className={`flex flex-col gap-3 mb-12 ${alignClass}`}>
      <span
        className="text-4xl"
        style={{
          fontFamily: "var(--font-script)",
          color: "var(--color-primary)",
        }}
      >
        {subtitle}
      </span>

      <h2
        className="text-3xl md:text-4xl font-bold leading-tight"
        style={{
          fontFamily: "var(--font-heading)",
          color: light ? "#fff" : "var(--color-text)",
        }}
      >
        {title}
      </h2>

      {/* Decorative divider */}
      <div className="flex items-center gap-2 mt-1">
        <div
          className="h-[2px] w-12 rounded-full"
          style={{ backgroundColor: "var(--color-primary)" }}
        />
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--color-primary)" }}
        />
        <div
          className="h-[2px] w-12 rounded-full"
          style={{ backgroundColor: "var(--color-primary)" }}
        />
      </div>

      {description && (
        <p
          className="mt-2 max-w-xl text-base leading-relaxed"
          style={{ color: light ? "rgba(255,255,255,0.75)" : "#666" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
