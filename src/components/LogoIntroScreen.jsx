import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * LogoIntroScreen
 * Architectural black introductory screen displaying the Consilio Studios logo.
 * Automatically transitions directly to the landing page after 5 seconds
 * without requiring any hovering or user actions.
 * Also supports clicking, scrolling, or pressing enter to proceed early.
 */
export default function LogoIntroScreen({ onIntroComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);
  const touchStartY = useRef(0);
  const isTriggered = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const dismissIntro = () => {
    if (isTriggered.current) return;
    isTriggered.current = true;
    setIsDismissing(true);
    // Unlock body scroll immediately
    document.body.style.overflow = "";
    
    // Smooth architectural transition out
    const exitDuration = shouldReduceMotion ? 100 : 950;
    setTimeout(() => {
      setIsVisible(false);
      if (onIntroComplete) onIntroComplete();
    }, exitDuration);
  };

  useEffect(() => {
    // Lock body scroll while intro is visible
    if (isVisible) {
      document.body.style.overflow = "hidden";
    }

    // Auto-advance directly to the landing page after 5 seconds without requiring hover or interaction
    const autoLandTimer = setTimeout(() => {
      dismissIntro();
    }, 5000);

    // Optional manual early skip triggers (click, scroll, swipe, key) if visitor prefers not to wait
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > 8 || Math.abs(e.deltaX) > 8) {
        dismissIntro();
      }
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const touchCurrentY = e.touches[0].clientY;
      const diffY = touchStartY.current - touchCurrentY;
      if (Math.abs(diffY) > 18) {
        dismissIntro();
      }
    };

    const handleKeyDown = (e) => {
      if (["ArrowDown", "ArrowRight", "Space", "PageDown", "Enter"].includes(e.code)) {
        dismissIntro();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(autoLandTimer);
      document.body.style.overflow = "";
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isDismissing ? (
        <motion.div
          key="logo-intro-curtain"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: shouldReduceMotion ? 0 : "-100%",
            opacity: shouldReduceMotion ? 0 : 1,
            transition: {
              duration: shouldReduceMotion ? 0.2 : 0.95,
              ease: [0.76, 0, 0.24, 1], // Classic architectural curtain curve
            },
          }}
          className="fixed inset-0 z-[100] bg-[#0A0A09] text-[#FAF8F5] flex flex-col justify-between items-center select-none overflow-hidden cursor-pointer"
          onClick={dismissIntro}
          role="region"
          aria-label="Consilio Studios Welcome Introduction"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 48%, rgba(255,255,255,0.06) 0%, rgba(10,10,9,0.92) 58%, #0A0A09 100%)",
            }}
          />

          {/* Architectural Thin Grid Hairlines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] grid grid-cols-6 grid-rows-6">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>

          {/* Subtle Corner Architectural Registration Marks */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-white/30 uppercase pointer-events-none hidden xs:block">
            CONSILIO / 01
          </div>
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-white/30 uppercase pointer-events-none text-right hidden xs:block">
            18.4529° N, 73.8652° E
          </div>

          {/* TOP SPACING */}
          <div className="w-full pt-8 sm:pt-16" />

          {/* CENTER: THE ICONIC LOGO & TYPOGRAPHY */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.92, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center text-center px-4 xs:px-6 max-w-xl"
          >
            {/* The Logo with Crisp White Architectural Inversion */}
            <div className="relative group">
              {/* Luminous Ambient Glow */}
              <div className="absolute -inset-4 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              <motion.img
                src="/logo.png"
                alt="Consilio Studios Official Logo"
                className="w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 object-contain invert drop-shadow-[0_0_28px_rgba(255,255,255,0.22)] transition-transform duration-500 group-hover:scale-105"
                initial={{ filter: "invert(1) blur(4px)", opacity: 0 }}
                animate={{ filter: "invert(1) blur(0px)", opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.9, ease: "easeOut" }}
              />
            </div>

            {/* Studio Identity Name */}
            <motion.h1
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.25, duration: shouldReduceMotion ? 0.2 : 0.9 }}
              className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-light tracking-[0.2em] sm:tracking-[0.26em] text-white uppercase mt-6 sm:mt-8 leading-tight"
            >
              Consilio Studios
            </motion.h1>

            {/* Disciplines & Location */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: shouldReduceMotion ? 0.2 : 0.8 }}
              className="font-mono text-[9px] xs:text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.35em] text-white/60 uppercase mt-2.5 sm:mt-3"
            >
              Architecture • Spatial Design • Pune
            </motion.p>

            {/* Studio Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.55, duration: shouldReduceMotion ? 0.2 : 0.8 }}
              className="font-serif italic text-xs sm:text-sm text-white/45 mt-3 sm:mt-4 tracking-wider"
            >
              "You got space, and we got the idea"
            </motion.p>
          </motion.div>

          {/* BOTTOM SPACING & SUBTLE PROGRESS LINE (5s auto-landing) */}
          <div className="w-full pb-8 sm:pb-16 flex flex-col items-center relative z-10 pointer-events-none">
            {/* Subtle hairline progress indicator across 5s */}
            <div className="w-24 sm:w-32 h-[1px] bg-white/10 overflow-hidden rounded-full" aria-hidden="true">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: shouldReduceMotion ? 0 : 5, ease: "linear" }}
                className="h-full bg-white/35"
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
