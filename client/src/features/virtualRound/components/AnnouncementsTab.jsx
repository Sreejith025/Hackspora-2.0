import { motion } from 'framer-motion';
import { HiMegaphone } from 'react-icons/hi2';

export default function AnnouncementsTab({ announcements }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 10 }}
 className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl space-y-6"
 >
 <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-4">
 <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
 <HiMegaphone className="w-6 h-6 animate-bounce" />
 </div>
 <div>
 <h2 className="text-xl font-bold text-white">Live Admin Announcements</h2>
 <p className="text-xs text-slate-400">Official updates broadcast during Virtual Round 1.</p>
 </div>
 </div>

 <div className="space-y-4">
 {announcements.map((item) => (
 <div
 key={item.id}
 className={`p-4 rounded-xl border transition-all ${
 item.isNew
 ? 'bg-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
 : 'bg-slate-950/80 border-slate-800'
 }`}
 >
 <div className="flex items-center justify-between mb-1.5">
 <div className="flex items-center space-x-2">
 <span className="font-bold text-sm text-white">{item.title}</span>
 {item.isNew && (
 <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
 NEWEST
 </span>
 )}
 </div>
 <span className="text-[10px] text-slate-400">{item.time}</span>
 </div>
 <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
 </div>
 ))}
 </div>
 </motion.div>
 );
}
