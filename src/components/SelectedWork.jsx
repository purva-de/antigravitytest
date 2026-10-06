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
// HELPER: Curated Architectural Specifications Resolution
// =============================================================================
function getDetailedSpecs(project) {
  if (!project) return null;

  const customSpecs = {
    'living-room': {
      scale: '1,450 SQ.FT',
      location: 'Pune, MH',
      scope: '1,450 SQ.FT living footprint featuring organic archways, custom spatial partitions, and floating oak cabinetry.',
      millwork: 'Bespoke White Oak Millwork & Slatted Timber Arch',
      materials: [
        '2700K Warm Indirect Cove Illumination',
        'Custom Curved Arch Partitions',
        'Hand-Textured Botanical Accents',
        'Floating White Oak Entertainment Credenza'
      ]
    },
    'bedroom': {
      scale: '850 SQ.FT',
      location: 'Pune, MH',
      scope: '850 SQ.FT bedroom sanctuary with concealed floor-to-ceiling joinery and circadian evening lighting.',
      millwork: 'Concealed European Joinery & Smoked Oak Fluted Headboard',
      materials: [
        '2200K Circadian Dimmable Lighting System',
        'Fluted Velvet & Smoked Oak Headboard Wall',
        'Concealed Soft-Close Wardrobe Architecture',
        'Integrated Floating Bedside Consoles'
      ]
    },
    'balcony': {
      scale: '380 SQ.FT',
      location: 'Pune, MH',
      scope: '380 SQ.FT high-rise balcony oasis with weather-sealed timber trellis and integrated planter irrigation.',
      millwork: 'Seasoned Teak Trellis & Exterior Weatherproof Timber Slats',
      materials: [
        'Automated Biophilic Green Wall Systems',
        'Linear Weatherproof Warm Exterior Lighting',
        'Drainage-Optimized Decking & Natural Stone',
        'Natural Teak Louvers & Outdoor Lounger'
      ]
    },
    'tv-showcase': {
      scale: '620 SQ.FT',
      location: 'Pune, MH',
      scope: '16 FT Continuous architectural media wall featuring concealed cabling and floating credenza.',
      millwork: 'Fluted Ash Paneling & Concealed Blum Soft-Close Joinery',
      materials: [
        'Statuario Marble Floating Console',
        '24V Dimmable Halo Backlighting Strip',
        'Concealed AV Conduits & Cable Management',
        'Vertical Acoustic Wood Ribs'
      ]
    },
    'wooden-interior': {
      scale: '1,800 SQ.FT',
      location: 'Pune, MH',
      scope: '1,800 SQ.FT artisanal residence showcase with acoustic timber wall cladding and hidden pivot doors.',
      millwork: 'Artisanal American Walnut & Oak with Natural Matte Hardwax Oil',
      materials: [
        '100% In-House Master Crafted Millwork',
        'Solid Timber Acoustic Feature Walls',
        'Concealed Soft-Close Blum Hardware',
        'Satin Brass Inlays & Minimalist Shadow Gaps'
      ]
    }
  };

  const curated = customSpecs[project.id];
  if (curated) return curated;

  // Graceful fallback for any other project in data system
  const scale = project.area ? project.area.toUpperCase() : '1,500 SQ.FT';
  const location = project.location?.includes('MH')
    ? project.location
    : `${project.location || 'Pune'}, MH`;
  const scope =
    project.overview ||
    `${project.projectType || project.name} custom layout with architectural spatial planning.`;
  const millworkStat = project.highlightStats?.find((s) =>
    /millwork|wood|timber|finish|joinery|cabinetry/i.test(s.label)
  );
  const millwork = millworkStat
    ? `${millworkStat.label}: ${millworkStat.value}`
    : 'Artisanal Millwork & Bespoke Detailing';
  const materials = [
    ...(project.highlightStats || []).map((s) => `${s.label}: ${s.value}`),
    ...(project.services || [])
  ].slice(0, 4);

  return { scale, location, scope, millwork, materials };
}

// =============================================================================
// INDIVIDUAL 3D CAROUSEL CARD COMPONENT
// =============================================================================
function CurvedPanoramaCard({
  project,
  virtualIndex,
  cardWidth,
  cardHeight,
  onOpenSpecsModal,
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

  // Card click opens centered specifications modal (suppressed if dragged)
  const handleCardClick = (e) => {
    if (dragDistRef.current > 12) {
      e.preventDefault();
      return;
    }
    onOpenSpecsModal(project);
  };

  const handleFullscreenClick = (e) => {
    e.stopPropagation();
    onOpenSpecsModal(project);
  };

  const handleSpecsButtonClick = (e) => {
    e.stopPropagation();
    onOpenSpecsModal(project);
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
      aria-label={`View architectural details for ${project.criteriaTitle}: ${project.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenSpecsModal(project);
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

          {/* Quick Details / Fullscreen Expand Icon */}
          <button
            onClick={handleFullscreenClick}
            className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20 active:scale-90 cursor-pointer"
            title="Open specifications & gallery"
            aria-label={`Open specifications & gallery for ${project.name}`}
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
        {/* LOWER METADATA OVERLAY (Space Name, Area, Specs Button, WhatsApp)     */}
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

          {/* Action Row: SPECS trigger button + WhatsApp contact icon (Completed badge removed) */}
          <div className="pt-2 border-t border-white/15 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSpecsButtonClick}
              className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[8px] sm:text-[8.5px] font-mono tracking-wider uppercase text-[#FAF8F5]/90 hover:text-white flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
              title={`View architectural specifications for ${project.criteriaTitle}`}
              aria-label={`View architectural specifications for ${project.criteriaTitle}`}
            >
              <span>SPECS</span>
              <ArrowUpRight size={10} className="text-[#D4B993]" />
            </button>

            <a
              href={`${STUDIO_INFO.whatsapp}?text=${encodeURIComponent(`Hello Consilio Studios, I am interested in inquiring about your ${project.criteriaTitle} (${project.name}) design.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-[#25D366] hover:text-[#1ebe5b] transition-all hover:scale-115 active:scale-95 flex items-center justify-center shrink-0"
              title={`WhatsApp inquiry for ${project.name}`}
              aria-label={`WhatsApp inquiry for ${project.name}`}
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

// =============================================================================
// MAIN 3D CURVED PANORAMA CAROUSEL COMPONENT
// =============================================================================
function CurvedPanoramaCarousel({ onOpenSpecsModal, isModalOpen }) {
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

      const trackLength = VIRTUAL_COUNT * step; // 15 * step

      // Continuous Right-to-Left Auto-Scroll (advancing offset)
      // Pauses on hover, active dragging, reduced motion, or active modal
      const isPaused =
        isHoveredRef.current ||
        isDraggingRef.current ||
        isReducedMotionRef.current ||
        isModalOpen;

      if (!isPaused) {
        // Slow, elegant continuous motion moving right to left: 0.3 speed (~18px/sec)
        const autoSpeed = 0.3;
        targetOffsetRef.current += autoSpeed * dt;
      }

      // Smooth Snappy Lerp Glide (~0.3s settling response)
      const diff = targetOffsetRef.current - currentOffsetRef.current;
      currentOffsetRef.current += diff * (isDraggingRef.current ? 1 : 0.12);

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
    [dimensions, isModalOpen]
  );

  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [animate]);

  // 3. Navigation Buttons: Gliding to Previous / Next Criteria
  const handlePrev = useCallback(() => {
    targetOffsetRef.current -= dimensions.step;
  }, [dimensions.step]);

  const handleNext = useCallback(() => {
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
        targetOffsetRef.current = dragStartOffsetRef.current - dx;
        currentOffsetRef.current = targetOffsetRef.current;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
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

    if (Math.abs(dx) > Math.abs(dy) && dist > 6) {
      targetOffsetRef.current = dragStartOffsetRef.current - dx;
      currentOffsetRef.current = targetOffsetRef.current;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      dragDistRef.current = 0;
    }, 120);
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
              onOpenSpecsModal={onOpenSpecsModal}
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
          className="w-7.5 h-7.5 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full border border-[#1C1B19]/35 dark:border-white/35 hover:border-[#1C1B19] dark:hover:border-white flex items-center justify-center text-[#1C1B19] dark:text-[#FAF8F5] hover:bg-[#1C1B19] hover:text-[#FAF8F5] dark:hover:bg-[#FAF8F5] dark:hover:text-[#1C1B19] transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
          aria-label="Previous criteria (←)"
          title="Previous criteria (←)"
        >
          <ArrowLeft className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={handleNext}
          className="w-7.5 h-7.5 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full border border-[#1C1B19]/35 dark:border-white/35 hover:border-[#1C1B19] dark:hover:border-white flex items-center justify-center text-[#1C1B19] dark:text-[#FAF8F5] hover:bg-[#1C1B19] hover:text-[#FAF8F5] dark:hover:bg-[#FAF8F5] dark:hover:text-[#1C1B19] transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
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
// DETAILED SPECIFICATIONS MODAL / OVERLAY COMPONENT
// =============================================================================
function ProjectSpecsModal({ project, onClose, onExplore }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // High-Resolution Image Angles
  const images = useMemo(() => {
    if (project.galleryImages && project.galleryImages.length > 0) {
      return project.galleryImages;
    }
    return [project.heroImage];
  }, [project]);

  const activeImage = images[activeImgIndex] || project.heroImage;

  // Key-Value Specifications
  const specs = useMemo(() => getDetailedSpecs(project), [project]);

  // Accessibility: Escape key & Arrow navigation listener + body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, images.length]);

  const whatsappMessage = encodeURIComponent(
    `Hello Consilio Studios, I am inquiring about the architectural specifications for ${project.criteriaTitle} (${project.name}).`
  );
  const whatsappUrl = `${STUDIO_INFO.whatsapp}?text=${whatsappMessage}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 xs:p-4 sm:p-6 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="specs-modal-title"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#141312] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-[#FAF8F5] my-auto"
      >
        {/* ================================================================= */}
        {/* HEADER: Project Number + Title & Prominent Close Button           */}
        {/* ================================================================= */}
        <header className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#181715]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#828C74]" />
            <h3
              id="specs-modal-title"
              className="font-mono text-xs sm:text-sm tracking-widest text-[#D4B993] uppercase font-semibold"
            >
              {project.criteriaNum} • {project.criteriaTitle}
            </h3>
            <span className="hidden sm:inline-block text-white/30 text-xs">•</span>
            <span className="hidden sm:inline-block font-serif text-sm text-white/90 font-normal">
              {project.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/15 cursor-pointer"
            aria-label="Close specifications modal"
            title="Close (Esc)"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </header>

        {/* ================================================================= */}
        {/* MODAL BODY: Two-Column Responsive Layout (Gallery + Specs)        */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-64px)]">
          {/* =============================================================== */}
          {/* LEFT/MAIN COLUMN: Image Gallery                                 */}
          {/* =============================================================== */}
          <section
            className="lg:col-span-7 flex flex-col justify-between"
            aria-label="Room Image Gallery"
          >
            <div>
              {/* Large Active Image Display */}
              <div className="relative w-full aspect-[4/3] max-h-[380px] sm:max-h-[420px] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-inner group">
                <img
                  src={activeImage}
                  alt={`${project.name} angle ${activeImgIndex + 1}`}
                  className="w-full h-full object-cover select-none transition-opacity duration-300"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Photo index counter tag */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono tracking-widest text-white/90 border border-white/15">
                  ANGLE {String(activeImgIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </div>

                {/* Prev / Next Arrows */}
                {images.length > 1 && (
                  <div className="absolute inset-x-2.5 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                      }}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all border border-white/20 active:scale-95 pointer-events-auto backdrop-blur-xs cursor-pointer"
                      aria-label="Previous angle"
                      title="Previous angle (←)"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                      }}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all border border-white/20 active:scale-95 pointer-events-auto backdrop-blur-xs cursor-pointer"
                      aria-label="Next angle"
                      title="Next angle (→)"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Thumbnail Carousel / Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 sm:gap-2.5 mt-3 overflow-x-auto no-scrollbar py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative w-14 h-10 xs:w-16 xs:h-11 sm:w-18 sm:h-12 shrink-0 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                        activeImgIndex === idx
                          ? 'border-[#D4B993] ring-2 ring-[#D4B993]/40 scale-102 opacity-100'
                          : 'border-white/15 opacity-60 hover:opacity-90 hover:border-white/40'
                      }`}
                      aria-label={`Select angle ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Title & Subtitle Note if small screen */}
            <div className="mt-3 block sm:hidden">
              <h4 className="font-serif text-base text-white">{project.name}</h4>
              <p className="text-[11px] text-[#FAF8F5]/70 font-light">{project.subtitle}</p>
            </div>
          </section>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: Specifications Sheet                              */}
          {/* =============================================================== */}
          <section
            className="lg:col-span-5 flex flex-col justify-between"
            aria-label="Architectural Specifications Sheet"
          >
            <div>
              {/* Category Subhead */}
              <div className="mb-3">
                <span className="text-[9px] font-mono tracking-widest text-[#D4B993] uppercase font-medium">
                  ARCHITECTURAL SPECIFICATION
                </span>
                <h4 className="font-serif text-lg sm:text-xl text-white font-normal mt-0.5">
                  {project.name}
                </h4>
                <p className="text-xs text-[#FAF8F5]/70 font-light mt-0.5">
                  {project.subtitle}
                </p>
              </div>

              {/* Structured Key-Value Specs Sheet */}
              <dl className="space-y-2.5 text-xs">
                {/* Scale */}
                <div className="pb-2 border-b border-white/10">
                  <dt className="text-[9.5px] font-mono tracking-wider text-[#A09C94] uppercase mb-0.5">
                    SCALE
                  </dt>
                  <dd className="font-mono text-white text-xs sm:text-[13px] font-medium">
                    {specs.scale}
                  </dd>
                </div>

                {/* Location */}
                <div className="pb-2 border-b border-white/10">
                  <dt className="text-[9.5px] font-mono tracking-wider text-[#A09C94] uppercase mb-0.5">
                    LOCATION
                  </dt>
                  <dd className="text-white text-xs sm:text-[13px] font-normal">
                    {specs.location}
                  </dd>
                </div>

                {/* Scope / Living Area */}
                <div className="pb-2 border-b border-white/10">
                  <dt className="text-[9.5px] font-mono tracking-wider text-[#A09C94] uppercase mb-0.5">
                    SCOPE / LIVING AREA
                  </dt>
                  <dd className="text-[#FAF8F5]/85 text-xs sm:text-[12.5px] font-light leading-relaxed">
                    {specs.scope}
                  </dd>
                </div>

                {/* Millwork & Finishes */}
                <div className="pb-2 border-b border-white/10">
                  <dt className="text-[9.5px] font-mono tracking-wider text-[#A09C94] uppercase mb-0.5">
                    MILLWORK & FINISHES
                  </dt>
                  <dd className="text-white text-xs sm:text-[12.5px] font-normal leading-snug">
                    {specs.millwork}
                  </dd>
                </div>

                {/* Materials / Features */}
                <div className="pb-2 border-b border-white/10">
                  <dt className="text-[9.5px] font-mono tracking-wider text-[#A09C94] uppercase mb-1">
                    MATERIALS / FEATURES
                  </dt>
                  <dd className="space-y-1">
                    {specs.materials.map((mat, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-[#FAF8F5]/85">
                        <span className="text-[#D4B993] text-[9px] mt-0.5">◆</span>
                        <span>{mat}</span>
                      </div>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>

            {/* CTA Buttons Row at Bottom of Right Column */}
            <div className="pt-4 mt-2 sm:mt-4 space-y-2">
              {/* Primary WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5b] active:scale-98 text-black font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <MessageCircle size={15} />
                <span>INQUIRE ABOUT THIS SPACE</span>
              </a>

              {/* Secondary Case Study Link */}
              <button
                type="button"
                onClick={() => onExplore(project)}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 text-white font-mono text-[11px] tracking-wider uppercase font-medium flex items-center justify-center gap-1.5 transition-all border border-white/15 cursor-pointer"
              >
                <span>EXPLORE FULL SPACE</span>
                <ArrowUpRight size={13} className="text-[#D4B993]" />
              </button>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// MAIN EXPORTED SECTION
// =============================================================================
export default function SelectedWork({ onSelectProject }) {
  const [activeModalProject, setActiveModalProject] = useState(null);

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
          onOpenSpecsModal={(proj) => setActiveModalProject(proj)}
          isModalOpen={Boolean(activeModalProject)}
        />
      </div>

      {/* ===================================================================== */}
      {/* DETAILED ARCHITECTURAL SPECIFICATIONS & GALLERY MODAL                */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {activeModalProject && (
          <ProjectSpecsModal
            project={activeModalProject}
            onClose={() => setActiveModalProject(null)}
            onExplore={(proj) => {
              setActiveModalProject(null);
              if (onSelectProject) {
                onSelectProject(proj);
              }
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
