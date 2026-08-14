import { motion } from 'framer-motion';
import {
 HiClock,
 HiCheckCircle,
 HiPencilSquare,
 HiQuestionMarkCircle,
 HiPhone,
} from 'react-icons/hi2';

export default function ParticipantRightPanel({
 countdown,
 submission,
 saveStatus,
 lastSavedTime,
 quickNotes,
 setQuickNotes,
}) {
 // Timer Color Theme: Blue default -> Orange under 60m -> Red under 15m
 const getTimerColors = () => {
 switch (countdown.colorState) {
 case 'red':
 return {
 badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/40',
 text: 'text-rose-400',
 ring: 'stroke-rose-500',
 };
 case 'orange':
 return {
 badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/40',
 text: 'text-amber-400',
 ring: 'stroke-amber-500',
 };
 default:
 return {
 badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40',
 text: 'text-cyan-400',
 ring: 'stroke-cyan-400',
 };
 }
 };

 const timerColors = getTimerColors();

 return (
 <div className="space-y-6">
 {/* Countdown Timer Glass Card with Animated Progress Ring */}
 <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
 <div className="flex items-center justify-between w-full border-b border-slate-800/80 pb-3">
 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
 <HiClock className="w-3.5 h-3.5 text-cyan-400" />
 <span>Time Remaining</span>
 </span>
 <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${timerColors.badgeBg}`}>
 {countdown.colorState === 'red' ? 'FINAL MINUTES' : countdown.colorState === 'orange' ? 'LAST HOUR' : 'ROUND ACTIVE'}
 </span>
 </div>

 {/* Circular Gauge Ring & Large Numbers */}
 <div className="relative w-44 h-44 flex items-center justify-center">
 <svg className="w-full h-full transform -rotate-90">
 <circle
 cx="88"
 cy="88"
 r="76"
 stroke="rgba(30, 41, 59, 0.8)"
 strokeWidth="10"
 fill="transparent"
 />
 <motion.circle
 cx="88"
 cy="88"
 r="76"
 className={timerColors.ring}
 strokeWidth="10"
 strokeDasharray="477"
 strokeDashoffset={477 - (477 * countdown.percentRemaining) / 100}
 strokeLinecap="round"
 fill="transparent"
 transition={{ duration: 0.5 }}
 />
 </svg>

 {/* Centered Digital Display */}
 <div className="absolute inset-0 flex flex-col items-center justify-center ">
 <span className={`text-3xl font-black ${timerColors.text} tracking-tight`}>
 {countdown.hours}:{countdown.minutes}:{countdown.seconds}
 </span>
 <span className="text-[10px] text-slate-400 uppercase mt-1">HH : MM : SS</span>
 </div>
 </div>

 {/* Auto Save Pill */}
 <div className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
 <span className="text-slate-400">Auto-Save Status:</span>
 <span className=" text-cyan-400 font-bold flex items-center space-x-1 text-[11px]">
 <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
 <span>{saveStatus}</span>
 <span className="text-slate-500 font-normal">
 ({lastSavedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})
 </span>
 </span>
 </div>
 </div>

 {/* Submission Status Glass Card */}
 <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-2xl space-y-3">
 <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
 <span className="text-xs font-bold text-white uppercase tracking-wider">Submission Status</span>
 {submission.isSubmitted ? (
 <HiCheckCircle className="w-5 h-5 text-emerald-400" />
 ) : (
 <HiPencilSquare className="w-5 h-5 text-amber-400" />
 )}
 </div>

 <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
 <div className="flex justify-between">
 <span className="text-slate-400">Project Code:</span>
 <span className=" font-bold text-slate-200">{submission.githubRepoUrl ? 'Attached' : 'Missing'}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Demo Video:</span>
 <span className=" font-bold text-slate-200">{submission.demoVideoUrl ? 'Attached' : 'Missing'}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-slate-400">Turn-in Lock:</span>
 <span className={`font-bold ${submission.isSubmitted ? 'text-emerald-400' : 'text-amber-400'}`}>
 {submission.isSubmitted ? 'SUBMITTED & LOCKED' : 'DRAFT EDITABLE'}
 </span>
 </div>
 </div>
 </div>

 {/* Quick Notes Scratchpad */}
 <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-2xl space-y-3">
 <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
 <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Team Notes</span>
 <span className="text-[10px] text-slate-500">AUTO-SAVED</span>
 </div>
 <textarea
 rows={3}
 value={quickNotes}
 onChange={(e) => setQuickNotes(e.target.value)}
 placeholder="Scratchpad for API keys, endpoint URLs, tasks..."
 className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
 />
 </div>

 {/* Support Contact */}
 <div className="glass-card rounded-2xl p-4 border border-slate-800/80 shadow-2xl flex items-center justify-between text-xs">
 <div className="flex items-center space-x-2 text-slate-300">
 <HiQuestionMarkCircle className="w-5 h-5 text-cyan-400" />
 <span>Need Technical Help?</span>
 </div>
 <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-[11px] font-bold border border-slate-800 transition-colors">
 <HiPhone className="w-3.5 h-3.5" />
 <span>Help Desk</span>
 </button>
 </div>
 </div>
 );
}
