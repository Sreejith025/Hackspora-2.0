import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import {
  HiSquares2X2,
  HiUserGroup,
  HiDocumentText,
  HiRocketLaunch,
  HiMegaphone,
  HiUser,
  HiCog6Tooth,
  HiCheckCircle,
  HiLockClosed,
  HiClock,
  HiCheck,
  HiTrophy,
  HiEye,
} from 'react-icons/hi2';
import { registrationService } from '../services/registrationService';
import { virtualRoundService } from '../services/virtualRoundService';
import VirtualSubmissionModal from '../features/virtualRound/components/VirtualSubmissionModal';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HiSquares2X2 },
  { id: 'my-team', label: 'My Team', icon: HiUserGroup },
  { id: 'problem-statements', label: 'Problem Statements', icon: HiDocumentText },
  { id: 'virtual-round', label: 'Virtual Round', icon: HiRocketLaunch },
  { id: 'announcements', label: 'Announcements', icon: HiMegaphone },
  { id: 'profile', label: 'Profile', icon: HiUser },
  { id: 'settings', label: 'Settings', icon: HiCog6Tooth },
];

// About-style glass card — re-used across every surface.
function GlassCard({ className = '', children, hoverable = true }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/25 bg-white/[0.12] backdrop-blur-2xl shadow-2xl shadow-black/25 transition-all duration-300 ${
        hoverable ? 'hover:border-white/40 hover:bg-white/[0.16]' : ''
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80" />
      <div className="relative">{children}</div>
    </div>
  );
}

function AccentPill({ children, className = '' }) {
  return (
    <span
      className={`px-3 py-1 rounded-full bg-[#4a5cd9]/15 border border-[#4a5cd9]/40 text-[#aeb5ff] text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}

export default function ParticipantDashboard() {
  const { user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress || 'abisri024@gmail.com';
  const userName = user?.fullName || 'Participant';

  const [activeTab, setActiveTab] = useState('dashboard');
  const [teamData, setTeamData] = useState(null);
  const [vrData, setVrData] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [publishedProblems, setPublishedProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [vrConfig, setVrConfig] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        setLoadingProblems(true);
        const [team, vrRes, psRes, configRes] = await Promise.all([
          registrationService.getMyTeam(userEmail).catch(() => null),
          userEmail ? virtualRoundService.getMySubmission(userEmail).catch(() => null) : Promise.resolve(null),
          virtualRoundService.getPublishedProblemStatements().catch(() => null),
          virtualRoundService.getRoundConfig().catch(() => null),
        ]);
        if (!ignore) {
          if (team) setTeamData(team);
          if (vrRes?.success) setVrData(vrRes);
          if (psRes?.success && Array.isArray(psRes.data)) setPublishedProblems(psRes.data);
          if (configRes?.success) setVrConfig(configRes.data || configRes);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (!ignore) setLoadingProblems(false);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, [userEmail, refreshKey]);

  // Default fallback team if no team found yet
  const displayTeam = teamData || {
    teamId: 'HS2026-001',
    teamName: 'Galaxy Coders',
    leaderName: userName,
    leaderEmail: userEmail,
    leaderPhone: '+91 9876543210',
    collegeName: 'Anna University',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    year: '4th Year',
    city: 'Chennai',
    state: 'Tamil Nadu',
    status: 'Verified',
    members: [],
  };

  const totalMembersCount = 1 + (displayTeam.members ? displayTeam.members.length : 0);

  const vrStatus = vrData?.virtualRoundStatus || 'registered';
  const hasSubmitted = !!vrData?.submission;
  const isEligible = vrData?.isEligible || displayTeam.status === 'Verified';

  const hasPublishedProblems = publishedProblems && publishedProblems.length > 0;

  // Timeline events definition
  const timelineEvents = [
    { label: 'Account Created', status: 'completed' },
    { label: 'Registration Completed', status: 'completed' },
    { label: 'Registration Verified', status: 'completed' },
    { label: 'Problem Statements', status: hasPublishedProblems ? 'completed' : 'upcoming' },
    { label: 'Virtual Round', status: hasSubmitted ? 'completed' : 'active' },
    { label: 'Grand Finale Results', status: vrStatus === 'shortlisted' ? 'completed' : 'upcoming' },
  ];

  const renderDashboardTab = () => (
    <div className="space-y-8">
      {/* Top Welcome Card */}
      <GlassCard className="p-6 sm:p-8 space-y-3">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-[#aeb5ff] text-xs font-bold">
            <span>STUDENT HACKATHON HUB</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {displayTeam.leaderName}!
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Registered Squad: <strong className="text-white font-bold">{displayTeam.teamName}</strong> ({displayTeam.teamId})
          </p>
        </div>
      </GlassCard>

      {/* Grid Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Registration Status */}
        <GlassCard className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/70 uppercase">Registration Status</span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#4a5cd9] animate-ping" />
          </div>
          <div className="flex items-center space-x-3 pt-1">
            <div className="p-3 rounded-2xl bg-[#4a5cd9]/15 border border-[#4a5cd9]/40 text-[#aeb5ff]">
              <HiCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{displayTeam.status || 'Verified'}</div>
              <span className="text-xs text-white/70">Verified Squad</span>
            </div>
          </div>
        </GlassCard>

        {/* Card 2: Team ID */}
        <GlassCard className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/70 uppercase">Team ID</span>
            <AccentPill>HS2026</AccentPill>
          </div>
          <div className="pt-1">
            <div className="text-2xl font-black text-white tracking-wider">
              {displayTeam.teamId}
            </div>
            <span className="text-xs text-white/70">{displayTeam.teamName}</span>
          </div>
        </GlassCard>

        {/* Card 3: Members */}
        <GlassCard className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/70 uppercase">Squad Members</span>
            <span className="text-xs text-white/70">Max 5</span>
          </div>
          <div className="flex items-center space-x-3 pt-1">
            <div className="p-3 rounded-2xl bg-[#4a5cd9]/15 border border-[#4a5cd9]/40 text-[#aeb5ff]">
              <HiUserGroup className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{totalMembersCount} Members</div>
              <span className="text-xs text-white/70">Leader + {displayTeam.members ? displayTeam.members.length : 0} Members</span>
            </div>
          </div>
        </GlassCard>

        {/* Card 4: Problem Statements */}
        <GlassCard className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/70 uppercase">Problem Statements</span>
            {hasPublishedProblems ? (
              <HiCheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <HiClock className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="pt-1 space-y-1">
            <div className={`text-lg font-bold flex items-center space-x-1.5 ${hasPublishedProblems ? 'text-emerald-400' : 'text-amber-400'}`}>
              <span>{hasPublishedProblems ? 'Tracks Unlocked' : 'Not Released Yet'}</span>
            </div>
            <p className="text-xs text-white/70">
              {hasPublishedProblems
                ? 'Problem statements are active for submission.'
                : 'Problem statements will be released soon by the admin.'}
            </p>
          </div>
        </GlassCard>

        {/* Card 5: Virtual Round */}
        <GlassCard className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/70 uppercase">Virtual Round</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              vrStatus === 'shortlisted'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : vrStatus === 'submitted'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : vrStatus === 'under_review'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'bg-[#4a5cd9]/20 text-white border border-[#4a5cd9]/40'
            }`}>
              {vrStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="pt-1 space-y-2">
            <div className="text-xl font-black text-white flex items-center space-x-2">
              <HiRocketLaunch className="w-5 h-5 text-cyan-400" />
              <span className="capitalize">{vrStatus === 'submitted' ? 'Submission Received' : vrStatus.replace('_', ' ')}</span>
            </div>
            
            {hasSubmitted ? (
              <button
                onClick={() => setIsViewModalOpen(true)}
                className="w-full py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <HiEye className="w-4 h-4" />
                <span>View Submission</span>
              </button>
            ) : isEligible ? (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full py-2 rounded-xl text-xs font-bold text-white bg-[#4a5cd9] hover:bg-[#5a6ce9] transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shadow-[#4a5cd9]/30"
              >
                <HiRocketLaunch className="w-4 h-4" />
                <span>Submit Project</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 italic">Eligibility Verification Pending</p>
            )}
          </div>
        </GlassCard>

        {/* Card 6: Announcements */}
        <GlassCard className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/70 uppercase">Announcements</span>
            <HiMegaphone className="w-4 h-4 text-white" />
          </div>
          <div className="pt-1">
            <div className="text-sm font-bold text-white">Virtual Round is Live</div>
            <p className="text-xs text-white/70 mt-0.5 truncate">
              Submit your GitHub repo, demo video, and presentation slides!
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Timeline Component */}
      <GlassCard className="p-6 sm:p-8 space-y-6" hoverable={false}>
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <div>
            <h3 className="text-xl font-black text-white">Hackathon Milestone Timeline</h3>
            <p className="text-xs text-white/70">Track your journey through Hackspora 2.0</p>
          </div>
          <AccentPill>STAGE 5 / 6</AccentPill>
        </div>

        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {timelineEvents.map((evt, idx) => {
            const isDone = evt.status === 'completed';
            const isLocked = evt.status === 'locked';
            return (
              <div
                key={idx}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col justify-between space-y-2 sm:space-y-3 transition-all ${
                  isDone
                    ? 'bg-[#4a5cd9]/15 border-[#4a5cd9]/50 shadow-lg shadow-[#4a5cd9]/20'
                    : isLocked
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-white/5 border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/60 uppercase">
                    0{idx + 1}
                  </span>
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isDone
                        ? 'bg-[#4a5cd9] text-white shadow-md shadow-[#4a5cd9]/30'
                        : isLocked
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-white/10 text-white/60 border border-white/15'
                    }`}
                  >
                    {isDone ? (
                      <HiCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    ) : isLocked ? (
                      <HiLockClosed className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    ) : (
                      <span>○</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className={`text-[11px] sm:text-xs font-bold leading-tight ${isDone ? 'text-white' : 'text-white/70'}`}>
                    {evt.label}
                  </h4>
                  <span
                    className={`text-[10px] block ${
                      isDone ? 'text-[#aeb5ff]' : isLocked ? 'text-amber-400' : 'text-white/50'
                    }`}
                  >
                    {isDone ? 'Completed' : isLocked ? 'Locked' : 'Upcoming'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );

  const renderMyTeamTab = () => (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/15 pb-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black text-white">My Squad • {displayTeam.teamName}</h2>
          <p className="text-xs text-white/70">Team ID: {displayTeam.teamId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-6 space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Team Leader</h4>
          <div className="space-y-1 text-xs text-slate-300">
            <p><strong className="text-white">Name:</strong> {displayTeam.leaderName}</p>
            <p><strong className="text-white">Email:</strong> {displayTeam.leaderEmail}</p>
            <p><strong className="text-white">College:</strong> {displayTeam.collegeName}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Members ({displayTeam.members ? displayTeam.members.length : 0})</h4>
          <div className="space-y-2 text-xs text-slate-300">
            {(displayTeam.members || []).map((m, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/10">
                <p className="font-semibold text-white">{m.fullName}</p>
                <p className="text-slate-400">{m.email}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const renderProblemStatementsTab = () => (
    <div className="space-y-6">
      <GlassCard className="p-6 sm:p-8 space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <HiDocumentText className="w-4 h-4" />
          <span>Hackspora 2.0 Track Statements</span>
        </div>
        <h3 className="text-2xl font-black text-white">Problem Statements</h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Review live published problem statements for Hackspora 2.0. Select your chosen problem statement track when submitting your project deck in the Virtual Round.
        </p>
      </GlassCard>

      {loadingProblems ? (
        <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading published problem statements...</span>
        </div>
      ) : publishedProblems.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3">
          <HiDocumentText className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-white">No Problem Statements Published Yet</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Problem briefs are currently being configured by hackathon administrators. Once published, they will automatically appear here.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedProblems.map((ps) => (
            <GlassCard key={ps._id} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider block">
                      Published Track
                    </span>
                    <h4 className="text-lg font-bold text-white tracking-tight">{ps.name}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    Live
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{ps.description}</p>
                {ps.link && (
                  <a
                    href={ps.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline inline-flex items-center space-x-1 font-mono pt-1"
                  >
                    <span>Reference Link: {ps.link}</span>
                  </a>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );

  const renderVirtualRoundTab = () => (
    <div className="space-y-6">
      {/* Shortlisted Celebration Banner */}
      {vrStatus === 'shortlisted' && (
        <GlassCard className="p-6 sm:p-8 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-slate-900 border-emerald-500/40 space-y-4">
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
        </GlassCard>
      )}

      {/* Rejected Status Respectful Outcome Message */}
      {vrStatus === 'rejected' && (
        <GlassCard className="p-6 bg-slate-900/90 border-slate-800 space-y-2">
          <h4 className="text-base font-bold text-white">Evaluation Completed</h4>
          <p className="text-xs text-slate-400">
            Thank you for participating in Hackspora 2.0 Virtual Round. While your team was not selected for the final shortlist this time, we commend your innovation and hard work.
          </p>
        </GlassCard>
      )}

      {/* Virtual Round Status Overview Card */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
              <HiRocketLaunch className="w-4 h-4" />
              <span>Virtual Round Status</span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">Project Evaluation Portal</h3>
          </div>

          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 self-start sm:self-auto">
            Status: {vrStatus.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Squad ID</span>
            <p className="text-base font-bold text-white font-mono">{displayTeam.teamId}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Eligibility</span>
            <p className="text-base font-bold text-emerald-400">{isEligible ? 'Eligible for Virtual Round' : 'Under Verification'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Evaluator</span>
            <p className="text-base font-bold text-cyan-300">
              {displayTeam.evaluatorName || vrData?.team?.evaluatorName || vrData?.submission?.evaluatorName || 'Evaluator will be assigned soon'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-2">
          {hasSubmitted ? (
            <button
              onClick={() => setIsViewModalOpen(true)}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all cursor-pointer flex items-center space-x-2 shadow-lg shadow-cyan-600/30"
            >
              <HiEye className="w-4 h-4" />
              <span>View My Submission</span>
            </button>
          ) : isEligible ? (
            (vrConfig && (vrConfig.submissionOpen === false || vrConfig.isAcceptingSubmissions === false)) ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-3 w-full">
                <HiLockClosed className="w-5 h-5 shrink-0 text-rose-400" />
                <div>
                  <span className="font-bold text-sm text-white block">🔒 Virtual Round submissions are currently closed.</span>
                  <span className="text-slate-300">Please wait until the admin opens submissions.</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#4a5cd9] hover:bg-[#5a6ce9] transition-all cursor-pointer flex items-center space-x-2 shadow-lg shadow-[#4a5cd9]/30"
              >
                <HiRocketLaunch className="w-4 h-4" />
                <span>Submit Project Now</span>
              </button>
            )
          ) : null}
        </div>
      </GlassCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-20 sm:pt-24 pb-16 px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-2">
          <GlassCard className="p-3 sm:p-4 mb-3 sm:mb-4" hoverable={false}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#4a5cd9] text-white flex items-center justify-center font-black text-base shadow-md shadow-[#4a5cd9]/30 shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-white truncate">{userName}</h4>
                <span className="text-[11px] text-white/70 block truncate">
                  {displayTeam.teamId}
                </span>
              </div>
            </div>
          </GlassCard>

          <nav className="space-y-1 flex lg:flex-col gap-1 overflow-x-auto scrollbar-thin pb-2 lg:pb-0">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap touch-manipulation ${
                    isActive
                      ? 'bg-[#4a5cd9]/20 text-white border-l-4 border-[#4a5cd9] shadow-md shadow-[#4a5cd9]/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && renderDashboardTab()}
            {activeTab === 'my-team' && renderMyTeamTab()}
            {activeTab === 'problem-statements' && renderProblemStatementsTab()}
            {activeTab === 'virtual-round' && renderVirtualRoundTab()}
            {activeTab !== 'dashboard' &&
              activeTab !== 'my-team' &&
              activeTab !== 'problem-statements' &&
              activeTab !== 'virtual-round' && (
                <GlassCard className="p-8 text-center space-y-4" hoverable={false}>
                  <h3 className="text-xl font-bold text-white capitalize">{activeTab} Module</h3>
                  <p className="text-xs text-white/70">
                    This section is active and ready for your Hackspora 2.0 workflow.
                  </p>
                </GlassCard>
              )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modal: Project Submission */}
      <VirtualSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        userEmail={userEmail}
        team={displayTeam}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />

      {/* Modal: View Submission */}
      {isViewModalOpen && vrData?.submission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#090d16] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h4 className="text-lg font-bold text-white">Your Project Submission</h4>
                <p className="text-xs text-slate-400">{vrData.submission.teamName} ({vrData.submission.teamId})</p>
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
                <span className="text-white font-semibold text-sm">{vrData.submission.problemStatementName}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">GitHub Repository</span>
                <a href={vrData.submission.githubLink} target="_blank" rel="noreferrer" className="text-cyan-400 underline font-mono">
                  {vrData.submission.githubLink}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Demo Video URL</span>
                <a href={vrData.submission.videoLink} target="_blank" rel="noreferrer" className="text-purple-400 underline font-mono">
                  {vrData.submission.videoLink}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Presentation Deck Link</span>
                <a href={vrData.submission.pptLink || vrData.submission.pptFileUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold underline font-mono text-xs">
                  View Presentation ({vrData.submission.pptLink || vrData.submission.pptFileUrl})
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Evaluator</span>
                <span className="text-white font-semibold text-xs">
                  {vrData.submission.evaluatorName ? `Evaluator: ${vrData.submission.evaluatorName}` : 'Evaluator will be assigned soon'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted At</span>
                  <span className="text-slate-200">{new Date(vrData.submission.submittedAt).toLocaleString()}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase text-[10px]">
                  {vrData.submission.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
