import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, subtext, highlight = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative p-5 rounded-2xl transition-all duration-300 ${
        highlight
          ? 'bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-cyan-950/40 border border-cyan-500/40 shadow-[0_0_30px_rgba(56,189,248,0.15)]'
          : 'glass-card hover:border-slate-700/80 shadow-lg shadow-black/40'
      }`}
    >
      {highlight && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-cyan-500 to-indigo-500 text-[10px] font-bold tracking-wider text-slate-950 uppercase rounded-bl-xl rounded-tr-xl shadow-md">
          FEATURED
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-cyan-400 shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
          {value}
        </span>
        <span className="block text-xs font-semibold uppercase tracking-wider text-cyan-400/90 mt-1">
          {label}
        </span>
        {subtext && (
          <p className="text-[11px] text-slate-400 mt-1 font-normal">
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
}
