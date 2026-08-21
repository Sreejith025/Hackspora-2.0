import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiMegaphone,
  HiPlus,
  HiPencilSquare,
  HiLink,
  HiCheckCircle,
  HiXMark,
  HiTrash,
  HiMagnifyingGlass,
  HiEye,
  HiEyeSlash,
  HiExclamationTriangle,
  HiArrowPath,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { announcementService } from '../../../services/announcementService';
import { ADMIN_EMAIL } from '../../../constants/authConfig';

const ANNOUNCEMENT_TYPES = [
  { id: 'general', label: 'General', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { id: 'urgent', label: 'Urgent', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  { id: 'update', label: 'Update', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { id: 'event', label: 'Event', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
];

export default function AdminAnnouncementsManagement({ adminEmail = ADMIN_EMAIL }) {
  const activeAdminEmail =
    adminEmail && typeof adminEmail === 'string' && adminEmail.trim()
      ? adminEmail.trim()
      : ADMIN_EMAIL;

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('published');
  const [saving, setSaving] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await announcementService.getAdminAnnouncements(activeAdminEmail);
      if (res?.success && Array.isArray(res.data)) {
        setAnnouncements(res.data);
      } else {
        toast.error(res?.message || 'Failed to fetch announcements.');
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      toast.error('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  }, [activeAdminEmail]);

  useEffect(() => {
    let ignore = false;
    async function init() {
      setLoading(true);
      try {
        const res = await announcementService.getAdminAnnouncements(activeAdminEmail);
        if (!ignore) {
          if (res?.success && Array.isArray(res.data)) {
            setAnnouncements(res.data);
          } else {
            toast.error(res?.message || 'Failed to fetch announcements.');
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to fetch announcements:', err);
          toast.error('Error connecting to backend server.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [activeAdminEmail]);

  // Open modal for new announcement
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setTitle('');
    setMessage('');
    setType('general');
    setLink('');
    setStatus('published');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setMessage(item.message || '');
    setType(item.type || 'general');
    setLink(item.link || '');
    setStatus(item.status || 'published');
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Title and Message content are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        message: message.trim(),
        type,
        link: link.trim(),
        status,
      };

      if (editingItem) {
        const res = await announcementService.updateAnnouncement(
          editingItem._id,
          payload,
          activeAdminEmail
        );
        if (res?.success) {
          toast.success('Announcement updated successfully!');
          setIsModalOpen(false);
          fetchAnnouncements();
        } else {
          toast.error(res?.message || 'Failed to update announcement.');
        }
      } else {
        const res = await announcementService.createAnnouncement(payload, activeAdminEmail);
        if (res?.success) {
          toast.success('Announcement created successfully!');
          setIsModalOpen(false);
          fetchAnnouncements();
        } else {
          toast.error(res?.message || 'Failed to create announcement.');
        }
      }
    } catch (err) {
      console.error('Failed saving announcement:', err);
      toast.error(err?.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle publish/unpublish
  const handleTogglePublish = async (item) => {
    setActionLoadingId(item._id);
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      const res = await announcementService.togglePublishStatus(
        item._id,
        newStatus,
        activeAdminEmail
      );
      if (res?.success) {
        toast.success(
          `Announcement ${newStatus === 'published' ? 'published' : 'unpublished'}!`
        );
        setAnnouncements((prev) =>
          prev.map((a) => (a._id === item._id ? { ...a, status: newStatus } : a))
        );
      } else {
        toast.error(res?.message || 'Failed to change status.');
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
      toast.error('Error updating announcement status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete announcement
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await announcementService.deleteAnnouncement(
        deleteTarget._id,
        activeAdminEmail
      );
      if (res?.success) {
        toast.success('Announcement deleted successfully.');
        setAnnouncements((prev) => prev.filter((a) => a._id !== deleteTarget._id));
        setDeleteTarget(null);
      } else {
        toast.error(res?.message || 'Failed to delete announcement.');
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
      toast.error('Error deleting announcement.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter logic
  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCount = announcements.length;
  const publishedCount = announcements.filter((a) => a.status === 'published').length;
  const draftCount = announcements.filter((a) => a.status === 'draft').length;
  const urgentCount = announcements.filter((a) => a.type === 'urgent').length;

  const getTypeBadge = (itemType) => {
    const config = ANNOUNCEMENT_TYPES.find((t) => t.id === itemType) || ANNOUNCEMENT_TYPES[0];
    return (
      <span
        className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-purple-950/40 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <HiMegaphone className="w-4 h-4" />
              <span>LIVE ANNOUNCEMENT SYSTEM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Broadcast & Announcements Center
            </h2>
            <p className="text-xs text-slate-300">
              Create, edit, publish, and manage official hackathon broadcasts for participants in real-time.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={fetchAnnouncements}
              disabled={loading}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer"
              title="Refresh"
            >
              <HiArrowPath className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-cyan-500/30 flex items-center space-x-2"
            >
              <HiPlus className="w-5 h-5" />
              <span>New Announcement</span>
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Posted</span>
            <span className="text-xl font-black text-white">{totalCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-bold text-emerald-400 block uppercase">Published Live</span>
            <span className="text-xl font-black text-emerald-300">{publishedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 block uppercase">Drafts</span>
            <span className="text-xl font-black text-amber-300">{draftCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-bold text-rose-400 block uppercase">Urgent Alerts</span>
            <span className="text-xl font-black text-rose-300">{urgentCount}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <HiMagnifyingGlass className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="urgent">Urgent</option>
            <option value="update">Update</option>
            <option value="event">Event</option>
          </select>
        </div>
      </div>

      {/* Announcement Items List */}
      {loading ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-slate-800 space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading announcements from MongoDB...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-slate-800 space-y-4">
          <HiMegaphone className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Announcements Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'No announcements match your search or filter criteria.'
              : 'No announcements have been created yet. Click "New Announcement" to broadcast your first message.'}
          </p>
          {!search && statusFilter === 'all' && typeFilter === 'all' && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer"
            >
              Create First Announcement
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((item) => {
            const isPublished = item.status === 'published';
            const isActionBusy = actionLoadingId === item._id;

            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`glass-card p-6 rounded-2xl border transition-all space-y-4 ${
                  isPublished
                    ? 'border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/30'
                    : 'border-amber-500/20 bg-amber-950/10 hover:border-amber-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    {getTypeBadge(item.type)}
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${
                        isPublished
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center space-x-2">
                    {/* Publish/Unpublish toggle */}
                    <button
                      onClick={() => handleTogglePublish(item)}
                      disabled={isActionBusy}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                        isPublished
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                          : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                      }`}
                    >
                      {isPublished ? (
                        <>
                          <HiEyeSlash className="w-4 h-4" />
                          <span>Unpublish</span>
                        </>
                      ) : (
                        <>
                          <HiEye className="w-4 h-4" />
                          <span>Publish Now</span>
                        </>
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer"
                      title="Edit Announcement"
                    >
                      <HiPencilSquare className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                      title="Delete Announcement"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Announcement Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {item.message}
                  </p>
                  {item.link && (
                    <div className="pt-2">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        <HiLink className="w-3.5 h-3.5" />
                        <span>{item.link}</span>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                  <HiMegaphone className="w-5 h-5" />
                  <span>{editingItem ? 'Edit Announcement' : 'Create Announcement'}</span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Round 1 Submission Deadline Extended"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Type & Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="general">General</option>
                      <option value="urgent">Urgent Alert</option>
                      <option value="update">Update</option>
                      <option value="event">Event / Schedule</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="published">Published (Visible to Hackers)</option>
                      <option value="draft">Draft (Hidden from Hackers)</option>
                    </select>
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Message Content <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Enter the full announcement details, instructions, or rules..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Link (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    Resource Link <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950 font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <HiCheckCircle className="w-4 h-4" />
                        <span>{editingItem ? 'Update Announcement' : 'Create & Publish'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 rounded-3xl border border-rose-500/30 bg-slate-950 shadow-2xl space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <HiExclamationTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Announcement?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong className="text-white">&quot;{deleteTarget.title}&quot;</strong>? This action cannot be undone and will immediately remove it from participant dashboards.
              </p>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all cursor-pointer flex items-center space-x-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <HiTrash className="w-4 h-4" />
                      <span>Yes, Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
