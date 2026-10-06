import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Maximize2, Sliders, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STUDIO_INFO } from '../data/projectsData';

export default function ProjectCard({
  project,
  onSelect,
  onQuickView,
  index = 0
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSpecs, setShowSpecs] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const playPromiseRef = useRef(null);

  // 1. Detect touch devices and accessibility reduced-motion preference
  useEffect(() => {
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setIsTouchDevice(!hasFinePointer);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
      return () => motionQuery.removeEventListener('change', handleMotionChange);
    }
  }, []);

  // 2. Performance: Lazy-load video using IntersectionObserver
  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            pauseAndResetVideo();
          }
        });
      },
      { rootMargin: '240px' }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Video Playback Controllers
  const playVideoFromStart = () => {
    if (prefersReducedMotion || !project.video) return;
    const video = videoRef.current;
    if (!video) return;

    try {
      video.currentTime = 0;
    } catch (e) {}

    video.muted = true;
    setIsEnded(false);
    setProgress(0);

    const promise = video.play();
    playPromiseRef.current = promise;

    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
          setIsVideoVisible(true);
        })
        .catch(() => {
          // Playback interrupted by mouseleave pause — expected and handled
        });
    }
  };

  const pauseAndResetVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playPromiseRef.current !== null) {
      playPromiseRef.current
        .then(() => {
          video.pause();
          try {
            video.currentTime = 0;
          } catch (e) {}
        })
        .catch(() => {
          video.pause();
          try {
            video.currentTime = 0;
          } catch (e) {}
        })
        .finally(() => {
          playPromiseRef.current = null;
        });
    } else {
      video.pause();
      try {
        video.currentTime = 0;
      } catch (e) {}
    }

    setIsPlaying(false);
    setIsVideoVisible(false);
    setIsEnded(false);
    setProgress(0);
  };

  // 4. Desktop Mouse Handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isTouchDevice) return;
    playVideoFromStart();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isTouchDevice) return;
    pauseAndResetVideo();
  };

  // 5. Video Event Handlers
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    }
  };

  const handleVideoPlaying = () => {
    setIsPlaying(true);
    setIsVideoVisible(true);
  };

  const handleVideoEnded = () => {
    setIsEnded(true);
    setIsPlaying(false);
    setProgress(100);
  };

  // 6. Mobile Touch Tap Handler
  const handleMediaTap = (e) => {
    if (!isTouchDevice) {
      onSelect(project);
      return;
    }

    e.stopPropagation();

    if (prefersReducedMotion || !project.video) {
      onSelect(project);
      return;
    }

    if (isPlaying || isEnded) {
      pauseAndResetVideo();
    } else {
      playVideoFromStart();
    }
  };


  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(project, 0);
    } else {
      onSelect(project);
    }
  };

  const handleToggleSpecs = (e) => {
    e.stopPropagation();
    setShowSpecs(!showSpecs);
  };

  return (
    <article
      ref={cardRef}
      onClick={() => onSelect(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer flex flex-col select-none w-full bg-white dark:bg-[#181716] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 hover:shadow-xl transition-all duration-300 transform-gpu hover:-translate-y-1"
      data-cursor="view"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(project);
      }}
      aria-label={`View space details for ${project.name}`}
    >
      {/* 
        ARCHITECTURAL MEDIA FRAME:
        Balanced aspect ratio (16/11) with crisp image and smooth video playback on hover.
      */}
      <div
        onClick={handleMediaTap}
        className="relative w-full aspect-[16/11] overflow-hidden bg-[#E8E3DB] dark:bg-[#1A1918]"
      >
        {/* STILL ARCHITECTURAL POSTER IMAGE (Default State) */}
        <img
          src={project.heroImage}
          alt={`${project.name} architectural view`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* HTML5 VIDEO OVERLAY (Clean crossfade when hovering) */}
        {project.video && !prefersReducedMotion && (
          <video
            ref={videoRef}
            src={isInView ? project.video : undefined}
            preload="metadata"
            muted
            defaultMuted
            playsInline
            webkit-playsinline="true"
            loop={false}
            onTimeUpdate={handleTimeUpdate}
            onPlaying={handleVideoPlaying}
            onEnded={handleVideoEnded}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ease-out ${
              isVideoVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Subtle Dark Gradient Overlay at Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Top Badges & Quick Action Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* Space Name Badge */}
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] tracking-[0.2em] font-mono text-white uppercase border border-white/15 shadow-sm font-medium">
              {project.category}
            </span>

            {/* Subtle Live Video Motion Indicator */}
            {isVideoVisible && isPlaying && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-600/90 backdrop-blur-md text-[8px] font-mono text-white tracking-widest uppercase border border-amber-400/30 shadow-xs animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                MOTION
              </span>
            )}
          </div>

          {/* Top Right Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* Quick Lightbox Expand Icon */}
            <button
              onClick={handleQuickViewClick}
              className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 border border-white/15"
              title="Expand photo lightbox"
              aria-label="Expand image"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>



        {/* Ultra-Thin 2px Gold Architectural Playback Progress Bar */}
        {isVideoVisible && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/40 z-20 overflow-hidden pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Inline Architectural Specs Drawer (Toggled via [Specs] button) */}
        <AnimatePresence>
          {showSpecs && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 bg-[#1C1B19]/95 backdrop-blur-md text-[#FAF8F5] p-3.5 sm:p-4 flex flex-col justify-between z-30"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/15 mb-2.5 sm:mb-3">
                  <span className="text-[10px] font-mono tracking-widest text-[#828C74] uppercase font-semibold">
                    {project.category} SPECIFICATION
                  </span>
                  <button
                    onClick={handleToggleSpecs}
                    className="text-[10px] font-mono text-white/60 hover:text-white px-2 py-0.5 rounded-sm border border-white/20"
                  >
                    CLOSE
                  </button>
                </div>

                <div className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#A09C94]">SCALE:</span>
                    <span className="text-white font-medium">{project.area || 'Bespoke'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A09C94]">LOCATION:</span>
                    <span className="text-white truncate max-w-[170px] text-right">
                      {project.location}
                    </span>
                  </div>
                  {project.highlightStats?.[1] && (
                    <div className="flex justify-between">
                      <span className="text-[#A09C94] truncate max-w-[90px]">
                        {project.highlightStats[1].label}:
                      </span>
                      <span className="text-white truncate max-w-[150px] text-right">
                        {project.highlightStats[1].value}
                      </span>
                    </div>
                  )}
                  {project.highlightStats?.[2] && (
                    <div className="flex justify-between">
                      <span className="text-[#A09C94] truncate max-w-[90px]">
                        {project.highlightStats[2].label}:
                      </span>
                      <span className="text-white truncate max-w-[150px] text-right">
                        {project.highlightStats[2].value}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onSelect(project)}
                className="w-full py-2 rounded-md bg-white text-black text-[10px] font-mono tracking-wider uppercase font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>OPEN SPACE DETAILS</span>
                <ArrowUpRight size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clean, Refined Metadata Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-serif text-xs sm:text-sm font-normal text-[#1C1B19] dark:text-[#FAF8F5] tracking-tight group-hover:text-[#4F5542] dark:group-hover:text-[#D9CEBE] transition-colors duration-200">
              {project.name}
            </h3>
            <span className="text-[10px] font-mono text-[#8F8B83] dark:text-[#7A766F] shrink-0">
              {project.area}
            </span>
          </div>
          <p className="text-xs text-[#57544E] dark:text-[#A09C94] font-light line-clamp-1">
            {project.subtitle}
          </p>
        </div>

        {/* Action Buttons: Specs + Contact symbol only */}
        <div className="mt-3.5 pt-2.5 border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleToggleSpecs}
            className={`px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-sm text-[10px] font-mono tracking-wider transition-colors flex items-center gap-1.5 ${
              showSpecs
                ? 'bg-[#1C1B19] text-white dark:bg-white dark:text-black font-medium'
                : 'bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#57544E] hover:text-[#1C1B19] dark:text-[#A09C94] dark:hover:text-white'
            }`}
            title="Toggle architectural specifications"
            aria-label="Toggle specs"
          >
            <Sliders size={11} />
            <span>SPECS</span>
          </button>

          <a
            href={`${STUDIO_INFO.whatsapp}?text=${encodeURIComponent(`Hello Consilio Studios, I am interested in inquiring about your ${project.category} (${project.name}) design.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 sm:w-6 sm:h-6 rounded-sm bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white dark:text-[#25D366] dark:hover:text-black transition-colors flex items-center justify-center shrink-0"
            title={`Contact Consilio Studios about ${project.name}`}
            aria-label={`Contact about ${project.name}`}
          >
            <MessageCircle size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}
