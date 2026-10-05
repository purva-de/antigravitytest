import React, { useState, useRef } from 'react';
import { ArrowUpRight, Sparkles, Layers, Maximize2 } from 'lucide-react';
import imgStructuralRhythm from '../assets/showcase/structural_rhythm.jpg';
import imgMaterialEssence from '../assets/showcase/material_essence.jpg';
import imgSpatialCalm from '../assets/showcase/spatial_calm.jpg';

const PILLARS_DATA = [
  {
    id: "structural-rhythm",
    number: "0 1",
    title: "Structural Rhythm",
    subtitle: "Cantilevered stone procession & floating thresholds",
    description: "Every step is engineered as an unadorned structural sculpture, bridging levels with light, shadow, and architectural clarity.",
    discipline: "ARCHITECTURAL FORM",
    image: imgStructuralRhythm,
    materials: "Board-Marked Concrete • Laminated Glass • Basalt"
  },
  {
    id: "material-essence",
    number: "0 2",
    title: "Material Essence",
    subtitle: "Fluted timber joinery & ambient cove illumination",
    description: "Honoring raw tactility through warm kiln-dried hardwoods, organic architectural radii, and seamlessly integrated indirect lighting.",
    discipline: "BESPOKE INTERIORS",
    image: imgMaterialEssence,
    materials: "Fluted White Oak • Calacatta Marble • Matte Brass"
  },
  {
    id: "spatial-calm",
    number: "0 3",
    title: "Spatial Calm",
    subtitle: "Expansive double-height volume & uninterrupted flow",
    description: "Balancing generous openness with intimate sanctuaries, calibrated precisely for unhurried residential rituals.",
    discipline: "SPATIAL CHOREOGRAPHY",
    image: imgSpatialCalm,
    materials: "Double-Height Glazing • Acoustic Plaster • Linen"
  }
];

// Single 3D Interactive Tilt Card Component
function InteractiveTiltCard({ pillar, index, isExpanded, onHover, onSelect }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt calculation (-9 deg to +9 deg)
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;
    const sheenX = (x / rect.width) * 100;
    const sheenY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, sheenX, sheenY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHover) onHover(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect && onSelect(pillar)}
      style={{
        perspective: '1200px',
      }}
      className="group relative cursor-pointer h-[280px] xs:h-[320px] sm:h-[350px] lg:h-[380px] w-full transition-all duration-700 ease-out select-none"
      role="button"
      tabIndex={0}
      aria-label={`Explore ${pillar.title}`}
      data-cursor="view"
    >
      {/* 3D Tilted Card Body with Smooth Parallax Depth */}
      <div
        style={{
          transform: isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full rounded-2xl sm:rounded-[1.25rem] overflow-hidden shadow-lg transition-transform duration-200 ease-out bg-[#1A1918] border border-black/10 dark:border-white/15"
      >
        {/* Background Architectural Photograph with Counter-Parallax Scale */}
        <div
          style={{
            transform: isHovered
              ? `scale(1.08) translate3d(${-tilt.rotateY * 1.2}px, ${tilt.rotateX * 1.2}px, 0)`
              : 'scale(1.02) translate3d(0, 0, 0)',
          }}
          className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out"
        >
          <img
            src={pillar.image}
            alt={pillar.title}
            className="w-full h-full object-cover brightness-[0.94] contrast-[1.03]"
            loading="lazy"
          />
        </div>

        {/* Ambient Darkened Gradient Overlay: Clear view on top, readable on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/35" />

        {/* Dynamic Specular Light Sheen (Simulates Architectural Glass Reflection) */}
        {isHovered && (
          <div
            style={{
              background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255, 255, 255, 0.22) 0%, transparent 65%)`,
            }}
            className="absolute inset-0 pointer-events-none transition-opacity duration-150"
          />
        )}

        {/* Top Header: Discipline Tag & Floating Arrow Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-20">
          <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[9px] tracking-[0.2em] font-mono text-white/90 uppercase shadow-xs">
            {pillar.discipline}
          </span>

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:rotate-45 shadow-md">
            <ArrowUpRight size={13} />
          </div>
        </div>

        {/* Bottom Content: Green Micro-Number, Serif Title & Reveal Subtitle */}
        <div
          style={{
            transform: isHovered ? 'translateZ(28px)' : 'translateZ(0px)',
          }}
          className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex flex-col justify-end transition-transform duration-300 ease-out"
        >
          {/* Subtle Green Micro Number */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-semibold tracking-[0.3em] text-[#4E774E] dark:text-[#68A268]">
              {pillar.number}
            </span>
            <span className="w-5 h-px bg-[#4E774E]/40" />
          </div>

          {/* Clean Serif Title */}
          <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-normal text-white tracking-tight leading-tight drop-shadow-md">
            {pillar.title}
          </h3>

          {/* Visible on mobile/tablet, expandable on desktop hover */}
          <div className="overflow-hidden transition-all duration-500 max-md:max-h-24 max-md:opacity-100 max-md:mt-1 max-h-0 opacity-0 md:group-hover:max-h-28 md:group-hover:opacity-100 md:group-hover:mt-1.5">
            <p className="text-[11px] sm:text-xs text-white/85 font-light leading-relaxed mb-1.5 line-clamp-2">
              {pillar.subtitle}
            </p>
            <div className="pt-1.5 border-t border-white/15 flex items-center justify-between text-[9px] font-mono text-white/70 tracking-wider">
              <span>{pillar.materials}</span>
            </div>
          </div>
        </div>

        {/* Subtle Edge Glow on Hover */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-[1.25rem] border border-white/0 group-hover:border-white/30 transition-colors duration-500 pointer-events-none" />
      </div>
    </div>
  );
}

export default function SpatialPillars({ onSelectProject }) {
  const [activeIdx, setActiveIdx] = useState(1);
  const [selectedPillar, setSelectedPillar] = useState(null);

  return (
    <section
      id="intentions"
      className="relative pt-6 sm:pt-8 pb-2 sm:pb-3 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] transition-colors duration-500 overflow-hidden"
      aria-label="Architectural Intentions Showcase"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5 sm:mb-6 pb-3 border-b border-[#1C1B19]/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs tracking-[0.25em] font-mono text-[#8F8B83] uppercase mb-1.5">
              <span className="w-6 sm:w-8 h-px bg-[#1C1B19]/30 dark:bg-white/30" />
              <span>SPATIAL CURATION</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight">
              ARCHITECTURAL INTENTIONS
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs font-mono tracking-widest text-[#8F8B83] uppercase max-w-xs">
            THREE PILLARS DEFINING EVERY RESIDENCE
          </p>
        </div>

        {/* 3-Card Interactive Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 items-stretch">
          {PILLARS_DATA.map((pillar, idx) => (
            <InteractiveTiltCard
              key={pillar.id}
              pillar={pillar}
              index={idx}
              isExpanded={activeIdx === idx}
              onHover={(i) => setActiveIdx(i)}
              onSelect={(p) => setSelectedPillar(p)}
            />
          ))}
        </div>

        {/* Subtle Bottom Interactive Hint */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-[10px] xs:text-[11px] font-mono text-[#8F8B83] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E774E] animate-pulse" />
            <span>INTERACTIVE 3D PERSPECTIVE</span>
          </div>
          <span className="hidden sm:inline">HOVER TO EXPLORE SPATIAL SPECIFICATIONS</span>
          <span className="sm:hidden">TAP TO EXPLORE</span>
        </div>
      </div>

      {/* Pillar Detail Modal */}
      {selectedPillar && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-[#141413] border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl text-white max-h-[90dvh] flex flex-col">
            <div className="relative aspect-video w-full shrink-0 bg-[#0E0D0C]">
              <img
                src={selectedPillar.image}
                alt={selectedPillar.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-transparent to-black/40 pointer-events-none" />
              <button
                onClick={() => setSelectedPillar(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 shadow-md"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="p-5 sm:p-8 space-y-3 sm:space-y-4 overflow-y-auto">
              <div className="flex items-center gap-2 text-xs font-mono text-[#4E774E]">
                <span>{selectedPillar.number}</span>
                <span>•</span>
                <span>{selectedPillar.discipline}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                {selectedPillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                {selectedPillar.description}
              </p>
              <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-[11px] sm:text-xs font-mono text-white/50">
                <span>{selectedPillar.materials}</span>
                <span className="text-[#828C74]">Consilio Studios Architecture</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
