import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/projectsData';
import ProjectCard from './ProjectCard';
import {
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SelectedWork({ onSelectProject }) {
  const [lightboxData, setLightboxData] = useState(null);

  return (
    <section
      id="work"
      className="pt-3 sm:pt-4 pb-4 sm:pb-6 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] transition-colors duration-500 relative"
      aria-label="Selected Architectural Work"
    >
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER: Title & Small All Criteria Badge                          */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-5 pb-5 border-b border-[#1C1B19]/10 dark:border-white/10 mb-6 sm:mb-10">
          
          {/* Left Title & Space Names */}
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs tracking-[0.25em] font-mono text-[#8F8B83] dark:text-[#A09C94] uppercase mb-2">
              <span className="w-6 sm:w-8 h-px bg-[#1C1B19]/30 dark:bg-white/30" />
              <span>PORTFOLIO CURATION</span>
            </div>
            <h2 className="font-serif text-base xs:text-lg sm:text-xl lg:text-2xl font-normal tracking-tight">
              SELECTED WORK
            </h2>
            <p className="text-xs sm:text-sm text-[#57544E] dark:text-[#A09C94] font-light mt-1.5">
              3×2 architectural monograph — Living Room, Hall, Bedroom, Balcony, TV Unit & Classic Interior.
            </p>
          </div>

          {/* Right: Small "ALL CRITERIA" Indicator */}
          <div className="flex items-center">
            <span className="px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-widest uppercase bg-[#1C1B19] text-[#FAF8F5] dark:bg-white dark:text-black font-medium">
              ALL CRITERIA ({PROJECTS_DATA.length})
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3x2 ARCHITECTURAL GRID (3 COLUMNS x 2 ROWS)                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {PROJECTS_DATA.map((project, idx) => (
            <div key={project.id} className="w-full">
              <ProjectCard
                project={project}
                onSelect={onSelectProject}
                onQuickView={(proj, imgIdx) => setLightboxData({ project: proj, imgIndex: imgIdx })}
                index={idx}
              />
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM CALLOUT & ARCHITECTURAL INQUIRY ACTION                             */}
        {/* ========================================================================= */}
        <div className="mt-8 sm:mt-10 pt-4 border-t border-[#1C1B19]/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs font-light text-[#57544E] dark:text-[#A09C94] max-w-lg">
            Hover over any space card to preview its architectural video. Click <span className="font-mono text-[#1C1B19] dark:text-white font-medium">SPECS</span> for exact dimensions & materials, or click the card to explore the full monograph.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.18em] uppercase font-medium text-[#1C1B19] dark:text-[#FAF8F5] hover-underline-animation group"
            data-cursor="pointer"
          >
            <span>Commission a Project</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>

      </div>



      {/* ========================================================================= */}
      {/* INTERACTIVE LIGHTBOX / FULLSCREEN ZOOM MODAL                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {lightboxData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxData(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 xs:p-4 sm:p-8"
          >
            {/* Lightbox Topbar */}
            <div className="flex items-center justify-between text-white pb-3 sm:pb-4 border-b border-white/10">
              <div>
                <h3 className="font-serif text-xs sm:text-sm">{lightboxData.project.name}</h3>
                <p className="text-[10px] sm:text-xs font-mono text-[#A09C94] uppercase tracking-wider">
                  {lightboxData.project.category} • {lightboxData.project.location} • PHOTO {lightboxData.imgIndex + 1} OF {lightboxData.project.galleryImages.length}
                </p>
              </div>

              <button
                onClick={() => setLightboxData(null)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close lightbox"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Lightbox Image Viewport */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[70vh] mx-auto my-auto flex items-center justify-center w-full"
            >
              <img
                src={lightboxData.project.galleryImages[lightboxData.imgIndex] || lightboxData.project.heroImage}
                alt={lightboxData.project.name}
                className="max-w-full max-h-[65vh] sm:max-h-[68vh] object-contain rounded-lg shadow-2xl border border-white/10"
              />

              {/* Prev / Next Arrows in Lightbox (responsive placement) */}
              {lightboxData.project.galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setLightboxData((prev) => ({
                      ...prev,
                      imgIndex: prev.imgIndex > 0 ? prev.imgIndex - 1 : prev.project.galleryImages.length - 1
                    }))}
                    className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-20 backdrop-blur-xs"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() => setLightboxData((prev) => ({
                      ...prev,
                      imgIndex: prev.imgIndex < prev.project.galleryImages.length - 1 ? prev.imgIndex + 1 : 0
                    }))}
                    className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-20 backdrop-blur-xs"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Strip with horizontal swipe on mobile */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-start sm:justify-center gap-2 pt-3 sm:pt-4 border-t border-white/10 overflow-x-auto no-scrollbar max-w-full px-1"
            >
              {lightboxData.project.galleryImages.map((img, thumbIdx) => (
                <button
                  key={thumbIdx}
                  onClick={() => setLightboxData((prev) => ({ ...prev, imgIndex: thumbIdx }))}
                  className={`w-12 h-9 sm:w-14 sm:h-10 shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                    lightboxData.imgIndex === thumbIdx
                      ? 'border-white scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
