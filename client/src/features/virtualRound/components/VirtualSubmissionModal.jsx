import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiCloudArrowUp, HiCheckCircle, HiDocumentText, HiLink, HiVideoCamera, HiLockClosed } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { virtualRoundService } from '../../../services/virtualRoundService';

export default function VirtualSubmissionModal({ isOpen, onClose, userEmail, team, onSuccess }) {
  const [publishedProblems, setPublishedProblems] = useState([]);
  const [selectedPsId, setSelectedPsId] = useState('');
  const [problemStatementName, setProblemStatementName] = useState('');
  const [customProblem, setCustomProblem] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [pptLink, setPptLink] = useState('');
  const [loadingPs, setLoadingPs] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [vrConfig, setVrConfig] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;
    async function loadModalData() {
      try {
        setLoadingPs(true);
        const [psRes, configRes] = await Promise.all([
          virtualRoundService.getPublishedProblemStatements().catch(() => null),
          virtualRoundService.getRoundConfig().catch(() => null),
        ]);
        if (!ignore) {
          if (psRes?.success && Array.isArray(psRes.data)) setPublishedProblems(psRes.data);
          if (configRes?.success) setVrConfig(configRes.data || configRes);
        }
      } catch (err) {
        console.error('Failed to load modal data:', err);
      } finally {
        if (!ignore) setLoadingPs(false);
      }
    }
    loadModalData();
    return () => {
      ignore = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePsChange = (e) => {
    const val = e.target.value;
    setSelectedPsId(val);
    if (val === 'Other') {
      setProblemStatementName('Other');
    } else {
      const found = publishedProblems.find((p) => p._id === val || p.name === val);
      if (found) {
        setSelectedPsId(found._id);
        setProblemStatementName(found.name);
      } else {
        setProblemStatementName(val);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalPsId = selectedPsId === 'Other' ? undefined : selectedPsId;
    let finalPsName = selectedPsId === 'Other' ? customProblem.trim() : problemStatementName.trim();

    if (!finalPsName) {
      toast.error('Please select or specify your Problem Statement.');
      return;
    }

    if (!githubLink.trim() || !githubLink.toLowerCase().includes('github.com')) {
      toast.error('Please provide a valid GitHub Repository URL (must contain github.com).');
      return;
    }

    if (!videoLink.trim() || (!videoLink.startsWith('http://') && !videoLink.startsWith('https://'))) {
      toast.error('Please provide a valid Demo Video URL (e.g. YouTube, Vimeo, Google Drive).');
      return;
    }

    if (!pptLink.trim() || (!pptLink.startsWith('http://') && !pptLink.startsWith('https://'))) {
      toast.error('Please provide a valid Presentation Deck URL (Google Slides, Canva, Drive, etc.).');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        userEmail,
        problemStatementId: finalPsId,
        problemStatementName: finalPsName,
        githubLink: githubLink.trim(),
        videoLink: videoLink.trim(),
        pptLink: pptLink.trim(),
      };

      const res = await virtualRoundService.submitProject(payload);

      if (res?.success) {
        toast.success('Project submitted successfully for Virtual Round!');
        if (onSuccess) onSuccess(res.data || res.submission);
        onClose();
      } else {
        toast.error(res?.message || 'Submission failed. Please check form details.');
      }
    } catch (err) {
      toast.error(err.message || 'Error submitting project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#090d16] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-[#4a5cd9]/20 border border-[#4a5cd9]/30 text-[#8e9dff]">
                <HiCloudArrowUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Virtual Round Submission</h3>
                <p className="text-xs text-slate-400">Submit your project repositories, demo video, and presentation deck link</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body / Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Team Info Banner */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Submitting Team</span>
                <h4 className="text-base font-bold text-cyan-300">{team?.teamName || 'Your Registered Team'}</h4>
                <div className="text-xs text-slate-300 mt-1">
                  <span className="text-slate-400">Assigned Evaluator: </span>
                  <strong className="text-emerald-400">{team?.evaluatorName || 'Evaluator will be assigned soon'}</strong>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                <span className="text-slate-400">ID:</span>
                <strong className="text-white font-mono">{team?.teamId || 'HS2026-TEAM'}</strong>
              </div>
            </div>

            {/* Field 1: Problem Statement (Dynamically Loaded from MongoDB) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Problem Statement Name <span className="text-rose-400">*</span>
              </label>
              {loadingPs ? (
                <div className="p-3 text-xs text-slate-400 bg-slate-900 rounded-xl border border-slate-800 animate-pulse">
                  Loading published problem statements...
                </div>
              ) : (
                <select
                  value={selectedPsId}
                  onChange={handlePsChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-[#4a5cd9] focus:ring-1 focus:ring-[#4a5cd9] transition-all cursor-pointer"
                >
                  <option value="" disabled>Select your Problem Statement...</option>
                  {publishedProblems.map((ps) => (
                    <option key={ps._id} value={ps._id} className="bg-slate-900 text-white">
                      {ps.name}
                    </option>
                  ))}
                  <option value="Other" className="bg-slate-900 text-cyan-400">Other / Custom Track</option>
                </select>
              )}

              {selectedPsId === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter custom problem statement name..."
                  value={customProblem}
                  onChange={(e) => setCustomProblem(e.target.value)}
                  required
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#4a5cd9]"
                />
              )}
            </div>

            {/* Field 2: GitHub Repo URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                GitHub Repository URL <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <HiLink className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  placeholder="https://github.com/your-org/your-repo"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-[#4a5cd9] focus:ring-1 focus:ring-[#4a5cd9] transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400">Ensure the repository is Public or accessible for evaluation.</p>
            </div>

            {/* Field 3: Demo Video URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Demo Video URL <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <HiVideoCamera className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or Google Drive video link"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-[#4a5cd9] focus:ring-1 focus:ring-[#4a5cd9] transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400">Submit a 3-5 minute video demonstration showing your live project demo.</p>
            </div>

            {/* Field 4: Presentation Deck Link (PPT/PPTX) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Presentation Deck Link <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <HiDocumentText className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  placeholder="https://docs.google.com/presentation/..."
                  value={pptLink}
                  onChange={(e) => setPptLink(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-[#4a5cd9] focus:ring-1 focus:ring-[#4a5cd9] transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Paste your PPT/PPTX presentation link (Google Slides, Google Drive, OneDrive, Canva, etc.)
              </p>
            </div>

            {vrConfig && (vrConfig.submissionOpen === false || vrConfig.isAcceptingSubmissions === false) && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-3">
                <HiLockClosed className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <span className="font-bold text-sm text-white block">🔒 Virtual Round submissions are currently closed.</span>
                  <span className="text-slate-300">Please wait until the admin opens submissions.</span>
                </div>
              </div>
            )}

            {/* Modal Footer / Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || (vrConfig && (vrConfig.submissionOpen === false || vrConfig.isAcceptingSubmissions === false))}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4a5cd9] hover:bg-[#5a6ce9] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#4a5cd9]/30 flex items-center space-x-2"
              >
                {submitting ? (
                  <span>Submitting Project...</span>
                ) : (
                  <>
                    <HiCheckCircle className="w-4 h-4" />
                    <span>Submit Project Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
