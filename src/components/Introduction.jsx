import React from 'react';
import { STUDIO_INFO } from '../data/projectsData';
import { ArrowUpRight } from 'lucide-react';

export default function Introduction() {
  const pillars = [
    {
      num: "01",
      title: "Material Honesty",
      desc: "Raw concrete, natural stone veining, and solid hardwoods honored in their unadorned authenticity."
    },
    {
      num: "02",
      title: "Choreographed Light",
      desc: "Sculpting indirect, glare-free architectural illumination that transforms spaces from dawn to twilight."
    },
    {
      num: "03",
      title: "Spatial Continuity",
      desc: "Seamless visual and physical procession across thresholds, uniting landscapes with interior sanctuaries."
    },
    {
      num: "04",
      title: "Human Proportion",
      desc: "Every ceiling height, sill line, and furniture radius calibrated precisely to the human scale and ritual."
    }
  ];

  return (
    <section id="studio-intro" className="relative pt-6 sm:pt-12 pb-6 sm:pb-8 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        
        {/* Editorial Sub-heading */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-xs tracking-[0.25em] font-mono text-[#8F8B83] dark:text-[#A09C94] uppercase mb-3 sm:mb-5">
          <span className="w-6 sm:w-8 h-px bg-[#1C1B19]/30 dark:bg-white/30" />
          <span>EDITORIAL PHILOSOPHY • CONSILIO STUDIOS</span>
        </div>

        {/* Large Statement Heading & Signature Motto Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 items-stretch">
          
          {/* Left: Editorial Statement & Philosophy */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-base xs:text-lg sm:text-2xl lg:text-3xl font-normal leading-[1.12] tracking-tight text-[#1C1B19] dark:text-[#FAF8F5]">
                DESIGNING SPACES
                <span className="block text-[#4F5542] dark:text-[#D4B993] font-normal mt-1">
                  WITH INTENTION.
                </span>
              </h2>

              <p className="mt-2.5 sm:mt-4 text-xs sm:text-sm text-[#57544E] dark:text-[#C8C4BC] font-light leading-relaxed max-w-2xl">
                {STUDIO_INFO.introParagraph}
              </p>
            </div>

            <div className="mt-3.5 sm:mt-6 pl-3.5 sm:pl-5 border-l-2 border-[#4F5542]/40 dark:border-[#D4B993]/40">
              <p className="text-xs sm:text-sm text-[#706B63] dark:text-[#A09C94] font-sans italic leading-relaxed max-w-xl">
                "{STUDIO_INFO.philosophy}"
              </p>
              <span className="block mt-1 text-[10px] font-mono tracking-widest uppercase text-[#8F8B83]">
                — PRINCIPAL DESIGN PHILOSOPHY
              </span>
            </div>
          </div>

          {/* Right: Signature Architectural Plaque / Motto Card */}
          <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl bg-[#1C1B19] text-[#FAF8F5] p-4 xs:p-5 sm:p-6 border border-white/10 shadow-xl flex flex-col justify-between min-h-[220px] sm:min-h-[250px] transition-all duration-500 hover:border-white/20">
            
            {/* Ambient Subtle Architectural Backdrop */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 group-hover:opacity-35 transition-opacity duration-700">
              <img
                src="/hero/start_frame.webp"
                alt="Consilio Studios Architecture"
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19] via-[#1C1B19]/85 to-[#1C1B19]/70" />
            </div>

            {/* Top Bar: Live Studio Beacon & Location */}
            <div className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4E774E] animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4B993] font-medium">
                  THE STUDIO MOTTO
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-wider text-white/50 uppercase">
                PUNE
              </span>
            </div>

            {/* Center: Large Typographic Motto */}
            <div className="relative z-10 py-3 sm:py-4 my-auto">
              <span className="font-serif text-base sm:text-lg text-[#D4B993]/80 leading-none select-none block -mb-1 sm:-mb-2">“</span>
              <p className="font-serif text-xs xs:text-sm sm:text-base text-white font-normal leading-snug tracking-tight">
                YOU GOT SPACE, AND WE GOT THE IDEA.
              </p>
            </div>

            {/* Bottom Bar: Discipline & Direct Link */}
            <div className="relative z-10 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between font-mono tracking-wider">
              <div className="flex items-center gap-1.5 sm:gap-2 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="text-[8.5px] xs:text-[9.5px] sm:text-[10.5px]">ARCHITECTURE & INTERIORS</span>
              </div>
              <a
                href="#work"
                className="text-[8px] xs:text-[8.5px] sm:text-[10px] uppercase tracking-widest text-[#D4B993] hover:text-white flex items-center gap-0.5 sm:gap-1 transition-colors group/link shrink-0"
              >
                <span>PORTFOLIO</span>
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* 4 Architectural Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-[#1C1B19]/10 dark:border-white/10">
          {pillars.map((pillar) => (
            <div key={pillar.num} className="group">
              <span className="font-mono text-xs text-[#8F8B83] tracking-widest block mb-1.5 sm:mb-2 group-hover:text-[#4F5542] dark:group-hover:text-[#D4B993] transition-colors">
                {pillar.num}
              </span>
              <h3 className="font-serif text-xs sm:text-sm text-[#1C1B19] dark:text-[#FAF8F5] mb-1 font-medium">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#57544E] dark:text-[#A09C94] leading-relaxed font-light">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
