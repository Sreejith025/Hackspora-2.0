import { motion } from 'framer-motion';
import {
 HiPlay,
 HiPause,
 HiStop,
 HiLockClosed,
 HiLockOpen,
 HiMegaphone,
 HiCog6Tooth,
} from 'react-icons/hi2';

export default function ControlPanelButtons({
 status,
 isLocked,
 areProblemsReleased,
 onRequestAction,
 onOpenConfig,
}) {
 return (
 <div className="glass-card rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-4">
 <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
 <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center space-x-2">
 <span>Master Control Room Panel</span>
 </h3>
 <button
 onClick={onOpenConfig}
 className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
 >
 <HiCog6Tooth className="w-4 h-4 text-cyan-400" />
 <span>Configure Round</span>
 </button>
 </div>

 {/* Grid of Large Control Buttons */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
 {/* Release Problems */}
 <motion.button
 whileTap={{ scale: 0.96 }}
 onClick={() =>
 onRequestAction(
 'RELEASE_PROBLEMS',
 'Release Problem Statements',
 'Are you sure you want to release all problem statements to participating teams now?'
 )
 }
 disabled={areProblemsReleased}
 className={`p-4 rounded-xl font-extrabold text-xs flex flex-col items-center justify-center space-y-2 border transition-all cursor-pointer ${
 areProblemsReleased
 ? 'bg-slate-950 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
 : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-lg shadow-cyan-950/30'
 }`}
 >
 <HiMegaphone className="w-6 h-6 text-cyan-400" />
 <span>Release Problems</span>
 </motion.button>

 {/* Start Round */}
 <motion.button
 whileTap={{ scale: 0.96 }}
 onClick={() =>
 onRequestAction(
 'START_ROUND',
 'Start Virtual Round',
 'Are you sure you want to officially start Virtual Round 1 timer and activity?'
 )
 }
 disabled={status === 'Live'}
 className={`p-4 rounded-xl font-extrabold text-xs flex flex-col items-center justify-center space-y-2 border transition-all cursor-pointer ${
 status === 'Live'
 ? 'bg-slate-950 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
 : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 shadow-lg shadow-emerald-950/30'
 }`}
 >
 <HiPlay className="w-6 h-6 text-emerald-400" />
 <span>Start Round</span>
 </motion.button>

 {/* Pause Round */}
 <motion.button
 whileTap={{ scale: 0.96 }}
 onClick={() =>
 onRequestAction(
 'PAUSE_ROUND',
 'Pause Virtual Round',
 'Are you sure you want to pause the round timer and freeze participant activities?'
 )
 }
 disabled={status !== 'Live'}
 className={`p-4 rounded-xl font-extrabold text-xs flex flex-col items-center justify-center space-y-2 border transition-all cursor-pointer ${
 status !== 'Live'
 ? 'bg-slate-950 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
 : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 shadow-lg shadow-amber-950/30'
 }`}
 >
 <HiPause className="w-6 h-6 text-amber-400" />
 <span>Pause Round</span>
 </motion.button>

 {/* Resume Round */}
 <motion.button
 whileTap={{ scale: 0.96 }}
 onClick={() =>
 onRequestAction(
 'RESUME_ROUND',
 'Resume Virtual Round',
 'Are you sure you want to unfreeze and resume Virtual Round 1 timer?'
 )
 }
 disabled={status !== 'Paused'}
 className={`p-4 rounded-xl font-extrabold text-xs flex flex-col items-center justify-center space-y-2 border transition-all cursor-pointer ${
 status !== 'Paused'
 ? 'bg-slate-950 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
 : 'bg-sky-500/10 border-sky-500/30 text-sky-300 hover:bg-sky-500/20 hover:border-sky-400 shadow-lg shadow-sky-950/30'
 }`}
 >
 <HiPlay className="w-6 h-6 text-sky-400" />
 <span>Resume Round</span>
 </motion.button>

 {/* Lock / Unlock Submissions */}
 <motion.button
 whileTap={{ scale: 0.96 }}
 onClick={() =>
 onRequestAction(
 isLocked ? 'UNLOCK_SUBMISSIONS' : 'LOCK_SUBMISSIONS',
 isLocked ? 'Unlock Submissions' : 'Lock Submissions',
 isLocked
 ? 'Are you sure you want to unlock team submissions?'
 : 'Are you sure you want to lock all team submissions? Teams will not be able to submit edits.'
 )
 }
 className={`p-4 rounded-xl font-extrabold text-xs flex flex-col items-center justify-center space-y-2 border transition-all cursor-pointer ${
 isLocked
 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
 : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20 shadow-lg shadow-rose-950/30'
 }`}
 >
 {isLocked ? (
 <>
 <HiLockOpen className="w-6 h-6 text-emerald-400" />
 <span>Unlock Submissions</span>
 </>
 ) : (
 <>
 <HiLockClosed className="w-6 h-6 text-rose-400" />
 <span>Lock Submissions</span>
 </>
 )}
 </motion.button>

 {/* End Round */}
 <motion.button
 whileTap={{ scale: 0.96 }}
 onClick={() =>
 onRequestAction(
 'END_ROUND',
 'End Virtual Round',
 'CRITICAL: Are you sure you want to end Virtual Round 1? Submissions will be locked automatically.'
 )
 }
 disabled={status === 'Ended'}
 className={`p-4 rounded-xl font-extrabold text-xs flex flex-col items-center justify-center space-y-2 border transition-all cursor-pointer ${
 status === 'Ended'
 ? 'bg-slate-950 border-slate-900 text-slate-600 opacity-60 cursor-not-allowed'
 : 'bg-rose-950/40 border-rose-600/40 text-rose-300 hover:bg-rose-900/60 shadow-lg shadow-rose-950/50'
 }`}
 >
 <HiStop className="w-6 h-6 text-rose-400" />
 <span>End Round</span>
 </motion.button>
 </div>
 </div>
 );
}
