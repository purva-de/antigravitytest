import React from 'react';
import { PROCESS_DATA } from '../data/projectsData';

export default function Process() {
  return (
    <section id="process" className="pt-6 sm:pt-8 pb-8 sm:pb-10 bg-[#FAF8F5] dark:bg-[#121110] text-[#1C1B19] dark:text-[#FAF8F5] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-[#1C1B19]/10 dark:border-white/10 mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs tracking-[0.25em] font-mono text-[#8F8B83] uppercase mb-1.5">
              <span className="w-6 sm:w-8 h-px bg-[#1C1B19]/30 dark:bg-white/30" />
              <span>METHODOLOGY & EXECUTION</span>
            </div>
            <h2 className="font-serif text-sm sm:text-base lg:text-lg font-normal tracking-tight">
              THE PROCESS
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs font-mono tracking-widest text-[#8F8B83] uppercase">
            A CONTINUOUS ARCHITECTURAL JOURNEY
          </p>
        </div>

        {/* 5-Step Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 relative">
          {PROCESS_DATA.map((step) => (
            <div
              key={step.step}
              className="flex flex-col justify-between group p-4 sm:p-0 rounded-xl sm:rounded-none bg-black/[0.02] dark:bg-white/[0.02] sm:bg-transparent border border-black/5 dark:border-white/5 sm:border-0"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 sm:pb-3 mb-3 sm:mb-4 border-b border-[#1C1B19]/20 dark:border-white/20">
                  <span className="font-mono text-lg sm:text-xl font-light text-[#8F8B83] group-hover:text-[#4F5542] dark:group-hover:text-[#D9CEBE] transition-colors">
                    {step.step}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#1C1B19]/20 dark:bg-white/20 group-hover:bg-[#4F5542] dark:group-hover:bg-[#D9CEBE] transition-colors" />
                </div>

                <h3 className="font-serif text-xs sm:text-sm lg:text-base font-normal tracking-tight text-[#1C1B19] dark:text-[#FAF8F5] mb-1">
                  {step.name}
                </h3>

                <p className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-[#8F8B83] mb-2">
                  {step.subtitle}
                </p>

                <p className="text-xs font-light text-[#57544E] dark:text-[#A09C94] leading-relaxed mb-3 sm:mb-4">
                  {step.description}
                </p>
              </div>

              <div className="pt-2.5 sm:pt-3 border-t border-[#1C1B19]/5 dark:border-white/5 text-[10px] font-mono text-[#8F8B83] leading-normal">
                {step.details}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
