import React, { useEffect, useRef, useState } from 'react';

interface InteractiveInfiniteGridProps {
  gridSize?: number;
  glowColor?: string;
  baseOpacity?: number;
  className?: string;
}

const InteractiveInfiniteGrid: React.FC<InteractiveInfiniteGridProps> = ({
  gridSize = 60,
  glowColor = 'rgba(199, 123, 63, 0.45)', // Premium Amber/Orange glow matching haappy theme
  baseOpacity = 0.2,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [interactCount, setInteractCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
      if (!isHovered) setIsHovered(true);
      setInteractCount((prev) => (prev < 999 ? prev + 1 : prev));
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePos({ x: -1000, y: -1000 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      style={{ background: '#141414' }}
    >
      {/* 1. Base Infinite Scrolling Grid */}
      <div
        className="absolute inset-0 infinite-grid-scroll"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, ${baseOpacity * 0.4}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, ${baseOpacity * 0.4}) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* 2. Secondary Floating Cyber Grid (Subtle Parallax Layer) */}
      <div
        className="absolute inset-0 infinite-grid-scroll-reverse opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(199, 123, 63, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(199, 123, 63, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize * 2}px ${gridSize * 2}px`,
        }}
      />

      {/* 3. Mouse Cursor Glow Spotlight Layer (Reveals Active Grid Lines & Nodes) */}
      <div
        className="absolute inset-0 infinite-grid-scroll transition-opacity duration-300"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(199, 123, 63, 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(199, 123, 63, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          opacity: isHovered ? 1 : 0,
          WebkitMaskImage: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 80%)`,
          maskImage: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 80%)`,
        }}
      />

      {/* 4. Glowing Neon Cursor Orb */}
      <div
        className="absolute rounded-full transition-all duration-75 pointer-events-none blur-3xl opacity-60"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          width: '380px',
          height: '380px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(199,123,63,0.35) 0%, rgba(147,51,234,0.15) 50%, transparent 80%)',
        }}
      />

      {/* 5. Vignette Dark Borders for Cinematic Focus */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(20,20,20,0.85) 100%)',
        }}
      />
    </div>
  );
};

export default InteractiveInfiniteGrid;
