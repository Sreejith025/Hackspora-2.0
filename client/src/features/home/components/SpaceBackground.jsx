import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const shootingStars = [
  { id: 1, top: '15%', right: '20%', delay: '1s', duration: '5s' },
  { id: 2, top: '38%', right: '45%', delay: '6s', duration: '5.5s' },
  { id: 3, top: '60%', right: '12%', delay: '9s', duration: '4.8s' },
  { id: 4, top: '25%', right: '70%', delay: '3.5s', duration: '5.2s' },
];

export default function SpaceBackground() {
  const canvasRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 35, stiffness: 90 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Subtle Mouse Parallax Layers
  const layer1X = useTransform(smoothMouseX, [-800, 800], [-10, 10]);
  const layer1Y = useTransform(smoothMouseY, [-800, 800], [-10, 10]);
  const layer2X = useTransform(smoothMouseX, [-800, 800], [-25, 25]);
  const layer2Y = useTransform(smoothMouseY, [-800, 800], [-25, 25]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX - innerWidth / 2);
      mouseY.set(e.clientY - innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // 60 FPS HTML5 Canvas for Layer 1 (Twinkling Stars) & Layer 4 (Galaxy Dust)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isMobile = window.innerWidth < 768;
    const numStars = isMobile ? 140 : 350;

    // Layer 1 & 4 particles
    const stars = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.45 + 0.05,
      speedAlpha: Math.random() * 0.006 + 0.002,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      color: Math.random() > 0.45 ? '#38bdf8' : Math.random() > 0.65 ? '#c084fc' : '#ddf7ff',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha += s.speedAlpha;

        if (s.alpha > 0.55 || s.alpha < 0.05) {
          s.speedAlpha = -s.speedAlpha;
        }

        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, Math.min(0.55, s.alpha));
        if (!isMobile && s.radius > 1.2) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = s.color;
        }
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#02040A] w-full h-full">
      
      {/* LAYER 10: Moving Gradient Mesh Base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#050816_0%,_#030712_50%,_#02040A_100%)] opacity-90" />

      {/* LAYER 1 & 4: Twinkling Stars & Galaxy Dust Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />

      {/* LAYER 2: Moving Nebula Clouds (Blue & Purple) */}
      <motion.div
        style={{ x: layer1X, y: layer1Y }}
        className="absolute top-[-10%] right-[-5%] w-[650px] sm:w-[800px] h-[650px] sm:h-[800px] rounded-full bg-gradient-to-br from-purple-950/20 via-indigo-950/15 to-transparent blur-[160px] animate-aurora"
      />

      {/* LAYER 3: Aurora Waves (Cyan, Barely Visible) */}
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="absolute bottom-[-15%] left-[-5%] w-[700px] sm:w-[850px] h-[600px] sm:h-[700px] rounded-full bg-gradient-to-tr from-cyan-950/20 via-blue-950/15 to-purple-950/10 blur-[170px] animate-aurora"
      />

      {/* LAYER 9: Energy Wave Pulse (Starts Behind Title) */}
      <div className="absolute top-[22%] left-[20%] w-[500px] h-[300px] rounded-full border border-cyan-500/20 animate-pulse-wave pointer-events-none" />

      {/* LAYER 8: Rotating Holographic Circles & Radar Behind Content */}
      <motion.div
        style={{ x: layer1X, y: layer1Y }}
        className="absolute top-[10%] left-[2%] hidden lg:block w-[480px] h-[480px] rounded-full border border-cyan-500/10 animate-orbit"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 shadow-[0_0_8px_#38bdf8] absolute -top-1.5 left-1/2 -translate-x-1/2" />
      </motion.div>

      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="absolute bottom-[5%] right-[3%] hidden lg:block w-[550px] h-[550px] rounded-full border border-purple-500/10 animate-orbit-reverse"
      >
        <div className="w-3 h-3 rounded-full bg-purple-400/60 shadow-[0_0_10px_#c084fc] absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
      </motion.div>

      {/* LAYER 5: Shooting Stars & Comets */}
      {shootingStars.map((s) => (
        <div
          key={s.id}
          style={{ top: s.top, right: s.right, animationDelay: s.delay, animationDuration: s.duration }}
          className="absolute w-40 sm:w-48 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300 to-white shadow-[0_0_10px_#38bdf8] animate-shooting-star opacity-0"
        />
      ))}

      {/* LAYER 7: Constellation Lines (Fade Connected Nodes) */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
        <line x1="10%" y1="18%" x2="24%" y2="30%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="24%" y1="30%" x2="38%" y2="20%" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="68%" y1="72%" x2="84%" y2="86%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="84%" y1="86%" x2="94%" y2="65%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="6 6" />
      </svg>

      {/* Cyber Grid & Dots Background Overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30" />
      <div className="absolute inset-0 bg-circuit-dots opacity-15" />

      {/* Laser Scanline Beam */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-48 w-full animate-scanline opacity-50" />

      {/* EXTRA: Floating Glass Crystal & Space Badges */}
      <motion.div
        style={{ x: layer2X, y: layer2Y }}
        className="absolute top-[18%] left-[6%] hidden md:flex items-center justify-center w-20 h-20 rounded-2xl glass-card border border-cyan-400/20 animate-float-slow"
      >
        <div className="w-8 h-8 border-2 border-dashed border-cyan-400/40 rotate-45 animate-spin" />
      </motion.div>
    </div>
  );
}
