import { motion } from 'framer-motion';
import {
  HiSparkles,
  HiCheckCircle,
  HiUserGroup,
  HiScale,
  HiAcademicCap,
} from 'react-icons/hi2';

const rulesList = [
  {
    title: 'Eligibility & Entry',
    items: [
      'Open to all undergraduate and postgraduate students across engineering, diploma, and tech degrees.',
      'Participants must register with a valid college ID and student credentials.',
      'Single registration per participant is strictly enforced.',
    ],
  },
  {
    title: 'Team Composition',
    items: [
      'Squads can consist of 1 to 5 members maximum (including Team Leader).',
      'Cross-departmental and cross-year teams within the same or different colleges are welcome.',
      'Team Leaders are responsible for all official communications.',
    ],
  },
  {
    title: 'Code of Conduct & Originality',
    items: [
      'All project submissions must be built during the 24-hour hackathon window.',
      'Open-source libraries and APIs are permitted provided they are properly cited.',
      'Plagiarism or pre-built complete repositories will result in immediate disqualification.',
    ],
  },
];

export default function GuidelinesSection() {
  return (
    <section id="guidelines" className="scroll-mt-28 relative py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
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
            <span>RULES & GUIDELINES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Hackathon Guidelines & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">Rules</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            Please review the official guidelines to ensure a smooth, fair, and competitive hackathon experience.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rulesList.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 space-y-4 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  {idx === 0 ? (
                    <HiAcademicCap className="w-5 h-5" />
                  ) : idx === 1 ? (
                    <HiUserGroup className="w-5 h-5" />
                  ) : (
                    <HiScale className="w-5 h-5" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{category.title}</h3>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                {category.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start space-x-2.5">
                    <HiCheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
