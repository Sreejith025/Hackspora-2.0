import { motion } from 'framer-motion';
import { HiFolder, HiKey, HiCloud, HiCodeBracket, HiArrowDownTray } from 'react-icons/hi2';

export default function ResourcesTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-6"
    >
      <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-4">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          <HiFolder className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Sponsor API Keys & Starter Kits</h2>
          <p className="text-xs text-slate-400">Access free cloud credits, starter repositories, and SDK documentation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Starter Kit */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
              <HiCodeBracket className="w-4 h-4" />
              <span>Fullstack Starter Template</span>
            </div>
            <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-400">GITHUB</span>
          </div>
          <p className="text-xs text-slate-300">Pre-configured React, Vite, FastAPI, and Docker template with CI/CD GitHub Actions.</p>
          <button className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-bold border border-slate-800 transition-colors">
            <HiArrowDownTray className="w-4 h-4" />
            <span>Clone Starter Repo</span>
          </button>
        </div>

        {/* OpenAI Credit Key */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
              <HiKey className="w-4 h-4" />
              <span>AI API Credits Key</span>
            </div>
            <span className="text-[10px] font-mono bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-300">$100 CREDITS</span>
          </div>
          <p className="text-xs text-slate-300">Free API token for OpenAI GPT-4o and Claude 3.5 Sonnet endpoints for Virtual Round 1.</p>
          <div className="p-2 rounded-lg bg-slate-900 font-mono text-[11px] text-cyan-300 border border-slate-800 select-all">
            sk-hackspora20-partner-team-key-84920
          </div>
        </div>

        {/* Cloud Hosting */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
              <HiCloud className="w-4 h-4" />
              <span>Cloud Server Credits</span>
            </div>
            <span className="text-[10px] font-mono bg-purple-500/10 px-2 py-0.5 rounded text-purple-300">DEPLOY</span>
          </div>
          <p className="text-xs text-slate-300">Free deployment sandbox on Vercel and AWS EC2 for staging your live hackathon demos.</p>
          <button className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-400 text-xs font-bold border border-slate-800 transition-colors">
            Access Cloud Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
}
