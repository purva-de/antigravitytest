import React, { useRef, useState, useEffect } from 'react';
import { MessageCircle, Instagram, Linkedin } from 'lucide-react';
import { STUDIO_INFO } from '../data/projectsData';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * HeroExperience
 * Authentic Consilio Studios architectural landing page experience matching
 * the reference video with full-bleed exterior villa walkthrough (hero_walkthrough.mp4),
 * editorial typography, interactive actions, and floating architectural badge.
 */
export default function HeroExperience({ onExploreProjects }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Attempt video autoplay with fallbacks
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback (already muted and playsInline)
      });
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full h-[100dvh] min-h-[580px] bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] overflow-hidden select-none"
      aria-label="Consilio Studios Cinematic Landing Experience"
    >
      {/* 1. Full-Bleed Architectural Villa Walkthrough Video */}
      <video
        ref={videoRef}
        src="/videos/hero_walkthrough.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-100' : 'opacity-90'
        }`}
      />

      {/* 2. Soft Architectural Contrast Gradients for Optimal Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15 pointer-events-none z-10" />

      {/* 3. Main Hero Editorial Typography & Content (Left Column) */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-4 xs:px-6 sm:px-10 lg:px-12 h-full flex flex-col justify-center pt-20 xs:pt-24 pb-14 xs:pb-16">
        <div className="max-w-xl">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 sm:space-y-5"
          >
            {/* Architectural Discipline Eyebrow */}
            <div className="flex items-center gap-2 sm:gap-2.5 text-[9.5px] xs:text-[10.5px] sm:text-xs tracking-[0.28em] font-mono uppercase text-[#1C1B19] dark:text-[#E8E4DD] font-semibold drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <span>ARCHITECTURE / INTERIORS / PUNE</span>
            </div>

            {/* Editorial Title (Matching Reference Screenshot) */}
            <h1 className="font-editorial text-5xl xs:text-6xl sm:text-7xl lg:text-[86px] font-normal tracking-tight text-[#1C1B19] dark:text-white leading-[0.92] drop-shadow-[0_1px_3px_rgba(255,255,255,0.6)] dark:drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Consilio<br />Studios
            </h1>

            {/* Studio Purpose Tagline */}
            <p className="text-xs xs:text-sm sm:text-[15px] text-[#24221F] dark:text-[#F3EFEA] max-w-md sm:max-w-lg font-sans font-normal leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Innovation meets design excellence. We craft spaces that blend functionality and aesthetics, transforming visions into tangible structures.
            </p>

            {/* Action Buttons: Green WhatsApp Pill + Minimal View Work */}
            <div className="flex items-center gap-4 sm:gap-6 pt-2 flex-wrap">
              <a
                href={STUDIO_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#5D7B58] hover:bg-[#4E6A49] text-white flex items-center gap-2 text-xs sm:text-[13px] font-sans font-medium tracking-wide shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                data-cursor="pointer"
              >
                <MessageCircle size={15} className="fill-white/20 shrink-0" />
                <span>Message Now</span>
              </a>

              <button
                onClick={onExploreProjects}
                className="text-xs sm:text-[13px] font-sans font-medium text-[#1C1B19] dark:text-white hover:opacity-70 transition-all duration-200 cursor-pointer underline-offset-4 hover:underline drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                data-cursor="pointer"
              >
                View Work
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. Floating Architectural Emblem Card (Bottom-Right Corner, Matching Reference) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="hidden lg:flex absolute bottom-8 sm:bottom-10 lg:bottom-12 right-10 lg:right-16 z-20 w-48 sm:w-56 h-64 sm:h-76 bg-white/95 dark:bg-[#FAF8F5]/95 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 flex-col items-center justify-between text-center border border-black/5 backdrop-blur-md pointer-events-auto transition-transform duration-500 hover:scale-[1.02]"
      >
        <div className="w-full flex-1 flex items-center justify-center p-2">
          <img
            src="/logo.png"
            alt="Consilio Studios"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
        </div>
        <div className="space-y-1 my-auto">
          <p className="font-editorial text-xs sm:text-sm tracking-[0.28em] uppercase text-[#1C1B19] font-medium leading-tight">
            CONSILIO
          </p>
          <p className="font-editorial text-[10px] sm:text-xs tracking-[0.28em] uppercase text-[#1C1B19]/80 font-medium leading-tight">
            STUDIOS
          </p>
        </div>
        <div className="pt-2 border-t border-black/5 w-full">
          <p className="text-[7.5px] sm:text-[8.5px] font-mono tracking-[0.24em] text-[#7A766F] uppercase">
            PUNE • MAHARASHTRA
          </p>
        </div>
      </motion.div>

      {/* 5. Desktop-Only Floating Social Rail (Right Screen Edge) */}
      <div className="hidden md:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-2 sm:gap-2.5">
        <a
          href={STUDIO_INFO.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-black/60 hover:bg-[#25D366] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-md border border-white/20"
          aria-label="WhatsApp Consilio Studios"
          title="WhatsApp Dialogue"
          data-cursor="pointer"
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        <a
          href={STUDIO_INFO.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-black/60 hover:bg-[#E4405F] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-md border border-white/20"
          aria-label="Instagram Consilio Studios"
          title="Instagram Portfolio"
          data-cursor="pointer"
        >
          <Instagram className="w-4 h-4" />
        </a>

        <a
          href={STUDIO_INFO.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-black/60 hover:bg-[#0A66C2] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-md border border-white/20"
          aria-label="LinkedIn Consilio Studios"
          title="LinkedIn Architectural Network"
          data-cursor="pointer"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </div>

      {/* 6. Mobile-Only Horizontal Social Icons (Positioned Below Text) */}
      <div className="md:hidden absolute bottom-4 xs:bottom-5 left-4 xs:left-6 z-30 flex items-center gap-2">
        <a
          href={STUDIO_INFO.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[34px] h-[34px] rounded-full bg-black/60 hover:bg-[#25D366] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-md border border-white/20"
          aria-label="WhatsApp Consilio Studios"
          title="WhatsApp Dialogue"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </a>

        <a
          href={STUDIO_INFO.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[34px] h-[34px] rounded-full bg-black/60 hover:bg-[#E4405F] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-md border border-white/20"
          aria-label="Instagram Consilio Studios"
          title="Instagram Portfolio"
        >
          <Instagram className="w-3.5 h-3.5" />
        </a>

        <a
          href={STUDIO_INFO.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[34px] h-[34px] rounded-full bg-black/60 hover:bg-[#0A66C2] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-md border border-white/20"
          aria-label="LinkedIn Consilio Studios"
          title="LinkedIn Architectural Network"
        >
          <Linkedin className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 7. Bottom Center "SCROLL TO BEGIN" Prompt (Matching Reference) */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.32em] text-[#1C1B19]/75 dark:text-white/75 animate-pulse font-medium drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          SCROLL TO BEGIN
        </span>
      </div>
    </section>
  );
}