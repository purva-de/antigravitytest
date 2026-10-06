import React, { useState, useEffect } from 'react';
import { STUDIO_INFO } from '../data/projectsData';
import { Phone, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ activeSection, onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'STUDIO', href: '#studio', desc: 'Philosophy & Credentials' },
    { label: 'WORK', href: '#work', desc: 'Architectural Portfolio' },
    { label: 'SERVICES', href: '#services', desc: 'Turnkey Spatial Solutions' },
    { label: 'CONTACT', href: '#contact', desc: 'Connect & Inquiries' },
  ];

  const handleItemClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(href.replace('#', ''));
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        id="main-navigation"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-2.5 sm:py-3.5 shadow-sm border-b border-[#1C1B19]/10'
            : 'bg-transparent py-3 sm:py-5 border-b border-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-5 lg:px-6 flex items-center justify-between gap-2">
          
          {/* LEFT: Circular Logo Emblem + Wordmark + Tagline */}
          <a
            href="#hero"
            onClick={(e) => handleItemClick(e, '#hero')}
            className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 group focus:outline-hidden shrink-0"
            aria-label="Consilio Studios Home"
          >
            {/* The Official Uploaded Logo: White over hero video, Solid Black after scrolling */}
            <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0">
              <img
                src="/logo.png"
                alt="Consilio Studios Logo"
                className={`w-full h-full object-contain transition-all duration-300 ${
                  isScrolled
                    ? 'filter brightness-0'
                    : 'filter brightness-0 invert drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
                }`}
              />
            </div>
            
            <div className="flex flex-col shrink-0">
              <span
                className={`font-serif text-[10px] xs:text-[11.5px] sm:text-sm md:text-base font-normal tracking-wide leading-tight whitespace-nowrap transition-colors duration-300 ${
                  isScrolled
                    ? 'text-[#1C1B19]'
                    : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
                }`}
              >
                Consilio Studios
              </span>
              <span
                className={`text-[6.5px] xs:text-[7.5px] sm:text-[8.5px] tracking-[0.14em] sm:tracking-[0.2em] font-mono uppercase font-medium whitespace-nowrap transition-colors duration-300 ${
                  isScrolled
                    ? 'text-[#57544E]'
                    : 'text-[#D9CEBE] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]'
                }`}
              >
                <span className="hidden xs:inline">ARCHITECTURE / INTERIORS / </span>PUNE
              </span>
            </div>
          </a>

          {/* RIGHT: Navigation Links & Circular Action Buttons */}
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-6 lg:gap-8 shrink-0">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item.href)}
                  className={`text-xs tracking-[0.2em] font-medium font-mono hover-underline-animation transition-colors duration-200 ${
                    isScrolled
                      ? 'text-[#1C1B19]/80 hover:text-[#1C1B19]'
                      : 'text-white/90 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Utility Controls (Mobile Menu & Phone Contact Symbol) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Mobile Hamburger Toggle (placed before contact symbol so contact symbol stays at far right) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 focus:outline-hidden ${
                  isScrolled
                    ? 'bg-[#1C1B19]/5 hover:bg-[#1C1B19]/10 text-[#1C1B19] border border-[#1C1B19]/15 shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-xs'
                }`}
                aria-label={mobileMenuOpen ? "Close menu" : "Open mobile menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className={`w-3.5 h-3.5 ${isScrolled ? 'text-[#1C1B19]' : 'text-white'}`} />
                ) : (
                  <Menu className={`w-3.5 h-3.5 ${isScrolled ? 'text-[#1C1B19]' : 'text-white'}`} />
                )}
              </button>

              {/* Refined Small Contact Symbol in Far Right Corner */}
              <a
                href={`tel:${STUDIO_INFO.phone.replace(/\s+/g, '')}`}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-105 focus:outline-hidden ${
                  isScrolled
                    ? 'bg-[#1C1B19]/5 hover:bg-[#1C1B19]/10 text-[#1C1B19] border border-[#1C1B19]/15 shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-xs'
                }`}
                title={`Call Consilio Studios: ${STUDIO_INFO.phone}`}
                aria-label={`Call Consilio Studios at ${STUDIO_INFO.phone}`}
              >
                <Phone className={`w-3.5 h-3.5 ${isScrolled ? 'text-[#1C1B19]' : 'text-white'}`} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#FAF8F5] dark:bg-[#121110] flex flex-col justify-between p-5 xs:p-6 sm:p-8 md:hidden transition-all duration-300 pt-safe pb-safe"
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div className="flex items-center justify-between border-b border-[#1C1B19]/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Consilio Studios Logo" className="w-full h-full object-contain filter brightness-0 transition-all duration-300" />
              </div>
              <span className="font-serif text-xs xs:text-sm tracking-wider text-[#1C1B19]">Consilio Studios</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full border border-[#1C1B19]/20 flex items-center justify-center text-[#1C1B19]"
              aria-label="Close menu"
            >
              <X size={16} className="text-[#1C1B19]" />
            </button>
          </div>

          <nav className="flex flex-col gap-2.5 my-auto py-3 sm:py-5" aria-label="Mobile navigation">
            {navItems.map((item, idx) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item.href)}
                  className={`group relative flex items-center justify-between p-3 xs:p-3.5 sm:p-4 rounded-xl border transition-all duration-300 active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#1C1B19]/[0.06] border-[#1C1B19]/25 shadow-xs'
                      : 'bg-white/60 hover:bg-white border-[#1C1B19]/10 hover:border-[#1C1B19]/25'
                  }`}
                >
                  <div className="flex items-center gap-3 xs:gap-3.5">
                    <span className={`text-[10px] xs:text-[11px] font-mono tracking-widest px-2 py-0.5 rounded-md transition-colors ${
                      isActive ? 'bg-[#4F5542] text-white font-medium' : 'bg-black/5 text-[#8F8B83] group-hover:text-[#1C1B19] group-hover:bg-black/10'
                    }`}>
                      0{idx + 1}
                    </span>
                    <div className="flex flex-col text-left">
                      <span className={`font-serif text-xs xs:text-sm sm:text-base tracking-wider uppercase transition-colors ${
                        isActive ? 'text-[#1C1B19] font-medium' : 'text-[#1C1B19]/90 group-hover:text-[#1C1B19]'
                      }`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] xs:text-[11px] font-mono text-[#8F8B83] tracking-wide mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F5542] animate-pulse" />
                    )}
                    <div className={`w-7 h-7 xs:w-8 xs:h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'border-[#1C1B19]/30 bg-white text-[#1C1B19]'
                        : 'border-black/5 bg-black/[0.02] text-[#8F8B83] group-hover:border-[#1C1B19]/20 group-hover:bg-white group-hover:text-[#1C1B19] group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    }`}>
                      <ArrowUpRight size={13} />
                    </div>
                  </div>
                </a>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#1C1B19]/10 dark:border-white/10 flex flex-col gap-2.5 text-xs tracking-wider text-[#57544E] dark:text-[#A09C94]">
            <p className="font-medium text-[#1C1B19] dark:text-white">ARCHITECTURE / INTERIORS / PUNE</p>
            <p>{STUDIO_INFO.location}</p>
            <div className="pt-1">
              <a
                href={STUDIO_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full justify-center px-4 py-2.5 rounded-full bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30 font-mono text-xs inline-flex items-center gap-1.5 font-medium hover:bg-[#25D366]/25 transition-colors"
              >
                <span>WhatsApp Dialogue: {STUDIO_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
