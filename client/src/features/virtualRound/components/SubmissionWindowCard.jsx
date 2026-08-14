import {
 HiClock,
 HiLockClosed,
 HiLockOpen,
 HiCalendarDays,
} from 'react-icons/hi2';

export default function SubmissionWindowCard({ config, isLocked, timeRemaining }) {
 return (
 <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-2xl flex flex-col space-y-4">
 {/* Header */}
 <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
 <div className="flex items-center space-x-2">
 <HiClock className="w-5 h-5 text-cyan-400" />
 <h3 className="text-sm font-bold text-white uppercase tracking-wider">Submission Window</h3>
 </div>
 <span
 className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
 isLocked
 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
 : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
 }`}
 >
 {isLocked ? 'LOCKED' : 'UNLOCKED & ACCEPTING'}
 </span>
 </div>

 {/* Details List */}
 <div className="space-y-3 text-xs">
 {/* Opens */}
 <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
 <div className="flex items-center space-x-2 text-slate-400">
 <HiCalendarDays className="w-4 h-4 text-cyan-400" />
 <span>Submission Opens</span>
 </div>
 <span className=" font-bold text-slate-200">
 {config.startDate} • {config.startTime}
 </span>
 </div>

 {/* Closes */}
 <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
 <div className="flex items-center space-x-2 text-slate-400">
 <HiClock className="w-4 h-4 text-rose-400" />
 <span>Submission Closes</span>
 </div>
 <span className=" font-bold text-slate-200">
 {config.endDate} • {config.endTime}
 </span>
 </div>

 {/* Time Remaining */}
 <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
 <div className="flex items-center space-x-2 text-slate-400">
 <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
 <span>Time Remaining</span>
 </div>
 <span className=" font-bold text-cyan-400">
 {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
 </span>
 </div>

 {/* Lock Status */}
 <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
 <div className="flex items-center space-x-2 text-slate-400">
 {isLocked ? (
 <HiLockClosed className="w-4 h-4 text-rose-400" />
 ) : (
 <HiLockOpen className="w-4 h-4 text-emerald-400" />
 )}
 <span>Lock Status</span>
 </div>
 <span className={`font-bold ${isLocked ? 'text-rose-400' : 'text-emerald-400'}`}>
 {isLocked ? 'Manual Lock Engaged' : 'Auto Lock Active at Cut-off'}
 </span>
 </div>
 </div>
 </div>
 );
}
