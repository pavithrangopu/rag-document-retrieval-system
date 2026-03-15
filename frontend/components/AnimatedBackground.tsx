"use client";

import { motion } from "framer-motion";

const orbs = [
  {
    size: 600,
    color: "rgba(124,58,237,0.12)",
    top: "-5%",
    left: "10%",
    duration: 22,
  },
  {
    size: 500,
    color: "rgba(59,130,246,0.10)",
    top: "50%",
    left: "60%",
    duration: 28,
  },
  {
    size: 400,
    color: "rgba(6,182,212,0.08)",
    top: "70%",
    left: "5%",
    duration: 26,
  },
  {
    size: 350,
    color: "rgba(124,58,237,0.07)",
    top: "20%",
    left: "75%",
    duration: 30,
  },
  {
    size: 250,
    color: "rgba(59,130,246,0.06)",
    top: "85%",
    left: "45%",
    duration: 20,
  },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-100 to-dark-200" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            top: orb.top,
            left: orb.left,
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, 60, -40, 20, 0],
            y: [0, -50, 30, -20, 0],
            scale: [1, 1.08, 0.95, 1.03, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}