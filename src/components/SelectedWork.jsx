import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { PROJECTS_DATA, STUDIO_INFO } from '../data/projectsData';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sliders,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// EXACT 5 CRITERIA REQUIRED BY CLIENT (IN ORDER)
// 1) Living Room  2) Bedroom  3) Balcony  4) TV unit  5) Classic interior
// =============================================================================
const CRITERIA_CONFIG = [
  { id: 'living-room', num: '01', criteriaName: 'Living Room' },
  { id: 'bedroom', num: '02', criteriaName: 'Bedroom' },
  { id: 'balcony', num: '03', criteriaName: 'Balcony' },
  { id: 'tv-showcase', num: '04', criteriaName: 'TV unit' },
  { id: 'wooden-interior', num: '05', criteriaName: 'Classic interior' }
];

const SELECTED_CRITERIA_PROJECTS = CRITERIA_CONFIG.map((cfg) => {
  const proj = PROJECTS_DATA.find((p) => p.id === cfg.id);
  return {
    ...proj,
    criteriaNum: cfg.num,
    criteriaTitle: cfg.criteriaName
  };
});

// Repeat 5 criteria 3 times = 15 virtual cards for seamless infinite flow
const VIRTUAL_COUNT = 15;
const CRITERIA_COUNT = SELECTED_CRITERIA_PROJECTS.length; // 5

// =============================================================================
// INDIVIDUAL 3D CAROUSEL CARD COMPONENT
// =============================================================================
function CurvedPanoramaCard({
  project,
  virtualIndex,
  cardWidth,
  cardHeight,
  onSelectProject,
  onQuickView,
  onSpecsToggle,
  isSpecsOpen,
  dragDistRef,
  setCardElementRef,
  setShadowElementRef
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const videoRef = useRef(null);
  const playPromiseRef = useRef(null);

  // Play video smoothly on desktop hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!project.video) return;
    const video = videoRef.current;
    if (!video) return;

    try {
      video.currentTime = 0;
    } catch (e) {}

    video.muted = true;
    const promise = video.play();
    playPromiseRef.current = promise;
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsVideoPlaying(true);
          setIsVideoVisible(true);
        })
        .catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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

    setIsVideoPlaying(false);
    setIsVideoVisible(false);
    setVideoProgress(0);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      setVideoProgress(Math.min(100, Math.max(0, pct)));
    }
  };

  // Click card to open monograph (suppressed if dragged)
  const handleCardClick = (e) => {
    if (dragDistRef.current > 6) {
      e.preventDefault();
      return;
    }
    onSelectProject(project);
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    onQuickView(project, 0);
  };

  const handleSpecsButtonClick = (e) => {
    e.stopPropagation();
    onSpecsToggle(virtualIndex);
  };

  return (
    <article
      ref={(el) => setCardElementRef(virtualIndex, el)}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute top-0 cursor-pointer select-none rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl bg-[#EFECE6] dark:bg-[#181716] group transition-shadow duration-300"
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        left: `calc(50% - ${cardWidth / 2}px)`,
        transformOrigin: '50% 50%',
        willChange: 'transform'
      }}
      role="group"
      aria-roledescription="slide"
      aria-label={`${project.criteriaTitle}: ${project.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelectProject(project);
      }}
    >
      {/* Dynamic 3D Atmospheric Lighting Shadow Overlay */}
      <div
        ref={(el) => setShadowElementRef(virtualIndex, el)}
        className="absolute inset-0 bg-black pointer-events-none z-20 transition-opacity duration-75"
        style={{ opacity: 0 }}
      />

      {/* ===================================================================== */}
      {/* MEDIA FRAME: High-Res Poster + Smooth Hover Video                      */}
      {/* ===================================================================== */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Still Architectural Image */}
        <img
          src={project.heroImage}
          alt={`${project.name} architectural space`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Video Overlay on Hover */}
        {project.video && (
          <video
            ref={videoRef}
            src={project.video}
            preload="metadata"
            muted
            playsInline
            webkit-playsinline="true"
            loop
            onTimeUpdate={handleTimeUpdate}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ease-out ${
              isVideoVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Cinematic Gradient Vignette at Top and Bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

        {/* Top Badges & Controls */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          {/* Criteria Tag Pill (e.g. 01 • LIVING ROOM) */}
          <span className="px-2 py-0.5 rounded-full bg-black/60 dark:bg-black/75 backdrop-blur-md text-[8px] sm:text-[8.5px] font-mono font-medium tracking-widest text-[#FAF8F5] uppercase border border-white/15 shadow-sm">
            {project.criteriaNum} • {project.criteriaTitle}
          </span>

          {/* Quick Lightbox Expand Icon */}
          <button
            onClick={handleQuickViewClick}
            className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20 active:scale-90"
            title="Expand photo lightbox"
            aria-label={`Expand photo for ${project.name}`}
          >
            <Maximize2 size={11} />
          </button>
        </div>

        {/* Ultra-Thin Gold Architectural Video Playback Progress Bar */}
        {isVideoVisible && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-black/40 z-20 overflow-hidden pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-100 ease-linear"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
        )}

        {/* ===================================================================== */}
        {/* LOWER METADATA OVERLAY (Space Name, Area, Specs, Contact)              */}
        {/* ===================================================================== */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5 text-white z-10 flex flex-col justify-end">
          <div className="mb-2">
            <div className="flex items-baseline justify-between gap-2 mb-0.5">
              <h3 className="font-serif text-xs sm:text-sm font-normal tracking-tight text-white drop-shadow-sm group-hover:text-amber-200 transition-colors">
                {project.name}
              </h3>
              <span className="text-[9px] font-mono text-[#D9CEBE] shrink-0 font-light">
                {project.area}
              </span>
            </div>
            <p className="text-[10px] sm:text-[10.5px] text-[#E5E0D8]/80 font-light line-clamp-1">
              {project.subtitle}
            </p>
          </div>

          {/* Action Row: SPECS button + WhatsApp contact icon (frameless) */}
          <div className="pt-1.5 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSpecsButtonClick}
                className={`px-2 py-0.5 rounded-xs text-[8.5px] font-mono tracking-wider transition-colors flex items-center gap-1 ${
                  isSpecsOpen
                    ? 'bg-white text-black font-semibold'
                    : 'bg-white/15 hover:bg-white/25 text-white/90 border border-white/20'
                }`}
                title="Toggle architectural specifications"
                aria-label={`Toggle specs for ${project.name}`}
              >
                <Sliders size={9} />
                <span>SPECS</span>
              </button>

              <a
                href={`${STUDIO_INFO.whatsapp}?text=${encodeURIComponent(`Hello Consilio Studios, I am interested in inquiring about your ${project.criteriaTitle} (${project.name}) design.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-0.5 text-[#25D366] hover:text-[#1ebe5b] transition-all hover:scale-115 active:scale-95 flex items-center justify-center shrink-0"
                title={`WhatsApp inquiry for ${project.name}`}
                aria-label={`WhatsApp inquiry for ${project.name}`}
              >
                <MessageCircle size={14} />
              </a>
            </div>

            <span className="text-[8.5px] font-mono uppercase tracking-wider text-white/60 group-hover:text-white inline-flex items-center gap-0.5 transition-colors">
              <span>EXPLORE</span>
              <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* COMPACT ARCHITECTURAL SPECS DRAWER (Toggled via [SPECS] button)       */}
        {/* ===================================================================== */}
        <AnimatePresence>
          {isSpecsOpen && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 bg-[#1C1B19]/96 backdrop-blur-md text-[#FAF8F5] p-4 flex flex-col justify-between z-30"
            >
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-white/15 mb-2.5">
                  <span className="text-[9px] font-mono tracking-widest text-[#828C74] uppercase font-semibold">
                    {project.criteriaNum} • {project.criteriaTitle} SPECIFICATION
                  </span>
                  <button
                    onClick={handleSpecsButtonClick}
                    className="text-[8.5px] font-mono text-white/60 hover:text-white px-1.5 py-0.5 rounded-xs border border-white/20"
                  >
                    CLOSE
                  </button>
                </div>

                <div className="space-y-1.5 text-[9px] font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-[#A09C94]">SCALE:</span>
                    <span className="text-white font-medium">{project.area || 'Bespoke'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-[#A09C94]">LOCATION:</span>
                    <span className="text-white truncate max-w-[160px] text-right">
                      {project.location}
                    </span>
                  </div>
                  {project.highlightStats?.[0] && (
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#A09C94] truncate max-w-[95px]">
                        {project.highlightStats[0].label}:
                      </span>
                      <span className="text-white truncate max-w-[150px] text-right">
                        {project.highlightStats[0].value}
                      </span>
                    </div>
                  )}
                  {project.highlightStats?.[1] && (
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#A09C94] truncate max-w-[95px]">
                        {project.highlightStats[1].label}:
                      </span>
                      <span className="text-white truncate max-w-[150px] text-right">
                        {project.highlightStats[1].value}
                      </span>
                    </div>
                  )}
                  {project.highlightStats?.[2] && (
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#A09C94] truncate max-w-[95px]">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProject(project);
                }}
                className="w-full py-2 rounded-md bg-white text-black text-[9px] font-mono tracking-wider uppercase font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 shadow-md mt-2"
              >
                <span>OPEN FULL MONOGRAPH</span>
                <ArrowUpRight size={11} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

// =============================================================================
// MAIN 3D CURVED PANORAMA CAROUSEL COMPONENT
// =============================================================================
function CurvedPanoramaCarousel({ onSelectProject, onQuickView }) {
  const containerRef = useRef(null);
  const cardElementsRef = useRef([]);
  const shadowElementsRef = useRef([]);

  // Responsive Layout Parameters
  const [dimensions, setDimensions] = useState({
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
    cardWidth: 360,
    cardHeight: 500,
    cardGap: 24,
    step: 384,
    radius: 1100,
    perspective: 1100,
    curvatureFactor: 0.85,
    depthFactor: 1.25
  });

  const [activeSpecsIndex, setActiveSpecsIndex] = useState(null);
  const [activeCenterCriterion, setActiveCenterCriterion] = useState(0);

  // Animation & Motion Refs
  const currentOffsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const dragDistRef = useRef(0);
  const isReducedMotionRef = useRef(false);
  const lastTimeRef = useRef(0);
  const rafIdRef = useRef(null);

  // 1. Responsive Resizing (Compact & Balanced Proportions)
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth || window.innerWidth;

    let cWidth, cHeight, cGap, rad, persp, curve, depth;

    if (w < 640) {
      cWidth = Math.min(210, Math.floor(w * 0.60));
      cHeight = Math.floor(cWidth * 1.36); // ~285px
      cGap = 14;
      rad = 560;
      persp = 750;
      curve = 0.90;
      depth = 1.28;
    } else if (w < 1024) {
      cWidth = 240;
      cHeight = 330;
      cGap = 16;
      rad = 760;
      persp = 880;
      curve = 0.88;
      depth = 1.25;
    } else {
      cWidth = 270;
      cHeight = 370;
      cGap = 18;
      rad = 920;
      persp = 980;
      curve = 0.85;
      depth = 1.25;
    }

    setDimensions({
      viewportWidth: w,
      cardWidth: cWidth,
      cardHeight: cHeight,
      cardGap: cGap,
      step: cWidth + cGap,
      radius: rad,
      perspective: persp,
      curvatureFactor: curve,
      depthFactor: depth
    });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotionRef.current = motionQuery.matches;
    const handleMotion = (e) => {
      isReducedMotionRef.current = e.matches;
    };
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotion);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotion);
      }
    };
  }, [updateDimensions]);

  // Set card and shadow element refs
  const setCardElementRef = useCallback((idx, el) => {
    cardElementsRef.current[idx] = el;
  }, []);

  const setShadowElementRef = useCallback((idx, el) => {
    shadowElementsRef.current[idx] = el;
  }, []);

  // 2. High-Performance 60fps/120fps Cylindrical Projection Loop
  const animate = useCallback(
    (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min(32, time - lastTimeRef.current) / 16.67;
      lastTimeRef.current = time;

      const {
        step,
        viewportWidth,
        radius,
        curvatureFactor,
        depthFactor,
        cardWidth
      } = dimensions;

      const cycleLength = CRITERIA_COUNT * step; // 5 * step
      const trackLength = VIRTUAL_COUNT * step;  // 15 * step

      // Continuous Right-to-Left Auto-Scroll (advancing offset)
      // Pauses on hover, active dragging, reduced motion, or open specs drawer
      const isPaused =
        isHoveredRef.current ||
        isDraggingRef.current ||
        isReducedMotionRef.current ||
        activeSpecsIndex !== null;

      if (!isPaused) {
        // Continuous brisk flow moving right to left: ~70px/sec
        const autoSpeed = 1.15;
        targetOffsetRef.current += autoSpeed * dt;
      }

      // Smooth Snappy Lerp Glide
      const diff = targetOffsetRef.current - currentOffsetRef.current;
      currentOffsetRef.current += diff * (isDraggingRef.current ? 1 : 0.16);

      // Keep currentOffset normalized within track range
      if (currentOffsetRef.current > trackLength * 10) {
        currentOffsetRef.current -= trackLength * 10;
        targetOffsetRef.current -= trackLength * 10;
      } else if (currentOffsetRef.current < -trackLength * 10) {
        currentOffsetRef.current += trackLength * 10;
        targetOffsetRef.current += trackLength * 10;
      }

      const offset = currentOffsetRef.current;

      // Update active center criterion index (0 to 4)
      const centerCriterion = (Math.round(offset / step) % CRITERIA_COUNT + CRITERIA_COUNT) % CRITERIA_COUNT;
      setActiveCenterCriterion(centerCriterion);

      // Calculate 3D cylindrical transform for each of the 15 virtual cards
      for (let k = 0; k < VIRTUAL_COUNT; k++) {
        const cardEl = cardElementsRef.current[k];
        const shadowEl = shadowElementsRef.current[k];
        if (!cardEl) continue;

        // Position on the continuous track wrapped symmetrically around center
        let x = (k * step - offset) % trackLength;
        if (x < -trackLength / 2) x += trackLength;
        if (x > trackLength / 2) x -= trackLength;

        // Visibility Culling for off-screen cards
        const isVisible = Math.abs(x) < viewportWidth / 2 + cardWidth + 120;

        if (!isVisible) {
          cardEl.style.visibility = 'hidden';
          continue;
        }

        cardEl.style.visibility = 'visible';

        // 3D Cylindrical Geometry Projection
        const theta = x / radius; // angle in radians
        const rotY = -theta * (180 / Math.PI) * curvatureFactor;
        const transZ = -radius * (1 - Math.cos(theta)) * depthFactor;
        const transX = radius * Math.sin(theta);

        cardEl.style.transform = `translate3d(${transX.toFixed(2)}px, 0px, ${transZ.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg)`;
        cardEl.style.zIndex = `${Math.round(100 - Math.abs(x) / 10)}`;

        // Atmospheric Depth Lighting
        if (shadowEl) {
          const shadowOpacity = Math.min(
            0.45,
            Math.pow(Math.abs(x) / (radius * 1.35), 1.5)
          );
          shadowEl.style.opacity = shadowOpacity.toFixed(3);
        }
      }

      rafIdRef.current = requestAnimationFrame(animate);
    },
    [dimensions, activeSpecsIndex]
  );

  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [animate]);

  // 3. Navigation Buttons: Gliding to Previous / Next Criteria
  const handlePrev = useCallback(() => {
    // Move left to right (reverse flow) by 1 card step
    targetOffsetRef.current -= dimensions.step;
  }, [dimensions.step]);

  const handleNext = useCallback(() => {
    // Move right to left (advance flow) by 1 card step
    targetOffsetRef.current += dimensions.step;
  }, [dimensions.step]);

  // 4. Mouse Drag Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // primary click only
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = targetOffsetRef.current;
    dragDistRef.current = 0;

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartXRef.current;
      dragDistRef.current = Math.abs(dx);
      // Dragging left (dx < 0) advances offset (moves cards left)
      targetOffsetRef.current = dragStartOffsetRef.current - dx;
      currentOffsetRef.current = targetOffsetRef.current;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 5. Mobile Touch Handlers
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartYRef.current = e.touches[0].clientY;
    dragStartOffsetRef.current = targetOffsetRef.current;
    dragDistRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartXRef.current;
    const dy = e.touches[0].clientY - dragStartYRef.current;

    // Distinguish horizontal swipe from vertical page scroll
    if (Math.abs(dx) > Math.abs(dy)) {
      dragDistRef.current = Math.abs(dx);
      targetOffsetRef.current = dragStartOffsetRef.current - dx;
      currentOffsetRef.current = targetOffsetRef.current;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleSpecsToggle = (virtualIdx) => {
    setActiveSpecsIndex((prev) => (prev === virtualIdx ? null : virtualIdx));
  };

  // Create 15 virtual card items from the 5 criteria
  const virtualCards = useMemo(() => {
    return Array.from({ length: VIRTUAL_COUNT }, (_, k) => {
      const project = SELECTED_CRITERIA_PROJECTS[k % CRITERIA_COUNT];
      return {
        key: `card-${k}`,
        virtualIndex: k,
        project
      };
    });
  }, []);

  return (
    <div className="w-full relative py-3 sm:py-6">
      {/* ===================================================================== */}
      {/* 3D CYLINDRICAL PANORAMA STAGE                                          */}
      {/* ===================================================================== */}
      <div
        ref={containerRef}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing flex items-center justify-center"
        style={{
          perspective: `${dimensions.perspective}px`,
          perspectiveOrigin: '50% 50%',
          height: `${dimensions.cardHeight + 28}px`
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="3D Curved Panorama of Selected Work"
      >
        {/* Soft Left and Right Edge Vignette Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#FAF8F5] dark:from-[#121110] to-transparent pointer-events-none z-30" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#FAF8F5] dark:from-[#121110] to-transparent pointer-events-none z-30" />

        {/* 3D Stage Container */}
        <div
          className="relative w-full h-full flex items-center justify-center pointer-events-auto"
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {virtualCards.map(({ key, virtualIndex, project }) => (
            <CurvedPanoramaCard
              key={key}
              project={project}
              virtualIndex={virtualIndex}
              cardWidth={dimensions.cardWidth}
              cardHeight={dimensions.cardHeight}
              onSelectProject={onSelectProject}
              onQuickView={onQuickView}
              onSpecsToggle={handleSpecsToggle}
              isSpecsOpen={activeSpecsIndex === virtualIndex}
              dragDistRef={dragDistRef}
              setCardElementRef={setCardElementRef}
              setShadowElementRef={setShadowElementRef}
            />
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* NAVIGATION CONTROLS: Centered (←) (→) Circles matching Reference       */}
      {/* ===================================================================== */}
      <div className="mt-4 sm:mt-6 flex flex-col items-center justify-center gap-3">
        {/* Centered Circular Arrow Buttons */}
        <nav
          className="flex items-center justify-center gap-3"
          aria-label="3D Panorama Carousel Controls"
        >
          <button
            onClick={handlePrev}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#1C1B19]/30 dark:border-white/30 hover:border-[#1C1B19] dark:hover:border-white flex items-center justify-center text-[#1C1B19] dark:text-[#FAF8F5] hover:bg-[#1C1B19] hover:text-[#FAF8F5] dark:hover:bg-[#FAF8F5] dark:hover:text-[#1C1B19] transition-all duration-200 active:scale-95 shadow-xs"
            aria-label="Previous criteria (←)"
            title="Previous criteria (←)"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Active Criterion Status Indicator */}
          <div className="px-3.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-mono tracking-widest text-[#1C1B19] dark:text-[#FAF8F5] uppercase">
            <span>{CRITERIA_CONFIG[activeCenterCriterion]?.num}</span>
            <span className="mx-1.5 opacity-40">/</span>
            <span className="font-medium">{CRITERIA_CONFIG[activeCenterCriterion]?.criteriaName}</span>
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#1C1B19]/30 dark:border-white/30 hover:border-[#1C1B19] dark:hover:border-white flex items-center justify-center text-[#1C1B19] dark:text-[#FAF8F5] hover:bg-[#1C1B19] hover:text-[#FAF8F5] dark:hover:bg-[#FAF8F5] dark:hover:text-[#1C1B19] transition-all duration-200 active:scale-95 shadow-xs"
            aria-label="Next criteria (→)"
            title="Next criteria (→)"
          >
            <ArrowRight size={16} />
          </button>
        </nav>

        {/* Five Micro Criteria Indicator Dots */}
        <div className="flex items-center gap-2 mt-1" aria-hidden="true">
          {CRITERIA_CONFIG.map((crit, idx) => (
            <button
              key={crit.id}
              onClick={() => {
                // Glide directly to this criterion
                const currentCrit = (Math.round(targetOffsetRef.current / dimensions.step) % CRITERIA_COUNT + CRITERIA_COUNT) % CRITERIA_COUNT;
                let stepDiff = idx - currentCrit;
                if (stepDiff > 2) stepDiff -= 5;
                if (stepDiff < -2) stepDiff += 5;
                targetOffsetRef.current += stepDiff * dimensions.step;
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeCenterCriterion === idx
                  ? 'w-6 bg-[#1C1B19] dark:bg-white'
                  : 'w-1.5 bg-[#1C1B19]/20 dark:bg-white/20 hover:bg-[#1C1B19]/50 dark:hover:bg-white/50'
              }`}
              title={crit.criteriaName}
              aria-label={`Jump to ${crit.criteriaName}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN EXPORTED SECTION
// =============================================================================
export default function SelectedWork({ onSelectProject }) {
  const [lightboxData, setLightboxData] = useState(null);

  return (
    <section
      id="work"
      className="pt-3 sm:pt-4 pb-4 sm:pb-6 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] transition-colors duration-500 relative"
      aria-label="Selected Architectural Work"
    >
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        {/* ===================================================================== */}
        {/* SECTION HEADER: Clean Title Only                                      */}
        {/* ===================================================================== */}
        <div className="pb-3 sm:pb-4 border-b border-[#1C1B19]/10 dark:border-white/10 mb-4 sm:mb-6">
          <h2 className="font-serif text-base xs:text-lg sm:text-xl lg:text-2xl font-normal tracking-tight">
            SELECTED WORK
          </h2>
        </div>

        {/* ===================================================================== */}
        {/* 3D CURVED PANORAMA CAROUSEL (5 CRITERIA, CONTINUOUS RIGHT-TO-LEFT)    */}
        {/* ===================================================================== */}
        <CurvedPanoramaCarousel
          onSelectProject={onSelectProject}
          onQuickView={(proj, imgIdx) => setLightboxData({ project: proj, imgIndex: imgIdx })}
        />

        {/* ===================================================================== */}
        {/* BOTTOM CALLOUT ACTION                                                 */}
        {/* ===================================================================== */}
        <div className="mt-6 sm:mt-8 pt-4 border-t border-[#1C1B19]/10 dark:border-white/10 flex items-center justify-end">
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

      {/* ===================================================================== */}
      {/* INTERACTIVE LIGHTBOX / FULLSCREEN ZOOM MODAL                          */}
      {/* ===================================================================== */}
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

              {/* Prev / Next Arrows in Lightbox */}
              {lightboxData.project.galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setLightboxData((prev) => ({
                        ...prev,
                        imgIndex: prev.imgIndex > 0 ? prev.imgIndex - 1 : prev.project.galleryImages.length - 1
                      }))
                    }
                    className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-20 backdrop-blur-xs"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() =>
                      setLightboxData((prev) => ({
                        ...prev,
                        imgIndex: prev.imgIndex < prev.project.galleryImages.length - 1 ? prev.imgIndex + 1 : 0
                      }))
                    }
                    className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-20 backdrop-blur-xs"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
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
