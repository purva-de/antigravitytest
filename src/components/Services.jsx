import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Compass,
  Layers,
  Box,
  Eye,
  Sparkles,
  SlidersHorizontal,
  LayoutGrid,
  Check,
  X,
  ArrowRight
} from 'lucide-react';

const SERVICES = [
  {
    number: "01",
    title: "ARCHITECTURE",
    subtitle: "Form, Climate & Context",
    shortDesc: "Sculptural residential and commercial structures harmonized with geography, solar paths, and enduring materiality.",
    image: "/hero/start_frame.webp",
    coordinate: "LAT 12.97° N • SOLAR AXIS 01",
    badge: "BESPOKE MASSING",
    deliverables: [
      "Solar & Microclimate Simulation",
      "Full Architectural CAD Blueprints",
      "Cantilever & Facade Detailing",
      "Site Feasibility & Zoning Approvals"
    ],
    highlightStat: "100% Climatic Orientation"
  },
  {
    number: "02",
    title: "INTERIOR DESIGN",
    subtitle: "Atmosphere & Tactility",
    shortDesc: "Atmospheric choreography balancing custom millwork, curated stones, fine textiles, and indirect cove illumination.",
    image: "/projects/IMG_0380.webp",
    coordinate: "CRI 98 • 2700K LOW-GLARE",
    badge: "CUSTOM MILLWORK",
    deliverables: [
      "Bespoke Woodwork & Partitions",
      "Italian Stone & Marble Detailing",
      "Diffuse Architectural Lighting",
      "Art & FF&E Global Curation"
    ],
    highlightStat: "Zero-Glare Lighting"
  },
  {
    number: "03",
    title: "SPACE PLANNING",
    subtitle: "Ergonomics & Movement",
    shortDesc: "Choreographing the natural rhythm of human circulation to eliminate spatial friction and maximize functional elegance.",
    image: "/projects/IMG_9733.webp",
    coordinate: "ERGONOMIC FLUIDITY • 03",
    badge: "CIRCULATION MASTERY",
    deliverables: [
      "Movement & Circulation Analysis",
      "Custom Radial & Linear Zoning",
      "Modular Concealed Storage",
      "Acoustic & Privacy Engineering"
    ],
    highlightStat: "Optimized Flow Dynamics"
  },
  {
    number: "04",
    title: "3D VISUALIZATION",
    subtitle: "Cinematic Pre-Experience",
    shortDesc: "Hyper-realistic rendering and cinematic camera walkthroughs to inhabit your unbuilt space before construction begins.",
    image: "/hero/last_frame.webp",
    coordinate: "RAY-TRACED PHOTOREALISM",
    badge: "CINEMATIC SIMULATION",
    deliverables: [
      "4K Photorealistic Stills",
      "Continuous Video Walkthroughs",
      "Daylight & Night Atmosphere Studies",
      "Virtual Reality Interactive Previews"
    ],
    highlightStat: "Sub-millimeter Accuracy"
  },
  {
    number: "05",
    title: "DESIGN CONSULTATION",
    subtitle: "Strategic Vision",
    shortDesc: "High-level creative and architectural advisory for discerning homeowners, estate developers, and hospitality founders.",
    image: "/projects/IMG_0149_shot_1.jpg",
    coordinate: "CURATED ADVISORY • 05",
    badge: "GLOBAL STANDARDS",
    deliverables: [
      "Design Audits & Revitalizations",
      "Brand-to-Space Architectural Strategy",
      "Master Artisan & Contractor Vetting",
      "Budget Phasing & Material Procurement"
    ],
    highlightStat: "End-to-End Governance"
  }
];

export default function Services() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewMode, setViewMode] = useState("panels"); // "panels" | "grid"
  const [selectedServiceForModal, setSelectedServiceForModal] = useState(null);

  const activeService = SERVICES[activeIdx];

  return (
    <section
      id="services"
      className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] transition-colors duration-500 overflow-hidden"
      aria-label="Architectural Services and Disciplines"
    >
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        
        {/* ========================================================================= */}
        {/* HEADER: Title, Subtitle, and View Switcher                                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[#1C1B19]/10 dark:border-white/10 mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs tracking-[0.25em] font-mono text-[#8F8B83] dark:text-[#A09C94] uppercase mb-1.5">
              <span className="w-6 sm:w-8 h-px bg-[#1C1B19]/30 dark:bg-white/30" />
              <span>DISCIPLINES & CAPABILITIES</span>
            </div>
            <h2 className="font-serif text-base sm:text-lg font-normal tracking-tight">
              SERVICES
            </h2>
          </div>

          {/* Interactive Controls & View Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#8F8B83] hidden sm:inline">
              HOVER OR CLICK TO EXPAND
            </span>

            <div className="flex items-center gap-1 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <button
                onClick={() => setViewMode("panels")}
                className={`px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                  viewMode === "panels"
                    ? 'bg-white dark:bg-[#252422] text-black dark:text-white shadow-xs font-medium'
                    : 'text-[#8F8B83] hover:text-black dark:hover:text-white'
                }`}
                title="Interactive Expanding Panels"
              >
                <SlidersHorizontal size={13} />
                <span className="hidden sm:inline">PANELS</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? 'bg-white dark:bg-[#252422] text-black dark:text-white shadow-xs font-medium'
                    : 'text-[#8F8B83] hover:text-black dark:hover:text-white'
                }`}
                title="Showcase Cards Grid"
              >
                <LayoutGrid size={13} />
                <span className="hidden sm:inline">GRID</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: EXPANDABLE ARCHITECTURAL PANELS (DESKTOP)                         */}
        {/* ========================================================================= */}
        {viewMode === "panels" && (
          <div className="hidden lg:flex gap-2.5 h-[340px] sm:h-[370px] lg:h-[390px] w-full select-none">
            {SERVICES.map((srv, idx) => {
              const isActive = activeIdx === idx;
              return (
                <motion.div
                  key={srv.number}
                  layout
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border border-black/10 dark:border-white/10 group ${
                    isActive ? 'flex-[3] shadow-xl' : 'flex-1 hover:flex-[1.15] shadow-sm'
                  }`}
                  data-cursor="pointer"
                >
                  {/* High-Resolution Architectural Image (Always visible on every panel) */}
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                      isActive ? 'scale-105 brightness-95' : 'scale-100 brightness-[0.65] group-hover:brightness-90'
                    }`}
                  />

                  {/* Gradient Lighting Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

                  {/* Specular Radial Highlight on Active Panel */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.15)_0%,transparent_60%)]"
                    />
                  )}

                  {/* Top Bar on Active Panel */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white z-10">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono tracking-widest uppercase border border-white/15">
                      DISCIPLINE {srv.number}
                    </span>

                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[9px] font-mono tracking-widest uppercase text-white/70 hidden xl:inline-block"
                      >
                        {srv.coordinate}
                      </motion.span>
                    )}
                  </div>

                  {/* Content Container (Bottom of Panel) */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white z-10 flex flex-col justify-end">
                    
                    {/* Collapsed State: Vertical Typography on narrow panels */}
                    {!isActive && (
                      <div className="flex flex-col items-center justify-end h-full py-3">
                        <span
                          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                          className="font-serif text-sm sm:text-base font-normal tracking-widest uppercase mb-3 opacity-90 group-hover:opacity-100 whitespace-nowrap text-white"
                        >
                          {srv.title}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                          <ArrowUpRight size={12} />
                        </div>
                      </div>
                    )}

                    {/* Active Expanded State: Bold, Clean & Concise */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#D9CEBE] tracking-widest uppercase">
                          <span>{srv.subtitle}</span>
                          <span>•</span>
                          <span className="text-white/70">{srv.badge}</span>
                        </div>

                        <h3 className="font-serif text-sm sm:text-base font-normal tracking-tight text-white leading-tight">
                          {srv.title}
                        </h3>

                        {/* Concise 1-sentence descriptor */}
                        <p className="text-xs font-light text-white/85 leading-relaxed max-w-md line-clamp-2">
                          {srv.shortDesc}
                        </p>

                        {/* Deliverables Tags Strip */}
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {srv.deliverables.slice(0, 3).map((item, dIdx) => (
                            <span
                              key={dIdx}
                              className="px-2 py-0.5 rounded-sm bg-white/15 backdrop-blur-md text-[9px] font-mono tracking-wider text-white uppercase border border-white/10"
                            >
                              {item}
                            </span>
                          ))}
                        </div>

                        {/* Interactive Scope Action Button */}
                        <div className="pt-1.5 flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedServiceForModal(srv);
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-mono tracking-wider uppercase font-semibold hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-md"
                          >
                            <span>Explore Deliverables</span>
                            <ArrowUpRight size={12} />
                          </button>

                          <a
                            href="#contact"
                            className="text-[11px] font-mono tracking-wider uppercase text-white/80 hover:text-white underline underline-offset-4"
                          >
                            Inquire Now
                          </a>
                        </div>
                      </motion.div>
                    )}

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MOBILE & TABLET ACCORDION VIEW: IMAGES 100% VISIBLE WITH TOUCH EXPAND     */}
        {/* ========================================================================= */}
        <div className={`lg:hidden space-y-3 ${viewMode === "grid" ? "hidden" : "block"}`}>
          {SERVICES.map((srv, idx) => {
            const isExpanded = activeIdx === idx;
            return (
              <div
                key={srv.number}
                onClick={() => setActiveIdx(isExpanded ? -1 : idx)}
                className="rounded-xl overflow-hidden bg-[#1C1B19] text-white border border-white/10 shadow-md cursor-pointer transition-all"
              >
                {/* Visual Image Banner (ALWAYS VISIBLE) */}
                <div className="relative h-28 xs:h-32 sm:h-36 w-full overflow-hidden">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Discipline Pill */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono text-white tracking-widest uppercase border border-white/15">
                      {srv.number}
                    </span>
                    <span className="text-[9px] font-mono text-white/70 uppercase">
                      {srv.subtitle}
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                    <h3 className="font-serif text-xs xs:text-sm font-normal text-white">
                      {srv.title}
                    </h3>
                    <div className={`w-6 h-6 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90 bg-white text-black' : ''}`}>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>

                {/* Expandable Details Area */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="p-4 xs:p-5 bg-[#171615] border-t border-white/10 space-y-3"
                    >
                      <p className="text-xs font-light text-white/80 leading-relaxed">
                        {srv.shortDesc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {srv.deliverables.map((item, dIdx) => (
                          <span
                            key={dIdx}
                            className="px-2 py-0.5 rounded-sm bg-white/10 text-[9px] font-mono tracking-wider text-white uppercase"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between sm:justify-start gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedServiceForModal(srv);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-white text-black text-[11px] font-mono tracking-wider uppercase font-semibold flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Full Scope</span>
                          <ArrowUpRight size={12} />
                        </button>

                        <a
                          href="#contact"
                          className="text-[11px] font-mono tracking-wider uppercase text-white/70 hover:text-white underline underline-offset-4"
                        >
                          Inquire
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* VIEW 2: SHOWCASE GRID (ALL IMAGES PROMINENTLY VISIBLE IN A 3-COL / 2-COL)  */}
        {/* ========================================================================= */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {SERVICES.map((srv) => (
              <div
                key={srv.number}
                onClick={() => setSelectedServiceForModal(srv)}
                className="group relative rounded-xl overflow-hidden bg-white dark:bg-[#1A1918] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                data-cursor="pointer"
              >
                {/* Card Top: Visual Image Frame (Height strictly proportioned) */}
                <div className="relative w-full h-44 xs:h-48 sm:h-52 overflow-hidden bg-[#E8E3DB] dark:bg-[#121110]">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono tracking-widest uppercase border border-white/15">
                      {srv.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-mono tracking-wider text-white">
                      {srv.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] font-mono text-white/80 uppercase">
                      {srv.subtitle}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Concise Typography */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif text-xs sm:text-sm font-normal text-[#1C1B19] dark:text-white tracking-tight mb-2 group-hover:text-[#4A5844] dark:group-hover:text-[#D9CEBE] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs font-light text-[#57544E] dark:text-[#A09C94] leading-relaxed line-clamp-2 mb-3">
                      {srv.shortDesc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8F8B83] uppercase tracking-wider">
                      {srv.highlightStat}
                    </span>
                    <span className="text-xs font-mono font-medium text-[#1C1B19] dark:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>SCOPE</span>
                      <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE DELIVERABLES SCOPE MODAL                                      */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {selectedServiceForModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedServiceForModal(null)}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl rounded-2xl bg-[#FAF8F5] dark:bg-[#1A1918] text-[#1C1B19] dark:text-[#FAF8F5] shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 max-h-[90dvh] flex flex-col"
              >
                {/* Modal Hero Banner with Image */}
                <div className="relative h-36 xs:h-44 sm:h-56 w-full shrink-0 overflow-hidden">
                  <img
                    src={selectedServiceForModal.image}
                    alt={selectedServiceForModal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <button
                    onClick={() => setSelectedServiceForModal(null)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20"
                    aria-label="Close modal"
                  >
                    <X size={16} />
                  </button>

                  <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 text-white">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-white/70 block mb-0.5 sm:mb-1">
                      DISCIPLINE {selectedServiceForModal.number} • {selectedServiceForModal.badge}
                    </span>
                    <h3 className="font-serif text-sm xs:text-base sm:text-lg font-normal text-white">
                      {selectedServiceForModal.title}
                    </h3>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-4 xs:p-6 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto">
                  <div>
                    <h4 className="text-xs font-mono tracking-widest uppercase text-[#8F8B83] mb-1.5 sm:mb-2">
                      DISCIPLINE PHILOSOPHY
                    </h4>
                    <p className="text-xs sm:text-sm font-light text-[#57544E] dark:text-[#A09C94] leading-relaxed">
                      {selectedServiceForModal.shortDesc}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono tracking-widest uppercase text-[#8F8B83] mb-2 sm:mb-3">
                      KEY DELIVERABLES & DOCUMENTATION
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                      {selectedServiceForModal.deliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs font-mono"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#4A5844] text-white flex items-center justify-center shrink-0">
                            <Check size={10} />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 sm:pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <span className="text-xs font-mono text-[#8F8B83] text-center sm:text-left">
                      Standard Execution: 4–12 Weeks
                    </span>
                    <a
                      href="#contact"
                      onClick={() => setSelectedServiceForModal(null)}
                      className="px-4 sm:px-5 py-2.5 rounded-full bg-[#1C1B19] text-[#FAF8F5] dark:bg-white dark:text-[#1C1B19] text-xs font-mono tracking-wider uppercase font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <span>Consult on this Discipline</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
