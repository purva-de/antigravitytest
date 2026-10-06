import React, { useState } from "react";
import { STUDIO_INFO } from "../data/projectsData";
import { X, Send, CheckCircle2, MessageCircle, Phone, MapPin } from "lucide-react";

export default function Contact({ onNavigate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleNavClick = (sectionId) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="contact"
      className="relative bg-[#0A0A0A] text-white pt-12 sm:pt-16 pb-8 overflow-hidden select-none"
      aria-label="Contact & Studio Information"
    >
      {/* Huge Faint Architectural Watermark across the background */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-8 pointer-events-none select-none w-full text-center overflow-hidden opacity-90 z-0"
        aria-hidden="true"
      >
        <span className="font-serif text-[10vw] leading-none uppercase tracking-[0.16em] text-white/[0.04] font-normal whitespace-nowrap block">
          CONSILIO
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 xs:px-6 sm:px-10 lg:px-12">
        {/* Main Upper Grid: Left Headline & Right Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Grand Editorial Headline & Consultation Button */}
          <div className="lg:col-span-6">
            <h2 className="font-serif text-lg xs:text-xl sm:text-3xl lg:text-4xl font-normal leading-[1.08] tracking-tight text-white">
              Elevate your<br />
              architectural<br />
              <span className="italic text-[#828C74] font-light">
                experience.
              </span>
            </h2>

            {/* Action Buttons: Consultation Modal & Direct WhatsApp */}
            <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row items-stretch xs:items-center gap-3 xs:gap-3.5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 xs:px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-white text-black text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all duration-300 hover:scale-105 shadow-2xl group focus:outline-hidden"
                data-cursor="pointer"
              >
                <span>Consult with us</span>
                <span className="w-5 h-[1.5px] bg-black transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <a
                href={STUDIO_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 xs:px-6 py-2.5 sm:py-3 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/30 text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 shadow-lg group focus:outline-hidden"
                data-cursor="pointer"
              >
                <MessageCircle size={16} className="shrink-0" />
                <span className="flex flex-col text-left leading-tight">
                  <span className="text-[11px] sm:text-xs font-normal">WhatsApp:</span>
                  <span className="whitespace-nowrap font-mono text-xs sm:text-sm font-medium">{STUDIO_INFO.phone}</span>
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT: Contact, Location, Social & Studio Directory Columns */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-2 sm:pt-4">
            
            {/* CONTACT & LOCATION COLUMN */}
            <div className="space-y-5 sm:space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#8A8478] flex items-center gap-1.5 mb-2">
                  <Phone size={12} className="text-[#828C74]" /> CONTACT
                </span>
                <a
                  href={`tel:${STUDIO_INFO.phone.replace(/\s+/g, '')}`}
                  className="text-xs sm:text-sm text-white/90 hover:text-[#828C74] transition-colors font-light block"
                >
                  {STUDIO_INFO.phone}
                </a>
                <a
                  href={STUDIO_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#25D366] hover:underline font-mono inline-flex items-center gap-1 mt-1"
                >
                  <MessageCircle size={11} /> [WhatsApp]
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#8A8478] flex items-center gap-1.5 mb-2">
                  <MapPin size={12} className="text-[#828C74]" /> LOCATION
                </span>
                <address className="text-xs sm:text-sm text-white/80 font-light not-italic leading-relaxed">
                  {STUDIO_INFO.location}
                </address>
              </div>
            </div>

            {/* SOCIAL COLUMN */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#8A8478] block mb-2 sm:mb-2.5">
                SOCIAL
              </span>
              <ul className="space-y-2 sm:space-y-2.5">
                <li>
                  <a
                    href={STUDIO_INFO.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-white/90 hover:text-[#828C74] transition-colors font-light block"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={STUDIO_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-white/90 hover:text-[#828C74] transition-colors font-light block"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={STUDIO_INFO.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-white/90 hover:text-[#25D366] transition-colors font-light block"
                  >
                    WhatsApp Direct
                  </a>
                </li>
              </ul>
            </div>

            {/* STUDIO COLUMN */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#8A8478] block mb-2 sm:mb-2.5">
                STUDIO
              </span>
              <ul className="space-y-2 sm:space-y-2.5">
                <li>
                  <button
                    onClick={() => handleNavClick("studio")}
                    className="text-xs sm:text-sm text-white/90 hover:text-[#828C74] transition-colors font-light text-left"
                  >
                    About Practice
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("work")}
                    className="text-xs sm:text-sm text-white/90 hover:text-[#828C74] transition-colors font-light text-left"
                  >
                    Selected Work
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("services")}
                    className="text-xs sm:text-sm text-white/90 hover:text-[#828C74] transition-colors font-light text-left"
                  >
                    Services
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* FOUNDER & STUDIO LEADERSHIP HIGHLIGHT */}
        <div className="mt-10 sm:mt-16 p-5 sm:p-8 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-2xl group">
              <img
                src="/founder.jpg"
                alt="Founder & Principal Architect, Consilio Studios"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#828C74]/20 border border-[#828C74]/40 text-[#828C74] text-[10px] font-mono tracking-widest uppercase mb-1.5 sm:mb-2">
                Founder & Principal Architect
              </div>
              <h3 className="font-serif text-sm sm:text-base text-white font-normal">
                Consilio Studios Leadership
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl mt-1 sm:mt-1.5 leading-relaxed">
                Direct founder-led communication, weekly 3D milestones, and dedicated on-site precision for every residential and spatial commission.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={STUDIO_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 shadow-lg"
              data-cursor="pointer"
            >
              <MessageCircle size={15} className="text-[#25D366]" />
              <span>Connect with Founder</span>
            </a>
          </div>
        </div>

        {/* Thin Divider Line */}
        <div className="w-full h-px bg-white/10 mt-8 sm:mt-14 mb-5 sm:mb-6" />

        {/* Bottom Bar: Logo, Founder Avatar, Name, Location & Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs font-light">
          
          {/* Left Brand Identity */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
              <img
                src="/founder.jpg"
                alt="Founder & Principal Architect"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="Consilio Studios Emblem"
                className="w-full h-full object-contain invert"
              />
            </div>
            <span className="font-serif italic text-white/90 text-xs">
              Consilio Studios
            </span>
            <span className="w-4 h-px bg-white/30 hidden sm:inline-block" />
            <span className="text-[11px] font-mono text-white/70 tracking-wider">
              {STUDIO_INFO.location}
            </span>
          </div>

          {/* Right Copyright Notice */}
          <div className="text-[10px] sm:text-[11px] font-mono text-white/40 tracking-[0.16em] uppercase">
            © 2026 CONSILIO STUDIOS. REFINED BY CRAFT.
          </div>

        </div>
      </div>

      {/* LUXURY CONSULTATION MODAL (Triggered by "Consult with us —") */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-[#141413] border border-white/15 p-5 xs:p-7 sm:p-10 rounded-2xl shadow-2xl relative text-white max-h-[92dvh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => { setIsModalOpen(false); setIsSubmitted(false); }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>

            {isSubmitted ? (
              <div className="text-center py-6 sm:py-8 space-y-4">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#828C74] mx-auto" />
                <h3 className="font-serif text-sm sm:text-base text-white">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto font-light leading-relaxed">
                  Thank you, {formData.name || "friend"}. Our studio partners will review your project brief and connect within 24–48 hours.
                </p>
                <div className="pt-3 sm:pt-4">
                  <button
                    onClick={() => { setIsModalOpen(false); setIsSubmitted(false); }}
                    className="px-6 py-2.5 rounded-full bg-white text-black text-xs uppercase tracking-widest font-medium hover:bg-neutral-200 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#828C74] block mb-1.5 sm:mb-2">
                  CONSILIO STUDIOS
                </span>
                <h3 className="font-serif text-sm sm:text-base text-white mb-1.5 sm:mb-2">
                  Initiate a Consultation
                </h3>
                <p className="text-xs text-white/60 font-light mb-5 sm:mb-6">
                  Share your plot or space parameters. We respond with thoughtful vision.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#828C74] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#828C74] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91..."
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#828C74] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/60 mb-1">
                      Project Concept or Location *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Brief details about your residence, plot area, or interior vision..."
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#828C74] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 sm:gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full xs:w-auto px-6 sm:px-7 py-3 rounded-full bg-white text-black text-xs uppercase tracking-widest font-medium hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group shadow-lg"
                    >
                      <span>{isSubmitting ? "Transmitting..." : "Send Consultation"}</span>
                      <Send size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <a
                      href={STUDIO_INFO.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/70 hover:text-[#25D366] transition-colors flex items-center justify-center gap-1.5 font-mono"
                    >
                      <MessageCircle size={14} className="text-[#25D366]" />
                      <span>WhatsApp: {STUDIO_INFO.phone}</span>
                    </a>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
}
