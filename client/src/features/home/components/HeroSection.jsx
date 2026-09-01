import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
 HiArrowRight,
 HiArrowPath,
} from 'react-icons/hi2';

import AlreadyRegisteredModal from '../../../components/AlreadyRegisteredModal';
import ColorBends from './ColorBends';
import { useRegisterFlow } from '../../../hooks';

const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
 opacity: 1,
 transition: {
 staggerChildren: 0.1,
 delayChildren: 0.1,
 },
 },
};

const itemVariants = {
 hidden: { opacity: 0, y: 25, filter: 'blur(8px)' },
 visible: {
 opacity: 1,
 y: 0,
 filter: 'blur(0px)',
 transition: {
 duration: 0.75,
 ease: [0.16, 1, 0.3, 1],
 },
 },
};

export default function HeroSection() {
 const containerRef = useRef(null);
 const {
  isChecking,
  isRegistered,
  isRegistrationOpen,
  registeredData,
  isModalOpen,
  handleRegisterNow,
  closeModal,
 } = useRegisterFlow();

 const { scrollYProgress } = useScroll({
 target: containerRef,
 offset: ['start start', 'end start'],
 });

 const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
 const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

 return (
 <section
 ref={containerRef}
 className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center pt-14 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden bg-black"
 >
 {/* ColorBends WebGL animated backdrop (the only background layer) */}
 <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
 <ColorBends
 colors={["#4a5cd9"]}
 rotation={90}
 speed={0.3}
 scale={1}
 frequency={1}
 warpStrength={1}
 mouseInfluence={0.6}
 parallax={0.5}
 iterations={1}
 intensity={1.2}
 bandWidth={6}
 transparent
 autoRotate={0}
 />
 {/* Soft darken so hero text stays readable on top */}
 <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black" />
 </div>

 {/* Top edge fade so the navbar blends into the hero */}
 <div className="absolute inset-x-0 top-0 h-32 sm:h-44 md:h-56 bg-gradient-to-b from-black via-black/70 to-transparent pointer-events-none z-[1]" />

 {/* Already Registered Modal */}
 <AlreadyRegisteredModal
 isOpen={isModalOpen}
 onClose={closeModal}
 teamData={registeredData}
 />

 <motion.div
 style={{ scale: heroScale, opacity: heroOpacity }}
 className="relative z-10 max-w-[1600px] w-full mx-auto"
 >
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
 {/* LEFT/CENTER: Hero Copy — Centered */}
 <motion.div
 variants={containerVariants}
 initial="hidden"
 animate="visible"
 className="lg:col-span-12 flex flex-col items-center text-center mx-auto w-full space-y-6 sm:space-y-8"
 >
 {/* Institutional Header Banner */}
 <motion.div
 variants={itemVariants}
 className="max-w-2xl mx-auto text-center px-1"
 >
 <div className="space-y-1.5 text-[10px] xs:text-[11px] sm:text-xs md:text-sm text-slate-300 font-normal leading-relaxed">
 <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-4">
 <div className="relative shrink-0 mt-3 sm:mt-4 md:mt-5 h-11 w-11 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full overflow-hidden ring-2 ring-white/40 shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center justify-center">
 <img
 src="/logos/aids.jpg"
 alt="Department of AI & Data Science"
 className="h-full w-full object-cover brightness-110 contrast-110 saturate-110"
 style={{ imageRendering: '-webkit-optimize-contrast' }}
 />
 </div>
 <h2 className="uppercase tracking-wide leading-snug">
 KARPAGAM ACADEMY OF HIGHER EDUCATION
 </h2>
 </div>
 <p className="uppercase tracking-wide leading-snug">
 Department of Artificial Intelligence and Data Science
 </p>
 <p className="uppercase tracking-wide leading-snug">
 In Association with <span className="text-white">AIQubit</span>
 </p>
 <div className="mx-auto h-px w-12 bg-white/40" />
 </div>
 </motion.div>

 {/* Hero Heading — BIG + centered */}
 <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4 pt-1 sm:pt-1 md:pt-2 lg:pt-2 w-full">
 <h1
 className="text-[2.6rem] min-[400px]:text-5xl xs:text-6xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[11rem] font-thin tracking-tight text-white leading-[1.02] sm:leading-[0.98]"
 style={{ textShadow: '4px 4px 0px #111184' }}
 >
 <span className="sm:hidden" style={{ textShadow: '4px 4px 0px #111184' }}>
 HACKSPORA 2.0
 </span>
 <span className="hidden sm:inline" style={{ textShadow: '8px 8px 0px #111184' }}>
 HACKSPORA{' '}
 <span className="text-white">2.0</span>
 </span>
 </h1>

 {/* Tagline */}
 <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-sm md:text-base lg:text-lg font-normal tracking-wider text-white pb-2 sm:pb-4 md:pb-6 lg:pb-10">
 <span>Innovate.</span>
 <span className="text-white">•</span>
 <span>Build.</span>
 <span className="text-white">•</span>
 <span>Impact.</span>
 </div>
 </motion.div>

 {/* Description */}
 <motion.p
 variants={itemVariants}
 className="text-xs sm:text-sm md:text-sm lg:text-base text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed px-2 sm:px-0 -mt-3 sm:-mt-4"
 >
 Join India&apos;s brightest innovators, developers, designers and entrepreneurs to solve real-world challenges, compete for exciting prizes and build the future.
 </motion.p>

 {/* Buttons */}
 <motion.div
 variants={itemVariants}
 className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4 pb-2 sm:pb-12 md:pb-16 lg:pb-20 w-full sm:w-auto"
 >
 {/* Primary Button */}
 <motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto relative z-20">
 {isRegistered ? (
 <Link
 to="/dashboard"
 className="group/cta relative inline-flex items-center justify-center px-6 sm:px-6 py-3 sm:py-3 text-sm sm:text-xs md:text-sm font-extrabold text-white bg-[#4a5cd9] hover:bg-[#5a6ce9] rounded-2xl active:scale-95 transition-all duration-300 w-full min-h-[48px] cursor-pointer touch-manipulation shadow-xl shadow-[#4a5cd9]/40 hover:shadow-2xl hover:shadow-[#4a5cd9]/60 overflow-hidden"
 >
 <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
 <span className="relative flex items-center justify-center space-x-2">
 <span>Dashboard</span>
 <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
 </span>
 </Link>
 ) : !isRegistrationOpen ? (
 <Link
 to="/register"
 className="group/cta relative inline-flex items-center justify-center px-6 sm:px-6 py-3 sm:py-3 text-sm sm:text-xs md:text-sm font-extrabold text-rose-200 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 rounded-2xl active:scale-95 transition-all duration-300 w-full min-h-[48px] cursor-pointer touch-manipulation shadow-xl shadow-rose-950/50 overflow-hidden"
 >
 <span className="relative flex items-center justify-center space-x-2">
 <span>Registration Closed</span>
 </span>
 </Link>
 ) : (
 <button
 type="button"
 onClick={handleRegisterNow}
 disabled={isChecking}
 className="group/cta relative inline-flex items-center justify-center px-6 sm:px-6 py-3 sm:py-3 text-sm sm:text-xs md:text-sm font-extrabold text-white bg-[#3645bf] hover:bg-[#4a5cd9] rounded-2xl active:scale-95 transition-all duration-300 w-full min-h-[48px] cursor-pointer touch-manipulation shadow-xl shadow-[#3645bf]/40 hover:shadow-2xl hover:shadow-[#3645bf]/60 overflow-hidden"
 >
 <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
 <span className="relative flex items-center justify-center space-x-2">
 {isChecking ? (
 <>
 <HiArrowPath className="w-5 h-5 animate-spin" />
 <span>Checking Status...</span>
 </>
 ) : (
 <>
 <span>Register Now</span>
 <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
 </>
 )}
 </span>
 </button>
 )}
 </motion.div>

 {/* Secondary Button */}
 <Link
 to="/schedule"
 className="inline-flex items-center justify-center px-4 sm:px-4 py-3 sm:py-2 text-sm sm:text-xs md:text-sm font-bold text-white hover:text-white/80 transition-colors text-center w-full sm:w-auto min-h-[48px] sm:min-h-0 rounded-2xl sm:rounded-none border border-white/20 sm:border-transparent hover:border-white/30 hover:bg-white/5 sm:hover:bg-transparent"
 >
 <span>View Schedule</span>
 </Link>
 </motion.div>

 </motion.div>
 </div>
 </motion.div>
 </section>
 );
}
