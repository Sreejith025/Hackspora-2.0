import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamationTriangle, HiXMark } from 'react-icons/hi2';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, pendingAction }) {
 if (!isOpen || !pendingAction) return null;

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
 />

 {/* Modal Window */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
 >
 {/* Icon & Title */}
 <div className="flex items-start space-x-3">
 <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
 <HiExclamationTriangle className="w-6 h-6" />
 </div>
 <div className="flex-1">
 <h3 className="text-lg font-bold text-white leading-tight">
 Confirm Action: {pendingAction.label}
 </h3>
 <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
 {pendingAction.description}
 </p>
 </div>
 <button
 onClick={onClose}
 className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
 >
 <HiXMark className="w-5 h-5" />
 </button>
 </div>

 {/* Action Buttons */}
 <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={onConfirm}
 className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:scale-105 rounded-xl transition-all shadow-md shadow-cyan-500/20"
 >
 Confirm & Execute
 </button>
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
}
