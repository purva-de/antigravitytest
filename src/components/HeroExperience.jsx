import React, { useRef, useEffect, useState } from 'react';
import { MessageCircle, Instagram, Linkedin, Play, Pause, RotateCcw, ArrowRight } from 'lucide-react';
import { STUDIO_INFO } from '../data/projectsData';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_FRAMES = 145;

export default function HeroExperience({ onExploreProjects }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const mobileVideoRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // References for rendering and animation loop
  const frameImagesRef = useRef([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animFrameIdRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  // 1. Preload all 145 WebP frames of the authentic Consilio main video
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `/hero_sequence/frame_${paddedIndex}.webp`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
          renderFrame(0);
        }
        if (loadedCount >= 15) {
          setIsReady(true);
        }
      };

      images.push(img);
    }

    frameImagesRef.current = images;

    return () => {
      frameImagesRef.current = [];
    };
  }, []);

  // 2. High-DPI Edge-to-Edge Canvas Renderer (Zero black space / zero letterboxing)
  const renderFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = frameImagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      if (videoRef.current && videoRef.current.duration) {
        const time = (frameIndex / (TOTAL_FRAMES - 1)) * videoRef.current.duration;
        videoRef.current.currentTime = time;
      }
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Full Bleed aspect-fill (object-fit: cover) to eliminate all black borders
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const scale = Math.max(width / imgWidth, height / imgHeight);
    const renderW = imgWidth * scale;
    const renderH = imgHeight * scale;
    const offsetX = (width - renderW) / 2;
    const offsetY = (height - renderH) / 2;

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    ctx.restore();
  };

  // Touch swipe scrubbing for mobile
  const touchStartXRef = useRef(0);
  const touchStartFrameRef = useRef(0);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartFrameRef.current = currentFrameRef.current;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length === 1) {
      const deltaX = touchStartXRef.current - e.touches[0].clientX;
      const frameDelta = deltaX * 0.35;
      const newFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, touchStartFrameRef.current + frameDelta));
      targetFrameRef.current = newFrame;
    }
  };

  // 3. Pause desktop autoplay when scrolled out of view or on mobile
  useEffect(() => {
    if (isMobileOrTablet) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    const handleScroll = () => {
      const isVisible = window.scrollY < window.innerHeight;
      if (!isVisible && autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      } else if (isVisible && isAutoPlaying && !autoPlayTimerRef.current) {
        autoPlayTimerRef.current = setInterval(() => {
          targetFrameRef.current = (targetFrameRef.current + 0.45) % TOTAL_FRAMES;
        }, 40);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAutoPlaying, isMobileOrTablet]);

  // 4. Smooth Animation Loop via requestAnimationFrame
  useEffect(() => {
    let lastRendered = -1;

    const loop = () => {
      // Smooth interpolation for slow, cinematic Steadicam feel
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.1;

      const currentIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      const normProgress = currentFrameRef.current / (TOTAL_FRAMES - 1);
      setScrollProgress(normProgress);

      // Chapter detection based on video frame progression
      if (currentIdx < 45) {
        setCurrentChapter(0);
      } else if (currentIdx < 95) {
        setCurrentChapter(1);
      } else {
        setCurrentChapter(2);
      }

      if (currentIdx !== lastRendered) {
        renderFrame(currentIdx);
        lastRendered = currentIdx;
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  // Auto-play / Walkthrough mode timer
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    if (!autoPlayTimerRef.current) {
      autoPlayTimerRef.current = setInterval(() => {
        targetFrameRef.current = (targetFrameRef.current + 0.45) % TOTAL_FRAMES;
      }, 40);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [isAutoPlaying]);

  // Handle Resize and Mobile/Tablet Detection
  useEffect(() => {
    const handleResize = () => {
      const isMob = window.innerWidth < 1024;
      setIsMobileOrTablet(isMob);
      if (!isMob) {
        const idx = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(currentFrameRef.current))
        );
        renderFrame(idx);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Synchronize mobile video playback with chapter & progress
  const handleMobileTimeUpdate = () => {
    if (!mobileVideoRef.current) return;
    const { currentTime, duration } = mobileVideoRef.current;
    if (!duration) return;
    const progress = currentTime / duration;
    setScrollProgress(progress);
    if (progress < 0.33) {
      setCurrentChapter(0);
    } else if (progress < 0.66) {
      setCurrentChapter(1);
    } else {
      setCurrentChapter(2);
    }
  };

  const toggleAutoPlay = () => {
    const nextState = !isAutoPlaying;
    setIsAutoPlaying(nextState);
    if (mobileVideoRef.current) {
      if (nextState) {
        mobileVideoRef.current.play().catch(() => {});
      } else {
        mobileVideoRef.current.pause();
      }
    }
  };

  const handleTimelineScrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));

    if (isMobileOrTablet && mobileVideoRef.current && mobileVideoRef.current.duration) {
      mobileVideoRef.current.currentTime = pct * mobileVideoRef.current.duration;
      setScrollProgress(pct);
      return;
    }

    targetFrameRef.current = pct * (TOTAL_FRAMES - 1);
  };

  // Chapter Jump Helper (Supports both desktop frames and mobile video timeline)
  const goToChapter = (chapterIdx) => {
    if (isMobileOrTablet && mobileVideoRef.current && mobileVideoRef.current.duration) {
      const duration = mobileVideoRef.current.duration;
      if (chapterIdx === 0) {
        mobileVideoRef.current.currentTime = 0;
        setCurrentChapter(0);
      } else if (chapterIdx === 1) {
        mobileVideoRef.current.currentTime = duration * 0.33;
        setCurrentChapter(1);
      } else if (chapterIdx === 2) {
        mobileVideoRef.current.currentTime = duration * 0.66;
        setCurrentChapter(2);
      }
      return;
    }

    if (chapterIdx === 0) {
      targetFrameRef.current = 0;
      setCurrentChapter(0);
    } else if (chapterIdx === 1) {
      targetFrameRef.current = 65;
      setCurrentChapter(1);
    } else if (chapterIdx === 2) {
      targetFrameRef.current = 135;
      setCurrentChapter(2);
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[560px] sm:min-h-[600px] bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] overflow-hidden"
      aria-label="Cinematic Architectural Hero"
    >
      {/* 
        CLEAN FULL-VIEWPORT HERO:
        Zero empty scroll tracks, zero blank white space.
        The video plays in slow, majestic continuous motion with instant chapter jumping.
      */}
      <div className="relative h-full w-full overflow-hidden flex flex-col justify-between select-none">
        
        {/* Mobile / Tablet Dedicated Native Video (9:16 Portrait Optimized "mobile") */}
        <video
          ref={mobileVideoRef}
          src="/videos/mobile.mp4"
          autoPlay
          loop
          muted
          playsInline
          onTimeUpdate={handleMobileTimeUpdate}
          className="absolute inset-0 w-full h-full object-cover z-0 block lg:hidden"
        />

        {/* Full-bleed Edge-to-Edge Canvas: zero black bars, zero letterboxing (Desktop) */}
        <canvas
          ref={canvasRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="absolute inset-0 w-full h-full object-cover z-0 touch-pan-y hidden lg:block"
        />

        {/* Fallback fastseek video (Desktop) */}
        <video
          ref={videoRef}
          src="/main_video_fastseek.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-0 pointer-events-none hidden lg:block"
        />

        {/* Refined subtle gradient: no harsh black space */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-10" />

        {/* FLOATING SOCIAL ICONS (RIGHT EDGE) */}
        <div className="absolute right-2 xs:right-2.5 sm:right-3.5 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5 xs:gap-2 sm:gap-2.5 lg:gap-3">
          <a
            href={STUDIO_INFO.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 xs:w-8 xs:h-8 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-11 lg:h-11 rounded-full bg-black/70 hover:bg-[#25D366] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg border border-white/10"
            aria-label="WhatsApp Consilio Studios"
            data-cursor="pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" />
          </a>

          <a
            href={STUDIO_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 xs:w-8 xs:h-8 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-11 lg:h-11 rounded-full bg-black/70 hover:bg-[#E4405F] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg border border-white/10"
            aria-label="Instagram Consilio Studios"
            data-cursor="pointer"
          >
            <Instagram className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" />
          </a>

          <a
            href={STUDIO_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 xs:w-8 xs:h-8 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-11 lg:h-11 rounded-full bg-black/70 hover:bg-[#0A66C2] text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg border border-white/10"
            aria-label="LinkedIn Consilio Studios"
            data-cursor="pointer"
          >
            <Linkedin className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" />
          </a>
        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL STORYTELLING OVERLAYS (SYNCHRONIZED WITH WALKTHROUGH)           */}
        {/* ========================================================================= */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 xs:px-6 sm:px-10 lg:px-12 h-full flex flex-col justify-center pt-20 xs:pt-24 pb-14 xs:pb-16">
          <div className="max-w-xl">

            <AnimatePresence mode="wait">
              {/* CHAPTER 0: ENTRANCE TO LIVING SANCTUARY */}
              {currentChapter === 0 && (
                <motion.div
                  key="chap-0"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] xs:text-xs tracking-[0.25em] font-mono text-[#D9CEBE] uppercase">
                    <span className="w-6 sm:w-8 h-px bg-[#D9CEBE]" />
                    <span>01 / LIVING ROOM</span>
                  </div>

                  <h1 className="font-serif text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[0.98] drop-shadow-md">
                    Consilio<br />
                    Studios
                  </h1>

                  <p className="text-xs xs:text-sm sm:text-base text-white/90 max-w-md font-light leading-relaxed">
                    {STUDIO_INFO.tagline}. An experiential walkthrough of bespoke living spaces, curved botanical niches, and tailored woodwork.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                    <a
                      href={STUDIO_INFO.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 xs:px-6 sm:px-7 py-2.5 xs:py-3 rounded-full bg-[#4A5844] hover:bg-[#3D4938] text-white flex items-center gap-2 text-xs sm:text-sm font-medium shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                      data-cursor="pointer"
                    >
                      <MessageCircle size={15} />
                      <span>Message Now</span>
                    </a>

                    <button
                      onClick={onExploreProjects}
                      className="px-5 xs:px-6 sm:px-7 py-2.5 xs:py-3 rounded-full bg-white/20 hover:bg-white/35 text-white border border-white/30 text-xs sm:text-sm font-medium backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
                      data-cursor="pointer"
                    >
                      <span>Explore Projects</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* CHAPTER 1: BOTANICAL LIVING ALCOVE */}
              {currentChapter === 1 && (
                <motion.div
                  key="chap-1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] xs:text-xs tracking-[0.25em] font-mono text-[#D9CEBE] uppercase">
                    <span className="w-6 sm:w-8 h-px bg-[#D9CEBE]" />
                    <span>02 / BOTANICAL NICHE</span>
                  </div>

                  <h2 className="font-serif text-3xl xs:text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-tight drop-shadow-md">
                    Living<br />Room
                  </h2>

                  <p className="text-xs xs:text-sm sm:text-base text-white/90 max-w-md font-light leading-relaxed">
                    Arched architectural niche with hand-curated botanical wallpaper, 2700K indirect cove halo, and floating fluted oak credenza.
                  </p>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-2.5 xs:px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[9px] xs:text-[10px] font-mono text-white tracking-widest uppercase border border-white/10">
                      BOTANICAL NICHE
                    </span>
                    <span className="px-2.5 xs:px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[9px] xs:text-[10px] font-mono text-white tracking-widest uppercase border border-white/10">
                      COVE ILLUMINATION
                    </span>
                  </div>
                </motion.div>
              )}

              {/* CHAPTER 2: PETITE VITESSE JUNIOR SUITE */}
              {currentChapter === 2 && (
                <motion.div
                  key="chap-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] xs:text-xs tracking-[0.25em] font-mono text-[#D9CEBE] uppercase">
                    <span className="w-6 sm:w-8 h-px bg-[#D9CEBE]" />
                    <span>03 / Kids Bedroom</span>
                  </div>

                  <h2 className="font-serif text-3xl xs:text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-tight drop-shadow-md">
                    Kids<br />Bedroom
                  </h2>

                  <p className="text-xs xs:text-sm sm:text-base text-white/90 max-w-md font-light leading-relaxed">
                    Disciplined modular joinery, integrated active gymnastics climbing ladder, window daybed, and graphic car mural.
                  </p>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="px-2.5 xs:px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[9px] xs:text-[10px] font-mono text-white tracking-widest uppercase border border-white/10">
                      ACTIVE RIGGING
                    </span>
                    <span className="px-2.5 xs:px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[9px] xs:text-[10px] font-mono text-white tracking-widest uppercase border border-white/10">
                      CUSTOM JOINERY
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE TIMELINE & PLAYBACK CONTROLLER (BOTTOM)                       */}
        {/* ========================================================================= */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 xs:px-6 sm:px-10 lg:px-12 pb-4 xs:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          
          {/* Chapter Buttons with responsive mobile overflow-x handling */}
          <div className="flex items-center gap-3 sm:gap-6 text-[11px] xs:text-xs font-mono overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => goToChapter(0)}
              className={`flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors ${
                currentChapter === 0 ? 'text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentChapter === 0 ? 'bg-[#D9CEBE]' : 'bg-white/30'}`} />
              <span className="hidden sm:inline">01 LIVING ROOM</span>
              <span className="sm:hidden">01 LIVING</span>
            </button>

            <span className="text-white/20 shrink-0">•</span>

            <button
              onClick={() => goToChapter(1)}
              className={`flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors ${
                currentChapter === 1 ? 'text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentChapter === 1 ? 'bg-[#D9CEBE]' : 'bg-white/30'}`} />
              <span className="hidden sm:inline">02 BOTANICAL NICHE</span>
              <span className="sm:hidden">02 NICHE</span>
            </button>

            <span className="text-white/20 shrink-0">•</span>

            <button
              onClick={() => goToChapter(2)}
              className={`flex items-center gap-1.5 sm:gap-2 shrink-0 transition-colors ${
                currentChapter === 2 ? 'text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${currentChapter === 2 ? 'bg-[#D9CEBE]' : 'bg-white/30'}`} />
              <span className="hidden sm:inline">03 KIDS BEDROOM</span>
              <span className="sm:hidden">03 KIDS</span>
            </button>
          </div>

          {/* Interactive Controls & Scrub Progress */}
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
            {/* Auto Play / Pause Toggle Button */}
            <button
              onClick={toggleAutoPlay}
              className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[10px] font-mono tracking-wider uppercase flex items-center gap-1.5 transition-colors active:scale-95"
              title={isAutoPlaying ? "Pause Walkthrough" : "Play Continuous Walkthrough"}
            >
              {isAutoPlaying ? <Pause size={10} /> : <Play size={10} />}
              <span>{isAutoPlaying ? "PAUSE" : "AUTO-PLAY"}</span>
            </button>

            {/* Continuous Progress Track with Click-to-Scrub */}
            <div
              onClick={handleTimelineScrub}
              className="flex-1 sm:flex-initial w-28 xs:w-36 h-2 bg-white/20 hover:bg-white/30 rounded-full overflow-hidden relative cursor-pointer transition-colors"
              title="Click timeline to scrub video"
            >
              <div
                className="h-full bg-[#D9CEBE] rounded-full transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>

            <span className="text-[10px] font-mono text-[#D9CEBE] w-8 sm:w-10 text-right">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
