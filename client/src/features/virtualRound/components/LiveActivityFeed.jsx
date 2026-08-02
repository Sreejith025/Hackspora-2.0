import { motion } from 'framer-motion';
import {
  HiCheckCircle,
  HiPencilSquare,
  HiEye,
  HiUserPlus,
  HiExclamationCircle,
  HiRss,
} from 'react-icons/hi2';

export default function LiveActivityFeed({ activityLogs }) {
  const getLogIcon = (type) => {
    switch (type) {
      case 'SUBMISSION':
        return <HiCheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'DRAFT':
        return <HiPencilSquare className="w-4 h-4 text-amber-400" />;
      case 'PROBLEM':
        return <HiEye className="w-4 h-4 text-cyan-400" />;
      case 'LOGIN':
        return <HiUserPlus className="w-4 h-4 text-indigo-400" />;
      case 'STATUS':
        return <HiExclamationCircle className="w-4 h-4 text-purple-400" />;
      default:
        return <HiRss className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-2xl flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <HiRss className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Activity Feed</h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
          REAL-TIME STREAM
        </span>
      </div>

      {/* Feed List */}
      <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
        {activityLogs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors text-xs"
          >
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
              {getLogIcon(log.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 truncate">{log.team}</span>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{log.time}</span>
              </div>
              <p className="text-slate-300 mt-0.5 text-[11px] leading-snug">{log.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
