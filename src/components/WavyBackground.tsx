import React, { useEffect, useRef } from 'react';

export const WavyBackground: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let t = 0;
    const animateWave = () => {
      if (!pathRef.current) return;
      t += 0.01;
      const y1 = 400 + Math.sin(t) * 50;
      const y2 = 400 + Math.cos(t) * 50;
      pathRef.current.setAttribute('d', `M0 ${y1} Q 360 ${y2} 720 ${y1} T 1440 ${y1}`);
      requestAnimationFrame(animateWave);
    };
    const frame = requestAnimationFrame(animateWave);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg className="wave-bg fixed inset-0 z-0 opacity-40 pointer-events-none" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
        <path ref={pathRef} d="M0 400 Q 360 300 720 400 T 1440 400" stroke="#b4916c" strokeWidth="0.5" fill="none" />
    </svg>
  );
};
