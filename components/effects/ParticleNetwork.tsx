'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const particleCount = 100;
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }
    particlesRef.current = particles;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(156, 163, 175, 0.4)'; // gray-400
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            // Calculate opacity based on distance
            const opacity = 1 - distance / 150;
            
            // Check distance to mouse
            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            const midX = (particle.x + particles[j].x) / 2;
            const midY = (particle.y + particles[j].y) / 2;
            const mouseDist = Math.sqrt(
              (mouseX - midX) ** 2 + (mouseY - midY) ** 2
            );

            // Glow effect near mouse
            let lineWidth = 1;
            let glowIntensity = 0;
            if (mouseDist < 200) {
              glowIntensity = 1 - mouseDist / 200;
              lineWidth = 1 + glowIntensity * 2;
            }

            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            if (glowIntensity > 0) {
              // Glowing gray line near mouse
              ctx.strokeStyle = `rgba(209, 213, 219, ${opacity * 0.6})`;
              ctx.lineWidth = lineWidth;
              ctx.shadowBlur = 8 + glowIntensity * 15;
              ctx.shadowColor = 'rgba(209, 213, 219, 0.5)';
            } else {
              // Normal line
              ctx.strokeStyle = `rgba(156, 163, 175, ${opacity * 0.2})`;
              ctx.lineWidth = 1;
              ctx.shadowBlur = 0;
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset shadow
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
