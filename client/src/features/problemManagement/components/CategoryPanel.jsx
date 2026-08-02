import { motion } from 'framer-motion';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiPencilSquare,
  HiTrash,
  HiFolder,
  HiCheckCircle,
  HiXCircle,
} from 'react-icons/hi2';

export default function CategoryPanel({
  categories,
  categorySearch,
  setCategorySearch,
  onOpenCreate,
  onOpenEdit,
  onDeleteCategory,
  onToggleStatus,
}) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-2xl flex flex-col space-y-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <HiFolder className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Categories</h2>
            <p className="text-xs text-slate-400">Manage problem tracks</p>
          </div>
        </div>
        <button
          onClick={onOpenCreate}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-xl hover:scale-105 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <HiPlus className="w-4 h-4" />
          <span>New Track</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      {/* Categories List */}
      <div className="flex flex-col space-y-3 overflow-y-auto max-h-[560px] pr-1">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No categories found matching your search.
          </div>
        ) : (
          categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -2 }}
              className={`p-4 rounded-xl border transition-all ${
                cat.isActive
                  ? 'bg-slate-900/80 border-slate-800/90 hover:border-cyan-500/40'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-100">{cat.name}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {cat.code}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-slate-400">
                    <span>Total: <strong className="text-white">{cat.totalProblems}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-400">Pub: {cat.publishedProblems}</span>
                    <span>•</span>
                    <span className="text-amber-400">Draft: {cat.draftProblems}</span>
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onToggleStatus(cat.id)}
                    title={cat.isActive ? 'Active Track (Click to disable)' : 'Disabled Track (Click to enable)'}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    {cat.isActive ? (
                      <HiCheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <HiXCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </button>
                  <button
                    onClick={() => onOpenEdit(cat)}
                    title="Edit Category"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <HiPencilSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    title="Delete Category"
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
