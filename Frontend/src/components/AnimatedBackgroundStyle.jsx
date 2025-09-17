import React, { useState } from "react";
import { motion } from "framer-motion";

// Background 1: Floating Particles
const FloatingParticlesBackground = () => (
  <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
    {Array.from({ length: 15 }).map((_, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full ${
          i % 3 === 0
            ? "bg-slate-300/20"
            : i % 3 === 1
            ? "bg-gray-400/15"
            : "bg-slate-400/10"
        }`}
        style={{
          width: `${20 + i * 8}px`,
          height: `${20 + i * 8}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [-20, -100, -20],
          x: [-10, 10, -10],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5,
        }}
      />
    ))}
  </div>
);

// Background 2: Grid Animation
const AnimatedGridBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-slate-100">
    <div className="absolute inset-0 opacity-30">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-slate-300/40"
          style={{
            width: "100px",
            height: "100px",
            left: `${(i % 4) * 25}%`,
            top: `${Math.floor(i / 4) * 33}%`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  </div>
);

// Background 3: Orbiting Circles
const OrbitingCirclesBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          width: "400px",
          height: "400px",
          left: "50%",
          top: "50%",
          marginLeft: "-200px",
          marginTop: "-200px",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 20 + i * 10,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div
          className={`w-8 h-8 rounded-full ${
            i % 2 === 0 ? "bg-slate-400/20" : "bg-gray-400/15"
          }`}
          style={{
            position: "absolute",
            left: `${200 + i * 30}px`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </motion.div>
    ))}
  </div>
);

// Background 4: Morphing Blobs
const MorphingBlobsBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-bl from-gray-50 to-slate-100">
    {Array.from({ length: 4 }).map((_, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full ${
          i % 2 === 0 ? "bg-slate-300/25" : "bg-gray-300/20"
        } blur-2xl`}
        style={{
          width: `${200 + i * 100}px`,
          height: `${200 + i * 100}px`,
          left: `${20 + i * 20}%`,
          top: `${10 + i * 20}%`,
        }}
        animate={{
          scale: [1, 1.2, 0.8, 1],
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
        }}
        transition={{
          duration: 15 + i * 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Background 5: Pulsing Dots Pattern
const PulsingDotsBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-gray-100 to-slate-50">
    <div className="grid grid-cols-8 gap-4 p-8 h-full">
      {Array.from({ length: 64 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-slate-400/30 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: (i * 0.1) % 3,
          }}
        />
      ))}
    </div>
  </div>
);

// Background 6: Zigzag Lines
const ZigzagLinesBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-slate-50">
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute h-px bg-slate-300/40"
        style={{
          width: "100%",
          top: `${12.5 * (i + 1)}%`,
          transformOrigin: "center",
        }}
        animate={{
          scaleX: [1, 1.1, 0.9, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

// Background 7: Spinning Squares
const SpinningSquaresBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-bl from-slate-100 to-gray-50">
    {Array.from({ length: 10 }).map((_, i) => (
      <motion.div
        key={i}
        className={`absolute ${
          i % 3 === 0
            ? "bg-slate-400/15"
            : i % 3 === 1
            ? "bg-gray-400/20"
            : "bg-slate-300/10"
        }`}
        style={{
          width: `${30 + i * 15}px`,
          height: `${30 + i * 15}px`,
          left: `${Math.random() * 90}%`,
          top: `${Math.random() * 90}%`,
          borderRadius: i % 2 === 0 ? "20%" : "0%",
        }}
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6 + i,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

// Background 8: Ripple Effect
const RippleEffectBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-slate-100">
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute border border-slate-300/30 rounded-full"
        style={{
          left: "50%",
          top: "50%",
        }}
        initial={{
          width: 0,
          height: 0,
          x: "-50%",
          y: "-50%",
          opacity: 1,
        }}
        animate={{
          width: "800px",
          height: "800px",
          opacity: 0,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

export {
  RippleEffectBackground,
  FloatingParticlesBackground,
  AnimatedGridBackground,
  OrbitingCirclesBackground,
  MorphingBlobsBackground,
  PulsingDotsBackground,
  ZigzagLinesBackground,
  SpinningSquaresBackground,
};
