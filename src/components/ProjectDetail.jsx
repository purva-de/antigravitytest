import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Play, Maximize2, CheckCircle2, MapPin, Calendar, Layers, Ruler } from 'lucide-react';
import { PROJECTS_DATA } from '../data/projectsData';

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

  if (!project) return null;

  // Find next project
  const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS_DATA[(currentIndex + 1) % PROJECTS_DATA.length];
  const prevProject = PROJECTS_DATA[(currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] overflow-y-auto selection:bg-[#2C2A26] selection:text-[#FAF8F5] transition-colors duration-500"
      id="project-detail-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      {/* Top Floating Bar */}
      <div className="sticky top-0 z-30 w-full glass-nav px-4 xs:px-6 sm:px-12 py-3 xs:py-4 flex items-center justify-between border-b border-[#1C1B19]/10 dark:border-white/10 pt-safe">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase hover:text-[#4F5542] dark:hover:text-[#D9CEBE] transition-colors focus:outline-hidden"
          data-cursor="pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </button>

        <div className="hidden sm:block text-xs font-mono text-[#8F8B83] tracking-widest uppercase">
          PROJECT ARCHIVE • 0{currentIndex + 1} OF 0{PROJECTS_DATA.length}
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full border border-[#1C1B19]/20 dark:border-white/20 flex items-center justify-center hover:bg-[#1C1B19] hover:text-[#FAF8F5] dark:hover:bg-[#FAF8F5] dark:hover:text-[#1C1B19] transition-all duration-200 focus:outline-hidden"
          aria-label="Close Case Study"
          data-cursor="pointer"
        >
          <X size={16} />
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4 xs:px-6 sm:px-10 lg:px-12 py-8 xs:py-12 sm:py-20 pb-safe">
        
        {/* PROJECT HERO METADATA */}
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono tracking-[0.2em] text-[#8F8B83] uppercase mb-3 sm:mb-4">
            <span>{project.category}</span>
            <span>•</span>
            <span>{project.projectType}</span>
          </div>

          <h1 id="project-title" className="font-serif text-lg xs:text-xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-[#1C1B19] dark:text-[#FAF8F5]">
            {project.name}
          </h1>

          <p className="font-serif italic text-sm xs:text-base sm:text-lg text-[#57544E] dark:text-[#D9CEBE] mt-2 font-light">
            {project.subtitle}
          </p>
        </header>

        {/* Specification Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-4 sm:py-6 border-y border-[#1C1B19]/10 dark:border-white/10 mb-8 sm:mb-12">
          <div>
            <span className="text-[10px] font-mono text-[#8F8B83] tracking-widest uppercase block mb-1">LOCATION</span>
            <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5"><MapPin size={13} className="text-[#4F5542] shrink-0" /> <span className="truncate">{project.location}</span></span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#8F8B83] tracking-widest uppercase block mb-1">YEAR</span>
            <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5"><Calendar size={13} className="text-[#4F5542] shrink-0" /> {project.year}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#8F8B83] tracking-widest uppercase block mb-1">SCALE</span>
            <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5"><Ruler size={13} className="text-[#4F5542] shrink-0" /> {project.area || "Custom"}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#8F8B83] tracking-widest uppercase block mb-1">STATUS</span>
            <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5"><CheckCircle2 size={13} className="text-[#4F5542] shrink-0" /> {project.status}</span>
          </div>
        </div>

        {/* LARGE PROJECT HERO IMAGE */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#E8E3DB] dark:bg-[#1A1918] overflow-hidden rounded-xs mb-16 shadow-xl">
          <img
            src={project.galleryImages[activeImageIndex] || project.heroImage}
            alt={`${project.name} view`}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <button
            onClick={() => setLightboxImage(project.galleryImages[activeImageIndex] || project.heroImage)}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            title="Open Lightbox"
            data-cursor="pointer"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* PROJECT OVERVIEW & DESIGN CONCEPT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          <div className="lg:col-span-4">
            <span className="text-xs font-mono text-[#8F8B83] tracking-[0.2em] uppercase block mb-3">
              01 • DESIGN CONCEPT
            </span>
            <h2 className="font-serif text-sm sm:text-base font-medium leading-snug">
              {project.designConcept}
            </h2>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6 text-[#57544E] dark:text-[#C8C4BC] font-light text-base sm:text-lg leading-relaxed">
            <p>{project.overview}</p>
            <p>{project.designPhilosophy}</p>
          </div>
        </section>

        {/* IMAGE GALLERY & THUMBNAILS */}
        {project.galleryImages && project.galleryImages.length > 1 && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1C1B19]/10 dark:border-white/10">
              <span className="text-xs font-mono text-[#8F8B83] tracking-[0.2em] uppercase">
                02 • ARCHITECTURAL & INTERIOR GALLERY ({project.galleryImages.length} VIEWS)
              </span>
              <span className="text-xs font-mono text-[#8F8B83]">CLICK TO EXPAND</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {project.galleryImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setLightboxImage(imgSrc);
                  }}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-xs cursor-pointer border-2 transition-all duration-300 ${
                    activeImageIndex === idx ? 'border-[#1C1B19] dark:border-white' : 'border-transparent opacity-85 hover:opacity-100'
                  }`}
                  data-cursor="view"
                >
                  <img
                    src={imgSrc}
                    alt={`${project.name} gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* HIGHLIGHT SPECIFICATIONS & SERVICES */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 p-5 xs:p-8 sm:p-12 bg-[#F3EFEA] dark:bg-[#1A1918] rounded-xl sm:rounded-xs mb-12 sm:mb-20">
          <div>
            <span className="text-xs font-mono text-[#8F8B83] tracking-[0.2em] uppercase block mb-3 sm:mb-4">
              SERVICES DELIVERED
            </span>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              {project.services.map((srv, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4F5542] shrink-0" />
                  <span>{srv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-mono text-[#8F8B83] tracking-[0.2em] uppercase block mb-3 sm:mb-4">
              ARCHITECTURAL PARAMETERS
            </span>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {project.highlightStats ? (
                project.highlightStats.map((stat, idx) => (
                  <div key={idx} className="border-l border-[#1C1B19]/15 dark:border-white/15 pl-3 sm:pl-4">
                    <span className="text-[9px] xs:text-[10px] font-mono text-[#8F8B83] uppercase block truncate">{stat.label}</span>
                    <span className="text-xs sm:text-sm font-medium">{stat.value}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs sm:text-sm text-[#8F8B83]">Bespoke Custom Execution</div>
              )}
            </div>
          </div>
        </section>

        {/* NEXT PROJECT NAVIGATION */}
        <footer className="pt-10 sm:pt-16 border-t border-[#1C1B19]/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 sm:gap-8">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="flex items-center gap-3 group text-left focus:outline-hidden justify-between sm:justify-start p-3 sm:p-0 rounded-lg sm:rounded-none bg-black/5 dark:bg-white/5 sm:bg-transparent"
            data-cursor="pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#1C1B19]/20 flex items-center justify-center group-hover:bg-[#1C1B19] group-hover:text-white transition-all shrink-0">
              <ArrowLeft size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#8F8B83] uppercase block">PREVIOUS PROJECT</span>
              <span className="font-serif text-xs sm:text-sm group-hover:underline">{prevProject.name}</span>
            </div>
          </button>

          <button
            onClick={() => onSelectProject(nextProject)}
            className="flex items-center gap-3 group text-right focus:outline-hidden justify-between sm:justify-end p-3 sm:p-0 rounded-lg sm:rounded-none bg-black/5 dark:bg-white/5 sm:bg-transparent"
            data-cursor="pointer"
          >
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono text-[#8F8B83] uppercase block">NEXT PROJECT</span>
              <span className="font-serif text-xs sm:text-sm group-hover:underline">{nextProject.name}</span>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#1C1B19]/20 flex items-center justify-center group-hover:bg-[#1C1B19] group-hover:text-white transition-all shrink-0">
              <ArrowRight size={16} />
            </div>
          </button>
        </footer>

      </main>

      {/* FULLSCREEN LIGHTBOX MODAL */}
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
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
