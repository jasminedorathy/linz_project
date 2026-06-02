"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CakePreviewProps {
  shape: string;
  size: string;
  flavour: string;
  frosting: string;
  decorations: string[];
}

const FLAVOUR_COLORS: Record<string, { base: string; mid: string; dark: string; label: string }> = {
  vanilla:   { base: "#FFF8E1", mid: "#F5E6C8", dark: "#EDD89A", label: "Vanilla Cream" },
  chocolate: { base: "#6B3A2A", mid: "#4A2512", dark: "#2D1508", label: "Dark Chocolate" },
  redvelvet: { base: "#C0392B", mid: "#9B2335", dark: "#7B1A29", label: "Red Velvet" },
  lemon:     { base: "#FFF176", mid: "#F9DA76", dark: "#F0C620", label: "Lemon Zest" },
  caramel:   { base: "#D4A04A", mid: "#C08030", dark: "#9A6020", label: "Salted Caramel" },
};

const FROSTING_COLORS: Record<string, { top: string; drip: string; label: string }> = {
  buttercream_smooth: { top: "#FFF8E1", drip: "#F5E6C8", label: "Smooth Buttercream" },
  buttercream_rustic: { top: "#F5E6C8", drip: "#EDD89A", label: "Rustic Naked" },
  fondant:            { top: "#FFFDE7", drip: "#F0E68C", label: "Fondant" },
};

const DECORATION_ICONS: Record<string, { emoji: string; label: string }> = {
  fresh_berries:  { emoji: "🍓", label: "Berries" },
  macarons:       { emoji: "🍬", label: "Macarons" },
  piped_flowers:  { emoji: "🌸", label: "Flowers" },
  gold_leaf:      { emoji: "✨", label: "Gold Leaf" },
  chocolate_drip: { emoji: "🍫", label: "Choc Drip" },
};

export default function CakePreview({ shape, size, flavour, frosting, decorations }: CakePreviewProps) {
  const fc = FLAVOUR_COLORS[flavour] || FLAVOUR_COLORS.vanilla;
  const fr = FROSTING_COLORS[frosting] || FROSTING_COLORS.buttercream_smooth;
  const isTwoTier = size === "2tier";
  const isLarge = size === "10inch" || size === "2tier";
  const isSquare = shape === "square";
  const isHeart = shape === "heart";
  const svgH = isTwoTier ? 220 : 180;
  const cakeW = isLarge ? 160 : 140;
  const cakeH = 50;
  const baseY = svgH - 20;
  const topY = baseY - cakeH;
  const tierW = 90;
  const tierH = 42;
  const tier2Y = topY - tierH;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Live Preview</p>

      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="relative"
      >
        <svg viewBox={`0 0 240 ${svgH}`} width="200" height={svgH * 200 / 240} xmlns="http://www.w3.org/2000/svg">

          {/* Plate */}
          <ellipse cx="120" cy={baseY + 10} rx="92" ry="11" fill="#E8E0D0" />
          <ellipse cx="120" cy={baseY + 8} rx="90" ry="9" fill="#F5F0E8" />

          <AnimatePresence mode="wait">
            <motion.g key={`${flavour}-${shape}-${size}`}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>

              {/* === BOTTOM TIER === */}
              {isHeart ? (
                <path
                  d={`M120,${baseY - 4} C72,${baseY - 35} 62,${baseY - 55} 82,${baseY - 68} C98,${baseY - 78} 120,${baseY - 70} 120,${baseY - 70} C120,${baseY - 70} 142,${baseY - 78} 158,${baseY - 68} C178,${baseY - 55} 168,${baseY - 35} 120,${baseY - 4}Z`}
                  fill={fc.mid} stroke={fc.dark} strokeWidth="2"
                />
              ) : isSquare ? (
                <>
                  <rect x={120 - cakeW / 2} y={topY} width={cakeW} height={cakeH} rx="6" fill={fc.mid} stroke={fc.dark} strokeWidth="1.5" />
                  <rect x={120 - cakeW / 2} y={topY + cakeH / 2 - 3} width={cakeW} height="6" fill={fr.drip} opacity="0.6" />
                </>
              ) : (
                <>
                  {/* round cylinder */}
                  <ellipse cx="120" cy={baseY} rx={cakeW / 2} ry="10" fill={fc.dark} />
                  <rect x={120 - cakeW / 2} y={topY} width={cakeW} height={cakeH} fill={fc.mid} />
                  <ellipse cx="120" cy={topY} rx={cakeW / 2} ry="10" fill={fc.base} />
                  {/* filling stripe */}
                  <rect x={120 - cakeW / 2} y={topY + cakeH / 2 - 3} width={cakeW} height="6" fill={fr.drip} opacity="0.55" />
                </>
              )}

              {/* === TOP TIER (2-tier) === */}
              {isTwoTier && !isHeart && (
                isSquare ? (
                  <rect x={120 - tierW / 2} y={tier2Y} width={tierW} height={tierH} rx="5" fill={fc.base} stroke={fc.dark} strokeWidth="1.5" />
                ) : (
                  <>
                    <ellipse cx="120" cy={topY} rx={tierW / 2} ry="9" fill={fc.dark} />
                    <rect x={120 - tierW / 2} y={tier2Y} width={tierW} height={tierH} fill={fc.base} />
                    <ellipse cx="120" cy={tier2Y} rx={tierW / 2} ry="9" fill={fr.top} />
                  </>
                )
              )}

              {/* === FROSTING TOP === */}
              {!isHeart && !isTwoTier && (
                frosting === "fondant" ? (
                  isSquare
                    ? <rect x={120 - cakeW / 2} y={topY - 6} width={cakeW} height="10" rx="4" fill={fr.top} stroke="#E8D5A3" strokeWidth="1" />
                    : <ellipse cx="120" cy={topY} rx={cakeW / 2} ry="12" fill={fr.top} stroke="#E8D5A3" strokeWidth="1" />
                ) : frosting === "buttercream_rustic" ? (
                  <path
                    d={isSquare
                      ? `M${120 - cakeW / 2},${topY} Q${120 - cakeW / 4},${topY - 10} 120,${topY - 6} Q${120 + cakeW / 4},${topY - 2} ${120 + cakeW / 2},${topY - 8} L${120 + cakeW / 2},${topY} Z`
                      : `M${120 - cakeW / 2 + 10},${topY} Q120,${topY - 14} ${120 + cakeW / 2 - 10},${topY}`}
                    fill={fr.top} stroke={fr.drip} strokeWidth="1.5"
                  />
                ) : (
                  /* smooth drips */
                  [0.2, 0.42, 0.62, 0.82].map((t, i) => (
                    <rect key={i} x={(120 - cakeW / 2) + t * cakeW - 3} y={topY}
                      width="6" height={8 + (i % 2) * 5} rx="3" fill={fr.drip} opacity="0.9" />
                  ))
                )
              )}

              {/* === CANDLE === */}
              <rect x="117" y={isTwoTier ? tier2Y - 22 : topY - 22} width="6" height="18" rx="2.5" fill="#FF8A65" />
              <ellipse cx="120" cy={isTwoTier ? tier2Y - 22 : topY - 22} rx="3.5" ry="2.5" fill="#FFCC02" />
              <motion.ellipse cx="120" cy={isTwoTier ? tier2Y - 28 : topY - 28} rx="3" ry="5" fill="#FF6D00"
                animate={{ scaleY: [1, 1.25, 0.85, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.1 }} />
              <motion.ellipse cx="120" cy={isTwoTier ? tier2Y - 27 : topY - 27} rx="1.5" ry="3" fill="#FFEE58"
                animate={{ scaleY: [1, 1.3, 0.8, 1] }} transition={{ repeat: Infinity, duration: 0.85 }} />

            </motion.g>
          </AnimatePresence>
        </svg>

        {/* Decoration badges */}
        {decorations.length > 0 && (
          <div className="absolute top-0 -right-2 flex flex-col gap-1">
            {decorations.slice(0, 4).map((dId, i) => {
              const dec = DECORATION_ICONS[dId];
              if (!dec) return null;
              return (
                <motion.span key={dId} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-1 bg-white rounded-full shadow-sm px-2 py-0.5 text-[9px] font-semibold border border-gray-100 text-gray-600 whitespace-nowrap">
                  {dec.emoji} {dec.label}
                </motion.span>
              );
            })}
          </div>
        )}
      </motion.div>

      <div className="text-center">
        <p className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>{fc.label}</p>
        <p className="text-[10px] text-gray-400 capitalize">{fr.label} · {shape}{isTwoTier ? " · 2-Tier" : ""}</p>
      </div>
    </div>
  );
}
