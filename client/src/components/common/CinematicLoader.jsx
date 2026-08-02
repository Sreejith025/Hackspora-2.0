import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

export default function CinematicLoader({ onComplete }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [sceneStage, setSceneStage] = useState(1); // 1 to 6
  const [isWarping, setIsWarping] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x081020, 2);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x38bdf8, 5, 100);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 4, 80);
    purpleLight.position.set(20, -10, 10);
    scene.add(purpleLight);

    // --- 1. 3D SPIRAL GALAXY PARTICLES ---
    const galaxyParticlesCount = 6000;
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyPositions = new Float32Array(galaxyParticlesCount * 3);
    const galaxyColors = new Float32Array(galaxyParticlesCount * 3);
    const originalZ = new Float32Array(galaxyParticlesCount);

    const colorCyan = new THREE.Color(0x38bdf8);
    const colorPurple = new THREE.Color(0x8b5cf6);
    const colorIce = new THREE.Color(0xddf7ff);

    for (let i = 0; i < galaxyParticlesCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 35 + 2;
      const spinAngle = radius * 0.4;
      const branchAngle = ((i % 4) * Math.PI * 2) / 4;

      const randomX = (Math.random() - 0.5) * (radius * 0.3);
      const randomY = (Math.random() - 0.5) * (radius * 0.3);
      const randomZ = (Math.random() - 0.5) * (radius * 0.3);

      const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
      const y = (Math.random() - 0.5) * 4 + randomY;
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      galaxyPositions[i3] = x;
      galaxyPositions[i3 + 1] = y;
      galaxyPositions[i3 + 2] = z;
      originalZ[i] = z;

      // Color gradient by radius
      const mixedColor = colorCyan.clone().lerp(
        radius > 15 ? colorPurple : colorIce,
        Math.random()
      );
      galaxyColors[i3] = mixedColor.r;
      galaxyColors[i3 + 1] = mixedColor.g;
      galaxyColors[i3 + 2] = mixedColor.b;
    }

    galaxyGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(galaxyPositions, 3)
    );
    galaxyGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(galaxyColors, 3)
    );

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const galaxyMesh = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxyMesh);

    // --- 2. GLOWING ENERGY CORE ---
    const coreGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 2,
      roughness: 0.1,
      metalness: 0.8,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Wireframe outer sphere
    const wireCoreGeo = new THREE.IcosahedronGeometry(3.6, 2);
    const wireCoreMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireCoreMesh = new THREE.Mesh(wireCoreGeo, wireCoreMat);
    scene.add(wireCoreMesh);

    // Orbital Rings
    const ringGeo = new THREE.TorusGeometry(6, 0.05, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // --- 3. FLOATING GLASS CRYSTAL SHARDS & CUBES ---
    const crystals = [];
    const crystalGeo = new THREE.OctahedronGeometry(1, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xddf7ff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });

    for (let i = 0; i < 15; i++) {
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      const angle = (i / 15) * Math.PI * 2;
      const dist = 12 + Math.random() * 8;
      crystal.position.set(
        Math.cos(angle) * dist,
        (Math.random() - 0.5) * 10,
        Math.sin(angle) * dist
      );
      crystal.scale.setScalar(Math.random() * 0.8 + 0.4);
      scene.add(crystal);
      crystals.push({ mesh: crystal, angle, dist, speed: 0.005 + Math.random() * 0.005 });
    }

    // --- MOUSE INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- RESIZE ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP & TIMELINE ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Galaxy rotation
      galaxyMesh.rotation.y = elapsedTime * 0.05;
      wireCoreMesh.rotation.y = -elapsedTime * 0.15;
      wireCoreMesh.rotation.x = elapsedTime * 0.1;
      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.2;

      // Orbiting crystals
      crystals.forEach((c) => {
        c.angle += c.speed;
        c.mesh.position.x = Math.cos(c.angle) * c.dist;
        c.mesh.position.z = Math.sin(c.angle) * c.dist;
        c.mesh.rotation.x += 0.01;
        c.mesh.rotation.y += 0.01;
      });

      // Smooth camera parallax based on mouse
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Core pulse
      const pulse = 1 + Math.sin(elapsedTime * 4) * 0.08;
      coreMesh.scale.set(pulse, pulse, pulse);

      // Hyperspace Warp Speed stretch when progress hits 100%
      if (isWarping) {
        const positions = galaxyGeometry.attributes.position.array;
        for (let i = 0; i < galaxyParticlesCount; i++) {
          const i3 = i * 3;
          positions[i3 + 2] += 4; // Velocity along Z axis
          if (positions[i3 + 2] > 100) {
            positions[i3 + 2] = -100;
          }
        }
        galaxyGeometry.attributes.position.needsUpdate = true;
        camera.position.z -= 0.8;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [isWarping]);

  // --- LOADING PROGRESS & SCENE STAGE TIMELINE ---
  useEffect(() => {
    const startTime = Date.now();
    const duration = 6000; // 6 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      // Scene stage updates
      if (pct < 15) setSceneStage(1);
      else if (pct < 35) setSceneStage(2);
      else if (pct < 60) setSceneStage(3);
      else if (pct < 85) setSceneStage(4);
      else if (pct < 100) setSceneStage(5);
      else if (pct >= 100) {
        setSceneStage(6);
        setIsWarping(true);
        clearInterval(interval);

        // Flash & completion trigger
        setTimeout(() => {
          setFlash(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
        }, 500);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Ambient Radial Vignette & Neon Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#020617_80%)] pointer-events-none" />

      {/* Scene Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between p-8 pointer-events-none">
        
        {/* Top Bar / Audio & Skip Controls */}
        <div className="w-full flex items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>ORBITAL LAUNCH SYSTEM v2.0</span>
          </div>
          <button
            onClick={() => {
              setProgress(100);
              if (onComplete) onComplete();
            }}
            className="px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all cursor-pointer"
          >
            SKIP INTRO ➔
          </button>
        </div>

        {/* Center Text & HUD Interface */}
        <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-xl">
          <AnimatePresence mode="wait">
            {sceneStage >= 4 && (
              <motion.div
                key="brandText"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.8 }}
                className="space-y-2"
              >
                <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#DDF7FF] text-glow-ice">
                  HACKSPORA <span className="text-cyan-400">2.0</span>
                </h1>
                <div className="flex items-center justify-center space-x-3 text-lg sm:text-xl font-extrabold tracking-widest text-cyan-300">
                  <span>Innovate.</span>
                  <span className="text-cyan-500">•</span>
                  <span>Build.</span>
                  <span className="text-cyan-500">•</span>
                  <span>Impact.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Futuristic Circular Loading HUD */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer Rotating Arc */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/40 animate-spin" />
            <div className="absolute inset-2 rounded-full border border-purple-500/30 animate-orbit-reverse" />

            {/* Glowing Progress Circle */}
            <svg className="w-36 h-36 -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-800/80"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="4"
                className="text-cyan-400 transition-all duration-100 ease-out"
                fill="transparent"
                strokeDasharray="377"
                strokeDashoffset={377 - (377 * progress) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Percentage Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-3xl font-black bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                {progress}%
              </span>
              <span className="text-[9px] text-cyan-400/80 tracking-widest uppercase mt-0.5">
                {progress < 100 ? 'INITIALIZING' : 'LAUNCHING'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Status Ticker */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div>
            STAGE: <span className="text-cyan-300 font-bold">{sceneStage} / 6</span>
          </div>
          <div className="hidden sm:block text-center text-slate-500">
            SOUTH INDIA PREMIER 24-HOUR HACKATHON
          </div>
          <div>
            SYSTEM: <span className="text-cyan-300 font-bold">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Hyperspace Flash Transition */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 bg-white"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
