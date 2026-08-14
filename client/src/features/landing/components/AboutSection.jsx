import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
 HiLightBulb,
 HiCpuChip,
 HiGlobeAlt,
 HiShieldCheck,
 HiArrowDownTray,
 HiDocumentText,
 HiEye,
 HiInformationCircle,
 HiXMark,
} from 'react-icons/hi2';

const pillars = [
 {
 icon: HiLightBulb,
 title: 'Innovative Problem Solving',
 description: 'Tackle real-world challenges designed by industry pioneers and researchers across AI, Cloud, Cybersecurity, and Web3.',
 },
 {
 icon: HiCpuChip,
 title: 'Cutting-Edge Tech Stack',
 description: 'Build futuristic prototypes using state-of-the-art developer tools, cloud APIs, vector databases, and LLM frameworks.',
 },
 {
 icon: HiGlobeAlt,
 title: 'Pan-India Tech Community',
 description: 'Connect with over 1,500+ passionate student hackers, mentors, tech leaders, and top engineering universities nationwide.',
 },
 {
 icon: HiShieldCheck,
 title: 'Fair & Transparent Evaluation',
 description: 'Automated code quality assessments, live virtual presentations, and judging by industry veterans and domain experts.',
 },
];

export default function AboutSection() {
 const [isBrochureOpen, setIsBrochureOpen] = useState(false);

 return (
 <section id="about" className="scroll-mt-20 sm:scroll-mt-28 relative py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
 <motion.div
 initial={{ opacity: 0, y: 50 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.15 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 className="space-y-10 sm:space-y-16"
 >
 {/* Section Header */}
 <div className="text-center space-y-4 max-w-3xl mx-auto">
 <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/25 backdrop-blur-2xl text-[#4a5cd9] text-xs font-bold tracking-widest uppercase shadow-lg shadow-black/20">
 <HiInformationCircle className="w-4 h-4 text-[#4a5cd9]" />
 <span>ABOUT HACKSPORA 2.0</span>
 </div>

 <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
 Empowering the Next Generation of <span className="text-[#4a5cd9]">Innovators</span>
 </h2>

 <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
 Hackspora 2.0 is South India&apos;s flagship 24-hour national hackathon, bringing together visionaries, developers, and creators to engineer high-impact solutions for tomorrow&apos;s digital ecosystem.
 </p>
 </div>

 {/* 4 Core Pillars Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
 {pillars.map((pillar, idx) => {
 const Icon = pillar.icon;
 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.2 }}
 transition={{ duration: 0.6, delay: idx * 0.1 }}
 whileHover={{ y: -4 }}
 className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/25 bg-white/[0.12] p-5 sm:p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl transition-all duration-300 hover:border-white/40 hover:bg-white/[0.16] space-y-4"
 >
 <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80" />
 <div className="relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/15 border border-white/25 text-white w-fit shadow-lg shadow-black/20 backdrop-blur-xl transition-colors duration-300 group-hover:border-cyan-300/50 group-hover:text-cyan-200">
 <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
 </div>

 <h3 className="relative text-base sm:text-lg font-extrabold text-white">{pillar.title}</h3>
 <p className="relative text-xs text-white/70 leading-relaxed">{pillar.description}</p>
 </motion.div>
 );
 })}
 </div>

 {/* Official Event Brochure Showcase */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.2 }}
 transition={{ duration: 0.8 }}
 className="relative px-0 pb-6 pt-8 sm:px-4 sm:pb-8 sm:pt-12 lg:px-10 lg:pb-10 lg:pt-16"
 >
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
 {/* Left Column: Information & Download Action */}
 <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
 <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/25 backdrop-blur-2xl text-[#4a5cd9] text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-lg shadow-black/20">
 <HiDocumentText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4a5cd9]" />
 <span>OFFICIAL EVENT BROCHURE</span>
 </div>

 <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
 Download the <span className="text-[#4a5cd9]">Hackspora 2.0</span> Brochure
 </h3>

 <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
 Explore complete event information, problem tracks, venue guidelines, evaluation process, and registration details in our official brochure.
 </p>

 {/* Action Buttons */}
 <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
 <a
 href="/broucher/bro1.jpg"
 download="Hackspora_2.0_Brochure.jpg"
 className="group/cta relative inline-flex items-center justify-center space-x-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-[#3645bf] hover:bg-[#4a5cd9] active:scale-95 transition-all duration-300 cursor-pointer shadow-xl shadow-[#3645bf]/40 hover:shadow-2xl hover:shadow-[#3645bf]/60 overflow-hidden touch-manipulation"
 >
 <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
 <span className="relative flex items-center justify-center space-x-2.5">
 <HiArrowDownTray className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
 <span>Download Brochure</span>
 </span>
 </a>

 <button
 type="button"
 onClick={() => setIsBrochureOpen(true)}
 className="inline-flex items-center justify-center space-x-2 px-3 py-2 text-xs sm:text-sm font-bold text-white hover:text-white/80 transition-colors cursor-pointer"
 >
 <HiEye className="w-4 h-4 text-white" />
 <span>View Full Image</span>
 </button>
 </div>
 </div>

 {/* Right Column: Image Preview Card */}
 <div className="lg:col-span-6 flex justify-center">
 <div className="relative group/img max-w-md w-full rounded-2xl overflow-hidden border border-white/25 bg-black">
 <img
 src="/broucher/bro1.jpg"
 alt="Hackspora 2.0 Official Brochure"
 className="w-full h-auto object-cover rounded-2xl group-hover/img:opacity-90 transition-opacity duration-200"
 />
 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-end justify-center p-4">
 <a
 href="/broucher/bro1.jpg"
 download="Hackspora_2.0_Brochure.jpg"
 className="px-4 py-2 rounded-lg bg-[#3645bf] text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-[#4a5cd9] transition-colors"
 >
 <HiArrowDownTray className="w-4 h-4" />
 <span>Download High-Res Brochure</span>
 </a>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 </motion.div>
 <AnimatePresence>
 {isBrochureOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 onClick={() => setIsBrochureOpen(false)}
 className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 px-4 py-6 backdrop-blur-xl sm:px-6"
 >
 <motion.div
 initial={{ opacity: 0, y: 28, scale: 0.88 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 18, scale: 0.92 }}
 transition={{ type: 'spring', stiffness: 320, damping: 22, mass: 0.75 }}
 onClick={(e) => e.stopPropagation()}
 className="relative flex max-h-[90vh] w-full max-w-4xl flex-col items-end"
 >
 <button
 type="button"
 onClick={() => setIsBrochureOpen(false)}
 aria-label="Close brochure preview"
 className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#3645bf] text-white shadow-xl shadow-black/40 transition-colors hover:bg-[#4a5cd9]"
 >
 <HiXMark className="h-6 w-6" />
 </button>

 <div className="max-h-[84vh] w-full overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl shadow-black/60">
 <img
 src="/broucher/bro1.jpg"
 alt="Hackspora 2.0 Official Brochure"
 className="max-h-[84vh] w-full object-contain"
 />
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </section>
 );
}
