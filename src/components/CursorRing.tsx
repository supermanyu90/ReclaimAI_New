import React, { useEffect, useRef } from 'react';

export const CursorRing: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const handleMouseMove = (e: MouseEvent) => {
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={ringRef}
      className="cursor-ring fixed w-10 h-10 border border-[#b4916c] rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
    />
  );
};
