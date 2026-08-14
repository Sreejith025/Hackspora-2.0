import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiFolderPlus } from 'react-icons/hi2';

export default function CategoryFormModal({ isOpen, onClose, onSave, editingCategory }) {
 const {
 register,
 handleSubmit,
 reset,
 formState: { errors },
 } = useForm({
 defaultValues: {
 name: '',
 code: '',
 isActive: true,
 },
 });

 useEffect(() => {
 if (editingCategory) {
 reset({
 name: editingCategory.name,
 code: editingCategory.code,
 isActive: editingCategory.isActive,
 });
 } else {
 reset({
 name: '',
 code: '',
 isActive: true,
 });
 }
 }, [editingCategory, reset, isOpen]);

 const onSubmit = (data) => {
 onSave(data);
 };

 if (!isOpen) return null;

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
 />

 {/* Modal Window */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl"
 >
 {/* Header */}
 <div className="flex items-center justify-between pb-4 border-b border-slate-800">
 <div className="flex items-center space-x-2">
 <HiFolderPlus className="w-5 h-5 text-cyan-400" />
 <h3 className="text-lg font-bold text-white">
 {editingCategory ? 'Edit Category Track' : 'Create Category Track'}
 </h3>
 </div>
 <button
 onClick={onClose}
 className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
 >
 <HiXMark className="w-5 h-5" />
 </button>
 </div>

 {/* Form */}
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Category Name *
 </label>
 <input
 type="text"
 {...register('name', { required: 'Category name is required' })}
 placeholder="e.g. Artificial Intelligence & ML"
 className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
 />
 {errors.name && (
 <span className="text-xs text-rose-400 mt-1 block">{errors.name.message}</span>
 )}
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
 Short Track Code / Tag *
 </label>
 <input
 type="text"
 {...register('code', { required: 'Category code tag is required' })}
 placeholder="e.g. AI-ML"
 className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 uppercase placeholder-slate-500 focus:outline-none focus:border-cyan-400"
 />
 {errors.code && (
 <span className="text-xs text-rose-400 mt-1 block">{errors.code.message}</span>
 )}
 </div>

 <div className="flex items-center space-x-2 pt-1">
 <input
 type="checkbox"
 id="isActiveCategory"
 {...register('isActive')}
 className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-400"
 />
 <label htmlFor="isActiveCategory" className="text-xs text-slate-300 font-medium">
 Active Category Track (Visible to participants)
 </label>
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
 {editingCategory ? 'Save Changes' : 'Create Category'}
 </button>
 </div>
 </form>
 </motion.div>
 </div>
 </AnimatePresence>
 );
}
