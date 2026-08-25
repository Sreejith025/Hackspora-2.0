import { useState, useEffect, useCallback } from 'react';
import {
  HiRocketLaunch,
  HiMagnifyingGlass,
  HiFunnel,
  HiEye,
  HiPlay,
  HiPause,
  HiXMark,
  HiDocumentText,
  HiCodeBracket,
  HiVideoCamera,
  HiSparkles,
  HiUser,
  HiClipboardDocument,
  HiArrowTopRightOnSquare,
  HiPencilSquare,
  HiArrowDownTray,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { virtualRoundService } from '../../../services/virtualRoundService';
import { ADMIN_EMAIL } from '../../../constants/authConfig';
import { downloadSubmissionPDF, downloadEvaluatorSubmissionsPDF } from '../../../utils/submissionPdfGenerator';

export default function AdminVirtualRoundManagement({ adminEmail = ADMIN_EMAIL }) {
  const activeAdminEmail = (adminEmail && typeof adminEmail === 'string' && adminEmail.trim()) ? adminEmail.trim() : ADMIN_EMAIL;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEligibleTeams: 0,
    totalSubmissions: 0,
    underReviewCount: 0,
    shortlistedCount: 0,
    rejectedCount: 0,
  });
  const [config, setConfig] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [evaluatorFilter, setEvaluatorFilter] = useState('All');
  const [selectedSub, setSelectedSub] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Pre-assignment evaluator and mentor link state for teams
  const [teamEvaluatorInputs, setTeamEvaluatorInputs] = useState({});
  const [teamMentorLinkInputs, setTeamMentorLinkInputs] = useState({});
  const [editingTeamEvalId, setEditingTeamEvalId] = useState(null);

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, configRes, subsRes, teamsRes] = await Promise.all([
        virtualRoundService.getAdminStats(activeAdminEmail),
        virtualRoundService.getRoundConfig(),
        virtualRoundService.getAdminSubmissions(activeAdminEmail, { search, status: statusFilter }),
        virtualRoundService.getAdminTeamsEvaluators(activeAdminEmail),
      ]);

      if (statsRes?.success) setStats(statsRes.data);
      if (configRes?.success) setConfig(configRes.data);
      if (subsRes?.success) setSubmissions(subsRes.data);
      if (teamsRes?.success) setTeamsList(teamsRes.data || []);

      if (!statsRes && !configRes && !subsRes && !teamsRes) {
        toast.error('Cannot connect to backend server (http://localhost:5000). Ensure node server is running.', { id: 'backend-offline' });
      }
    } catch (err) {
      console.error('Failed to load Admin Virtual Round data:', err);
      toast.error('Error loading Virtual Round management data.');
    } finally {
      setLoading(false);
    }
  }, [activeAdminEmail, search, statusFilter]);

  useEffect(() => {
    let ignore = false;
    async function init() {
      const [statsRes, configRes, subsRes, teamsRes] = await Promise.all([
        virtualRoundService.getAdminStats(activeAdminEmail).catch(() => null),
        virtualRoundService.getRoundConfig().catch(() => null),
        virtualRoundService.getAdminSubmissions(activeAdminEmail, { search, status: statusFilter }).catch(() => null),
        virtualRoundService.getAdminTeamsEvaluators(activeAdminEmail).catch(() => null),
      ]);
      if (!ignore) {
        if (statsRes?.success) setStats(statsRes.data);
        if (configRes?.success) setConfig(configRes.data);
        if (subsRes?.success) setSubmissions(subsRes.data);
        if (teamsRes?.success) setTeamsList(teamsRes.data || []);

        if (!statsRes && !configRes && !subsRes && !teamsRes) {
          toast.error('Cannot connect to backend server (http://localhost:5000). Ensure node server is running.', { id: 'backend-offline' });
        }
        setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [activeAdminEmail, search, statusFilter]);

  // Pre-assign evaluator/mentor and meeting link to a team
  const handlePreAssignTeamEvaluator = async (teamId, overrideName = null, overrideLink = null) => {
    const evaluatorName = overrideName !== null ? overrideName : (teamEvaluatorInputs[teamId] !== undefined ? teamEvaluatorInputs[teamId] : '').trim();
    const mentorLink = overrideLink !== null ? overrideLink : (teamMentorLinkInputs[teamId] !== undefined ? teamMentorLinkInputs[teamId] : '').trim();

    try {
      setUpdating(true);
      const res = await virtualRoundService.assignTeamEvaluator(teamId, evaluatorName, mentorLink, activeAdminEmail);
      if (res?.success) {
        toast.success(res.message || 'Mentor details updated successfully.');
        setEditingTeamEvalId(null);
        loadAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update mentor details.');
    } finally {
      setUpdating(false);
    }
  };

  // Toggle Round Active State
  const handleToggleRoundActive = async () => {
    try {
      setUpdating(true);
      const currentState = config ? (config.isRoundActive ?? true) : true;
      const nextState = !currentState;
      const res = await virtualRoundService.updateRoundConfig({ isRoundActive: nextState }, activeAdminEmail);
      if (res?.success) {
        toast.success(`Virtual Round is now ${nextState ? 'Active' : 'Inactive'}.`);
        if (res.data) setConfig(res.data);
        loadAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update round state.');
    } finally {
      setUpdating(false);
    }
  };

  // Toggle Submission Lock/Open State
  const handleToggleSubmissions = async () => {
    try {
      setUpdating(true);
      const currentState = config ? (config.submissionOpen ?? config.isAcceptingSubmissions ?? true) : true;
      const nextState = !currentState;
      const res = await virtualRoundService.updateSubmissionStatusControl(nextState, activeAdminEmail);
      if (res?.success) {
        toast.success(`Virtual Round submissions are now ${nextState ? 'OPEN' : 'LOCKED'}.`);
        if (res.data) setConfig(res.data);
        loadAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update submission status.');
    } finally {
      setUpdating(false);
    }
  };

  // Update Submission Status (under_review, shortlisted, rejected)
  const handleUpdateStatus = async (submissionId, newStatus) => {
    try {
      setUpdating(true);
      const res = await virtualRoundService.updateSubmissionStatus(submissionId, newStatus, activeAdminEmail);
      if (res?.success) {
        toast.success(`Submission status updated to '${newStatus.replace('_', ' ')}'.`);
        loadAdminData();
        if (selectedSub && selectedSub._id === submissionId) {
          setSelectedSub(res.data || res.submission);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const isSubmissionsOpen = config ? (config.submissionOpen ?? config.isAcceptingSubmissions ?? true) : true;

  // Extract unique evaluator names from submissions & team assignments
  const evaluatorOptions = Array.from(
    new Set(
      [...submissions.map((s) => s.evaluatorName), ...teamsList.map((t) => t.evaluatorName)].filter(
        (name) => name && typeof name === 'string' && name.trim().length > 0
      )
    )
  );

  // Filter submissions by evaluator filter
  const filteredSubmissions = submissions.filter((sub) => {
    if (evaluatorFilter !== 'All') {
      if (evaluatorFilter === 'Unassigned') {
        if (sub.evaluatorName && sub.evaluatorName.trim()) return false;
      } else {
        if ((sub.evaluatorName || '').trim().toLowerCase() !== evaluatorFilter.trim().toLowerCase()) return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <HiRocketLaunch className="w-4 h-4" />
            <span>Virtual Round Admin Control Center</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Virtual Round Management & Review
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor submission metrics, control round state, manage problem statements, assign evaluators, and shortlist teams.
          </p>
        </div>

        {/* Master Control Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleRoundActive}
            disabled={updating}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              config?.isRoundActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            {config?.isRoundActive ? <HiPause className="w-4 h-4" /> : <HiPlay className="w-4 h-4" />}
            <span>{config?.isRoundActive ? 'Round Active (Pause)' : 'Round Inactive (Release)'}</span>
          </button>
        </div>
      </div>

      {/* Virtual Round Submissions Status Card */}
      <div className={`p-6 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
        isSubmissionsOpen
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/40'
          : 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 border-rose-500/40'
      }`}>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Virtual Round Submissions</span>
          <div className="flex items-center space-x-2.5">
            <span className={`w-3 h-3 rounded-full animate-pulse ${isSubmissionsOpen ? 'bg-emerald-400 shadow-md shadow-emerald-500/50' : 'bg-rose-500 shadow-md shadow-rose-500/50'}`} />
            <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>{isSubmissionsOpen ? '🟢 OPEN' : '🔴 LOCKED'}</span>
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            {isSubmissionsOpen
              ? 'Participants can submit their projects'
              : 'Participants cannot submit projects'}
          </p>
        </div>

        <button
          onClick={handleToggleSubmissions}
          disabled={updating}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shrink-0 ${
            isSubmissionsOpen
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
          }`}
        >
          {isSubmissionsOpen ? 'Lock Submissions' : 'Open Submissions'}
        </button>
      </div>

      {/* 2. Stat Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Eligible Teams</span>
          <div className="text-2xl font-black text-white">{stats.totalEligibleTeams}</div>
          <span className="text-[10px] text-slate-500">Verified Teams</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
          <span className="text-[10px] font-bold uppercase text-cyan-400">Submissions Received</span>
          <div className="text-2xl font-black text-cyan-300">{stats.totalSubmissions}</div>
          <span className="text-[10px] text-slate-500">Project Decks Submitted</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-1">
          <span className="text-[10px] font-bold uppercase text-indigo-400">Under Review</span>
          <div className="text-2xl font-black text-indigo-300">{stats.underReviewCount}</div>
          <span className="text-[10px] text-slate-500">Jury Evaluation</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-bold uppercase text-emerald-400">Shortlisted</span>
          <div className="text-2xl font-black text-emerald-300">{stats.shortlistedCount}</div>
          <span className="text-[10px] text-slate-500">Grand Finale Finalists</span>
        </div>
      </div>

      {/* 3. Mentor & WhatsApp Group Link Assignment Section (Available BEFORE Virtual Round starts) */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <HiUser className="w-4 h-4" />
              <span>Pre-Submission Setup</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">Mentor & WhatsApp Link Assignment</h3>
            <p className="text-xs text-slate-400">
              Assign dedicated mentors and team-specific WhatsApp group links to registered squads. Each team receives its own unique WhatsApp group link.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold shrink-0 self-start sm:self-auto">
            {teamsList.length} Teams Registered
          </span>
        </div>

        {teamsList.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center">No registered teams found for mentor assignment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
            {teamsList.map((t) => {
              const isEditing = editingTeamEvalId === t._id;
              const hasEvaluator = !!t.evaluatorName;
              const hasLink = !!t.mentorLink;

              const currentEvalInput = teamEvaluatorInputs[t._id] !== undefined ? teamEvaluatorInputs[t._id] : (t.evaluatorName || '');
              const currentLinkInput = teamMentorLinkInputs[t._id] !== undefined ? teamMentorLinkInputs[t._id] : (t.mentorLink || '');

              const copyLinkToClipboard = (linkToCopy) => {
                if (!linkToCopy) return;
                navigator.clipboard.writeText(linkToCopy);
                toast.success('Copied WhatsApp group link to clipboard!');
              };

              return (
                <div key={t._id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white truncate">{t.teamName}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 shrink-0">
                        {t.teamId}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{t.collegeName} • {t.leaderEmail}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-900 space-y-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mentor Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Sreejith"
                            value={currentEvalInput}
                            onChange={(e) => setTeamEvaluatorInputs((prev) => ({ ...prev, [t._id]: e.target.value }))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mentor WhatsApp Group Link</label>
                          <input
                            type="text"
                            placeholder="https://chat.whatsapp.com/... or group link"
                            value={currentLinkInput}
                            onChange={(e) => setTeamMentorLinkInputs((prev) => ({ ...prev, [t._id]: e.target.value }))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center justify-end space-x-2 pt-1">
                          <button
                            onClick={() => setEditingTeamEvalId(null)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handlePreAssignTeamEvaluator(t._id)}
                            disabled={updating}
                            className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer flex items-center space-x-1"
                          >
                            <span>Save Details</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Mentor Name Row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Mentor:</span>
                          <span className="text-xs font-bold text-emerald-400 truncate">
                            {t.evaluatorName || 'Not Assigned'}
                          </span>
                        </div>

                        {/* Mentor Link Row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400">WhatsApp Link:</span>
                          {t.mentorLink ? (
                            <a
                              href={/^https?:\/\//i.test(t.mentorLink) ? t.mentorLink : `https://${t.mentorLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-cyan-400 hover:underline truncate max-w-[170px]"
                              title={t.mentorLink}
                            >
                              {t.mentorLink}
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">No link set</span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-900/60">
                          <div className="flex items-center space-x-1.5">
                            {t.mentorLink && (
                              <>
                                <button
                                  onClick={() => copyLinkToClipboard(t.mentorLink)}
                                  className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer flex items-center space-x-1"
                                  title="Copy WhatsApp Group Link"
                                >
                                  <HiClipboardDocument className="w-3 h-3 text-cyan-400" />
                                  <span>Copy</span>
                                </button>
                                <a
                                  href={/^https?:\/\//i.test(t.mentorLink) ? t.mentorLink : `https://${t.mentorLink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-[10px] font-bold cursor-pointer flex items-center space-x-1"
                                  title="Open WhatsApp Group Link"
                                >
                                  <HiArrowTopRightOnSquare className="w-3 h-3" />
                                  <span>Join</span>
                                </a>
                              </>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingTeamEvalId(t._id);
                                setTeamEvaluatorInputs((prev) => ({ ...prev, [t._id]: t.evaluatorName || '' }));
                                setTeamMentorLinkInputs((prev) => ({ ...prev, [t._id]: t.mentorLink || '' }));
                              }}
                              className="text-[10px] text-cyan-400 hover:underline cursor-pointer font-semibold flex items-center space-x-1"
                            >
                              <HiPencilSquare className="w-3 h-3" />
                              <span>{hasEvaluator || hasLink ? 'Edit' : 'Add Link'}</span>
                            </button>
                            {(hasEvaluator || hasLink) && (
                              <button
                                onClick={() => handlePreAssignTeamEvaluator(t._id, '', '')}
                                className="text-[10px] text-rose-400 hover:underline cursor-pointer font-semibold"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by team ID, team name, evaluator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <HiFunnel className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Submissions</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Evaluator Filter */}
          <div className="flex items-center space-x-2">
            <HiUser className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-semibold">Evaluator:</span>
            <select
              value={evaluatorFilter}
              onChange={(e) => setEvaluatorFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Evaluators</option>
              <option value="Unassigned">Unassigned</option>
              {evaluatorOptions.map((ev) => (
                <option key={ev} value={ev}>{ev}</option>
              ))}
            </select>
          </div>

          {/* Evaluator Wise PDF Download Button */}
          <button
            onClick={() => downloadEvaluatorSubmissionsPDF(evaluatorFilter, filteredSubmissions)}
            className="px-3.5 py-2 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md"
            title="Download Evaluator Report PDF"
          >
            <HiArrowDownTray className="w-4 h-4 text-cyan-400" />
            <span>{evaluatorFilter === 'All' ? 'Download Evaluator PDF' : `Download ${evaluatorFilter} PDF`}</span>
          </button>
        </div>
      </div>

      {/* 5. Submissions Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading Virtual Round submissions...</span>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="p-12 rounded-3xl border border-slate-800 bg-slate-950 text-center space-y-2">
          <HiSparkles className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No Submissions Found</h4>
          <p className="text-xs text-slate-400">No project submissions match the current search or filter criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Team</th>
                <th className="py-3.5 px-4">Problem Statement</th>
                <th className="py-3.5 px-4">Submission Links</th>
                <th className="py-3.5 px-4">Evaluator</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {filteredSubmissions.map((sub) => {
                return (
                  <tr key={sub._id} className="hover:bg-slate-900/90 transition-colors">
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <span>{sub.teamName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                          {sub.teamId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{sub.collegeName} • {sub.leaderEmail}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-200 block truncate max-w-xs">{sub.problemStatementName}</span>
                      <span className="text-[10px] text-slate-500 block">Submitted {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </td>

                    <td className="py-3.5 px-4 space-x-2 whitespace-nowrap">
                      <a
                        href={sub.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded bg-slate-800 text-cyan-300 hover:underline text-[11px] font-mono inline-flex items-center space-x-1"
                      >
                        <HiCodeBracket className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                      <a
                        href={sub.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded bg-slate-800 text-purple-300 hover:underline text-[11px] font-mono inline-flex items-center space-x-1"
                      >
                        <HiVideoCamera className="w-3.5 h-3.5" />
                        <span>Video</span>
                      </a>
                      <a
                        href={sub.pptLink || sub.pptFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded bg-slate-800 text-emerald-300 hover:underline text-[11px] font-semibold inline-flex items-center space-x-1"
                      >
                        <HiDocumentText className="w-3.5 h-3.5" />
                        <span>View Presentation</span>
                      </a>
                    </td>

                    {/* Evaluator Column (Read-Only) */}
                    <td className="py-3.5 px-4">
                      {sub.evaluatorName ? (
                        <div className="flex items-center space-x-1.5 text-xs text-slate-200">
                          <HiUser className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-semibold text-white">{sub.evaluatorName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Evaluator will be assigned soon</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          sub.status === 'shortlisted'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : sub.status === 'under_review'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : sub.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => downloadSubmissionPDF(sub)}
                        className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-all cursor-pointer border border-cyan-500/30"
                        title="Download Submission PDF"
                      >
                        <HiArrowDownTray className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="View Details"
                      >
                        <HiEye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(sub._id, 'under_review')}
                        disabled={updating}
                        className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Under Review
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(sub._id, 'shortlisted')}
                        disabled={updating}
                        className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Shortlist
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(sub._id, 'rejected')}
                        disabled={updating}
                        className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#090d16] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-lg font-bold text-white">{selectedSub.teamName}</h4>
                <p className="text-xs text-slate-400">Team ID: {selectedSub.teamId} • Leader: {selectedSub.leaderEmail}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadSubmissionPDF(selectedSub)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
                  title="Download Submission PDF"
                >
                  <HiArrowDownTray className="w-4 h-4" />
                  <span>Download Submission PDF</span>
                </button>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 cursor-pointer"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Problem Statement</span>
                <span className="text-white font-semibold text-sm">{selectedSub.problemStatementName}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">GitHub Repository</span>
                  <a href={selectedSub.githubLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-mono truncate block">
                    {selectedSub.githubLink}
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Demo Video URL</span>
                  <a href={selectedSub.videoLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline font-mono truncate block">
                    {selectedSub.videoLink}
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Presentation Deck Link</span>
                <a href={selectedSub.pptLink || selectedSub.pptFileUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold underline font-mono truncate block">
                  View Presentation ({selectedSub.pptLink || selectedSub.pptFileUrl})
                </a>
              </div>

              {/* Evaluator Display in Modal (Read-Only) */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Evaluator</span>
                {selectedSub.evaluatorName ? (
                  <div className="flex items-center space-x-2 text-white font-bold text-sm">
                    <HiUser className="w-4 h-4 text-emerald-400" />
                    <span>{selectedSub.evaluatorName}</span>
                    {selectedSub.assignedAt && (
                      <span className="text-[10px] text-slate-500 font-normal ml-2">
                        (Assigned on {new Date(selectedSub.assignedAt).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400 text-xs italic block">Evaluator will be assigned soon</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Evaluation Status</span>
                  <span className="text-white font-bold text-sm uppercase">{selectedSub.status}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedSub._id, 'under_review')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-bold cursor-pointer"
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedSub._id, 'shortlisted')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold cursor-pointer"
                  >
                    Shortlist Team
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedSub._id, 'rejected')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold cursor-pointer"
                  >
                    Reject Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
