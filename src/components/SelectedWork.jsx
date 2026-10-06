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
      className="py-4 xs:py-5 lg:py-4 xl:py-5 lg:min-h-screen lg:max-h-screen lg:flex lg:flex-col lg:justify-between bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] transition-colors duration-500 relative overflow-hidden"
      aria-label="Selected Architectural Work"
    >
      <div className="w-full max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12 lg:h-full lg:flex lg:flex-col lg:justify-between">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER: Title & Small All Criteria Badge                          */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 sm:pb-2.5 border-b border-[#1C1B19]/10 dark:border-white/10 mb-2.5 sm:mb-3 shrink-0">
          
          {/* Left Title & Space Names */}
          <div>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] font-mono text-[#8F8B83] dark:text-[#A09C94] uppercase mb-0.5">
              <span className="w-5 h-px bg-[#1C1B19]/30 dark:bg-white/30" />
              <span>PORTFOLIO CURATION</span>
            </div>
            <h2 className="font-serif text-sm sm:text-base lg:text-lg font-normal tracking-tight">
              SELECTED WORK
            </h2>
          </div>

          {/* Right: Small "ALL CRITERIA" Indicator */}
          <div className="flex items-center">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase bg-[#1C1B19] text-[#FAF8F5] dark:bg-white dark:text-black font-medium">
              ALL CRITERIA ({PROJECTS_DATA.length})
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3x2 ARCHITECTURAL GRID (3 COLUMNS x 2 ROWS) - ALL 6 FIT IN 1 SCREEN       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-3 xl:gap-3.5 items-stretch flex-1 min-h-0">
          {PROJECTS_DATA.map((project, idx) => (
            <div key={project.id} className="w-full h-full min-h-0">
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
        <div className="mt-2 pt-1.5 border-t border-[#1C1B19]/10 dark:border-white/10 flex items-center justify-end shrink-0">
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-[0.18em] uppercase font-medium text-[#1C1B19] dark:text-[#FAF8F5] hover-underline-animation group"
            data-cursor="pointer"
          >
            <span>Commission a Project</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
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
