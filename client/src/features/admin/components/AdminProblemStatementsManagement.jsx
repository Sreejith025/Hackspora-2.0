import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HiDocumentText,
  HiPlus,
  HiPencilSquare,
  HiLink,
  HiCheckCircle,
  HiXMark,
  HiTrash,
  HiSparkles,
  HiMagnifyingGlass,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { virtualRoundService } from '../../../services/virtualRoundService';
import { ADMIN_EMAIL } from '../../../constants/authConfig';

export default function AdminProblemStatementsManagement({ adminEmail = ADMIN_EMAIL }) {
  const activeAdminEmail = (adminEmail && typeof adminEmail === 'string' && adminEmail.trim()) ? adminEmail.trim() : ADMIN_EMAIL;

  const [problemStatements, setProblemStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPs, setEditingPs] = useState(null);
  const [psName, setPsName] = useState('');
  const [psDescription, setPsDescription] = useState('');
  const [psLink, setPsLink] = useState('');
  const [psStatus, setPsStatus] = useState('published');
  const [savingPs, setSavingPs] = useState(false);

  const loadProblemStatements = useCallback(async () => {
    try {
      const res = await virtualRoundService.getAdminProblemStatements(activeAdminEmail);
      if (res?.success && Array.isArray(res.data)) {
        setProblemStatements(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch problem statements:', err);
      toast.error('Error loading problem statements from database.');
    } finally {
      setLoading(false);
    }
  }, [activeAdminEmail]);

  useEffect(() => {
    let ignore = false;
    virtualRoundService
      .getAdminProblemStatements(activeAdminEmail)
      .then((res) => {
        if (!ignore && res?.success && Array.isArray(res.data)) {
          setProblemStatements(res.data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to fetch problem statements:', err);
          toast.error('Error loading problem statements from database.');
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [activeAdminEmail]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingPs(null);
    setPsName('');
    setPsDescription('');
    setPsLink('');
    setPsStatus('published');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (ps) => {
    setEditingPs(ps);
    setPsName(ps.name || '');
    setPsDescription(ps.description || '');
    setPsLink(ps.link || '');
    setPsStatus(ps.status === 'published' ? 'published' : 'draft');
    setIsModalOpen(true);
  };

  // Save (Create or Update) Problem Statement
  const handleSavePs = async (e) => {
    e.preventDefault();
    if (!psName.trim() || !psDescription.trim()) {
      toast.error('Problem Statement Name and Description are required.');
      return;
    }

    try {
      setSavingPs(true);
      const payload = {
        name: psName.trim(),
        description: psDescription.trim(),
        link: psLink.trim(),
        status: psStatus,
      };

      let res;
      const targetId = editingPs?._id || editingPs?.id;
      if (editingPs && targetId) {
        res = await virtualRoundService.updateProblemStatement(targetId, payload, activeAdminEmail);
      } else {
        res = await virtualRoundService.createProblemStatement(payload, activeAdminEmail);
      }

      if (res?.success) {
        toast.success(
          editingPs ? 'Problem Statement updated successfully.' : 'Problem Statement created successfully.'
        );
        setIsModalOpen(false);
        loadProblemStatements();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save Problem Statement.');
    } finally {
      setSavingPs(false);
    }
  };

  // Toggle Publish / Unpublish Status
  const handleTogglePublishPs = async (psId, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      setUpdating(true);
      const res = await virtualRoundService.togglePublishProblemStatement(psId, nextStatus, activeAdminEmail);
      if (res?.success) {
        toast.success(
          `Problem Statement ${nextStatus === 'published' ? 'Published' : 'Unpublished'} successfully.`
        );
        loadProblemStatements();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update problem statement status.');
    } finally {
      setUpdating(false);
    }
  };

  // Delete Problem Statement
  const handleDeletePs = async (psId, psName) => {
    if (!window.confirm(`Are you sure you want to delete "${psName}"?`)) return;
    try {
      setUpdating(true);
      const res = await virtualRoundService.deleteProblemStatement(psId, activeAdminEmail);
      if (res?.success) {
        toast.success('Problem Statement deleted successfully.');
        loadProblemStatements();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete problem statement.');
    } finally {
      setUpdating(false);
    }
  };

  // Search Filter
  const filteredProblems = (Array.isArray(problemStatements) ? problemStatements : []).filter(
    (ps) =>
      (ps?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (ps?.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="space-y-8"
    >
      {/* 1. Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <HiDocumentText className="w-4 h-4" />
            <span>Problem Statements Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Problem Statements Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Create, edit, publish, unpublish and manage problem statements for Hackspora 2.0.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <HiPlus className="w-4 h-4" />
          <span>+ Create Problem Statement</span>
        </button>
      </div>

      {/* 2. Overview Metrics & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Problem Statements</span>
          <div className="text-2xl font-black text-white">
            {Array.isArray(problemStatements) ? problemStatements.length : 0}
          </div>
          <span className="text-[10px] text-slate-500">Registered Tracks</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-bold uppercase text-emerald-400">Published Problems</span>
          <div className="text-2xl font-black text-emerald-300">
            {Array.isArray(problemStatements)
              ? problemStatements.filter((p) => p?.status === 'published').length
              : 0}
          </div>
          <span className="text-[10px] text-slate-500">Live for Participants</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-1">
          <span className="text-[10px] font-bold uppercase text-amber-400">Draft / Unpublished</span>
          <div className="text-2xl font-black text-amber-300">
            {Array.isArray(problemStatements)
              ? problemStatements.filter((p) => p?.status !== 'published').length
              : 0}
          </div>
          <span className="text-[10px] text-slate-500">Hidden from Dropdown</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search problem statements by title or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
        />
      </div>

      {/* 3. Problem Statement List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading Problem Statements from MongoDB...</span>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="p-12 rounded-3xl border border-slate-800 bg-slate-950/60 text-center space-y-3">
          <HiSparkles className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No Problem Statements Found</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {search
              ? 'No problem statements match your search criteria.'
              : 'No problem statements created yet. Click "+ Create Problem Statement" to add one.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProblems.map((ps) => {
            const psId = ps?._id || ps?.id;
            const isPublished = ps?.status === 'published';
            const displayStatus = isPublished ? 'Published' : 'Draft';
            const formattedLink = ps?.link
              ? ps.link.startsWith('http://') || ps.link.startsWith('https://')
                ? ps.link
                : `https://${ps.link}`
              : '';

            return (
              <div
                key={psId}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block tracking-wider">
                        Problem Statement
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">{ps?.name}</h3>
                    </div>

                    {/* Status Badge */}
                    <div className="space-y-1 text-right shrink-0">
                      <span className="text-[10px] text-slate-500 block">Status:</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider block ${
                          isPublished
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {displayStatus}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {ps?.description}
                  </p>

                  {formattedLink && (
                    <a
                      href={formattedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:underline inline-flex items-center space-x-1.5 font-mono pt-1"
                    >
                      <HiLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{ps.link}</span>
                    </a>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(ps)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer flex items-center space-x-1 transition-all"
                  >
                    <HiPencilSquare className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleTogglePublishPs(psId, ps?.status)}
                    disabled={updating}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isPublished
                        ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                    }`}
                  >
                    {isPublished ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleDeletePs(psId, ps?.name)}
                    disabled={updating}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-all cursor-pointer"
                    title="Delete Problem Statement"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Create / Edit Problem Statement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#090d16] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-lg font-bold text-white">
                  {editingPs ? 'Edit Problem Statement' : 'Create Problem Statement'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Specify details and visibility for Hackspora 2.0
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 cursor-pointer"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePs} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">
                  Problem Statement Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI Healthcare Assistant"
                  value={psName}
                  onChange={(e) => setPsName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">
                  Problem Statement Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the challenge, key requirements, and domain background..."
                  value={psDescription}
                  onChange={(e) => setPsDescription(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">
                  Optional Resource / Reference Link
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={psLink}
                  onChange={(e) => setPsLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-300">Status</label>
                <select
                  value={psStatus}
                  onChange={(e) => setPsStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none cursor-pointer"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Only Published problem statements are visible to participants during Virtual Round submission.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={savingPs}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 font-bold hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPs}
                  className="px-5 py-2 rounded-xl bg-[#4a5cd9] hover:bg-[#5a6ce9] text-white font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-lg shadow-[#4a5cd9]/30"
                >
                  <HiCheckCircle className="w-4 h-4" />
                  <span>
                    {savingPs
                      ? 'Saving...'
                      : editingPs
                      ? 'Update Problem Statement'
                      : 'Create Problem Statement'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
