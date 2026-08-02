import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiDocumentText, HiArrowUpTray } from 'react-icons/hi2';

export default function ProblemFormModal({
  isOpen,
  onClose,
  onSave,
  editingProblem,
  allCategories,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      categoryId: allCategories[0]?.id || '',
      difficulty: 'Medium',
      status: 'Draft',
      releaseType: 'Publish Immediately',
      releaseTime: new Date().toISOString().slice(0, 16),
      shortDescription: '',
      detailedDescription: '',
      requirements: '',
      expectedDeliverables: '',
      evaluationCriteria: '',
      suggestedTechStack: '',
      tags: '',
      referenceLinks: '',
      maxTeamSize: 4,
      estimatedHours: 24,
    },
  });

  useEffect(() => {
    if (editingProblem) {
      reset({
        title: editingProblem.title,
        categoryId: editingProblem.categoryId,
        difficulty: editingProblem.difficulty,
        status: editingProblem.status,
        releaseType: editingProblem.releaseType || 'Publish Immediately',
        releaseTime: editingProblem.releaseTime
          ? new Date(editingProblem.releaseTime).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        shortDescription: editingProblem.shortDescription || '',
        detailedDescription: editingProblem.detailedDescription || '',
        requirements: editingProblem.requirements || '',
        expectedDeliverables: editingProblem.expectedDeliverables || '',
        evaluationCriteria: editingProblem.evaluationCriteria || '',
        suggestedTechStack: Array.isArray(editingProblem.suggestedTechStack)
          ? editingProblem.suggestedTechStack.join(', ')
          : editingProblem.suggestedTechStack || '',
        tags: Array.isArray(editingProblem.tags)
          ? editingProblem.tags.join(', ')
          : editingProblem.tags || '',
        referenceLinks: Array.isArray(editingProblem.referenceLinks)
          ? editingProblem.referenceLinks.join(', ')
          : editingProblem.referenceLinks || '',
        maxTeamSize: editingProblem.maxTeamSize || 4,
        estimatedHours: editingProblem.estimatedHours || 24,
      });
    } else {
      reset({
        title: '',
        categoryId: allCategories[0]?.id || '',
        difficulty: 'Medium',
        status: 'Draft',
        releaseType: 'Publish Immediately',
        releaseTime: new Date().toISOString().slice(0, 16),
        shortDescription: '',
        detailedDescription: '',
        requirements: '',
        expectedDeliverables: '',
        evaluationCriteria: '',
        suggestedTechStack: '',
        tags: '',
        referenceLinks: '',
        maxTeamSize: 4,
        estimatedHours: 24,
      });
    }
  }, [editingProblem, reset, isOpen, allCategories]);

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      suggestedTechStack: typeof data.suggestedTechStack === 'string'
        ? data.suggestedTechStack.split(',').map((s) => s.trim()).filter(Boolean)
        : data.suggestedTechStack,
      tags: typeof data.tags === 'string'
        ? data.tags.split(',').map((s) => s.trim()).filter(Boolean)
        : data.tags,
      referenceLinks: typeof data.referenceLinks === 'string'
        ? data.referenceLinks.split(',').map((s) => s.trim()).filter(Boolean)
        : data.referenceLinks,
      maxTeamSize: Number(data.maxTeamSize),
      estimatedHours: Number(data.estimatedHours),
      attachments: editingProblem?.attachments || [
        { name: 'Problem_Brief.pdf', size: '2.0 MB' },
      ],
    };

    onSave(formattedData);
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
          className="relative z-10 w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-2">
              <HiDocumentText className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">
                {editingProblem ? 'Edit Problem Statement' : 'Create Problem Statement'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          {/* Form Scroll Area */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6 overflow-y-auto pr-2 flex-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Problem Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Problem title is required' })}
                placeholder="e.g. Autonomous AI Agent for Automated Code Auditing"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {errors.title && (
                <span className="text-xs text-rose-400 mt-1 block">{errors.title.message}</span>
              )}
            </div>

            {/* Track Category & Difficulty & Max Team Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Track Category *
                </label>
                <select
                  {...register('categoryId')}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                >
                  {allCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Difficulty Level *
                </label>
                <select
                  {...register('difficulty')}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Max Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  {...register('maxTeamSize')}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Short Description (Summary) *
              </label>
              <textarea
                rows={2}
                {...register('shortDescription', { required: 'Short description is required' })}
                placeholder="High-level overview summary displayed on preview cards..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Detailed Description & Context *
              </label>
              <textarea
                rows={4}
                {...register('detailedDescription', { required: 'Detailed description is required' })}
                placeholder="Complete background context, problem motivation, and real-world impact..."
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Requirements & Deliverables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Technical Requirements
                </label>
                <textarea
                  rows={3}
                  {...register('requirements')}
                  placeholder="System requirements, APIs, frameworks, and constraints..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Expected Deliverables
                </label>
                <textarea
                  rows={3}
                  {...register('expectedDeliverables')}
                  placeholder="Code repository, working demo URL, documentation, video..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Evaluation Criteria & Tech Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Evaluation Criteria
                </label>
                <textarea
                  rows={3}
                  {...register('evaluationCriteria')}
                  placeholder="Judged parameters with percentage weightages..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Suggested Tech Stack (Comma Separated)
                  </label>
                  <input
                    type="text"
                    {...register('suggestedTechStack')}
                    placeholder="Python, LangChain, React, Docker"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    {...register('tags')}
                    placeholder="AI, Security, Cloud"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Release Settings & Scheduling */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Release & Access Configuration
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Release Mode
                  </label>
                  <select
                    {...register('releaseType')}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Publish Immediately">Publish Immediately</option>
                    <option value="Schedule Release">Schedule Release</option>
                    <option value="Hide Until Virtual Round Starts">
                      Hide Until Virtual Round Starts
                    </option>
                    <option value="Automatically Release at Configured Time">
                      Automatically Release at Configured Time
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Configured Release Time
                  </label>
                  <input
                    type="datetime-local"
                    {...register('releaseTime')}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Upload Attachments Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Problem Attachments (PDF, Images, ZIP Resources)
              </label>
              <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors cursor-pointer flex flex-col items-center justify-center space-y-2">
                <HiArrowUpTray className="w-8 h-8 text-cyan-400 animate-bounce" />
                <span className="text-xs font-semibold text-slate-200">
                  Click or drag files here to upload problem briefs, datasets, or reference PDFs
                </span>
                <span className="text-[10px] text-slate-500">Supports PDF, PNG, JPG, ZIP (Max 50MB)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => reset({ ...editingProblem, status: 'Draft' })}
                className="px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-105 rounded-xl transition-all shadow-md shadow-cyan-500/20"
              >
                {editingProblem ? 'Update Problem' : 'Publish / Save Problem'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
