import { motion } from 'framer-motion';
import {
 HiCloudArrowUp,
 HiCheckCircle,
 HiClock,
 HiLockClosed,
} from 'react-icons/hi2';

export default function SubmissionTab({
 submission,
 setSubmission,
 saveStatus,
 lastSavedTime,
 onSaveDraft,
 onOpenFinalModal,
}) {
 const handleChange = (field, value) => {
 setSubmission((prev) => ({ ...prev, [field]: value }));
 };

 return (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 10 }}
 className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-6"
 >
 {/* Header */}
 <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
 <div className="flex items-center space-x-3">
 <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
 <HiCloudArrowUp className="w-6 h-6" />
 </div>
 <div>
 <h2 className="text-xl font-bold text-white">Project Turn-in Submission</h2>
 <p className="text-xs text-slate-400">
 Submit your team&apos;s source code, demo video, and architecture details.
 </p>
 </div>
 </div>

 {/* Auto Save Status Badge */}
 <div className="flex items-center space-x-2 text-xs ">
 <HiClock className="w-4 h-4 text-cyan-400" />
 <span className="text-slate-400">STATUS:</span>
 <span
 className={`font-bold ${
 saveStatus === 'Saving...' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
 }`}
 >
 {saveStatus}
 </span>
 <span className="text-[10px] text-slate-500">
 ({lastSavedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
 </span>
 </div>
 </div>

 {submission.isSubmitted ? (
 <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
 <HiCheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
 <h3 className="text-xl font-bold text-white">Final Project Submitted!</h3>
 <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
 Your project submission has been locked and recorded at{' '}
 <strong className="text-emerald-300">{new Date(submission.submittedAt).toLocaleString()}</strong>.
 </p>
 </div>
 ) : (
 <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
 {/* Project Title */}
 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Project Title *
 </label>
 <input
 type="text"
 value={submission.projectTitle}
 onChange={(e) => handleChange('projectTitle', e.target.value)}
 placeholder="e.g. AIAuditor Pro - Autonomous Vulnerability Remediation Agent"
 className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
 />
 </div>

 {/* Repository & Demo Video */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Public GitHub Repository URL *
 </label>
 <input
 type="url"
 value={submission.githubRepoUrl}
 onChange={(e) => handleChange('githubRepoUrl', e.target.value)}
 placeholder="https://github.com/team-name/project-repo"
 className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Demo Video URL (Loom / YouTube / Drive) *
 </label>
 <input
 type="url"
 value={submission.demoVideoUrl}
 onChange={(e) => handleChange('demoVideoUrl', e.target.value)}
 placeholder="https://loom.com/share/..."
 className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
 />
 </div>
 </div>

 {/* Tech Stack */}
 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Tech Stack Used
 </label>
 <input
 type="text"
 value={submission.techStack}
 onChange={(e) => handleChange('techStack', e.target.value)}
 placeholder="Python, LangChain, OpenAI GPT-4, FastAPI, React"
 className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
 />
 </div>

 {/* Project Summary */}
 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Project Description & Architecture Summary *
 </label>
 <textarea
 rows={4}
 value={submission.projectDescription}
 onChange={(e) => handleChange('projectDescription', e.target.value)}
 placeholder="Describe your solution architecture, key innovations, and how your team solved the problem..."
 className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
 />
 </div>

 {/* Additional Notes */}
 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Additional Notes / Deployment Credentials
 </label>
 <textarea
 rows={2}
 value={submission.additionalNotes}
 onChange={(e) => handleChange('additionalNotes', e.target.value)}
 placeholder="Instructions for judges, environment variables, or testing credentials..."
 className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
 />
 </div>

 {/* Action Buttons */}
 <div className="flex items-center justify-between pt-4 border-t border-slate-800">
 <button
 type="button"
 onClick={onSaveDraft}
 className="px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
 >
 Save Draft
 </button>

 <button
 type="button"
 onClick={onOpenFinalModal}
 className="inline-flex items-center space-x-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-105 rounded-xl transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
 >
 <HiLockClosed className="w-4 h-4" />
 <span>Final Submit & Lock</span>
 </button>
 </div>
 </form>
 )}
 </motion.div>
 );
}
