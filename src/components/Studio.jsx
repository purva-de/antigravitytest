import React from 'react';
import { Compass, Sparkles, ShieldCheck, HeartHandshake, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { STUDIO_INFO } from '../data/projectsData';

export default function Studio() {
  const credentials = [
    {
      num: "01",
      icon: Compass,
      title: "Holistic Flow",
      desc: "Walls, lighting, and movement designed together as one seamless home.",
      badge: "FLOW",
      color: {
        border: "hover:border-emerald-500/50",
        topLine: "bg-emerald-600",
        iconBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
        badge: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
        glow: "group-hover:shadow-emerald-500/10"
      }
    },
    {
      num: "02",
      icon: Sparkles,
      title: "Bespoke Millwork",
      desc: "100% custom-crafted TV showcases, wardrobes, and partitions. Zero catalog templates.",
      badge: "CUSTOM",
      color: {
        border: "hover:border-amber-500/50",
        topLine: "bg-amber-600",
        iconBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300",
        badge: "bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
        glow: "group-hover:shadow-amber-500/10"
      }
    },
    {
      num: "03",
      icon: ShieldCheck,
      title: "Natural Stone & Timber",
      desc: "Authentic Italian marbles, kiln-dried hardwoods, and rich tactile finishes built to endure.",
      badge: "TIMELESS",
      color: {
        border: "hover:border-orange-500/50",
        topLine: "bg-orange-600",
        iconBg: "bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300",
        badge: "bg-orange-50 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800/40",
        glow: "group-hover:shadow-orange-500/10"
      }
    },
    {
      num: "04",
      icon: HeartHandshake,
      title: "Founder-Led Trust",
      desc: "Direct communication with the principal architects through weekly 3D milestones and on-site oversight.",
      badge: "DIRECT TRUST",
      color: {
        border: "hover:border-blue-500/50",
        topLine: "bg-blue-600",
        iconBg: "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300",
        badge: "bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800/40",
        glow: "group-hover:shadow-blue-500/10"
      }
    }
  ];

  return (
    <section id="studio" className="pt-3 sm:pt-4 pb-6 sm:pb-8 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        
        {/* Editorial Sub-Header */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-xs tracking-[0.25em] font-mono text-[#8F8B83] dark:text-[#A09C94] uppercase mb-3 sm:mb-4">
          <span className="w-6 sm:w-8 h-px bg-[#1C1B19]/30 dark:bg-white/30" />
          <span>ABOUT CONSILIO STUDIOS</span>
        </div>

        {/* Main Headline & Vibrant Client Connection Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch mb-5 sm:mb-6">
          
          {/* Left: Punchy Core Philosophy (Zero Fluff) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-serif text-base xs:text-lg sm:text-xl lg:text-[21px] font-normal leading-[1.16] tracking-tight text-[#1C1B19] dark:text-[#FAF8F5]">
              Good design begins with{' '}
              <span className="text-[#9A3412] dark:text-[#FDBA74] font-normal">
                good thinking.
              </span>
            </h2>

            {/* The Main Motto */}
            <p className="font-sans italic text-xs xs:text-sm sm:text-base text-[#1C1B19] dark:text-[#FAF8F5] mt-1.5">
              “You got space, and we got the idea.”
            </p>

            <p className="mt-2 text-xs sm:text-sm text-[#57544E] dark:text-[#A09C94] font-light max-w-xl leading-relaxed">
              Architecture & custom interior environments in Pune — conceived around how you and your family actually live.
            </p>
          </div>

          {/* Right: Vibrant Audience Connection Card */}
          <div className="lg:col-span-5 p-[16px] xs:p-[18px] sm:p-5 md:p-6 rounded-2xl bg-gradient-to-br from-[#FEF3C7]/40 via-white to-[#ECFDF5]/50 dark:from-[#1E1D1B] dark:via-[#171615] dark:to-[#141A16] border border-amber-600/20 dark:border-amber-500/20 shadow-sm flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between text-[10px] xs:text-[11px] font-mono tracking-wider mb-2">
                <span className="text-[#9A3412] dark:text-[#FDBA74] font-medium uppercase">
                  DIRECT STUDIO COMMITMENT
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  PUNE
                </span>
              </div>

              <p className="text-xs xs:text-sm sm:text-base font-normal text-[#1C1B19] dark:text-white leading-snug">
                Have a floor plan, raw flat, or bungalow plot? Talk directly with our principal designers.
              </p>
            </div>

            {/* Direct Quick Action Buttons: Removed on desktop version, present on mobile/tablet */}
            <div className="md:hidden mt-3.5 pt-2.5 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href={STUDIO_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-mono uppercase tracking-wider font-medium inline-flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle size={14} className="shrink-0" />
                <span>{STUDIO_INFO.phone}</span>
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-full bg-[#1C1B19] dark:bg-white text-white dark:text-black text-[11px] font-mono uppercase tracking-wider font-medium inline-flex items-center justify-center gap-2 transition-colors shadow-xs hover:bg-[#9A3412]"
              >
                <span>Book Consultation</span>
                <ArrowRight size={13} className="shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* 4 Cards: Curated Architectural Color Palette */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {credentials.map((cred) => {
            const Icon = cred.icon;
            return (
              <div
                key={cred.num}
                className={`group relative p-5 rounded-2xl bg-white dark:bg-[#1A1918] border border-black/8 dark:border-white/10 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-default overflow-hidden ${cred.color.border} ${cred.color.glow}`}
              >
                {/* Vibrant Top Color Accent Bar */}
                <div className={`absolute top-0 inset-x-0 h-1 ${cred.color.topLine}`} />

                <div>
                  {/* Top Bar with Number & Themed Icon */}
                  <div className="flex items-center justify-between mb-3 pt-1">
                    <span className="font-mono text-xs text-[#8F8B83] tracking-widest font-medium">
                      {cred.num}
                    </span>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${cred.color.iconBg}`}>
                      <Icon size={18} />
                    </div>
                  </div>

                  {/* Punchy Title */}
                  <h3 className="font-serif text-xs sm:text-sm font-normal text-[#1C1B19] dark:text-[#FAF8F5] mb-1.5">
                    {cred.title}
                  </h3>

                  {/* Concise 1-Sentence Description */}
                  <p className="text-xs text-[#57544E] dark:text-[#A09C94] font-light leading-relaxed">
                    {cred.desc}
                  </p>
                </div>

                {/* Bottom Color Badge */}
                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border font-medium ${cred.color.badge}`}>
                    {cred.badge}
                  </span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
