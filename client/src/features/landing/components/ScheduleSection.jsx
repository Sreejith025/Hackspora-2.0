import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 HiCheckCircle,
 HiRocketLaunch,
 HiCodeBracket,
 HiTrophy,
 HiBuildingLibrary,
 HiVideoCamera,
 HiAcademicCap,
 HiUserGroup,
 HiArrowRight,
 HiChevronLeft,
 HiChevronRight,
 HiPhoto,
 HiXMark,
 HiMagnifyingGlassPlus,
} from 'react-icons/hi2';

const timelinePhases = [
 {
 time: 'Round 1 • 23 August 2026 • 09:30 AM',
 title: 'Virtual Round Begins & Problem Statements Release',
 description: 'Problem statements unlocked at 9:30 AM. 7-hour virtual screening hackathon starts.',
 icon: HiRocketLaunch,
 status: 'Upcoming',
 },
 {
 time: 'Round 1 • 23 August 2026 • 05:00 PM – 06:00 PM',
 title: 'Virtual Turn-in Window',
 description: 'Teams submit GitHub repository link and demo video link for virtual evaluation.',
 icon: HiVideoCamera,
 status: 'Upcoming',
 },
 {
 time: 'Shortlisting Notice',
 title: 'Virtual Screening Results & Confirmation',
 description: 'Shortlisted teams receive verification email and confirm participation with ₹1250/Per Team.',
 icon: HiCheckCircle,
 status: 'Upcoming',
 },
 {
 time: 'Round 2 • 19 September 2026 • 07:00 AM – 09:00 AM',
 title: 'Grand Finale Reporting & Inauguration',
 description: 'Offline reporting at KAHE, Coimbatore. College ID verification, briefing, and inauguration.',
 icon: HiBuildingLibrary,
 status: 'Upcoming',
 },
 {
 time: 'Round 2 • 19 Sep 10:00 AM – 20 Sep 12:00 PM',
 title: '24-Hour Offline Hackathon',
 description: 'Fresh offline problem statements released at 9:45 AM. 24-hour non-stop hackathon with meals & Wi-Fi.',
 icon: HiCodeBracket,
 status: 'Upcoming',
 },
 {
 time: 'Round 2 • 20 September 2026 • 12:00 PM Onwards',
 title: 'Final Judging & Grand Valedictory',
 description: 'Final presentations to industry judges, winner declarations, and cash prize distribution.',
 icon: HiTrophy,
 status: 'Upcoming',
 },
];

const lastYearMetrics = [
 {
 icon: HiUserGroup,
 stat: '1,200+',
 label: 'Hackers Participated',
 subtext: 'From 80+ colleges pan-India',
 body: 'Students from across India registered as 240+ teams, representing premier engineering institutes and Tier-2 colleges. The diversity of regions and skill levels made the hackathon floor one of the most energetic in HackSpora history.',
 },
 {
 icon: HiCodeBracket,
 stat: '180+',
 label: 'Projects Built',
 subtext: 'Across AI, Web3 & Cloud tracks',
 body: 'Working prototypes spanned autonomous agents, zero-knowledge demos, serverless DevOps tools, and DeFi dashboards. Judges evaluated each build on impact, originality, and shipping-readiness within the 24-hour window.',
 },
 {
 icon: HiTrophy,
 stat: '₹1,00,000+',
 label: 'Prize Pool Distributed',
 subtext: 'Cash rewards & tech grants',
 body: 'Beyond the top three cash prizes, partner sponsors contributed cloud credits, API grants, and internship fast-tracks. Winners also received direct interview slots with judging companies for summer 2025 roles.',
 },
 {
 icon: HiAcademicCap,
 stat: '25+',
 label: 'Industry Mentors',
 subtext: 'Engineers & researchers',
 body: 'Mentors from product, platform, and research backgrounds ran rotating office hours across the 24-hour finale. Each team received at least two focused sessions on architecture, demo prep, and pitching strategy.',
 },
];

const lastYearAchievementsGallery = [
 {
 id: 1,
 src: '/last year achievements/achievement1.jpg',
 title: 'Grand Finale Inauguration & Official Address',
 category: 'Inauguration',
 },
 {
 id: 2,
 src: '/last year achievements/achievement2.jpg',
 title: '24-Hour Non-Stop Hackathon Arena',
 category: 'Hackathon',
 },
 {
 id: 3,
 src: '/last year achievements/achievement3.jpg',
 title: 'Interactive Project Evaluation & Pitching',
 category: 'Evaluation',
 },
 {
 id: 4,
 src: '/last year achievements/achievement4.jpg',
 title: 'Judges Feedback & Mentorship Session',
 category: 'Mentorship',
 },
 {
 id: 5,
 src: '/last year achievements/achievement5.jpg',
 title: 'Grand Winner Award Ceremony & Celebrations',
 category: 'Valedictory',
 },
];

export default function ScheduleSection() {
 const [activeImage, setActiveImage] = useState(null);
 const [activeMetric, setActiveMetric] = useState(0);

 const goPrevMetric = () => {
 setActiveMetric((idx) => (idx - 1 + lastYearMetrics.length) % lastYearMetrics.length);
 };

 const goNextMetric = () => {
 setActiveMetric((idx) => (idx + 1) % lastYearMetrics.length);
 };

 return (
 <section id="schedule" className="scroll-mt-20 sm:scroll-mt-28 relative py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
 <motion.div
 initial={{ opacity: 0, y: 50 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.15 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 className="space-y-16 sm:space-y-24"
 >
 {/* ================= EVENT TIMELINE & SCHEDULE ================= */}
 <div className="space-y-10 sm:space-y-16">
 {/* Header */}
 <div className="text-center space-y-4 max-w-3xl mx-auto">
 <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/25 backdrop-blur-2xl text-[#4a5cd9] text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-lg shadow-black/20">
 <span>EVENT TIMELINE & SCHEDULE</span>
 </div>

 <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
 HackSpora 2.0 <span className="text-[#4a5cd9]">Schedule</span>
 </h2>

 <p className="text-xs sm:text-base text-slate-300">
 Aug 23 (Virtual Screening) & Sep 19–20 (24HOURS Offline Grand Finale at KAHE, Coimbatore).
 </p>
 </div>

 {/* Timeline Component */}
 <div className="max-w-4xl mx-auto relative space-y-4 sm:space-y-6">
 {/* Central Vertical Connector Line */}
 <div className="absolute top-0 bottom-0 left-6 sm:left-1/2 w-0.5 bg-white -translate-x-1/2 hidden sm:block" />

 {timelinePhases.map((phase, idx) => {
 const Icon = phase.icon;
 const isEven = idx % 2 === 0;
 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.2 }}
 transition={{ duration: 0.6, delay: idx * 0.1 }}
 className={`relative flex flex-row sm:flex-row items-center ${
 isEven ? 'sm:flex-row-reverse' : ''
 } gap-4 sm:gap-6`}
 >
 {/* Content Box */}
 <div className="flex-1 min-w-0 p-4 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl border border-white/25 bg-white/[0.12] backdrop-blur-2xl shadow-2xl shadow-black/25 hover:border-white/40 hover:bg-white/[0.16] space-y-2 sm:space-y-3 transition-all duration-300">
 <span className="text-xs sm:text-sm text-[#4a5cd9] font-bold block tracking-wide break-words">{phase.time}</span>
 <h3 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white leading-snug">{phase.title}</h3>
 <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{phase.description}</p>
 </div>

 {/* Node Icon Circle */}
 <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black border-2 border-white text-white flex items-center justify-center font-bold z-10 shrink-0">
 <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
 </div>

 {/* Spacer for symmetry (only on desktop) */}
 <div className="hidden sm:block sm:w-1/2" />
 </motion.div>
 );
 })}
 </div>
 </div>

 {/* ================= LAST YEAR ACHIEVEMENTS SECTION ================= */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.15 }}
 transition={{ duration: 0.8 }}
 className="space-y-10 sm:space-y-14"
 >
 {/* Header */}
 <div className="text-center space-y-4 max-w-3xl mx-auto">
 <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500 text-amber-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
 <HiTrophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
 <span>HACKSPORA 1.0 ACHIEVEMENTS</span>
 </div>

 <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
 Last Year&apos;s <span className="text-[#4a5cd9]">Impact & Memories</span>
 </h2>

 <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
 A look back at the landmark milestones, high-energy moments, and memorable achievements from HackSpora 1.0.
 </p>
 </div>

 {/* Key Metrics Carousel */}
 <div className="relative max-w-3xl mx-auto px-10 sm:px-16">
 {/* Card Stage */}
 <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[340px] sm:min-h-[340px]">
 <motion.div
 className="flex h-full"
 style={{ width: `${lastYearMetrics.length * 100}%` }}
 animate={{ x: `-${activeMetric * (100 / lastYearMetrics.length)}%` }}
 transition={{ type: 'tween', duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
 >
 {lastYearMetrics.map((m, idx) => {
 const Icon = m.icon;
 return (
 <div
 key={idx}
 className="h-full p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/25 bg-white/[0.12] backdrop-blur-2xl shadow-2xl shadow-black/25 space-y-4 sm:space-y-5 group flex flex-col"
 style={{ width: `${100 / lastYearMetrics.length}%` }}
 >
 <div className="flex items-center justify-between flex-wrap gap-2">
 <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/15 border border-white/25 text-cyan-400 shadow-lg shadow-black/20 backdrop-blur-xl group-hover:border-cyan-300/50 group-hover:text-cyan-200 transition-colors">
 <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
 </div>
 <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-300 uppercase bg-white/[0.16] border border-white/25 backdrop-blur-xl px-2 py-1 rounded-md">
 HS 1.0 • {String(idx + 1).padStart(2, '0')} / {String(lastYearMetrics.length).padStart(2, '0')}
 </span>
 </div>

 <div>
 <span className="block text-2xl sm:text-4xl font-black text-white tracking-tight">{m.stat}</span>
 <span className="block text-xs sm:text-sm font-bold text-slate-200 mt-1">{m.label}</span>
 <span className="block text-[10px] sm:text-xs text-slate-400 mt-0.5">{m.subtext}</span>
 </div>

 <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/15 pt-3 sm:pt-4">
 {m.body}
 </p>

 {/* Inline progress dots */}
 <div className="mt-auto flex items-center justify-center gap-2 pt-2">
 {lastYearMetrics.map((_, dotIdx) => (
 <button
 key={dotIdx}
 type="button"
 onClick={() => {
 setActiveMetric(dotIdx);
 }}
 aria-label={`Show stat ${dotIdx + 1}`}
 className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer touch-manipulation ${
 dotIdx === activeMetric ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
 }`}
 />
 ))}
 </div>
 </div>
 );
 })}
 </motion.div>
 </div>

 {/* Prev / Next Arrows */}
 <button
 type="button"
 onClick={goPrevMetric}
 aria-label="Previous stat"
 className="absolute top-1/2 -translate-y-1/2 left-0 sm:left-1 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 border border-white/30 backdrop-blur-2xl text-white hover:bg-white hover:text-black hover:border-white active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-lg shadow-black/40 touch-manipulation"
 >
 <HiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
 </button>
 <button
 type="button"
 onClick={goNextMetric}
 aria-label="Next stat"
 className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-1 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 border border-white/30 backdrop-blur-2xl text-white hover:bg-white hover:text-black hover:border-white active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-lg shadow-black/40 touch-manipulation"
 >
 <HiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
 </button>
 </div>

 {/* Last Year Achievements Photo Gallery */}
 <div className="space-y-4 sm:space-y-6">
 <div className="flex items-center justify-between">
 <h3 className="pt-8 pb-8 sm:pt-12 sm:pb-12 text-xl sm:text-2xl lg:text-4xl font-extrabold text-white flex items-center space-x-2">
 <HiPhoto className="w-6 h-6 sm:w-8 sm:h-8 text-[#4a5cd9] shrink-0" />
 <span>
 Highlights from <span className="text-[#4a5cd9]">HackSpora 1.0</span>
 </span>
 </h3>
 </div>

 <style>{`
 @keyframes hs-marquee {
 0% { transform: translateX(0); }
 100% { transform: translateX(-50%); }
 }
 .hs-marquee-track {
 animation: hs-marquee 12s linear infinite;
 will-change: transform;
 }
 .hs-marquee-wrap:hover .hs-marquee-track,
 .hs-marquee-wrap:focus-within .hs-marquee-track {
 animation-play-state: paused;
 }
 `}</style>

 {/* Infinite Marquee Strip */}
 <div className="hs-marquee-wrap relative overflow-hidden rounded-3xl border border-white/15 bg-black/40 group/marquee">
 {/* Edge fades for soft edges */}
 <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-black/80 to-transparent z-10" />
 <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-black/80 to-transparent z-10" />

 <div className="hs-marquee-track flex gap-5 px-4">
 {/* Duplicate the gallery array so the loop is seamless */}
 {[...lastYearAchievementsGallery, ...lastYearAchievementsGallery].map((item, idx) => (
 <button
 key={`${item.id}-${idx}`}
 type="button"
 onClick={() => setActiveImage(item)}
 className="relative shrink-0 w-72 sm:w-[30rem] lg:w-[36rem] h-56 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border border-white/20 hover:border-white/60 bg-black transition-all duration-300 cursor-pointer group/tile focus:outline-none focus:ring-2 focus:ring-white/60"
 aria-label={`Expand ${item.title}`}
 >
 <img
 src={item.src}
 alt={item.title}
 loading="lazy"
 draggable={false}
 className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/tile:scale-105"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 group-hover/tile:opacity-100 transition-opacity duration-300" />

 <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 space-y-1 text-left">
 <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider bg-slate-900 text-amber-300 border border-amber-500 inline-block">
 {item.category}
 </span>
 <h4 className="text-xs sm:text-base font-extrabold text-white line-clamp-2">
 {item.title}
 </h4>
 </div>

 <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 border border-white/20 text-white opacity-0 group-hover/tile:opacity-100 transition-opacity duration-200">
 <HiMagnifyingGlassPlus className="w-4 h-4" />
 </div>
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Call-to-action banner for HackSpora 2.0 */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.2 }}
 transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
 className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-gradient-to-br from-[#3645bf]/30 via-slate-900/60 to-black p-6 sm:p-12 lg:p-16 text-center shadow-2xl shadow-black/50 mt-16 sm:mt-32 lg:mt-40"
 >
 {/* Decorative ambient glows */}
 <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
 <div className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 bg-[#3645bf]/30 rounded-full blur-3xl" />
 <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%)]" />

 {/* Content */}
 <div className="relative max-w-3xl mx-auto flex flex-col items-center space-y-5 sm:space-y-6">
 <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.16] border border-white/25 backdrop-blur-2xl text-cyan-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-lg shadow-black/20">
 <span>Write the Next Chapter in 2026</span>
 </div>

 <h4 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
 Ready to etch your team into the
 <br className="hidden sm:block" />
 {' '}
 <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
 HackSpora Legacy?
 </span>
 </h4>

 <p className="text-xs sm:text-base text-slate-300 max-w-2xl leading-relaxed">
 Compete in HackSpora 2.0 with bigger rewards, higher stakes, and pan-India recognition.
 Bring your boldest idea — we&apos;ll bring the arena, the mentors, and 24 hours of pure momentum.
 </p>

 {/* Centered Register Button */}
 <div className="pt-2 w-full sm:w-auto">
 <a
 href="#home"
 className="group/cta relative inline-flex items-center justify-center space-x-2.5 px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-[#3645bf] hover:bg-[#4a5cd9] active:scale-95 transition-all duration-300 cursor-pointer shadow-xl shadow-[#3645bf]/40 hover:shadow-2xl hover:shadow-[#3645bf]/60 overflow-hidden touch-manipulation w-full sm:w-auto"
 >
 {/* Shimmer sweep */}
 <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />

 <span className="relative">Register for HackSpora 2.0</span>
 <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/15 group-hover/cta:bg-white/25 transition-colors">
 <HiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
 </span>
 </a>
 </div>

 {/* Trust line */}
 <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 pt-3 text-[10px] sm:text-xs text-slate-400 font-medium">
 <span className="inline-flex items-center space-x-1.5">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
 <span>Registrations Open</span>
 </span>
 <span className="hidden sm:inline w-px h-3 bg-white/15" />
 <span>Free to participate</span>
 <span className="hidden sm:inline w-px h-3 bg-white/15" />
 <span>Pan-India teams welcome</span>
 </div>
 </div>
 </motion.div>
 </motion.div>
 </motion.div>

 {/* Lightbox Preview Modal */}
 <AnimatePresence>
 {activeImage && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setActiveImage(null)}
 className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90"
 >
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 transition={{ duration: 0.3 }}
 onClick={(e) => e.stopPropagation()}
 className="relative max-w-5xl w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black"
 >
 {/* Close Button */}
 <button
 type="button"
 onClick={() => setActiveImage(null)}
 className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-black border border-slate-700 text-slate-300 hover:text-white hover:border-white transition-colors cursor-pointer touch-manipulation"
 >
 <HiXMark className="w-5 h-5 sm:w-6 sm:h-6" />
 </button>

 {/* Expanded Image */}
 <div className="relative max-h-[80vh] sm:max-h-[75vh] flex items-center justify-center bg-black">
 <img
 src={activeImage.src}
 alt={activeImage.title}
 className="w-full h-auto max-h-[80vh] sm:max-h-[75vh] object-contain"
 />
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </section>
 );
}
