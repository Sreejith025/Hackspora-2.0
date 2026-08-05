import { motion } from 'framer-motion';
import {
  HiSparkles,
  HiLightBulb,
  HiCpuChip,
  HiGlobeAlt,
  HiShieldCheck,
  HiArrowDownTray,
  HiDocumentText,
  HiEye,
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

        {/* Official Event Brochure Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-3xl p-6 sm:p-10 border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-900/90 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Information & Download Action */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
                <HiDocumentText className="w-4 h-4 text-cyan-400" />
                <span>OFFICIAL EVENT BROCHURE</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Download the <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">Hackspora 2.0</span> Brochure
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Explore complete event information, problem tracks, venue guidelines, evaluation process, and registration details in our official brochure.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="/broucher/bro1.jpg"
                  download="Hackspora_2.0_Brochure.jpg"
                  className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <HiArrowDownTray className="w-5 h-5 text-slate-950" />
                  <span>Download Brochure</span>
                </a>

                <a
                  href="/broucher/bro1.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400/50 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <HiEye className="w-4 h-4 text-cyan-400" />
                  <span>View Full Image</span>
                </a>
              </div>
            </div>

            {/* Right Column: Image Preview Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative group/img max-w-md w-full rounded-2xl overflow-hidden border border-cyan-500/40 shadow-[0_0_30px_rgba(56,189,248,0.2)] bg-slate-950">
                <img
                  src="/broucher/bro1.jpg"
                  alt="Hackspora 2.0 Official Brochure"
                  className="w-full h-auto object-cover rounded-2xl group-hover/img:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <a
                    href="/broucher/bro1.jpg"
                    download="Hackspora_2.0_Brochure.jpg"
                    className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-lg hover:bg-cyan-300 transition-colors"
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
    </section>
  );
}
