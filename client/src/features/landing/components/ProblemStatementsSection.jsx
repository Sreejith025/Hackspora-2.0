import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiSparkles,
  HiLockClosed,
  HiCpuChip,
  HiGlobeAlt,
  HiShieldCheck,
  HiCloud,
  HiArrowRight,
} from 'react-icons/hi2';

const categories = [
  {
    title: 'Generative AI & LLM Systems',
    description: 'Autonomous agents, RAG architectures, multi-modal reasoning models, and AI enterprise automation.',
    icon: HiCpuChip,
    tag: 'TRACK 01',
    color: 'border-cyan-500/30 text-cyan-400',
  },
  {
    title: 'Cloud Native & DevOps',
    description: 'Kubernetes orchestration, serverless microservices, distributed observability, and resilient infra.',
    icon: HiCloud,
    tag: 'TRACK 02',
    color: 'border-indigo-500/30 text-indigo-400',
  },
  {
    title: 'Cybersecurity & Zero Trust',
    description: 'Cryptographic identity, vulnerability scanners, threat intelligence, and zero-trust security frameworks.',
    icon: HiShieldCheck,
    tag: 'TRACK 03',
    color: 'border-purple-500/30 text-purple-400',
  },
  {
    title: 'Web3 & Decentralized Apps',
    description: 'Smart contracts, decentralized finance, zero-knowledge proofs, and cross-chain interoperability.',
    icon: HiGlobeAlt,
    tag: 'TRACK 04',
    color: 'border-emerald-500/30 text-emerald-400',
  },
];

export default function ProblemStatementsSection() {
  return (
    <section id="problems" className="scroll-mt-28 relative py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
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
            <span>PROBLEM STATEMENTS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            High-Impact Innovation <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">Tracks</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            Explore problem categories crafted by industry leaders. Detailed statement specs unlock upon committee release.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/50 space-y-4 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${cat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-amber-400">
                  <span className="flex items-center space-x-1">
                    <HiLockClosed className="w-3.5 h-3.5" />
                    <span>Statements Locked</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Callout */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900/90 to-purple-950/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <HiLockClosed className="w-5 h-5 text-amber-400" />
              <span>Full Problem Statements Lock Status</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Detailed problem descriptions, data schemas, API credentials, and evaluation metrics will unlock live during the hackathon kick-off ceremony.
            </p>
          </div>

          <Link
            to="/problem-statements"
            className="px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-105 transition-all shadow-md shadow-cyan-500/20 shrink-0 cursor-pointer flex items-center space-x-2"
          >
            <span>Explore Problem Page</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
