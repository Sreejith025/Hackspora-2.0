import { motion } from 'framer-motion';
import {
 HiPlay,
 HiPause,
 HiStop,
 HiClock,
 HiUsers,
 HiUserGroup,
 HiDocumentCheck,
 HiSignal,
} from 'react-icons/hi2';

export default function RoundStatusHeader({
 status,
 isLocked,
 serverTime,
 timeRemaining,
 metrics,
 submissionProgress,
}) {
 const getStatusBadge = () => {
 switch (status) {
 case 'Live':
 return (
 <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/50 text-cyan-300 text-xs font-bold shadow-[0_0_20px_rgba(56,189,248,0.25)]">
 <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
 <span>LIVE ROUND ACTIVE</span>
 </div>
 );
 case 'Paused':
 return (
 <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/50 text-amber-300 text-xs font-bold">
 <HiPause className="w-4 h-4 text-amber-400 animate-pulse" />
 <span>ROUND PAUSED</span>
 </div>
 );
 case 'Ended':
 return (
 <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-400/50 text-rose-300 text-xs font-bold">
 <HiStop className="w-4 h-4 text-rose-400" />
 <span>ROUND ENDED</span>
 </div>
 );
 default:
 return (
 <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold">
 <HiPlay className="w-4 h-4 text-slate-400" />
 <span>NOT STARTED</span>
 </div>
 );
 }
 };

 return (
 <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-6">
 {/* Top Banner: Status & Server Clock */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
 <div className="flex items-center space-x-4">
 {getStatusBadge()}
 {isLocked && (
 <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
 🔒 SUBMISSIONS LOCKED
 </span>
 )}
 </div>

 {/* Server Clock & Signal */}
 <div className="flex items-center space-x-4 text-xs text-slate-400">
 <div className="flex items-center space-x-1.5 text-cyan-400">
 <HiSignal className="w-4 h-4 animate-pulse" />
 <span>SERVER SYNC OK</span>
 </div>
 <span>•</span>
 <div>
 SERVER TIME:{' '}
 <span className="text-white font-bold">
 {serverTime.toLocaleTimeString('en-US', { hour12: false })}
 </span>
 </div>
 </div>
 </div>

 {/* Main Countdown Gauge & Metric Cards Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
 {/* Countdown Gauge (5 Columns) */}
 <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
 <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center space-x-1">
 <HiClock className="w-3.5 h-3.5 text-cyan-400" />
 <span>Virtual Round Time Remaining</span>
 </div>

 <div className="flex items-center space-x-3 font-black text-4xl sm:text-5xl text-white tracking-wider text-glow-ice py-1">
 <span>{timeRemaining.hours}</span>
 <span className="text-cyan-400 animate-pulse">:</span>
 <span>{timeRemaining.minutes}</span>
 <span className="text-cyan-400 animate-pulse">:</span>
 <span className="text-cyan-400">{timeRemaining.seconds}</span>
 </div>

 <div className="text-[11px] text-slate-400">
 Countdown to Submission Cut-off
 </div>
 </div>

 {/* Live Metrics Grid (7 Columns) */}
 <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
 <motion.div whileHover={{ y: -2 }} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
 <div className="flex items-center justify-between text-slate-400 mb-2">
 <HiUsers className="w-4 h-4 text-cyan-400" />
 <span className="text-[9px] font-bold text-cyan-400">LIVE</span>
 </div>
 <span className="block text-2xl font-black text-white">{metrics.participantsOnline}</span>
 <span className="block text-[11px] text-slate-400">Participants Online</span>
 </motion.div>

 <motion.div whileHover={{ y: -2 }} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
 <div className="flex items-center justify-between text-slate-400 mb-2">
 <HiUserGroup className="w-4 h-4 text-indigo-400" />
 <span className="text-[9px] font-bold text-indigo-400">ACTIVE</span>
 </div>
 <span className="block text-2xl font-black text-white">{metrics.teamsWorking}</span>
 <span className="block text-[11px] text-slate-400">Teams Working</span>
 </motion.div>

 <motion.div whileHover={{ y: -2 }} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
 <div className="flex items-center justify-between text-slate-400 mb-2">
 <HiDocumentCheck className="w-4 h-4 text-emerald-400" />
 <span className="text-[9px] font-bold text-emerald-400">SUBMITTED</span>
 </div>
 <span className="block text-2xl font-black text-white">{metrics.submissionsReceived}</span>
 <span className="block text-[11px] text-slate-400">Submissions In</span>
 </motion.div>

 <motion.div whileHover={{ y: -2 }} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
 <div className="flex items-center justify-between text-slate-400 mb-2">
 <span className="text-xs font-bold text-purple-400">RATE</span>
 <span className="text-[9px] font-bold text-purple-400">{submissionProgress}%</span>
 </div>
 <span className="block text-2xl font-black text-white">{submissionProgress}%</span>
 <span className="block text-[11px] text-slate-400">Turn-in Rate</span>
 </motion.div>
 </div>
 </div>

 {/* Submission Progress Bar */}
 <div className="space-y-1.5 pt-2">
 <div className="flex justify-between text-xs font-semibold text-slate-300">
 <span>Overall Submission Turn-in Progress</span>
 <span className=" text-cyan-400">{metrics.submissionsReceived} / {metrics.totalTeams} Teams ({submissionProgress}%)</span>
 </div>
 <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${submissionProgress}%` }}
 transition={{ duration: 1, ease: 'easeOut' }}
 className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full"
 />
 </div>
 </div>
 </div>
 );
}
