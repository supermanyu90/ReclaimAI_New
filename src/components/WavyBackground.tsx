import React, { useRef, useEffect } from 'react';

interface WavyBackgroundProps {
  mouseX: number;
  mouseY: number;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({ mouseX, mouseY }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Offset based on mouse position
      const mouseFactorX = (mouseX / window.innerWidth) - 0.5;
      const mouseFactorY = (mouseY / window.innerHeight) - 0.5;

      // Draw two wave layers
      drawWave(ctx, canvas, time, 0.005 + mouseFactorX * 0.002, 30 + mouseFactorY * 20, '#1a1a1a', 0.05);
      drawWave(ctx, canvas, time * 0.8, 0.003 + mouseFactorX * 0.001, 50 + mouseFactorY * 30, '#4a5d4e', 0.05);

      time += 0.02;
      animationFrameId = requestAnimationFrame(draw);
    };

    const drawWave = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      time: number,
      frequency: number,
      amplitude: number,
      color: string,
      opacity: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      for (let x = 0; x <= canvas.width; x++) {
        const y = Math.sin(x * frequency + time) * amplitude + canvas.height * 0.8;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
