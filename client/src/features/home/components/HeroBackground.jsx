import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const particles = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  duration: Math.random() * 10 + 10,
  delay: Math.random() * 5,
}));

export default function HeroBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const auraX = useTransform(smoothMouseX, [-500, 500], [-30, 30]);
  const auraY = useTransform(smoothMouseY, [-500, 500], [-30, 30]);
  const parallaxX = useTransform(smoothMouseX, [-500, 500], [-15, 15]);
  const parallaxY = useTransform(smoothMouseY, [-500, 500], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX - innerWidth / 2);
      mouseY.set(e.clientY - innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dark background base */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Cyber grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-60" />

      {/* Radial vignetting / gradient mask */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#030712_75%)]" />

      {/* Aurora blur blobs */}
      <motion.div
        style={{ x: auraX, y: auraY }}
        className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/25 via-blue-600/20 to-purple-600/20 blur-[130px] animate-aurora"
      />

      <motion.div
        style={{ x: auraY, y: auraX }}
        className="absolute top-[30%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-indigo-500/20 via-sky-400/20 to-teal-400/15 blur-[140px] animate-aurora"
      />

      <motion.div
        className="absolute bottom-[-10%] left-[30%] w-[600px] h-[400px] rounded-full bg-gradient-to-r from-blue-600/15 via-violet-600/15 to-cyan-400/20 blur-[150px] animate-aurora"
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-200/60 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating geometric 3D glass cubes */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute top-[18%] left-[8%] hidden xl:block w-24 h-24 rounded-2xl border border-cyan-400/20 bg-slate-900/20 backdrop-blur-md shadow-[0_0_30px_rgba(56,189,248,0.1)] rotate-12 animate-float-slow"
      />

      <motion.div
        style={{ x: parallaxY, y: parallaxX }}
        className="absolute bottom-[22%] right-[6%] hidden xl:block w-20 h-20 rounded-2xl border border-purple-400/20 bg-slate-900/20 backdrop-blur-md shadow-[0_0_30px_rgba(139,92,246,0.1)] -rotate-12 animate-float-slow"
      />
    </div>
  );
}
