import { motion } from 'framer-motion';
import { useProblemStatements } from '../../../hooks/useProblemStatements';
import CategoryPanel from './CategoryPanel';
import CategoryFormModal from './CategoryFormModal';
import ProblemTable from './ProblemTable';
import ProblemFormModal from './ProblemFormModal';
import ProblemPreviewModal from './ProblemPreviewModal';
import { HiSparkles, HiShieldCheck } from 'react-icons/hi2';

export default function ProblemManagementView() {
  const {
    categories,
    allCategories,
    categorySearch,
    setCategorySearch,
    categoryModalOpen,
    setCategoryModalOpen,
    editingCategory,
    setEditingCategory,
    handleSaveCategory,
    handleDeleteCategory,
    handleToggleCategoryStatus,

    problems,
    allFilteredProblemsCount,
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

    problemModalOpen,
    setProblemModalOpen,
    editingProblem,
    setEditingProblem,
    previewModalOpen,
    setPreviewModalOpen,
    previewingProblem,
    setPreviewingProblem,

    handleSaveProblem,
    handleDeleteProblem,
    handleDuplicateProblem,
    handleTogglePublish,
  } = useProblemStatements();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="min-h-screen w-full bg-[#02040A] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8"
    >
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold mb-1">
            <HiSparkles className="w-4 h-4" />
            <span>ENTERPRISE HACKATHON DASHBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Problem Statement Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure track categories, publish problem briefs, schedule releases, and audit deliverables.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <HiShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ADMIN ENGINE ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Two-Panel Layout (Left: Category Panel, Right: Problem Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL: Category Management (4 Columns) */}
        <div className="lg:col-span-4">
          <CategoryPanel
            categories={categories}
            categorySearch={categorySearch}
            setCategorySearch={setCategorySearch}
            onOpenCreate={() => {
              setEditingCategory(null);
              setCategoryModalOpen(true);
            }}
            onOpenEdit={(cat) => {
              setEditingCategory(cat);
              setCategoryModalOpen(true);
            }}
            onDeleteCategory={handleDeleteCategory}
            onToggleStatus={handleToggleCategoryStatus}
          />
        </div>

        {/* RIGHT PANEL: Problem Statements Data Table (8 Columns) */}
        <div className="lg:col-span-8">
          <ProblemTable
            problems={problems}
            allCategories={allCategories}
            problemSearch={problemSearch}
            setProblemSearch={setProblemSearch}
            selectedCategoryFilter={selectedCategoryFilter}
            setSelectedCategoryFilter={setSelectedCategoryFilter}
            selectedDifficultyFilter={selectedDifficultyFilter}
            setSelectedDifficultyFilter={setSelectedDifficultyFilter}
            selectedStatusFilter={selectedStatusFilter}
            setSelectedStatusFilter={setSelectedStatusFilter}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalFilteredCount={allFilteredProblemsCount}
            onOpenCreate={() => {
              setEditingProblem(null);
              setProblemModalOpen(true);
            }}
            onOpenEdit={(problem) => {
              setEditingProblem(problem);
              setProblemModalOpen(true);
            }}
            onPreview={(problem) => {
              setPreviewingProblem(problem);
              setPreviewModalOpen(true);
            }}
            onDuplicate={handleDuplicateProblem}
            onDelete={handleDeleteProblem}
            onTogglePublish={handleTogglePublish}
          />
        </div>
      </div>

      {/* Modals */}
      <CategoryFormModal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />

      <ProblemFormModal
        isOpen={problemModalOpen}
        onClose={() => {
          setProblemModalOpen(false);
          setEditingProblem(null);
        }}
        onSave={handleSaveProblem}
        editingProblem={editingProblem}
        allCategories={allCategories}
      />

      <ProblemPreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setPreviewingProblem(null);
        }}
        problem={previewingProblem}
      />
    </motion.div>
  );
}
