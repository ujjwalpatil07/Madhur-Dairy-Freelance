import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

// Dairy product icons (or replace with SVGs later)
const dairyIcons = ["🥛", "🧀", "🍶", "🍯", "🧈", "🍨"];

export default function MadhurLoader({ fullScreen = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % dairyIcons.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`${fullScreen ? "fixed inset-0" : "w-full h-full"
        } z-50 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-md`}
    >
      <div className="flex items-center gap-8">
        {/* Brand Text (Left) */}
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#843E71] dark:text-yellow-100">
            Madhur Dairy <br /> and Daily Needs
          </h1>
          
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Bringing freshness to your home...
          </p>
        </div>

        {/* Dairy Product Reels (Right) */}
        <div className="relative h-24 w-20 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute text-6xl"
            >
              {dairyIcons[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
