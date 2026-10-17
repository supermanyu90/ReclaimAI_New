import React, { useEffect, useRef } from 'react';

export const CursorRing: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!ring || !glow) return;

    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ring.style.opacity = '1';
        glow.style.opacity = '1';
      }

      // Instant hardware-accelerated transform: 0ms lag, direct sync with mouse position
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      // Check if hovering over clickable or interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, select, textarea, [role="button"], label, tr[class*="cursor-pointer"]');
        if (interactive) {
          ring.style.width = '56px';
          ring.style.height = '56px';
          ring.style.backgroundColor = 'rgba(180, 145, 108, 0.12)';
          ring.style.borderColor = '#b4916c';
        } else {
          ring.style.width = '40px';
          ring.style.height = '40px';
          ring.style.backgroundColor = 'transparent';
          ring.style.borderColor = 'rgba(180, 145, 108, 0.7)';
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      ring.style.opacity = '0';
      glow.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      ring.style.opacity = '1';
      glow.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <>
      {/* Ambient Radial Cursor Highlighter Glow (Synchronized directly with cursor) */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none z-[1] will-change-transform opacity-0 transition-opacity duration-200"
        style={{
          background: 'radial-gradient(circle, rgba(180, 145, 108, 0.08) 0%, rgba(180, 145, 108, 0.02) 40%, transparent 70%)',
          transform: 'translate3d(-1000px, -1000px, 0)',
        }}
      />

      {/* Crisp Precision Cursor Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[#b4916c]/70 pointer-events-none z-[9999] will-change-transform opacity-0 transition-[width,height,border-color,background-color,opacity] duration-150 ease-out"
        style={{
          transform: 'translate3d(-1000px, -1000px, 0)',
        }}
      />
    </>
  );
};
