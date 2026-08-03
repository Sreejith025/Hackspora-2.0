import { motion } from 'framer-motion';
import {
  HiSparkles,
  HiCheckCircle,
  HiRocketLaunch,
  HiCodeBracket,
  HiTrophy,
  HiBuildingLibrary,
  HiVideoCamera,
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

export default function ScheduleSection() {
  return (
    <section id="schedule" className="scroll-mt-28 relative py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-16"
      >
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
            Aug 23 (Virtual Screening) & Sep 18–19 (24H Offline Grand Finale at KAHE, Coimbatore).
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
      </motion.div>
    </section>
  );
}
