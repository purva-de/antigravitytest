import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState('default'); // 'default', 'hover', 'view'
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is touch or mobile
    const checkTouch = () => {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth < 1024;
    };

    if (checkTouch()) {
      setIsMobile(true);
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const viewTrigger = target.closest('[data-cursor="view"]');
      const interactiveTrigger = target.closest('button, a, input, select, textarea, [data-cursor="pointer"]');

      if (viewTrigger) {
        setCursorType('view');
      } else if (interactiveTrigger) {
        setCursorType('hover');
      } else {
        setCursorType('default');
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-hidden="true"
    >
      {/* Small, elegant architectural cursor dot */}
      {cursorType === 'default' && (
        <div className="w-1.5 h-1.5 rounded-full bg-[#1C1B19] dark:bg-[#FAF8F5] transition-all duration-150 shadow-xs" />
      )}

      {/* Small subtle ring on interactive hover */}
      {cursorType === 'hover' && (
        <div className="w-4 h-4 rounded-full border border-[#1C1B19]/70 dark:border-white/70 bg-[#1C1B19]/10 dark:bg-white/10 scale-100 transition-all duration-200" />
      )}

      {/* Small compact pill on project view */}
      {cursorType === 'view' && (
        <div className="w-7 h-7 rounded-full bg-[#1C1B19]/90 text-[#FAF8F5] flex items-center justify-center text-[7px] tracking-widest font-mono uppercase shadow-md scale-100 transition-all duration-200">
          VIEW
        </div>
      )}
    </div>
  );
}
