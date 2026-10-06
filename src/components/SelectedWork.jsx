import React, { useState, useEffect } from 'react';
import { PROJECTS_DATA } from '../data/projectsData';
import ProjectCard from './ProjectCard';
import {
  ArrowRight,
  Bookmark,
  X,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SelectedWork({ onSelectProject }) {
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("consilio_saved_projects");
      return saved ? JSON.parse(saved) : ["living-room"];
    } catch {
      return ["living-room"];
    }
  });
  const [onlySaved, setOnlySaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [lightboxData, setLightboxData] = useState(null);

  // Sync saved bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("consilio_saved_projects", JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }, [bookmarkedIds]);

  const handleToggleBookmark = (project) => {
    const isSaved = bookmarkedIds.includes(project.id);
    const newSaved = isSaved
      ? bookmarkedIds.filter((id) => id !== project.id)
      : [...bookmarkedIds, project.id];
    setBookmarkedIds(newSaved);

    setToastMessage(isSaved ? `Removed "${project.name}" from Moodboard` : `Added "${project.name}" to your Moodboard`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filter projects by saved status or show all criteria
  const filteredProjects = onlySaved
    ? PROJECTS_DATA.filter((project) => bookmarkedIds.includes(project.id))
    : PROJECTS_DATA;

  return (
    <section
      id="work"
      className="pt-3 sm:pt-4 pb-4 sm:pb-6 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] transition-colors duration-500 relative"
      aria-label="Selected Architectural Work"
    >
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER: Title & All Criteria Filter Pill                          */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-5 pb-5 border-b border-[#1C1B19]/10 dark:border-white/10 mb-6 sm:mb-10">
          
          {/* Left Title & Space Names */}
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs tracking-[0.25em] font-mono text-[#8F8B83] dark:text-[#A09C94] uppercase mb-2">
              <span className="w-6 sm:w-8 h-px bg-[#1C1B19]/30 dark:bg-white/30" />
              <span>PORTFOLIO CURATION</span>
            </div>
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
              SELECTED WORK
            </h2>
            <p className="text-xs sm:text-sm text-[#57544E] dark:text-[#A09C94] font-light mt-1.5">
              3×2 architectural monograph — Living Room, Hall, Bedroom, Balcony, TV Unit & Classic Interior.
            </p>
          </div>

          {/* Right: Only "ALL CRITERIA" + Moodboard Button */}
          <div className="flex flex-wrap items-center gap-2 xs:gap-2.5">
            {/* "ALL CRITERIA" Button */}
            <button
              onClick={() => setOnlySaved(false)}
              className={`px-3.5 xs:px-4 py-1.5 xs:py-2 rounded-full text-[11px] xs:text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 xs:gap-2 border shadow-xs ${
                !onlySaved
                  ? 'bg-[#1C1B19] text-[#FAF8F5] dark:bg-white dark:text-black border-transparent font-medium'
                  : 'bg-white dark:bg-[#1A1918] text-[#57544E] dark:text-[#A09C94] border-black/10 dark:border-white/10 hover:border-black/25'
              }`}
              title="Show all criteria"
            >
              <span>ALL CRITERIA</span>
              <span className={`text-[10px] ${!onlySaved ? 'opacity-80' : 'opacity-50'}`}>
                ({PROJECTS_DATA.length})
              </span>
            </button>

            {/* Moodboard Saved Toggle Button */}
            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`px-3.5 xs:px-4 py-1.5 xs:py-2 rounded-full text-[11px] xs:text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 xs:gap-2 border shadow-xs ${
                onlySaved
                  ? 'bg-amber-500 text-white border-amber-400 font-medium'
                  : 'bg-white dark:bg-[#1A1918] text-[#57544E] dark:text-[#A09C94] border-black/10 dark:border-white/10 hover:border-black/25'
              }`}
              title="Filter by saved spaces"
            >
              <Bookmark size={13} className={onlySaved ? 'fill-current' : ''} />
              <span>MOODBOARD ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Empty state if Moodboard is empty */}
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#8F8B83] mb-2">No saved spaces in your moodboard yet.</p>
            <p className="text-xs text-[#8F8B83] mb-4">Click the bookmark icon on any card to save spaces here.</p>
            <button
              onClick={() => setOnlySaved(false)}
              className="text-xs font-mono tracking-widest uppercase underline text-[#1C1B19] dark:text-white"
            >
              View All Criteria
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3x2 ARCHITECTURAL GRID (3 COLUMNS x 2 ROWS)                               */}
        {/* ========================================================================= */}
        {filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {filteredProjects.map((project, idx) => (
              <div key={project.id} className="w-full">
                <ProjectCard
                  project={project}
                  onSelect={onSelectProject}
                  onQuickView={(proj, imgIdx) => setLightboxData({ project: proj, imgIndex: imgIdx })}
                  isBookmarked={bookmarkedIds.includes(project.id)}
                  onToggleBookmark={handleToggleBookmark}
                  index={idx}
                />
              </div>
            ))}
          </div>
        )}

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
      {/* INTERACTIVE TOAST NOTIFICATION FOR SAVED MOODBOARD ITEMS                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-32px)] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#1C1B19] text-[#FAF8F5] dark:bg-[#FAF8F5] dark:text-[#1C1B19] shadow-2xl flex items-center gap-2.5 sm:gap-3 border border-white/10 text-[11px] sm:text-xs font-mono"
          >
            <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Check size={11} />
            </div>
            <span className="truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h3 className="font-serif text-lg sm:text-2xl">{lightboxData.project.name}</h3>
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
