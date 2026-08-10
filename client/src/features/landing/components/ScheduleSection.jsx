import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSparkles,
  HiCheckCircle,
  HiRocketLaunch,
  HiCodeBracket,
  HiTrophy,
  HiBuildingLibrary,
  HiVideoCamera,
  HiAcademicCap,
  HiUserGroup,
  HiArrowRight,
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
    description: 'Shortlisted teams receive verification email and confirm participation with ₹250/participant fee.',
    icon: HiCheckCircle,
    status: 'Upcoming',
  },
  {
    time: 'Round 2 • 18 September 2026 • 07:00 AM – 09:00 AM',
    title: 'Grand Finale Reporting & Inauguration',
    description: 'Offline reporting at KAHE, Coimbatore. College ID verification, briefing, and inauguration.',
    icon: HiBuildingLibrary,
    status: 'Upcoming',
  },
  {
    time: 'Round 2 • 18 Sep 10:00 AM – 19 Sep 12:00 PM',
    title: '24-Hour Offline Hackathon',
    description: 'Fresh offline problem statements released at 9:45 AM. 24-hour non-stop hackathon with meals & Wi-Fi.',
    icon: HiCodeBracket,
    status: 'Upcoming',
  },
  {
    time: 'Round 2 • 19 September 2026 • 12:00 PM Onwards',
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
    color: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
  },
  {
    icon: HiCodeBracket,
    stat: '180+',
    label: 'Projects Built',
    subtext: 'Across AI, Web3 & Cloud tracks',
    color: 'from-indigo-500/20 to-purple-500/20',
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
  },
  {
    icon: HiTrophy,
    stat: '₹1,00,000+',
    label: 'Prize Pool Distributed',
    subtext: 'Cash rewards & tech grants',
    color: 'from-amber-500/20 to-yellow-500/20',
    borderColor: 'border-amber-500/30',
    iconColor: 'text-amber-400',
  },
  {
    icon: HiAcademicCap,
    stat: '25+',
    label: 'Industry Mentors',
    subtext: 'Engineers & researchers',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
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

  return (
    <section id="schedule" className="scroll-mt-28 relative py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-24"
      >
        {/* ================= EVENT TIMELINE & SCHEDULE ================= */}
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
              <HiSparkles className="w-4 h-4 text-cyan-400" />
              <span>EVENT TIMELINE & SCHEDULE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              HackSpora 2.0 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">Schedule</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300">
              Aug 23 (Virtual Screening) & Sep 18–19 (24HOURS Offline Grand Finale at KAHE, Coimbatore).
            </p>
          </div>

          {/* Timeline Component */}
          <div className="max-w-4xl mx-auto relative space-y-6">
            {/* Central Vertical Connector Line */}
            <div className="absolute top-0 bottom-0 left-6 sm:left-1/2 w-0.5 bg-gradient-to-b from-cyan-400 via-indigo-500 to-purple-600 -translate-x-1/2 hidden sm:block" />

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
                  className={`relative flex flex-col sm:flex-row items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-6`}
                >
                  {/* Content Box */}
                  <div className="w-full sm:w-1/2 glass-card p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 space-y-2 transition-all">
                    <span className="text-xs font-mono text-cyan-400 font-bold block">{phase.time}</span>
                    <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{phase.description}</p>
                  </div>

                  {/* Node Icon Circle */}
                  <div className="w-12 h-12 rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/30 z-10 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Spacer for symmetry */}
                  <div className="hidden sm:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Divider with Ambient Glow */}
        <div className="relative py-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <div className="absolute inset-x-1/4 top-1/2 -translate-y-1/2 h-12 bg-cyan-500/10 blur-2xl pointer-events-none" />
        </div>

        {/* ================= LAST YEAR ACHIEVEMENTS SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8 }}
          className="space-y-14"
        >
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase">
              <HiTrophy className="w-4 h-4 text-amber-400" />
              <span>HACKSPORA 1.0 ACHIEVEMENTS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Last Year&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-200 to-yellow-400">Impact & Memories</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              A look back at the landmark milestones, high-energy moments, and memorable achievements from HackSpora 1.0.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lastYearMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`glass-card p-6 rounded-3xl border ${metric.borderColor} bg-gradient-to-b ${metric.color} space-y-4 transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-slate-950/80 border border-slate-800 ${metric.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase bg-slate-950/60 px-2 py-1 rounded-md border border-slate-800">
                      HS 1.0
                    </span>
                  </div>

                  <div>
                    <span className="block text-3xl font-black text-white tracking-tight">{metric.stat}</span>
                    <span className="block text-sm font-bold text-slate-200 mt-1">{metric.label}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">{metric.subtext}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Last Year Achievements Photo Gallery */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
                <HiPhoto className="w-6 h-6 text-cyan-400" />
                <span>Achievement Gallery (HackSpora 1.0)</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400 hidden sm:inline-block">
                Click any image to expand
              </span>
            </div>

            {/* Asymmetric / Responsive Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Main Featured Image 1 */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                onClick={() => setActiveImage(lastYearAchievementsGallery[0])}
                className="md:col-span-7 group relative rounded-3xl overflow-hidden border border-cyan-500/30 hover:border-cyan-400 bg-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.15)] hover:shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-all duration-500 cursor-pointer min-h-[300px] sm:min-h-[380px] flex flex-col justify-end"
              >
                <img
                  src={lastYearAchievementsGallery[0].src}
                  alt={lastYearAchievementsGallery[0].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
                
                <div className="relative z-10 p-6 sm:p-8 space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-block">
                    {lastYearAchievementsGallery[0].category}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {lastYearAchievementsGallery[0].title}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-xs text-cyan-400 font-semibold pt-1">
                    <HiMagnifyingGlassPlus className="w-4 h-4" />
                    <span>View Fullscreen</span>
                  </div>
                </div>
              </motion.div>

              {/* Image 2 */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onClick={() => setActiveImage(lastYearAchievementsGallery[1])}
                className="md:col-span-5 group relative rounded-3xl overflow-hidden border border-cyan-500/30 hover:border-cyan-400 bg-slate-950 shadow-lg hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all duration-500 cursor-pointer min-h-[250px] sm:min-h-[380px] flex flex-col justify-end"
              >
                <img
                  src={lastYearAchievementsGallery[1].src}
                  alt={lastYearAchievementsGallery[1].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
                
                <div className="relative z-10 p-6 space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-block">
                    {lastYearAchievementsGallery[1].category}
                  </span>
                  <h4 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {lastYearAchievementsGallery[1].title}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-xs text-cyan-400 font-semibold pt-1">
                    <HiMagnifyingGlassPlus className="w-4 h-4" />
                    <span>View Fullscreen</span>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Row: Images 3, 4, 5 */}
              {lastYearAchievementsGallery.slice(2).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: (idx + 2) * 0.1 }}
                  onClick={() => setActiveImage(item)}
                  className="md:col-span-4 group relative rounded-3xl overflow-hidden border border-slate-800 hover:border-cyan-400 bg-slate-950 shadow-lg hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all duration-500 cursor-pointer min-h-[240px] flex flex-col justify-end"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  <div className="relative z-10 p-5 space-y-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 inline-block">
                      {item.category}
                    </span>
                    <h4 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-1.5 text-xs text-cyan-400 font-semibold pt-0.5">
                      <HiMagnifyingGlassPlus className="w-3.5 h-3.5" />
                      <span>Expand</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call-to-action banner for HackSpora 2.0 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
          >
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-cyan-300 uppercase">
                <HiRocketLaunch className="w-4 h-4 text-cyan-400" />
                <span>WRITE THE NEXT CHAPTER IN 2026</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                Ready to etch your team into the HackSpora legacy?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Compete in HackSpora 2.0 with bigger rewards, higher stakes, and pan-India recognition.
              </p>
            </div>

            <a
              href="#home"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-[1.03] active:scale-95 transition-all duration-300 shrink-0"
            >
              <span>Register for 2.0</span>
              <HiArrowRight className="w-4 h-4" />
            </a>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full glass-card border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl bg-slate-950"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
              >
                <HiXMark className="w-6 h-6" />
              </button>

              {/* Expanded Image */}
              <div className="relative max-h-[75vh] flex items-center justify-center bg-black">
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              </div>

              {/* Caption Footer */}
              <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-block mb-1">
                    {activeImage.category}
                  </span>
                  <h3 className="text-lg font-bold text-white">{activeImage.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveImage(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 transition-all cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


