import React from "react";
import { STUDIO_INFO } from "../data/projectsData";
import { ArrowUp, Instagram, MessageCircle, Linkedin, MapPin } from "lucide-react";

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "Studio", id: "studio" },
    { label: "Work", id: "work" },
    { label: "Services", id: "services" },
    { label: "Process", id: "process" },
    { label: "Contact", id: "contact" }
  ];

  return (
    <footer
      className="bg-[var(--color-bg)] border-t border-[var(--color-border)] text-[var(--color-text)] transition-colors duration-500"
      aria-label="Consilio Studios Footer"
    >
      {/* Top Banner / Studio Identity with balanced padding */}
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          {/* Logo & Descriptor */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 xs:w-10 xs:h-10 flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="Consilio Studios Official Logo"
                  className="h-full w-full object-contain filter brightness-0 transition-all duration-300"
                />
              </div>
              <span className="font-serif text-xl xs:text-2xl tracking-wider text-[var(--color-text)] font-normal">
                CONSILIO STUDIOS
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.25em] font-mono text-[var(--color-muted)] font-medium">
              Architecture • Interiors • Spatial Design
            </p>
            <p className="text-sm text-[var(--color-muted)] font-light leading-relaxed pt-1">
              Conceiving spaces of profound stillness, tactile richness, and timeless permanence.
              Based in {STUDIO_INFO.location}, shaping residences and pavilions worldwide.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--color-muted)]">
              <a
                href={STUDIO_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--color-text)] hover:text-[#25D366] transition-colors"
              >
                <MessageCircle size={13} className="text-[#25D366]" />
                <span>{STUDIO_INFO.phone}</span>
              </a>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} className="text-[var(--color-accent)]" />
                <span>{STUDIO_INFO.location}</span>
              </span>
            </div>
          </div>

          {/* Founder & Studio Leadership Showcase */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)] font-semibold block mb-4">
              Founder & Leadership
            </span>
            <div className="group relative flex flex-col p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/70 hover:border-[var(--color-accent)]/50 transition-all duration-300 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden shrink-0 border border-[var(--color-border)] shadow-xs">
                  <img
                    src="/founder.jpg"
                    alt="Founder & Principal Architect, Consilio Studios"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--color-accent)] font-medium">
                    Principal Architect
                  </span>
                  <h4 className="font-serif text-base sm:text-lg text-[var(--color-text)] font-normal leading-snug mt-0.5">
                    Consilio Studios
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--color-muted)] mt-0.5">
                    Pune
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--color-muted)] font-light leading-relaxed mt-3 pt-3 border-t border-[var(--color-border)]/60">
                Founder-led spatial commissions with weekly 3D milestones and direct on-site execution.
              </p>
              <div className="mt-2.5 pt-2 flex items-center justify-between">
                <a
                  href={STUDIO_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-text)] hover:text-[#25D366] transition-colors"
                >
                  <MessageCircle size={12} className="text-[#25D366]" />
                  <span>Direct Dialogue</span>
                </a>
                <span className="text-[10px] font-mono tracking-wider text-[var(--color-muted)] uppercase">
                  Founder
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)] font-semibold block mb-4">
              Navigation
            </span>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate ? onNavigate(item.id) : document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-xs uppercase tracking-widest font-mono text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Channels & Back to Top */}
          <div className="md:col-span-3 space-y-6 flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-muted)] font-semibold block mb-4">
                Social Dialogues
              </span>
              <div className="flex items-center gap-3.5">
                <a
                  href={STUDIO_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                  aria-label="Consilio Studios on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={STUDIO_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                  aria-label="Connect via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={STUDIO_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                  aria-label="Consilio Studios on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2.5 text-xs uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors group"
                aria-label="Scroll back to top of page"
              >
                <span>Return to Top</span>
                <div className="w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                  <ArrowUp className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright Bar with generous padding */}
        <div className="mt-16 sm:mt-20 pt-8 sm:pt-10 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-muted)] font-light gap-4 text-center sm:text-left">
          <p>© 2026 Consilio Studios. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-[10px] xs:text-[11px] tracking-wider uppercase font-mono">
            <span>Architecture</span>
            <span>•</span>
            <span>Interiors</span>
            <span>•</span>
            <span>{STUDIO_INFO.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
