import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiCog6Tooth } from 'react-icons/hi2';

export default function RoundConfigModal({ isOpen, onClose, onSave, currentConfig }) {
 const {
 register,
 handleSubmit,
 reset,
 } = useForm({
 defaultValues: currentConfig,
 });

 useEffect(() => {
 if (currentConfig) {
 reset(currentConfig);
 }
 }, [currentConfig, reset, isOpen]);

 const onSubmit = (data) => {
 onSave(data);
 };

 if (!isOpen) return null;

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
 className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col"
 >
 {/* Header */}
 <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
 <div className="flex items-center space-x-2">
 <HiCog6Tooth className="w-6 h-6 text-cyan-400" />
 <h3 className="text-xl font-bold text-white">Round Configuration Settings</h3>
 </div>
 <button
 onClick={onClose}
 className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
 >
 <HiXMark className="w-6 h-6" />
 </button>
 </div>

 {/* Form Content */}
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-5 overflow-y-auto pr-2 flex-1">
 {/* Round Name & Description */}
 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Round Name *
 </label>
 <input
 type="text"
 {...register('roundName', { required: true })}
 className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Description
 </label>
 <textarea
 rows={2}
 {...register('description')}
 className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
 />
 </div>

 {/* Dates & Times */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Start Date & Time
 </label>
 <div className="grid grid-cols-2 gap-2">
 <input
 type="date"
 {...register('startDate')}
 className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
 />
 <input
 type="time"
 {...register('startTime')}
 className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 End Date & Time
 </label>
 <div className="grid grid-cols-2 gap-2">
 <input
 type="date"
 {...register('endDate')}
 className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
 />
 <input
 type="time"
 {...register('endTime')}
 className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
 />
 </div>
 </div>
 </div>

 {/* Registration Cut-off & Submission Deadline */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Registration Cut-off
 </label>
 <input
 type="datetime-local"
 {...register('registrationCutoff')}
 className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Submission Deadline
 </label>
 <input
 type="datetime-local"
 {...register('submissionDeadline')}
 className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
 />
 </div>
 </div>

 {/* Toggle Rules & Switches */}
 <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
 <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
 Automated Rules & Submission Constraints
 </h4>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
 <label className="flex items-center space-x-2.5 cursor-pointer">
 <input
 type="checkbox"
 {...register('autoReleaseProblems')}
 className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-400 focus:ring-cyan-400"
 />
 <span>Auto Release Problems at Start</span>
 </label>

 <label className="flex items-center space-x-2.5 cursor-pointer">
 <input
 type="checkbox"
 {...register('autoLockSubmissions')}
 className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-400 focus:ring-cyan-400"
 />
 <span>Auto Lock Submissions at Deadline</span>
 </label>

 <label className="flex items-center space-x-2.5 cursor-pointer">
 <input
 type="checkbox"
 {...register('githubRequired')}
 className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-400 focus:ring-cyan-400"
 />
 <span>Require Public GitHub Repo</span>
 </label>

 <label className="flex items-center space-x-2.5 cursor-pointer">
 <input
 type="checkbox"
 {...register('demoVideoRequired')}
 className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-400 focus:ring-cyan-400"
 />
 <span>Require Demo Video Link</span>
 </label>
 </div>

 <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
 <span className="text-xs text-slate-300">Max Submission Attempts per Team</span>
 <input
 type="number"
 min="1"
 max="10"
 {...register('maxSubmissionAttempts')}
 className="w-20 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 text-center focus:outline-none focus:border-cyan-400"
 />
 </div>
 </div>

 {/* Actions */}
 <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:scale-105 rounded-xl transition-all shadow-md shadow-cyan-500/20"
 >
 Save Configuration
 </button>
 </div>
 </form>
 </motion.div>
 </div>
 </AnimatePresence>
 );
}
