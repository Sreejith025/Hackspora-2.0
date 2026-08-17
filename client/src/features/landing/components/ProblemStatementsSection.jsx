import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiLockClosed,
  HiCpuChip,
  HiGlobeAlt,
  HiShieldCheck,
  HiCloud,
  HiKey,
  HiSparkles,
  HiLink,
} from 'react-icons/hi2';
import { virtualRoundService } from '../../../services/virtualRoundService';

const fallbackCategories = [
  {
    title: 'Generative AI & Autonomous Agent Systems',
    description: 'Multi-modal LLM reasoning, agentic workflows, RAG architectures, zero-shot code auditing, and enterprise AI automation.',
    icon: HiCpuChip,
    tag: 'TRACK 01',
  },
  {
    title: 'Cloud Native Infrastructure & Microservices',
    description: 'Kubernetes orchestration, distributed observability, eBPF telemetry, serverless functions, and resilient cloud DevOps.',
    icon: HiCloud,
    tag: 'TRACK 02',
  },
  {
    title: 'Cybersecurity, Zero Trust & Cryptography',
    description: 'Zero-knowledge proofs, automated patch recommendation systems, identity mesh, threat intelligence, and vulnerability scanners.',
    icon: HiShieldCheck,
    tag: 'TRACK 03',
  },
  {
    title: 'Web3, Smart Contracts & Decentralized Finance',
    description: 'Cross-chain liquidity aggregators, Layer-2 scaling solutions, EVM security audits, and decentralized storage networks.',
    icon: HiGlobeAlt,
    tag: 'TRACK 04',
  },
];

export default function ProblemStatementsSection() {
  const [publishedProblems, setPublishedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function loadPublished() {
      try {
        setLoading(true);
        const res = await virtualRoundService.getPublishedProblemStatements();
        if (!ignore && res?.success && Array.isArray(res.data)) {
          setPublishedProblems(res.data);
        }
      } catch (err) {
        console.error('Error fetching published problem statements:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadPublished();
    return () => {
      ignore = true;
    };
  }, []);

  const hasPublished = publishedProblems.length > 0;

  return (
    <section id="problems" className="scroll-mt-20 sm:scroll-mt-28 relative py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-10 sm:space-y-16"
      >
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/25 backdrop-blur-2xl text-[#4a5cd9] text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-lg shadow-black/20">
            <span>Problem Statements</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            High-Impact Innovation <span className="text-[#4a5cd9]">Tracks</span>
          </h2>

          <p className="text-xs sm:text-base text-slate-300">
            {hasPublished
              ? 'Published problem statements released for Hackspora 2.0. Select your track when submitting your Virtual Round project.'
              : 'Problem statement specifications are encrypted and locked. They will automatically unblur and release live as administrators publish statement briefs.'}
          </p>
        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-4 min-h-[220px]"
              >
                <div className="h-6 bg-slate-800 rounded-lg w-2/3" />
                <div className="h-4 bg-slate-800/60 rounded-lg w-full" />
                <div className="h-4 bg-slate-800/60 rounded-lg w-4/5" />
              </div>
            ))}
          </div>
        ) : hasPublished ? (
          /* Dynamic Published Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedProblems.map((ps, idx) => {
              const formattedLink = ps.link
                ? ps.link.startsWith('http://') || ps.link.startsWith('https://')
                  ? ps.link
                  : `https://${ps.link}`
                : '';

              return (
                <motion.div
                  key={ps._id || ps.id || `ps-${idx}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-6 shadow-2xl space-y-4 flex flex-col justify-between hover:border-cyan-400/60 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                        <HiSparkles className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                        Live Track
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight">{ps.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{ps.description}</p>
                  </div>

                  {formattedLink && (
                    <div className="pt-3 border-t border-slate-800">
                      <a
                        href={formattedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:underline inline-flex items-center space-x-1.5 font-mono"
                      >
                        <HiLink className="w-3.5 h-3.5" />
                        <span className="truncate">{ps.link}</span>
                      </a>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Fallback Locked Track Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {fallbackCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/25 bg-slate-900 p-5 sm:p-6 shadow-2xl shadow-black/25 hover:border-white/40 space-y-4 transition-all duration-300 flex flex-col justify-between min-h-[260px] sm:min-h-[300px]"
                >
                  {/* Foreground Lock Overlay */}
                  <div className="absolute inset-0 bg-black z-10 flex flex-col items-center justify-center p-5 sm:p-6 text-center space-y-3 rounded-2xl sm:rounded-3xl transition-opacity duration-200">
                    <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-800 border border-white/25 text-cyan-400">
                      <HiLockClosed className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
                        {cat.tag} • LOCKED
                      </span>
                      <span className="text-[11px] text-slate-300 mt-1 block">
                        Releases upon Admin publication
                      </span>
                    </div>
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/25 text-[10px] text-amber-300">
                      <HiKey className="w-3.5 h-3.5 text-amber-400" />
                      <span>Statements Encrypted</span>
                    </span>
                  </div>

                  {/* Background Blurred Content */}
                  <div className="space-y-4 filter blur-[6px] select-none opacity-40 pointer-events-none">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-black border border-white/25 text-cyan-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-white/25 text-slate-400">
                        {cat.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </section>
  );
}