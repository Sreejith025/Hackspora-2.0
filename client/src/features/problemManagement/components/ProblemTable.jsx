import { motion } from 'framer-motion';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiEye,
  HiPencilSquare,
  HiDocumentDuplicate,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiArrowPath,
  HiFunnel,
} from 'react-icons/hi2';

export default function ProblemTable({
  problems,
  allCategories,
  problemSearch,
  setProblemSearch,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  selectedDifficultyFilter,
  setSelectedDifficultyFilter,
  selectedStatusFilter,
  setSelectedStatusFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  totalFilteredCount,
  onOpenCreate,
  onOpenEdit,
  onPreview,
  onDuplicate,
  onDelete,
  onTogglePublish,
}) {
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Draft':
        return 'bg-slate-800/80 text-slate-400 border-slate-700';
      case 'Scheduled':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Archived':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-2xl flex flex-col space-y-5">
      {/* Sticky Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Left: Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px]">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={problemSearch}
              onChange={(e) => setProblemSearch(e.target.value)}
              placeholder="Search by ID, title, or tags..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1">
            <HiFunnel className="w-4 h-4 text-cyan-400" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => {
                setSelectedCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Track Categories</option>
              {allCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficultyFilter}
            onChange={(e) => {
              setSelectedDifficultyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => {
              setSelectedStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Create Button */}
        <button
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 rounded-xl hover:scale-105 transition-all shadow-md shadow-cyan-500/20 cursor-pointer shrink-0"
        >
          <HiPlus className="w-4 h-4" />
          <span>New Problem Statement</span>
        </button>
      </div>

      {/* Premium Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              <th className="py-3 px-3">ID</th>
              <th className="py-3 px-4">Problem Statement Title</th>
              <th className="py-3 px-3">Track Category</th>
              <th className="py-3 px-3">Difficulty</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Release Schedule</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {problems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No problem statements found matching your filters.
                </td>
              </tr>
            ) : (
              problems.map((p) => (
                <motion.tr
                  key={p.id}
                  whileHover={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
                  className="transition-colors"
                >
                  {/* ID */}
                  <td className="py-3.5 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {p.id}
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-4 font-semibold text-slate-100 max-w-sm">
                    <div className="line-clamp-2">{p.title}</div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                    {p.categoryName}
                  </td>

                  {/* Difficulty */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border ${getDifficultyBadge(
                        p.difficulty
                      )}`}
                    >
                      {p.difficulty}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border ${getStatusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* Release Time */}
                  <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(p.releaseTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onPreview(p)}
                        title="Preview Problem (Participant View)"
                        className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <HiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenEdit(p)}
                        title="Edit Problem"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <HiPencilSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDuplicate(p)}
                        title="Duplicate Problem"
                        className="p-1.5 text-slate-400 hover:text-purple-400 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <HiDocumentDuplicate className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onTogglePublish(p.id)}
                        title={p.status === 'Published' ? 'Unpublish to Draft' : 'Publish Problem'}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <HiArrowPath className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        title="Delete Problem"
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs text-slate-400">
        <div>
          Showing <span className="font-bold text-white">{problems.length}</span> of{' '}
          <span className="font-bold text-white">{totalFilteredCount}</span> problem statements
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <HiChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-cyan-400 font-bold px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <HiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
