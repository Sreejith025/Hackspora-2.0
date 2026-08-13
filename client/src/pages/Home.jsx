import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowUp } from 'react-icons/hi2';
import Lenis from 'lenis';

import HeroSection from '../features/home/components/HeroSection';
import SponsorsMarquee from '../features/home/components/SponsorsMarquee';
import HeroStatsStrip from '../features/home/components/HeroStatsStrip';
import AboutSection from '../features/landing/components/AboutSection';
import GuidelinesSection from '../features/landing/components/GuidelinesSection';
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
 <div className="relative w-full bg-black text-slate-100 overflow-hidden">
 {/* Section 1: Hero */}
 <div id="home">
 <HeroSection />
 </div>

 {/* Sponsors marquee */}
 <SponsorsMarquee />

 {/* Section 1.5: Hero Stats Strip (Prize / Innovators / Teams / Mentors + Date / Venue / Sponsors) */}
 <HeroStatsStrip />

 {/* Section 2: About */}
 <AboutSection />

 {/* Section 3: Guidelines */}
 <GuidelinesSection />

 {/* Section 4: Schedule */}
 <ScheduleSection />

 {/* Section 5: FAQ */}
 <FaqSection />

 {/* Section 6: Contact */}
 <ContactSection />

 {/* Floating Back to Top Button */}
 <AnimatePresence>
 {showBackToTop && (
 <motion.button
 initial={{ opacity: 0, scale: 0.8 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.8 }}
 onClick={scrollToTop}
 className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-white/[0.12] border border-white/25 backdrop-blur-2xl text-white shadow-2xl shadow-black/40 hover:bg-white/[0.2] hover:border-white/40 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group/scrolltop"
 aria-label="Back to top"
 >
 <HiArrowUp className="w-5 h-5 stroke-[2.5] transition-transform duration-300 group-hover/scrolltop:-translate-y-0.5" />
 </motion.button>
 )}
 </AnimatePresence>
 </div>
 );
}
