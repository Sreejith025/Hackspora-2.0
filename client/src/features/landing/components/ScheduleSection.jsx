import { motion } from 'framer-motion';
import {
  HiSparkles,
  HiClock,
  HiCheckCircle,
  HiRocketLaunch,
  HiCodeBracket,
  HiTrophy,
} from 'react-icons/hi2';

const timelinePhases = [
  {
    time: 'Day 1 • 09:00 AM',
    title: 'Registration & Opening Ceremony',
    description: 'Check-in, keynote addresses, mentor introductions, and problem statements release.',
    icon: HiRocketLaunch,
    status: 'Upcoming',
  },
  {
    time: 'Day 1 • 11:00 AM',
    title: 'Hacking Phase 1 Begins',
    description: 'Teams begin prototyping, architecture design, and initial codebase setup.',
    icon: HiCodeBracket,
    status: 'Upcoming',
  },
  {
    time: 'Day 1 • 06:00 PM',
    title: 'Mentorship & Progress Review',
    description: '1-on-1 feedback sessions with domain mentors and technical architecture reviews.',
    icon: HiClock,
    status: 'Upcoming',
  },
  {
    time: 'Day 2 • 09:00 AM',
    title: 'Hacking Stop & Project Turn-in',
    description: 'Final code commits, repository lock, video demo attachments, and turn-in submission.',
    icon: HiCheckCircle,
    status: 'Upcoming',
  },
  {
    time: 'Day 2 • 11:00 AM',
    title: 'Virtual Presentations & Evaluation',
    description: 'Live presentation slots with judging panel and prototype demonstrations.',
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
            <span>EVENT TIMELINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            24-Hour Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">Schedule</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            October 24 – 25, 2026 • Non-stop hackathon schedule, milestone reviews, and grand finale.
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
