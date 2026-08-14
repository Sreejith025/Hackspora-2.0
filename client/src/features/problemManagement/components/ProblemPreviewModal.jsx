import { motion, AnimatePresence } from 'framer-motion';
import {
 HiXMark,
 HiCpuChip,
 HiClock,
 HiUsers,
 HiDocumentText,
 HiArrowDownTray,
 HiLink,
 HiCheckCircle,
} from 'react-icons/hi2';

export default function ProblemPreviewModal({ isOpen, onClose, problem }) {
 if (!isOpen || !problem) return null;

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
 />

 {/* Modal Window */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative z-10 w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col"
 >
 {/* Top Bar Banner */}
 <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
 <div className="flex items-center space-x-2">
 <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
 PARTICIPANT PREVIEW MODE
 </span>
 <span className="text-xs text-slate-400">• ID: {problem.id}</span>
 </div>
 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
 >
 <HiXMark className="w-6 h-6" />
 </button>
 </div>

 {/* Participant Content View */}
 <div className="pt-6 space-y-6 overflow-y-auto pr-2 flex-1 text-slate-200">
 {/* Header info */}
 <div>
 <div className="flex flex-wrap items-center gap-2 mb-2">
 <span className="text-xs font-semibold text-slate-400">{problem.categoryName}</span>
 <span className="text-slate-600">•</span>
 <span
 className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${
 problem.difficulty === 'Easy'
 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
 : problem.difficulty === 'Medium'
 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
 : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
 }`}
 >
 {problem.difficulty}
 </span>
 </div>
 <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
 {problem.title}
 </h2>
 </div>

 {/* Metrics Ribbon */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
 <div className="flex items-center space-x-2.5">
 <HiUsers className="w-5 h-5 text-cyan-400 shrink-0" />
 <div>
 <span className="block text-[10px] text-slate-400 uppercase">Max Team Size</span>
 <span className="font-bold text-white">{problem.maxTeamSize || 4} Members</span>
 </div>
 </div>

 <div className="flex items-center space-x-2.5">
 <HiClock className="w-5 h-5 text-indigo-400 shrink-0" />
 <div>
 <span className="block text-[10px] text-slate-400 uppercase">Est. Duration</span>
 <span className="font-bold text-white">{problem.estimatedHours || 24} Hours</span>
 </div>
 </div>

 <div className="flex items-center space-x-2.5">
 <HiCpuChip className="w-5 h-5 text-purple-400 shrink-0" />
 <div>
 <span className="block text-[10px] text-slate-400 uppercase">Track</span>
 <span className="font-bold text-white">{problem.categoryName}</span>
 </div>
 </div>

 <div className="flex items-center space-x-2.5">
 <HiDocumentText className="w-5 h-5 text-emerald-400 shrink-0" />
 <div>
 <span className="block text-[10px] text-slate-400 uppercase">Status</span>
 <span className="font-bold text-emerald-400">{problem.status}</span>
 </div>
 </div>
 </div>

 {/* Overview */}
 <div>
 <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">
 Overview & Context
 </h3>
 <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
 {problem.detailedDescription || problem.shortDescription}
 </p>
 </div>

 {/* Technical Requirements */}
 {problem.requirements && (
 <div>
 <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">
 Technical Requirements & Scope
 </h3>
 <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
 {problem.requirements}
 </div>
 </div>
 )}

 {/* Expected Deliverables */}
 {problem.expectedDeliverables && (
 <div>
 <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">
 Expected Deliverables
 </h3>
 <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
 {problem.expectedDeliverables}
 </div>
 </div>
 )}

 {/* Evaluation Criteria */}
 {problem.evaluationCriteria && (
 <div>
 <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">
 Evaluation Criteria & Rubric
 </h3>
 <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
 {problem.evaluationCriteria}
 </div>
 </div>
 )}

 {/* Suggested Tech Stack Badges */}
 {problem.suggestedTechStack && problem.suggestedTechStack.length > 0 && (
 <div>
 <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">
 Suggested Tech Stack
 </h3>
 <div className="flex flex-wrap gap-2">
 {problem.suggestedTechStack.map((tech) => (
 <span
 key={tech}
 className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center space-x-1.5"
 >
 <HiCheckCircle className="w-3.5 h-3.5 text-cyan-400" />
 <span>{tech}</span>
 </span>
 ))}
 </div>
 </div>
 )}

 {/* Reference Links & Attachments */}
 {problem.attachments && problem.attachments.length > 0 && (
 <div>
 <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">
 Resources & Downloads
 </h3>
 <div className="space-y-2">
 {problem.attachments.map((file, idx) => (
 <div
 key={idx}
 className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
 >
 <div className="flex items-center space-x-2">
 <HiLink className="w-4 h-4 text-cyan-400" />
 <span className="font-semibold text-slate-200">{file.name}</span>
 <span className="text-[10px] text-slate-500">({file.size})</span>
 </div>
 <button className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[11px] font-bold border border-slate-800 transition-colors">
 <HiArrowDownTray className="w-3.5 h-3.5" />
 <span>Download</span>
 </button>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
}
