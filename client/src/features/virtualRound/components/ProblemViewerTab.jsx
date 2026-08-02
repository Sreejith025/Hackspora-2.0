import { motion } from 'framer-motion';
import {
  HiDocumentText,
  HiArrowDownTray,
  HiLink,
  HiCheckCircle,
  HiArrowRight,
  HiCpuChip,
} from 'react-icons/hi2';

export default function ProblemViewerTab({ problem, onGoToSubmission }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-6"
    >
      {/* Title & Metadata */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold">
            {problem.categoryName}
          </span>
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
            {problem.difficulty} DIFFICULTY
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-mono text-slate-400">ID: {problem.id}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          {problem.title}
        </h1>
      </div>

      {/* Overview */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          Problem Overview & Motivation
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          {problem.detailedDescription || problem.shortDescription}
        </p>
      </div>

      {/* Technical Requirements */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          Technical Scope & Constraints
        </h3>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          {problem.requirements}
        </div>
      </div>

      {/* Expected Deliverables */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          Expected Deliverables
        </h3>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          {problem.expectedDeliverables}
        </div>
      </div>

      {/* Evaluation Rubric */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          Evaluation Criteria (100% Weightage)
        </h3>
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          {problem.evaluationCriteria}
        </div>
      </div>

      {/* Suggested Tech Stack */}
      {problem.suggestedTechStack && problem.suggestedTechStack.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Suggested Tech Stack & Frameworks
          </h3>
          <div className="flex flex-wrap gap-2">
            {problem.suggestedTechStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center space-x-1.5"
              >
                <HiCheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Attachments & Reference Links */}
      {problem.attachments && (
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Downloadable Briefs & Attachments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {problem.attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-2">
                  <HiDocumentText className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-slate-200">{file.name}</span>
                </div>
                <button className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[11px] font-bold border border-slate-800 transition-colors">
                  <HiArrowDownTray className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            ))}

            {problem.referenceLinks && problem.referenceLinks.map((link, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center space-x-2 truncate">
                  <HiLink className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-mono text-cyan-300 truncate">{link}</span>
                </div>
                <HiArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Action Bar */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <HiCpuChip className="w-4 h-4 text-cyan-400" />
          <span>Ready to build solution?</span>
        </div>
        <button
          onClick={onGoToSubmission}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-105 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <span>Go to Turn-in Submission</span>
          <HiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
