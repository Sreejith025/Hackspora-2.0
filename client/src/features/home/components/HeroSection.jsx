import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiRocketLaunch,
  HiTrophy,
  HiUsers,
  HiUserGroup,
  HiAcademicCap,
  HiCalendarDays,
  HiMapPin,
  HiArrowRight,
  HiChevronRight,
  HiBuildingOffice2,
  HiCpuChip,
  HiSparkles,
} from 'react-icons/hi2';

import SpaceBackground from './SpaceBackground';
import CountdownTimer from './CountdownTimer';
import TiltCard from './TiltCard';

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden bg-[#02040A]"
    >
      {/* Living Deep Space Background */}
      <SpaceBackground />

      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative z-10 max-w-[1600px] w-full mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* LEFT SIDE: Hero Copy & Main Focus */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 flex flex-col items-start text-left space-y-5 sm:space-y-7"
          >
            {/* Small Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center w-full sm:w-auto">
              <div className="inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-950/90 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(56,189,248,0.15)] hover:border-cyan-400/50 transition-colors max-w-full">
                <HiRocketLaunch className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
                <span className="truncate">🚀 South India&apos;s Premier 24H Hackathon</span>
              </div>
            </motion.div>

            {/* Mobile-Optimized Hero Heading (Max 2 lines, Never Clipped) */}
            <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3 w-full relative">
              <div className="relative inline-block max-w-full">
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[9rem] font-black tracking-tight text-[#E2F7FF] text-glow-ice leading-[1.05] break-words">
                  <span className="bg-gradient-to-r from-white via-slate-100 to-[#DDF7FF] bg-clip-text text-transparent">
                    HACKSPORA
                  </span>{' '}
                  <span className="relative inline-block bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent animate-title-shimmer">
                    2.0
                  </span>
                </h1>

                {/* Subtle Sparkle Glints */}
                <div className="absolute -top-2 left-[30%] text-cyan-200 animate-sparkle pointer-events-none hidden sm:block">
                  <HiSparkles className="w-4 h-4 text-cyan-200 filter drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
                </div>
              </div>

              {/* Tagline */}
              <div className="flex items-center space-x-2 sm:space-x-3 text-base sm:text-2xl lg:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                <span>Innovate.</span>
                <span className="text-cyan-400">•</span>
                <span>Build.</span>
                <span className="text-cyan-400">•</span>
                <span>Impact.</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base lg:text-xl text-slate-300 max-w-3xl font-normal leading-relaxed text-balance w-full"
            >
              Join India&apos;s brightest innovators, developers, designers and entrepreneurs to solve real-world challenges, compete for exciting prizes and build the future.
            </motion.p>

            {/* Mobile Vertically Stacked Full-Width Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1 w-full sm:w-auto"
            >
              {/* Primary Button */}
              <motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  to="/register"
                  className="relative group inline-flex items-center justify-center px-7 py-3.5 sm:py-4 text-base font-extrabold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] transition-all duration-300 overflow-hidden w-full min-h-[48px]"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Register Now</span>
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
                </Link>
              </motion.div>

              {/* Secondary Button */}
              <motion.div whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  to="/problem-statements"
                  className="inline-flex items-center justify-center px-6 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-slate-200 glass-card hover:bg-slate-900/90 hover:text-white rounded-xl border border-slate-700/80 hover:border-cyan-400/50 transition-all duration-300 space-x-2 shadow-lg w-full min-h-[48px]"
                >
                  <span>Explore Problem Statements</span>
                  <HiChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                </Link>
              </motion.div>

              {/* Third Button */}
              <Link
                to="/schedule"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors group text-center w-full sm:w-auto"
              >
                <span>View Schedule</span>
                <HiChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* AI Circuit Holographic Badge */}
            <motion.div
              variants={itemVariants}
              className="pt-4 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400"
            >
              <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                <HiCpuChip className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>AI & CLOUD CIRCUIT</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className="text-slate-300 font-semibold">24H NON-STOP</span>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: Mobile Glass Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col space-y-4 w-full"
          >
            {/* Live 2x2 Countdown Timer Card */}
            <TiltCard highlight={true} className="w-full">
              <CountdownTimer targetDate="2026-10-24T09:00:00" />
            </TiltCard>

            {/* Grid of Mobile Glass Metric Widgets */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <TiltCard className="p-3.5" highlight={true}>
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <HiTrophy className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-extrabold tracking-wider text-cyan-400 uppercase bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    PRIZE
                  </span>
                </div>
                <div className="mt-2">
                  <span className="block text-lg sm:text-2xl font-black text-white">₹5 Lakhs+</span>
                  <span className="block text-[10px] text-slate-400 font-medium">Pool & Swag</span>
                </div>
              </TiltCard>

              <TiltCard className="p-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                    <HiUsers className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="block text-lg sm:text-2xl font-black text-white">1,500+</span>
                  <span className="block text-[10px] text-slate-400 font-medium">Innovators</span>
                </div>
              </TiltCard>

              <TiltCard className="p-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                    <HiUserGroup className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="block text-lg sm:text-2xl font-black text-white">400+</span>
                  <span className="block text-[10px] text-slate-400 font-medium">Teams</span>
                </div>
              </TiltCard>

              <TiltCard className="p-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <HiAcademicCap className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="block text-lg sm:text-2xl font-black text-white">50+</span>
                  <span className="block text-[10px] text-slate-400 font-medium">Mentors</span>
                </div>
              </TiltCard>
            </div>

            {/* Date & Venue Widget */}
            <TiltCard className="p-4 w-full">
              <div className="flex flex-col space-y-2.5">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <HiCalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Event Date</span>
                    <span className="block text-xs font-bold text-white">October 24–25, 2026</span>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-800/80" />

                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <HiMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Venue</span>
                    <span className="block text-xs font-bold text-white">Tech Park Hub & Hybrid</span>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Sponsors Highlight Widget */}
            <TiltCard className="p-3.5 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <HiBuildingOffice2 className="w-4 h-4 text-cyan-400" />
                  <span>Sponsors</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-mono tracking-wider text-cyan-300/80">
                  <span>DEVNET</span>
                  <span>•</span>
                  <span>NEXUS</span>
                  <span>•</span>
                  <span>CLOUD</span>
                </div>
              </div>
            </TiltCard>

          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
