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
  HiKey,
} from 'react-icons/hi2';

const categories = [
  {
    title: 'Generative AI & Autonomous Agent Systems',
    description: 'Multi-modal LLM reasoning, agentic workflows, RAG architectures, zero-shot code auditing, and enterprise AI automation.',
    icon: HiCpuChip,
    tag: 'TRACK 01',
    color: 'border-cyan-500/30 text-cyan-400',
  },
  {
    title: 'Cloud Native Infrastructure & Microservices',
    description: 'Kubernetes orchestration, distributed observability, eBPF telemetry, serverless functions, and resilient cloud DevOps.',
    icon: HiCloud,
    tag: 'TRACK 02',
    color: 'border-indigo-500/30 text-indigo-400',
  },
  {
    title: 'Cybersecurity, Zero Trust & Cryptography',
    description: 'Zero-knowledge proofs, automated patch recommendation systems, identity mesh, threat intelligence, and vulnerability scanners.',
    icon: HiShieldCheck,
    tag: 'TRACK 03',
    color: 'border-purple-500/30 text-purple-400',
  },
  {
    title: 'Web3, Smart Contracts & Decentralized Finance',
    description: 'Cross-chain liquidity aggregators, Layer-2 scaling solutions, EVM security audits, and decentralized storage networks.',
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
            <span>ENCRYPTED PROBLEM TRACKS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            High-Impact Innovation <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">Tracks</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            Problem statement specifications are encrypted and locked. They will automatically unblur and release live during Round 1 Kickoff.
          </p>
        </div>

        {/* Categories Grid - Blurred & Locked Tracks */}
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
                className="relative glass-card p-6 rounded-3xl border border-cyan-500/20 hover:border-cyan-400/50 space-y-4 transition-all duration-300 group flex flex-col justify-between overflow-hidden shadow-2xl min-h-[300px]"
              >
                {/* Foreground Glass Blur Lock Overlay */}
                <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[8px] z-10 flex flex-col items-center justify-center p-6 text-center space-y-3 border border-cyan-500/30 rounded-3xl group-hover:bg-slate-950/65 transition-all">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                    <HiLockClosed className="w-7 h-7 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest block">
                      {cat.tag} • LOCKED
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 mt-1 block">
                      Releases 23 Aug 2026 • 09:30 AM
                    </span>
                  </div>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-amber-300">
                    <HiKey className="w-3.5 h-3.5 text-amber-400" />
                    <span>Statements Encrypted</span>
                  </span>
                </div>

                {/* Background Blurred Content */}
                <div className="space-y-4 filter blur-[6px] select-none opacity-40 pointer-events-none">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${cat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-amber-400 filter blur-[6px] select-none opacity-40 pointer-events-none">
                  <span className="flex items-center space-x-1">
                    <HiLockClosed className="w-3.5 h-3.5" />
                    <span>Statements Encrypted</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Callout */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-purple-950/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <HiLockClosed className="w-5 h-5 text-cyan-400" />
              <span>Problem Statement Release Security</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              All 4 innovation track problem statements are currently encrypted and blurred to maintain competition fairness. Full problem specs, API endpoints, and evaluation rubrics unlock on <strong className="text-cyan-300">23 August 2026 at 9:30 AM</strong>.
            </p>
          </div>

          <Link
            to="/schedule"
            className="px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-105 transition-all shadow-md shadow-cyan-500/20 shrink-0 cursor-pointer flex items-center space-x-2"
          >
            <span>View Release Schedule</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
