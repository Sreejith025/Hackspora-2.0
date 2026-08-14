import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, subtext, highlight = false, delay = 0 }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
 whileHover={{ y: -4 }}
 className={`relative p-5 rounded-2xl transition-colors duration-200 bg-slate-900 border ${
 highlight
 ? 'border-cyan-500'
 : 'border-slate-800 hover:border-cyan-500'
 }`}
 >
 {highlight && (
 <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-400 text-[10px] font-bold tracking-wider text-black uppercase rounded-bl-xl rounded-tr-xl">
 FEATURED
 </div>
 )}

 <div className="flex items-start justify-between">
 <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
 <Icon className="w-5 h-5" />
 </div>
 </div>

 <div className="mt-4">
 <span className="block text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
 {value}
 </span>
 <span className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 mt-1">
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
