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

  // Click criteria card to pop up architectural specs drawer (suppressed if dragged)
  const handleCardClick = (e) => {
    if (dragDistRef.current > 12) {
      e.preventDefault();
      return;
    }
    onSpecsToggle(virtualIndex);
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    onQuickView(project, 0);
  };

  const handleSpecsButtonClick = (e) => {
    e.stopPropagation();
    onSpecsToggle(virtualIndex);
  };

  const handleExploreFromSpecs = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSpecsToggle(virtualIndex);
    onSelectProject(project);
  };

  return (
    <article
      ref={(el) => setCardElementRef(virtualIndex, el)}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="view"
      className="absolute top-0 cursor-pointer select-none rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl bg-[#EFECE6] dark:bg-[#181716] group transition-shadow duration-300"
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        left: `calc(50% - ${cardWidth / 2}px)`,
        transformOrigin: '50% 50%',
        willChange: 'transform'
      }}
      role="button"
      aria-label={`View specs for ${project.criteriaTitle}: ${project.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSpecsToggle(virtualIndex);
        }
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
          draggable="false"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none select-none"
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
          <span className="px-2 py-0.5 rounded-full bg-black/60 dark:bg-black/75 backdrop-blur-md text-[8px] sm:text-[8.5px] font-mono font-medium tracking-widest text-[#FAF8F5] uppercase border border-white/15 group-hover:border-white/35 transition-colors shadow-sm">
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

          {/* Action Row: Space Status + WhatsApp contact icon (SPECS text removed from image card) */}
          <div className="pt-1.5 border-t border-white/15 flex items-center justify-between">
            <span className="text-[8px] sm:text-[8.5px] font-mono text-[#FAF8F5]/65 tracking-wider uppercase">
              {project.status || 'Completed'}
            </span>

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
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="absolute inset-0 bg-[#1C1B19]/96 backdrop-blur-md text-[#FAF8F5] p-3 sm:p-3.5 flex flex-col justify-between z-30 overflow-y-auto no-scrollbar"
            >
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-white/15 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#828C74]" />
                    <span className="text-[8.5px] sm:text-[9px] font-mono tracking-widest text-[#D4B993] uppercase font-semibold">
                      {project.criteriaNum} • {project.criteriaTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExploreFromSpecs}
                      className="text-[8px] sm:text-[8.5px] font-mono text-[#D4B993] hover:text-white flex items-center gap-0.5 transition-colors uppercase tracking-wider"
                      title="Explore full project details"
                    >
                      <span>EXPLORE</span>
                      <ArrowUpRight size={10} />
                    </button>
                    <button
                      onClick={handleSpecsButtonClick}
                      className="text-[8px] sm:text-[8.5px] font-mono text-white/50 hover:text-white px-1.5 py-0.5 rounded-xs border border-white/20 hover:border-white/40 transition-colors uppercase"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-1.5 text-[8.5px] sm:text-[9px] font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-[#A09C94]">SCALE:</span>
                    <span className="text-white font-medium">{project.area || 'Bespoke'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-[#A09C94]">LOCATION:</span>
                    <span className="text-white truncate max-w-[140px] text-right">
                      {project.location}
                    </span>
                  </div>
                  {project.highlightStats?.[0] && (
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#A09C94] truncate max-w-[85px]">
                        {project.highlightStats[0].label}:
                      </span>
                      <span className="text-white truncate max-w-[130px] text-right">
                        {project.highlightStats[0].value}
                      </span>
                    </div>
                  )}
                  {project.highlightStats?.[1] && (
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[#A09C94] truncate max-w-[85px]">
                        {project.highlightStats[1].label}:
                      </span>
                      <span className="text-white truncate max-w-[130px] text-right">
                        {project.highlightStats[1].value}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Prominent High-Contrast Explore Button Always Anchored at Bottom */}
              <button
                onClick={handleExploreFromSpecs}
                className="w-full py-2 sm:py-2.5 rounded-lg bg-white hover:bg-neutral-100 active:bg-neutral-200 text-black text-[9px] sm:text-[10px] font-mono tracking-wider uppercase font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg active:scale-98 mt-2.5 cursor-pointer shrink-0"
                data-cursor="pointer"
              >
                <span>EXPLORE FULL SPACE</span>
                <ArrowUpRight size={12} />
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

  // 1. Responsive Resizing (Sleek Compact Proportions)
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth || window.innerWidth;

    let cWidth, cHeight, cGap, rad, persp, curve, depth;

    if (w < 640) {
      cWidth = Math.min(170, Math.floor(w * 0.52));
      cHeight = Math.floor(cWidth * 1.36); // ~230px
      cGap = 4;
      rad = 480;
      persp = 680;
      curve = 0.90;
      depth = 1.30;
    } else if (w < 1024) {
      cWidth = 195;
      cHeight = 265;
      cGap = 4;
      rad = 620;
      persp = 760;
      curve = 0.88;
      depth = 1.25;
    } else {
      cWidth = 220;
      cHeight = 300;
      cGap = 5;
      rad = 750;
      persp = 850;
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
        // Brisk, continuous motion moving right to left: ~135px/sec
        const autoSpeed = 2.2;
        targetOffsetRef.current += autoSpeed * dt;
      }

      // Smooth Snappy Lerp Glide
      const diff = targetOffsetRef.current - currentOffsetRef.current;
      currentOffsetRef.current += diff * (isDraggingRef.current ? 1 : 0.20);

      // Keep currentOffset normalized within track range
      if (currentOffsetRef.current > trackLength * 10) {
        currentOffsetRef.current -= trackLength * 10;
        targetOffsetRef.current -= trackLength * 10;
      } else if (currentOffsetRef.current < -trackLength * 10) {
        currentOffsetRef.current += trackLength * 10;
        targetOffsetRef.current += trackLength * 10;
      }

      const offset = currentOffsetRef.current;

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
    dragStartYRef.current = e.clientY;
    dragStartOffsetRef.current = targetOffsetRef.current;
    dragDistRef.current = 0;

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartXRef.current;
      const dy = moveEvent.clientY - dragStartYRef.current;
      const dist = Math.hypot(dx, dy);
      dragDistRef.current = dist;
      if (dist > 6) {
        // Dragging left (dx < 0) advances offset (moves cards left)
        targetOffsetRef.current = dragStartOffsetRef.current - dx;
        currentOffsetRef.current = targetOffsetRef.current;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      // Reset drag distance shortly after click event completes
      setTimeout(() => {
        dragDistRef.current = 0;
      }, 120);
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
    const dist = Math.hypot(dx, dy);
    dragDistRef.current = dist;

    // Distinguish horizontal swipe from vertical page scroll
    if (Math.abs(dx) > Math.abs(dy) && dist > 6) {
      targetOffsetRef.current = dragStartOffsetRef.current - dx;
      currentOffsetRef.current = targetOffsetRef.current;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    // Reset drag distance shortly after tap/click event completes
    setTimeout(() => {
      dragDistRef.current = 0;
    }, 120);
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
    <div className="w-full relative py-0.5 sm:py-1">
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
          height: `${dimensions.cardHeight + 10}px`
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
      <div className="mt-2.5 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3">
        <button
          onClick={handlePrev}
          className="w-7.5 h-7.5 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full border border-[#1C1B19]/35 dark:border-white/35 hover:border-[#1C1B19] dark:hover:border-white flex items-center justify-center text-[#1C1B19] dark:text-[#FAF8F5] hover:bg-[#1C1B19] hover:text-[#FAF8F5] dark:hover:bg-[#FAF8F5] dark:hover:text-[#1C1B19] transition-all duration-200 active:scale-95 shadow-xs"
          aria-label="Previous criteria (←)"
          title="Previous criteria (←)"
        >
          <ArrowLeft className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={handleNext}
          className="w-7.5 h-7.5 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full border border-[#1C1B19]/35 dark:border-white/35 hover:border-[#1C1B19] dark:hover:border-white flex items-center justify-center text-[#1C1B19] dark:text-[#FAF8F5] hover:bg-[#1C1B19] hover:text-[#FAF8F5] dark:hover:bg-[#FAF8F5] dark:hover:text-[#1C1B19] transition-all duration-200 active:scale-95 shadow-xs"
          aria-label="Next criteria (→)"
          title="Next criteria (→)"
        >
          <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
        </button>
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
      className="pt-1 sm:pt-1.5 pb-2 sm:pb-3 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] transition-colors duration-500 relative"
      aria-label="Selected Architectural Work"
    >
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        {/* ===================================================================== */}
        {/* SECTION HEADER: Clean Title Only                                      */}
        {/* ===================================================================== */}
        <div className="pb-1 sm:pb-1.5 border-b border-[#1C1B19]/10 dark:border-white/10 mb-1.5 sm:mb-2">
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
