import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  HiTrophy,
  HiLockClosed,
  HiClock,
  HiXMark,
  HiPencilSquare,
  HiArrowDownTray,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { virtualRoundService } from '../services/virtualRoundService';
import VirtualSubmissionModal from '../features/virtualRound/components/VirtualSubmissionModal';
import PublicResultsSection from '../features/virtualRound/components/PublicResultsSection';
import { downloadSubmissionPDF } from '../utils/submissionPdfGenerator';

// Reusable button styles — match the "Download Brochure" CTA so the page reads as one design system.
const ctaButtonClass =
  'group/cta relative inline-flex items-center justify-center space-x-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-[#3645bf] hover:bg-[#4a5cd9] active:scale-95 transition-all duration-300 cursor-pointer shadow-xl shadow-[#3645bf]/40 hover:shadow-2xl hover:shadow-[#3645bf]/60 overflow-hidden touch-manipulation';
const ctaShimmer =
  'pointer-events-none absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent';

// Primary CTA button with the Download Brochure shimmer effect.
function PrimaryButton({ children, className = '', onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${ctaButtonClass} ${className}`}
    >
      <span className={ctaShimmer} />
      <span className="relative flex items-center justify-center space-x-2.5">
        {children}
      </span>
    </button>
  );
}

export default function VirtualRound() {
  const { isSignedIn, user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';

  const [config, setConfig] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Time remaining countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let ignore = false;
    async function init() {
      setIsLoading(true);
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
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [isSignedIn, userEmail, refreshKey]);

  // Countdown timer effect
  useEffect(() => {
    // Fixed deadline: August 23rd, 2026 at 09:30 AM (IST)
    const deadline = new Date('2026-08-23T09:30:00+05:30');

    const tick = () => {
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
  }, []);

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
          <span className="px-3 py-1 rounded-full bg-[#4a5cd9]/20 border border-[#4a5cd9]/40 text-[#8e9dff] text-xs font-bold">
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
        className="p-6 sm:p-10 space-y-6"
      >
        <div className="relative space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl pb-2 md:pb-0">
            <div className="flex items-center space-x-2 text-[#8e9dff] text-xs font-bold uppercase tracking-widest">
              <HiRocketLaunch className="w-4 h-4" />
              <span>HACKSPORA 2.0 EVALUATION ENGINE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Virtual Round
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pb-4">
              Submit your team&apos;s project repositories, demo video link, and presentation slides to enter evaluation for the Grand Finale.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pb-4">
              Step into a high-energy 24-hour coding experience designed for builders, thinkers, and innovators. From the moment the challenge is announced, your team will brainstorm, design, develop, and deliver a solution that demonstrates both technical ability and creativity.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              No matter whether you are starting your development journey or already building projects, this hackathon gives you a platform to learn, collaborate, test your limits, and showcase what you can create.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="w-full lg:w-auto shrink-0 glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2.5 text-white mb-3 sm:mb-4">
              <HiClock className="w-5 h-5 sm:w-6 sm:h-6 text-[#b77611]" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white/90">
                Round Starts in
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 xs:gap-2 sm:gap-4 text-center w-full max-w-full">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="px-1 py-2 sm:px-4 sm:py-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col items-center justify-center min-w-0"
                >
                  <div className="relative flex h-8 xs:h-10 sm:h-14 items-center justify-center overflow-hidden w-full">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={unit.value}
                        initial={{ y: -16, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 16, opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="text-xl xs:text-2xl sm:text-4xl font-black tracking-tight text-white font-mono"
                      >
                        {String(unit.value).padStart(2, '0')}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="mt-1 sm:mt-2 block text-[9px] xs:text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-white/60 truncate w-full">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Eligibility & Action Row */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-semibold">Your Status:</span>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-[#4a5cd9] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-400">Loading...</span>
              </div>
            ) : (
              getStatusBadge()
            )}
          </div>

          <div>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-[#4a5cd9] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-400">Loading...</span>
              </div>
            ) : !isSignedIn ? (
              <Link to="/login" className={ctaButtonClass}>
                <span className={ctaShimmer} />
                <span className="relative flex items-center justify-center space-x-2.5">
                  <span>Login to Participate</span>
                  <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </span>
              </Link>
            ) : hasSubmitted ? (
              <div className="flex flex-wrap items-center gap-3">
                <PrimaryButton onClick={() => setIsViewModalOpen(true)}>
                  <HiEye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span>View Submission</span>
                </PrimaryButton>

                <PrimaryButton onClick={() => downloadSubmissionPDF(submissionData?.submission)}>
                  <HiArrowDownTray className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span>Download Submission PDF</span>
                </PrimaryButton>

                {config && (config.submissionOpen === false || config.isAcceptingSubmissions === false) ? (
                  <button
                    disabled
                    className="group/cta relative inline-flex items-center justify-center space-x-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-slate-400 bg-slate-800/60 border border-slate-700/60 opacity-60 cursor-not-allowed"
                    title="Submissions are currently locked by Admin"
                  >
                    <HiLockClosed className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                    <span>Update Submission (Locked)</span>
                  </button>
                ) : (
                  <PrimaryButton onClick={() => setIsSubmissionModalOpen(true)}>
                    <HiPencilSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span>Update Submission</span>
                  </PrimaryButton>
                )}
              </div>
            ) : isEligible && config?.isRoundActive && config?.isAcceptingSubmissions ? (
              <PrimaryButton onClick={() => setIsSubmissionModalOpen(true)}>
                <HiRocketLaunch className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span>Submit Project Now</span>
              </PrimaryButton>
            ) : (
              <span className="text-xs text-slate-400 italic">
                {!isEligible ? 'Team eligibility required' : 'Submissions currently locked'}
              </span>
            )}
          </div>
        </div>
        </div>
      </motion.div>

      {/* Shortlisted Celebration Banner */}
      {virtualStatus === 'shortlisted' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-emerald-500/40 p-6 sm:p-8 space-y-4"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-emerald-400 font-bold text-xs uppercase tracking-widest">
              <HiTrophy className="w-6 h-6" />
              <span>CONGRATULATIONS! GRAND FINALE QUALIFIER</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Your Team is Shortlisted for the Grand Finale!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your project submission has passed the evaluation criteria of the Hackspora 2.0 Virtual Round. Prepare your physical demonstration and final pitch deck for the Grand Finale on campus!
            </p>
          </div>
        </motion.div>
      )}

      {/* Rejected Status Respectful Outcome Message */}
      {virtualStatus === 'rejected' && (
        <div className="p-6 space-y-2">
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white">Evaluation Completed</h4>
            <p className="text-xs text-slate-400">
              Thank you for participating in Hackspora 2.0 Virtual Round. While your team was not selected for the final shortlist this time, we commend your innovation and hard work.
            </p>
          </div>
        </div>
      )}

      {/* Virtual Round Status Overview Card */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-[#8e9dff] text-xs font-bold uppercase">
                <HiRocketLaunch className="w-4 h-4" />
                <span>Virtual Round Status</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-1">Project Evaluation Portal</h3>
            </div>

            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#4a5cd9]/20 text-[#8e9dff] border border-[#4a5cd9]/40 self-start sm:self-auto">
              Status: {virtualStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Squad ID</span>
              <p className="text-base font-bold text-white font-mono">{team?.teamId || '—'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Eligibility</span>
              <p className="text-base font-bold text-emerald-400">
                {isEligible ? 'Eligible for Virtual Round' : 'Under Verification'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Evaluator</span>
              <p className="text-base font-bold text-[#8e9dff]">
                {submissionData?.submission?.evaluatorName || team?.evaluatorName || 'Evaluator will be assigned soon'}
              </p>
            </div>
          </div>

          {/* Submissions Locked Notice */}
          {isSignedIn &&
            !hasSubmitted &&
            isEligible &&
            config &&
            (config.submissionOpen === false || config.isAcceptingSubmissions === false) && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-3 w-full">
                <HiLockClosed className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <span className="font-bold text-sm text-white block">🔒 Virtual Round submissions are currently closed.</span>
                  <span className="text-slate-300">Please wait until the admin opens submissions.</span>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* 2. Grid: Submission Requirements & Official Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Submission Requirements (5 Cols) */}
        <div className="lg:col-span-5 p-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#8e9dff] text-xs font-bold uppercase">
              <HiCheckCircle className="w-4 h-4" />
              <span>Submission Checklist</span>
            </div>
            <h3 className="text-xl font-bold text-white">Submission Requirements</h3>

            <ul className="space-y-3 pt-2">
              <li className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-[#4a5cd9]/10 text-[#8e9dff] mt-0.5">
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
        </div>

        {/* Official Guidelines (7 Cols) */}
        <div className="lg:col-span-7 p-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#8e9dff] text-xs font-bold uppercase">
              <HiShieldCheck className="w-4 h-4" />
              <span>Official Rules & Guidelines</span>
            </div>
            <h3 className="text-xl font-bold text-white">Virtual Round Instructions</h3>

            <div className="space-y-3 pt-2">
              {(config?.guidelines || [
                'Each team must submit a GitHub repository containing clean, documented code and a descriptive README.md file.',
                'Submit a 3 to 5 minute video demonstration showcasing your project architecture, features, and live execution.',
                'Presentation slides must be uploaded in .ppt or .pptx format summarizing the problem, solution, technology stack, and future scope.',
                'Teams will be assigned dedicated evaluators/mentors, and their respective GitHub IDs will be provided for collaboration.',
                'Team leaders are required to add their assigned evaluators as GitHub collaborators to their project repositories.',
                'Only team leaders or registered team members may submit the project on behalf of their team.',
                'Resubmissions or modifications are not permitted once the submission is under review.',
                'The jury\'s decision is final and binding for all participants.',
                'All participants are requested to strictly follow the guidelines outlined above.',
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
      </div>

      {/* Development Guidelines Section */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-[#4a5cd9] text-xs font-bold uppercase">
            <HiShieldCheck className="w-4 h-4" />
            <span>Development Guidelines</span>
          </div>
          <h3 className="text-xl font-bold text-white">Project Best Practices</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Essential Requirements */}
            <div className="space-y-3">
              <h4 className="text-base font-bold text-[#4a5cd9] uppercase tracking-wider flex items-center gap-2">
                <HiCheckCircle className="w-4 h-4" />
                Essential Requirements
              </h4>
              <ul className="space-y-2">
                <li className="text-sm sm:text-base text-slate-300 flex items-start gap-2">
                  <span className="text-[#4a5cd9] mt-1">•</span>
                  <span>Clean, well-documented code with comments explaining complex logic</span>
                </li>
                <li className="text-sm sm:text-base text-slate-300 flex items-start gap-2">
                  <span className="text-[#4a5cd9] mt-1">•</span>
                  <span>Responsive design that works across different screen sizes</span>
                </li>
                <li className="text-sm sm:text-base text-slate-300 flex items-start gap-2">
                  <span className="text-[#4a5cd9] mt-1">•</span>
                  <span>Proper error handling and user-friendly error messages</span>
                </li>
                <li className="text-sm sm:text-base text-slate-300 flex items-start gap-2">
                  <span className="text-[#4a5cd9] mt-1">•</span>
                  <span>Complete README with setup instructions and dependencies</span>
                </li>
                <li className="text-sm sm:text-base text-slate-300 flex items-start gap-2">
                  <span className="text-[#4a5cd9] mt-1">•</span>
                  <span>Functional core features that demonstrate the solution</span>
                </li>
              </ul>
            </div>

            {/* Value-Add Features */}
            <div className="space-y-3">
              <h4 className="text-base font-bold text-[#4a5cd9] uppercase tracking-wider flex items-center gap-2">
                <HiTrophy className="w-4 h-4" />
                Value-Add Features
              </h4>
              <ul className="space-y-2">
                <li className="text-sm sm:text-base text-slate-300 flex items-start gap-2">
                  <span className="text-[#4a5cd9] mt-1">•</span>
                  <span>Additional features beyond the basic requirements</span>
                </li>
                <li className="text-sm sm:text-base text-slate-300 flex items-start gap-2">
                  <span className="text-[#4a5cd9] mt-1">•</span>
                  <span>Optimized performance and fast load times</span>
                </li>
                <li className="text-sm sm:text-base text-slate-300 flex items-start gap-2">
                  <span className="text-[#4a5cd9] mt-1">•</span>
                  <span>Advanced UI/UX with smooth animations and transitions</span>
                </li>
                <li className="text-sm sm:text-base text-slate-300 flex items-start gap-2">
                  <span className="text-[#4a5cd9] mt-1">•</span>
                  <span>Unit tests or integration tests where applicable</span>
                </li>
                <li className="text-sm sm:text-base text-slate-300 flex items-start gap-2">
                  <span className="text-[#4a5cd9] mt-1">•</span>
                  <span>Deployment-ready configuration and live demo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Prizes Section */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-[#8e9dff] text-xs font-bold uppercase">
            <HiTrophy className="w-4 h-4" />
            <span>Prizes & Rewards</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">Employment & Prizes Await the Winners!</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* 1st Prize */}
            <div className="relative p-6 rounded-2xl bg-white/[0.05] backdrop-blur-xl space-y-4 hover:bg-white/[0.08] transition-all duration-300">
              <div className="absolute top-4 right-4 text-yellow-400">
                <HiTrophy className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-wider">
                <span className="text-lg">🥇</span>
                <span>1st Prize</span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-black text-white">₹10,000</div>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>Internship Offer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>Certificates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>Gift Hampers</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* First Runner Up */}
            <div className="relative p-6 rounded-2xl bg-white/[0.05] backdrop-blur-xl space-y-4 hover:bg-white/[0.08] transition-all duration-300">
              <div className="absolute top-4 right-4 text-slate-300">
                <HiTrophy className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
                <span className="text-lg">🥈</span>
                <span>First Runner Up</span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-black text-white">₹7,000</div>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">•</span>
                    <span>Internship Offer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">•</span>
                    <span>Certificates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">•</span>
                    <span>Gift Hampers</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 2nd Runner Up */}
            <div className="relative p-6 rounded-2xl bg-white/[0.05] backdrop-blur-xl space-y-4 hover:bg-white/[0.08] transition-all duration-300">
              <div className="absolute top-4 right-4 text-orange-400">
                <HiTrophy className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
                <span className="text-lg">🥉</span>
                <span>2nd Runner Up</span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-black text-white">₹5,000</div>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-orange-400">•</span>
                    <span>Certificates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Public Results Showcase Section */}
      <PublicResultsSection />

      {/* Modal: Project Submission / Update */}
      <VirtualSubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        userEmail={userEmail}
        team={team}
        existingSubmission={submissionData?.submission}
        isUpdate={hasSubmitted}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
          toast.success(hasSubmitted ? 'Submission updated successfully!' : 'Submission recorded!');
        }}
      />

      {/* Modal: View Submission Details */}
      {isViewModalOpen && submissionData?.submission && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="group relative w-full max-w-xl rounded-2xl sm:rounded-3xl border border-white/25 bg-white/[0.04] backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden my-8"
            >
              {/* Subtle gradient highlight on top-left for depth */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

              {/* Modal Header */}
              <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white/15 border border-white/25 text-white shadow-lg shadow-black/20 backdrop-blur-xl">
                    <HiEye className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white tracking-tight">Your Project Submission</h4>
                    <p className="text-xs text-slate-400">{submissionData.submission.teamName} ({submissionData.submission.teamId})</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadSubmissionPDF(submissionData.submission)}
                    className="px-3.5 py-2 rounded-xl bg-[#3645bf] hover:bg-[#4a5cd9] text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
                    title="Download Submission PDF"
                  >
                    <HiArrowDownTray className="w-4 h-4 text-white" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    aria-label="Close"
                    className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/10 border border-white/15 hover:border-white/30 hover:bg-white/15 transition-all cursor-pointer"
                  >
                    <HiXMark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="relative p-6 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Problem Statement</span>
                  <span className="text-white font-semibold text-sm">{submissionData.submission.problemStatementName}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">GitHub Repository</span>
                  <a href={submissionData.submission.githubLink} target="_blank" rel="noreferrer" className="text-[#8e9dff] underline font-mono">
                    {submissionData.submission.githubLink}
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Demo Video URL</span>
                  <a href={submissionData.submission.videoLink} target="_blank" rel="noreferrer" className="text-purple-400 underline font-mono">
                    {submissionData.submission.videoLink}
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Presentation Deck Link</span>
                  <a href={submissionData.submission.pptLink || submissionData.submission.pptFileUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold underline font-mono text-xs">
                    View Presentation ({submissionData.submission.pptLink || submissionData.submission.pptFileUrl})
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Evaluator</span>
                  <span className="text-white font-semibold text-xs">
                    {submissionData.submission.evaluatorName ? `Evaluator: ${submissionData.submission.evaluatorName}` : 'Evaluator will be assigned soon'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted Date</span>
                    <span className="text-slate-200">{new Date(submissionData.submission.submittedAt).toLocaleString()}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#4a5cd9]/20 text-[#8e9dff] font-bold uppercase text-[10px]">
                    {submissionData.submission.status}
                  </span>
                </div>

                {/* Footer Action for Updating Submission */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Need to modify your links?
                  </span>
                  {config && (config.submissionOpen === false || config.isAcceptingSubmissions === false) ? (
                    <span className="text-xs text-rose-400 font-semibold flex items-center space-x-1">
                      <HiLockClosed className="w-3.5 h-3.5" />
                      <span>Submissions Locked</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        setIsSubmissionModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#3645bf] hover:bg-[#4a5cd9] text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                    >
                      <HiPencilSquare className="w-4 h-4" />
                      <span>Update Submission</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
