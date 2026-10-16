import React, { useEffect, useRef } from 'react';

export const StarBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = containerRef.current;
    if (!bg) return;

    // Create stars
    for (let i = 0; i < 100; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      s.style.position = 'absolute';
      s.style.width = '2px';
      s.style.height = '2px';
      s.style.background = 'rgba(255, 255, 255, 0.5)';
      s.style.borderRadius = '50%';
      s.style.animation = 'twinkle 3s infinite';
      s.style.top = Math.random() * 100 + '%';
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDelay = Math.random() * 3 + 's';
      bg.appendChild(s);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const h = document.createElement('div');
      h.style.position = 'fixed';
      h.style.left = e.clientX + 'px';
      h.style.top = e.clientY + 'px';
      h.style.width = '200px';
      h.style.height = '200px';
      h.style.background = 'radial-gradient(circle, rgba(135,169,255,0.05) 0%, transparent 70%)';
      h.style.pointerEvents = 'none';
      h.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 500);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
      `}</style>
      <div
        ref={containerRef}
        className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,#1e1e24_0%,#111113_100%)]"
        aria-hidden="true"
      />
    </>
  );
};
