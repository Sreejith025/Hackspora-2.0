import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowUp } from 'react-icons/hi2';
import Lenis from 'lenis';

import HeroSection from '../features/home/components/HeroSection';
import AboutSection from '../features/landing/components/AboutSection';
import GuidelinesSection from '../features/landing/components/GuidelinesSection';
import ProblemStatementsSection from '../features/landing/components/ProblemStatementsSection';
import ScheduleSection from '../features/landing/components/ScheduleSection';
import FaqSection from '../features/landing/components/FaqSection';
import ContactSection from '../features/landing/components/ContactSection';

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initialize Lenis Ultra-Smooth Inertia Scroll Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    window.lenis = lenis;

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-[#02040A] text-slate-100 overflow-hidden">
      {/* Section 1: Hero */}
      <div id="home">
        <HeroSection />
      </div>

      {/* Section 2: About */}
      <AboutSection />

      {/* Section 3: Guidelines */}
      <GuidelinesSection />

      {/* Section 4: Problem Statements */}
      <ProblemStatementsSection />

      {/* Section 5: Schedule */}
      <ScheduleSection />

      {/* Section 6: FAQ */}
      <FaqSection />

      {/* Section 7: Contact */}
      <ContactSection />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#080e22]/90 border border-cyan-500/40 text-cyan-300 shadow-xl shadow-cyan-950/60 hover:border-cyan-400 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
            aria-label="Back to top"
          >
            <HiArrowUp className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
