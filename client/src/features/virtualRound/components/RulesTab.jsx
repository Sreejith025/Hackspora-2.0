import { motion } from 'framer-motion';
import { HiBookOpen, HiCheckCircle, HiXCircle, HiScale } from 'react-icons/hi2';

export default function RulesTab() {
 return (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 10 }}
 className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-6"
 >
 <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-4">
 <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
 <HiBookOpen className="w-6 h-6" />
 </div>
 <div>
 <h2 className="text-xl font-bold text-white">Hackathon Rules & Evaluation Rubric</h2>
 <p className="text-xs text-slate-400">Official guidelines and code of conduct for Virtual Round 1.</p>
 </div>
 </div>

 {/* Rules Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
 {/* Allowed */}
 <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
 <div className="flex items-center space-x-2 text-emerald-400 font-bold">
 <HiCheckCircle className="w-4 h-4" />
 <span>Allowed Resources & Tools</span>
 </div>
 <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed">
 <li>Open-source libraries & frameworks (npm, PyPI, Cargo)</li>
 <li>Public LLM APIs (OpenAI, Claude, Llama 3)</li>
 <li>Sponsor provided starter kits & documentation</li>
 <li>Pre-existing open-source boilerplates (must cite in README)</li>
 </ul>
 </div>

 {/* Prohibited */}
 <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
 <div className="flex items-center space-x-2 text-rose-400 font-bold">
 <HiXCircle className="w-4 h-4" />
 <span>Prohibited Actions</span>
 </div>
 <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed">
 <li>Submitting work built prior to official round start time</li>
 <li>Plagiarism or copying another participating team&apos;s code</li>
 <li>Sharing solution details publicly during active round</li>
 <li>Submitting private GitHub repositories without access granted</li>
 </ul>
 </div>
 </div>

 {/* Rubric Breakdown */}
 <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
 <div className="flex items-center space-x-2 text-cyan-400 font-bold">
 <HiScale className="w-4 h-4" />
 <span>Judging Parameters & Weightage</span>
 </div>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
 <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
 <span className="block text-lg font-black text-cyan-400">30%</span>
 <span className="block text-[11px] text-slate-300 font-medium">Innovation & Impact</span>
 </div>
 <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
 <span className="block text-lg font-black text-indigo-400">30%</span>
 <span className="block text-[11px] text-slate-300 font-medium">Technical Execution</span>
 </div>
 <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
 <span className="block text-lg font-black text-purple-400">20%</span>
 <span className="block text-[11px] text-slate-300 font-medium">System Performance</span>
 </div>
 <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
 <span className="block text-lg font-black text-emerald-400">20%</span>
 <span className="block text-[11px] text-slate-300 font-medium">UX & Demo Video</span>
 </div>
 </div>
 </div>
 </motion.div>
 );
}
