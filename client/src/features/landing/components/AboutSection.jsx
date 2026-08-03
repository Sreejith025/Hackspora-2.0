import { motion } from 'framer-motion';
import {
  HiSparkles,
  HiLightBulb,
  HiCpuChip,
  HiGlobeAlt,
  HiShieldCheck,
} from 'react-icons/hi2';

const pillars = [
  {
    icon: HiLightBulb,
    title: 'Innovative Problem Solving',
    description: 'Tackle real-world challenges designed by industry pioneers and researchers across AI, Cloud, Cybersecurity, and Web3.',
    color: 'from-cyan-500/20 to-sky-500/20',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
  },
  {
    icon: HiCpuChip,
    title: 'Cutting-Edge Tech Stack',
    description: 'Build futuristic prototypes using state-of-the-art developer tools, cloud APIs, vector databases, and LLM frameworks.',
    color: 'from-indigo-500/20 to-purple-500/20',
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
  },
  {
    icon: HiGlobeAlt,
    title: 'Pan-India Tech Community',
    description: 'Connect with over 1,500+ passionate student hackers, mentors, tech leaders, and top engineering universities nationwide.',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
  },
  {
    icon: HiShieldCheck,
    title: 'Fair & Transparent Evaluation',
    description: 'Automated code quality assessments, live virtual presentations, and judging by industry veterans and domain experts.',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 relative py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-16"
      >
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
            <HiSparkles className="w-4 h-4 text-cyan-400" />
            <span>ABOUT HACKSPORA 2.0</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Empowering the Next Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">Innovators</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Hackspora 2.0 is South India&apos;s flagship 24-hour national hackathon, bringing together visionaries, developers, and creators to engineer high-impact solutions for tomorrow&apos;s digital ecosystem.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`glass-card p-6 rounded-3xl border ${pillar.borderColor} bg-gradient-to-b ${pillar.color} space-y-4 hover:scale-[1.02] transition-all duration-300 group`}
              >
                <div className={`p-3 rounded-2xl bg-slate-950/80 border border-slate-800 ${pillar.iconColor} w-fit group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-extrabold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{pillar.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Impact Numbers Banner */}
        <div className="glass-card rounded-3xl p-8 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-purple-950/30 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-2xl">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono">24 Hours</div>
            <span className="text-xs text-slate-400 font-medium">Non-Stop Coding</span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-indigo-300 font-mono">₹25,000+</div>
            <span className="text-xs text-slate-400 font-medium">Prizes & Grants</span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-purple-300 font-mono">1,500+</div>
            <span className="text-xs text-slate-400 font-medium">Student Hackers</span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono">100%</div>
            <span className="text-xs text-slate-400 font-medium">Free & Verified</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
