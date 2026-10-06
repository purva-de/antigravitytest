import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Maximize2,
  MapPin,
  Calendar,
  CheckCircle2,
  Ruler,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PROJECTS_DATA, STUDIO_INFO } from '../data/projectsData';

export default function ProjectDetail({ project, onClose, onSelectProject }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxImage) setLightboxImage(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [lightboxImage, onClose]);

  // Reset active image index when active project changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?.id]);

  if (!project) return null;

  const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS_DATA[(currentIndex + 1) % PROJECTS_DATA.length];
  const prevProject = PROJECTS_DATA[(currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length];

  const gallery = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.heroImage];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] flex flex-col h-screen max-h-screen overflow-hidden selection:bg-[#2C2A26] selection:text-[#FAF8F5] transition-colors duration-500"
      id="project-detail-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      {/* Top Bar (Compact Single-Screen Navigation) */}
      <div className="w-full glass-nav px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-[#1C1B19]/10 dark:border-white/10 shrink-0 z-30">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase hover:text-[#4F5542] dark:hover:text-[#D9CEBE] transition-colors"
          data-cursor="pointer"
        >
          <ArrowLeft size={15} />
          <span>Back to Portfolio</span>
        </button>

        <div className="hidden sm:flex items-center gap-2.5 text-xs font-mono text-[#8F8B83] tracking-widest uppercase">
          <span>PROJECT ARCHIVE • 0{currentIndex + 1} OF 0{PROJECTS_DATA.length}</span>
          <span>•</span>
          <span className="text-[#4E774E] dark:text-[#68A268] font-semibold">{project.category}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Prev / Next Buttons */}
          <button
            onClick={() => onSelectProject(prevProject)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#1C1B19]/15 dark:border-white/15 flex items-center justify-center hover:bg-[#1C1B19] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            title={`Previous: ${prevProject.name}`}
            aria-label="Previous project"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => onSelectProject(nextProject)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#1C1B19]/15 dark:border-white/15 flex items-center justify-center hover:bg-[#1C1B19] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            title={`Next: ${nextProject.name}`}
            aria-label="Next project"
          >
            <ChevronRight size={14} />
          </button>

          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#1C1B19]/20 dark:border-white/20 flex items-center justify-center hover:bg-[#1C1B19] hover:text-[#FAF8F5] dark:hover:bg-[#FAF8F5] dark:hover:text-[#1C1B19] transition-all ml-1"
            aria-label="Close Case Study"
            data-cursor="pointer"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Main Single-Screen Dashboard (Split Grid - Fits 1 Screen) */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-3 xs:p-4 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-5 min-h-0 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT COLUMN: Visual Media Suite (Hero Image + Thumbnails) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between h-full min-h-[280px] lg:min-h-0">
          
          {/* Active Large Image Display Frame */}
          <div className="flex-1 relative w-full rounded-xl overflow-hidden bg-[#181716] shadow-md border border-black/10 dark:border-white/10 min-h-0">
            <img
              src={gallery[activeImageIndex] || project.heroImage}
              alt={`${project.name} view ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
            
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Photo Counter Pill (Bottom Left) */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-mono text-white/90 tracking-widest uppercase">
              PHOTO 0{activeImageIndex + 1} / 0{gallery.length}
            </div>

            {/* Fullscreen Zoom Trigger */}
            <button
              onClick={() => setLightboxImage(gallery[activeImageIndex] || project.heroImage)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform hover:scale-105"
              title="Expand photo lightbox"
              aria-label="Expand image"
            >
              <Maximize2 size={12} />
            </button>
          </div>

          {/* Gallery Thumbnails Strip */}
          {gallery.length > 1 && (
            <div className="mt-2.5 flex items-center gap-2 overflow-x-auto shrink-0 pb-1 pt-0.5">
              {gallery.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#4E774E] scale-102 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Select photo ${idx + 1}`}
                >
                  <img src={imgSrc} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Architectural Monograph Dossier */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between h-full min-h-0 bg-white/70 dark:bg-[#181716] rounded-xl p-3.5 sm:p-4.5 lg:p-5 border border-black/5 dark:border-white/10 shadow-xs overflow-y-auto lg:overflow-hidden">
          
          <div className="space-y-3 min-h-0 overflow-y-auto pr-1">
            {/* Header: Eyebrow, Space Title & Subtitle */}
            <div>
              <div className="flex items-center gap-2 text-[9.5px] font-mono text-[#8F8B83] tracking-[0.2em] uppercase mb-1">
                <span className="text-[#4E774E] font-medium">{project.category}</span>
                <span>•</span>
                <span>{project.projectType}</span>
              </div>
              <h1 id="project-title" className="font-serif text-base sm:text-lg lg:text-xl font-normal tracking-tight text-[#1C1B19] dark:text-[#FAF8F5] leading-tight">
                {project.name}
              </h1>
              <p className="font-serif italic text-xs text-[#57544E] dark:text-[#D9CEBE] mt-0.5 font-light line-clamp-1">
                {project.subtitle}
              </p>
            </div>

            {/* 4-Stat Architectural Parameters Strip */}
            <div className="grid grid-cols-2 gap-2 py-2 border-y border-black/5 dark:border-white/10 text-xs">
              <div>
                <span className="text-[9px] font-mono text-[#8F8B83] uppercase block mb-0.5">LOCATION</span>
                <span className="text-[11px] sm:text-xs font-medium flex items-center gap-1 truncate">
                  <MapPin size={11} className="text-[#4E774E] shrink-0" />
                  <span className="truncate">{project.location}</span>
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#8F8B83] uppercase block mb-0.5">SCALE</span>
                <span className="text-[11px] sm:text-xs font-medium flex items-center gap-1 truncate">
                  <Ruler size={11} className="text-[#4E774E] shrink-0" />
                  <span className="truncate">{project.area || 'Custom'}</span>
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#8F8B83] uppercase block mb-0.5">STATUS</span>
                <span className="text-[11px] sm:text-xs font-medium flex items-center gap-1 truncate">
                  <CheckCircle2 size={11} className="text-[#4E774E] shrink-0" />
                  <span className="truncate">{project.status}</span>
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#8F8B83] uppercase block mb-0.5">YEAR</span>
                <span className="text-[11px] sm:text-xs font-medium flex items-center gap-1 truncate">
                  <Calendar size={11} className="text-[#4E774E] shrink-0" />
                  <span className="truncate">{project.year}</span>
                </span>
              </div>
            </div>

            {/* Design Concept & Overview */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-[#8F8B83] tracking-[0.2em] uppercase block">
                01 • DESIGN CONCEPT
              </span>
              <p className="text-[11px] sm:text-xs text-[#1C1B19] dark:text-[#FAF8F5] font-normal leading-relaxed line-clamp-3">
                {project.designConcept}
              </p>
              <p className="text-[10.5px] sm:text-[11px] text-[#57544E] dark:text-[#A09C94] font-light leading-relaxed line-clamp-2">
                {project.overview}
              </p>
            </div>

            {/* Delivered Services Tags */}
            {project.services && (
              <div className="pt-2 border-t border-black/5 dark:border-white/10">
                <span className="text-[9px] font-mono text-[#8F8B83] tracking-[0.2em] uppercase block mb-1.5">
                  DELIVERED SERVICES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.services.slice(0, 4).map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[9px] font-mono text-[#57544E] dark:text-[#C8C4BC]"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTA: Direct WhatsApp Inquiry */}
          <div className="pt-2.5 mt-2.5 border-t border-black/5 dark:border-white/10 shrink-0">
            <a
              href={`${STUDIO_INFO.whatsapp}?text=${encodeURIComponent(`Hello Consilio Studios, I would like to inquire regarding ${project.name} (${project.category}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-full bg-[#1C1B19] dark:bg-white text-white dark:text-black text-[11px] font-mono uppercase tracking-wider font-medium flex items-center justify-center gap-2 hover:bg-[#3D4938] dark:hover:bg-neutral-200 transition-colors shadow-sm"
              data-cursor="pointer"
            >
              <MessageCircle size={14} className="text-[#25D366]" />
              <span>Inquire About Space</span>
            </a>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL (When clicking expand on any photo) */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
        >
          <img
            src={lightboxImage}
            alt="Expanded Architectural View"
            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-xs"
          />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
