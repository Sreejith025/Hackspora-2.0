import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import {
  HiRocketLaunch,
  HiCheckCircle,
  HiDocumentText,
  HiCodeBracket,
  HiVideoCamera,
  HiArrowRight,
  HiShieldCheck,
  HiEye,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { virtualRoundService } from '../services/virtualRoundService';
import VirtualSubmissionModal from '../features/virtualRound/components/VirtualSubmissionModal';
import PublicResultsSection from '../features/virtualRound/components/PublicResultsSection';

export default function VirtualRound() {
  const { isSignedIn, user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';

  const [config, setConfig] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Time remaining countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const configRes = await virtualRoundService.getRoundConfig();
        if (!ignore && configRes?.success) {
          setConfig(configRes.data);
        }

        if (isSignedIn && userEmail) {
          const subRes = await virtualRoundService.getMySubmission(userEmail);
          if (!ignore && subRes?.success) {
            setSubmissionData(subRes);
          }
        }
      } catch (err) {
        console.error('Failed to load Virtual Round data:', err);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [isSignedIn, userEmail, refreshKey]);

  // Countdown timer effect
  useEffect(() => {
    if (!config?.submissionDeadline) return;

    const tick = () => {
      const deadline = new Date(config.submissionDeadline);
      const diff = deadline - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [config?.submissionDeadline]);

  const team = submissionData?.team;
  const isEligible = submissionData?.isEligible;
  const virtualStatus = submissionData?.virtualRoundStatus || 'registered';
  const hasSubmitted = !!submissionData?.submission;

  const getStatusBadge = () => {
    if (!isSignedIn) {
      return (
        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
          Authentication Required
        </span>
      );
    }

    if (!submissionData?.registered) {
      return (
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          Team Not Registered
        </span>
      );
    }

    switch (virtualStatus) {
      case 'submitted':
        return (
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
            Submitted
          </span>
        );
      case 'under_review':
        return (
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
            Under Review
          </span>
        );
      case 'shortlisted':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            Shortlisted
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
            Reviewed
          </span>
        );
      default:
        if (isEligible) {
          return (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              Eligible for Virtual Round
            </span>
          );
        }
        return (
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold">
            Not Eligible
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-12 max-w-[1500px] mx-auto space-y-12">
      {/* 1. Hero Section & Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1222] via-[#070b14] to-[#02040a] border border-white/15 p-6 sm:p-10 shadow-2xl space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-[#8e9dff] text-xs font-bold uppercase tracking-widest">
              <HiRocketLaunch className="w-4 h-4" />
              <span>HACKSPORA 2.0 EVALUATION ENGINE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Virtual Round
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Submit your team&apos;s project repositories, demo video link, and presentation slides to enter evaluation for the Grand Finale.
            </p>
          </div>

          {/* Round Status & Countdown Card */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 shrink-0 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Round Status:</span>
              <span className="flex items-center space-x-1 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{config?.isRoundActive ? 'ROUND ACTIVE' : 'ROUND INACTIVE'}</span>
              </span>
            </div>

            <div className="pt-2 border-t border-white/10">
              <span className="text-[11px] text-slate-400 block mb-1">Submission Deadline Countdown:</span>
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-base font-bold text-cyan-300">{timeLeft.days}</span>
                  <span className="text-[9px] block text-slate-500 uppercase">Days</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-base font-bold text-cyan-300">{timeLeft.hours}</span>
                  <span className="text-[9px] block text-slate-500 uppercase">Hours</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-base font-bold text-cyan-300">{timeLeft.minutes}</span>
                  <span className="text-[9px] block text-slate-500 uppercase">Mins</span>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-base font-bold text-cyan-300">{timeLeft.seconds}</span>
                  <span className="text-[9px] block text-slate-500 uppercase">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Eligibility & Action Row */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-semibold">Your Status:</span>
            {getStatusBadge()}
          </div>

          <div>
            {!isSignedIn ? (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4a5cd9] hover:bg-[#5a6ce9] transition-all shadow-md shadow-[#4a5cd9]/30 inline-flex items-center space-x-2"
              >
                <span>Login to Participate</span>
                <HiArrowRight className="w-4 h-4" />
              </Link>
            ) : hasSubmitted ? (
              <button
                onClick={() => setIsViewModalOpen(true)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all inline-flex items-center space-x-2 cursor-pointer"
              >
                <HiEye className="w-4 h-4" />
                <span>View Submission</span>
              </button>
            ) : isEligible && config?.isRoundActive && config?.isAcceptingSubmissions ? (
              <button
                onClick={() => setIsSubmissionModalOpen(true)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#4a5cd9] to-cyan-600 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#4a5cd9]/40 inline-flex items-center space-x-2 cursor-pointer"
              >
                <HiRocketLaunch className="w-4 h-4" />
                <span>Submit Project Now</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic">
                {!isEligible ? 'Team eligibility required' : 'Submissions currently locked'}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. Grid: Submission Requirements & Official Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Submission Requirements (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
            <HiCheckCircle className="w-4 h-4" />
            <span>Submission Checklist</span>
          </div>
          <h3 className="text-xl font-bold text-white">Submission Requirements</h3>

          <ul className="space-y-3 pt-2">
            <li className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 mt-0.5">
                <HiDocumentText className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-sm text-white block">1. Problem Statement Name</strong>
                <p className="text-xs text-slate-400">Select your registered problem statement track or custom problem statement.</p>
              </div>
            </li>

            <li className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
                <HiCodeBracket className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-sm text-white block">2. GitHub Repository Link</strong>
                <p className="text-xs text-slate-400">Provide a working public GitHub link containing full source code and README.</p>
              </div>
            </li>

            <li className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mt-0.5">
                <HiVideoCamera className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-sm text-white block">3. Demo Video Link</strong>
                <p className="text-xs text-slate-400">Submit a 3-5 minute YouTube or Google Drive video link showcasing key features.</p>
              </div>
            </li>

            <li className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                <HiDocumentText className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-sm text-white block">4. PPT / PPTX Presentation Deck</strong>
                <p className="text-xs text-slate-400">Upload your slide presentation (.ppt or .pptx) detailing architecture and scope.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Official Guidelines (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white/[0.04] border border-white/10 space-y-4">
          <div className="flex items-center space-x-2 text-[#8e9dff] text-xs font-bold uppercase">
            <HiShieldCheck className="w-4 h-4" />
            <span>Official Rules & Guidelines</span>
          </div>
          <h3 className="text-xl font-bold text-white">Virtual Round Instructions</h3>

          <div className="space-y-3 pt-2">
            {(config?.guidelines || [
              'Each team must submit a GitHub repository containing clean, documented code and a descriptive README.md.',
              'Submit a 3 to 5 minute video demonstration showcasing your project architecture, features, and live execution.',
              'Presentation slides must be uploaded in .ppt or .pptx format summarizing the problem, solution, technology stack, and future scope.',
              'Only team leaders or registered team members may submit the project on behalf of their team.',
              'Resubmissions or modifications are locked once the submission is under review.',
            ]).map((rule, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300 bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800/60">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4a5cd9]/20 text-[#8e9dff] font-bold text-xs flex items-center justify-center border border-[#4a5cd9]/30">
                  {idx + 1}
                </span>
                <span className="leading-relaxed mt-0.5">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Public Results Showcase Section */}
      <PublicResultsSection />

      {/* Modal: Project Submission */}
      <VirtualSubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        userEmail={userEmail}
        team={team}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
          toast.success('Submission recorded!');
        }}
      />

      {/* Modal: View Submission Details */}
      {isViewModalOpen && submissionData?.submission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#090d16] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h4 className="text-lg font-bold text-white">Your Project Submission</h4>
                <p className="text-xs text-slate-400">{submissionData.submission.teamName} ({submissionData.submission.teamId})</p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-bold text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Problem Statement</span>
                <span className="text-white font-semibold text-sm">{submissionData.submission.problemStatementName}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">GitHub Repository</span>
                <a href={submissionData.submission.githubLink} target="_blank" rel="noreferrer" className="text-cyan-400 underline font-mono">
                  {submissionData.submission.githubLink}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Demo Video URL</span>
                <a href={submissionData.submission.videoLink} target="_blank" rel="noreferrer" className="text-purple-400 underline font-mono">
                  {submissionData.submission.videoLink}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Presentation Deck Link</span>
                <a href={submissionData.submission.pptLink || submissionData.submission.pptFileUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold underline font-mono text-xs">
                  View Presentation ({submissionData.submission.pptLink || submissionData.submission.pptFileUrl})
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Evaluator</span>
                <span className="text-white font-semibold text-xs">
                  {submissionData.submission.evaluatorName ? `Evaluator: ${submissionData.submission.evaluatorName}` : 'Evaluator will be assigned soon'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted Date</span>
                  <span className="text-slate-200">{new Date(submissionData.submission.submittedAt).toLocaleString()}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase text-[10px]">
                  {submissionData.submission.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
