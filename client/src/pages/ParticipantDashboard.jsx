import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  HiSquares2X2,
  HiUserGroup,
  HiDocumentText,
  HiRocketLaunch,
  HiMegaphone,
  HiCheckCircle,
  HiXCircle,
  HiMinusCircle,
  HiClock,
  HiCheck,
  HiLockClosed,
  HiArrowPath,
  HiUser,
  HiArrowTopRightOnSquare,
  HiClipboardDocument,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { registrationService } from '../services/registrationService';
import { virtualRoundService } from '../services/virtualRoundService';
import { announcementService } from '../services/announcementService';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HiSquares2X2 },
  { id: 'my-team', label: 'My Team', icon: HiUserGroup },
  { id: 'problem-statements', label: 'Problem Statements', icon: HiDocumentText },
  { id: 'announcements', label: 'Announcements', icon: HiMegaphone },
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
  const [refreshKey, setRefreshKey] = useState(0);

  const [publishedProblems, setPublishedProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(false);

  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        setLoadingProblems(true);
        setLoadingAnnouncements(true);
        const [team, vrRes, psRes, annRes] = await Promise.all([
          registrationService.getMyTeam(userEmail).catch(() => null),
          userEmail ? virtualRoundService.getMySubmission(userEmail).catch(() => null) : Promise.resolve(null),
          virtualRoundService.getPublishedProblemStatements().catch(() => null),
          announcementService.getPublishedAnnouncements().catch(() => null),
        ]);
        if (!ignore) {
          if (team) setTeamData(team);
          if (vrRes?.success) setVrData(vrRes);
          if (psRes?.success && Array.isArray(psRes.data)) setPublishedProblems(psRes.data);
          if (annRes?.success && Array.isArray(annRes.data)) setAnnouncements(annRes.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (!ignore) {
          setLoadingProblems(false);
          setLoadingAnnouncements(false);
        }
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

  const assignedMentorName = vrData?.team?.evaluatorName || displayTeam.evaluatorName || null;
  const assignedMentorLink = vrData?.team?.mentorLink || displayTeam.mentorLink || '';

  const vrStatus = vrData?.virtualRoundStatus || 'registered';
  const hasSubmitted = !!vrData?.submission;
  const isEligible = vrData?.isEligible || displayTeam.status === 'Verified';

  const hasPublishedProblems = publishedProblems && publishedProblems.length > 0;

  // Timeline events definition
  const timelineEvents = [
    { label: 'Account Created', status: 'completed' },
    { label: 'Registration Completed', status: 'completed' },
    { label: 'Registration Verified', status: displayTeam.status === 'Verified' ? 'completed' : 'upcoming' },
    { label: 'Problem Statements', status: hasPublishedProblems ? 'completed' : 'upcoming' },
    { label: 'Virtual Round', status: hasSubmitted ? 'completed' : isEligible ? 'active' : 'locked' },
    { label: 'Grand Finale Results', status: vrStatus === 'shortlisted' ? 'completed' : 'upcoming' },
  ];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const renderDashboardTab = () => (
    <div className="space-y-8">
      {/* Top Welcome Card */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 text-[#aeb5ff] text-xs font-bold">
              <span>STUDENT HACKATHON HUB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Welcome back, {displayTeam.leaderName || userName}!
            </h2>
            <p className="text-xs sm:text-sm text-white/70">
              Registered Squad: <strong className="text-white font-bold">{displayTeam.teamName || 'My Team'}</strong> ({displayTeam.teamId || 'N/A'})
            </p>
          </div>

          {/* WhatsApp Group QR Code Box */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 shadow-lg shrink-0">
            <img
              src="/Qr whatsapp/qr1.jpg"
              alt="WhatsApp Group QR Code"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-contain bg-white p-1 border border-emerald-400/40 shadow-md shrink-0"
            />
            <div className="text-center sm:text-left space-y-1 max-w-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Official Squad Chat
              </span>
              <p className="text-xs font-bold text-white leading-tight">
                Join this WhatsApp group
              </p>
              <p className="text-[11px] text-emerald-200/70 leading-tight">
                Scan QR code for instant updates & announcements. Only for Team Leaders
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="self-center lg:self-auto inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 active:scale-95 cursor-pointer shrink-0"
          >
            <HiArrowPath className={`w-4 h-4 ${loadingProblems ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </GlassCard>

      {/* Grid Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Registration Status */}
        <GlassCard className="p-6 space-y-3">
          {(() => {
            const status = (displayTeam.status || 'Pending').toLowerCase();
            const isVerified = status === 'verified';
            const isRejected = status === 'rejected';
            const isPending = !isVerified && !isRejected;

            const StatusIcon = isVerified
              ? HiCheckCircle
              : isRejected
              ? HiXCircle
              : HiMinusCircle;

            const accentText = isVerified
              ? 'text-emerald-300'
              : isRejected
              ? 'text-rose-300'
              : 'text-amber-300';

            const accentBg = isVerified
              ? 'bg-emerald-500/15 border-emerald-500/40'
              : isRejected
              ? 'bg-rose-500/15 border-rose-500/40'
              : 'bg-amber-500/15 border-amber-500/40';

            const subtitle = isVerified
              ? 'Verified Squad'
              : isRejected
              ? 'Registration Rejected'
              : isPending
              ? 'Verification Pending'
              : 'Status Unknown';

            const symbol = isVerified
              ? '✓'
              : isRejected
              ? '✗'
              : '—';

            return (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/70 uppercase">Registration Status</span>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <div className={`p-3 rounded-2xl border ${accentBg} ${accentText}`}>
                    <StatusIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white flex items-center space-x-2">
                      <span>{symbol}</span>
                      <span>{displayTeam.status || 'Pending'}</span>
                    </div>
                    <span className="text-xs text-white/70">{subtitle}</span>
                  </div>
                </div>
              </>
            );
          })()}
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
                : isEligible
                ? 'bg-[#4a5cd9]/20 text-white border border-[#4a5cd9]/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {isEligible ? vrStatus.replace('_', ' ') : 'Pending Verification'}
            </span>
          </div>

          <div className="pt-1 space-y-2">
            <div className="text-xl font-black text-white flex items-center space-x-2">
              <HiRocketLaunch className="w-5 h-5 text-cyan-400" />
              <span className="capitalize">{vrStatus === 'submitted' ? 'Submission Received' : vrStatus.replace('_', ' ')}</span>
            </div>

            <Link
              to="/virtual-round"
              className="group/cta relative w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl font-bold text-xs text-white bg-[#3645bf] hover:bg-[#4a5cd9] active:scale-95 transition-all duration-300 cursor-pointer shadow-xl shadow-[#3645bf]/40 hover:shadow-2xl hover:shadow-[#3645bf]/60 overflow-hidden touch-manipulation"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative flex items-center justify-center space-x-2">
                <HiRocketLaunch className="w-4 h-4" />
                <span>Open Virtual Round</span>
              </span>
            </Link>
          </div>
        </GlassCard>

        {/* Card 6: Announcements */}
        <GlassCard className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/70 uppercase">Announcements</span>
            <HiMegaphone className="w-4 h-4 text-white" />
          </div>
          <div className="pt-1">
            {loadingAnnouncements ? (
              <div className="flex items-center space-x-2 py-1">
                <div className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-white/70">Loading...</span>
              </div>
            ) : announcements.length > 0 ? (
              <>
                <div className="text-sm font-bold text-white truncate">
                  {announcements[0].title}
                </div>
                <p className="text-xs text-white/70 mt-0.5 truncate">
                  {announcements[0].message}
                </p>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className="text-[11px] font-bold text-[#aeb5ff] hover:underline mt-2 inline-block cursor-pointer"
                >
                  View All ({announcements.length}) →
                </button>
              </>
            ) : (
              <>
                <div className="text-sm font-bold text-white">No New Announcements</div>
                <p className="text-xs text-white/70 mt-0.5 truncate">
                  Stay tuned for official updates from organizers.
                </p>
              </>
            )}
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
        {/* Mentor Card */}
        <GlassCard className="p-6 space-y-4 md:col-span-2" hoverable={false}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <HiUser className="w-4 h-4 text-emerald-400" />
              <span>Assigned Squad Mentor & WhatsApp Group</span>
            </div>
            <span className="text-[11px] text-white/60 font-semibold">Team Mentorship Hub</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-white/60 font-medium uppercase block">Mentor Name</span>
              <div className="text-lg font-black text-white flex items-center space-x-2">
                <span className={assignedMentorName ? 'text-emerald-400' : 'text-slate-400 italic font-normal text-sm'}>
                  {assignedMentorName || 'Not Assigned Yet'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-white/60 font-medium uppercase block">Mentor WhatsApp Group Link</span>
              {assignedMentorLink ? (
                <div className="flex items-center space-x-2">
                  <a
                    href={/^https?:\/\//i.test(assignedMentorLink) ? assignedMentorLink : `https://${assignedMentorLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <HiArrowTopRightOnSquare className="w-4 h-4" />
                    <span>Join WhatsApp Group</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(assignedMentorLink);
                      toast.success('Copied WhatsApp group link!');
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs hover:bg-white/20 transition-all cursor-pointer flex items-center space-x-1"
                    title="Copy WhatsApp Group Link"
                  >
                    <HiClipboardDocument className="w-4 h-4 text-cyan-300" />
                    <span>Copy Link</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-amber-300 font-semibold italic bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl inline-block">
                  Mentor WhatsApp link will be provided soon.
                </p>
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Team Leader</h4>
          <div className="space-y-1 text-xs text-slate-300">
            <p><strong className="text-white">Name:</strong> {displayTeam.leaderName || userName}</p>
            <p><strong className="text-white">Email:</strong> {displayTeam.leaderEmail || userEmail}</p>
            <p><strong className="text-white">Phone:</strong> {displayTeam.leaderPhone || 'N/A'}</p>
            <p><strong className="text-white">College:</strong> {displayTeam.collegeName || 'N/A'}</p>
            <p><strong className="text-white">Department:</strong> {displayTeam.branch || displayTeam.department || 'N/A'}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Members ({displayTeam.members ? displayTeam.members.length : 0})</h4>
          <div className="space-y-2 text-xs text-slate-300">
            {(displayTeam.members || []).length === 0 ? (
              <p className="text-white/50 italic">No additional squad members added.</p>
            ) : (
              (displayTeam.members || []).map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                  <p className="font-semibold text-white">{m?.fullName || `Member ${idx + 1}`}</p>
                  <p className="text-slate-400">{m?.email || 'No email provided'}</p>
                  {m?.phone && <p className="text-slate-500 text-[11px]">Phone: {m.phone}</p>}
                </div>
              ))
            )}
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
          {publishedProblems.map((ps, idx) => (
            <GlassCard key={ps._id || ps.id || idx} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider block">
                      Published Track
                    </span>
                    <h4 className="text-lg font-bold text-white tracking-tight">{ps.name || ps.title}</h4>
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

  const renderAnnouncementsTab = () => (
    <div className="space-y-6">
      <GlassCard className="p-6 sm:p-8 space-y-3" hoverable={false}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#aeb5ff] font-bold text-xs uppercase tracking-wider">
            <HiMegaphone className="w-4 h-4 text-amber-400" />
            <span>Hackathon Notifications</span>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loadingAnnouncements}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition-all cursor-pointer"
            title="Refresh announcements"
          >
            <HiArrowPath className={`w-4 h-4 ${loadingAnnouncements ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <h3 className="text-2xl font-black text-white">Latest Announcements</h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Stay updated with official announcements, deadlines, and guidelines for Hackspora 2.0.
        </p>
      </GlassCard>

      {loadingAnnouncements ? (
        <GlassCard className="p-12 text-center space-y-3" hoverable={false}>
          <div className="w-8 h-8 border-2 border-[#4a5cd9] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-white/70">Fetching live announcements from organizers...</p>
        </GlassCard>
      ) : announcements.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3" hoverable={false}>
          <HiMegaphone className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-white">No Announcements Posted Yet</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Official announcements, updates, and news will appear here when broadcasted by the organizers.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <GlassCard key={item._id || item.id} className="p-6 space-y-3" hoverable={true}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${
                      item.type === 'urgent'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : item.type === 'update'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : item.type === 'event'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {item.type || 'General'}
                  </span>
                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                </div>
                <span className="text-[11px] text-white/60">
                  {new Date(item.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {item.message}
              </p>

              {item.link && (
                <div className="pt-2">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#4a5cd9]/30 border border-[#4a5cd9]/50 text-xs font-bold text-[#aeb5ff] hover:bg-[#4a5cd9]/50 hover:text-white transition-all"
                  >
                    <span>View Resource Link</span>
                    <span className="text-xs">→</span>
                  </a>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-20 sm:pt-24 pb-16 px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-2">
          <GlassCard className="p-3.5 sm:p-4 mb-3 sm:mb-4 space-y-3" hoverable={false}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#4a5cd9] text-white flex items-center justify-center font-black text-base shadow-md shadow-[#4a5cd9]/30 shrink-0">
                {(displayTeam.leaderName || userName || 'P').charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-white truncate">{displayTeam.leaderName || userName}</h4>
                <span className="text-[11px] text-white/70 block truncate">
                  {displayTeam.teamId}
                </span>
              </div>
            </div>

            {/* WhatsApp Group Quick Badge */}
            <div className="pt-2.5 border-t border-white/10 flex items-center space-x-2.5">
              <img
                src="/Qr whatsapp/qr1.jpg"
                alt="WhatsApp Group QR Code"
                className="w-11 h-11 rounded-lg object-contain bg-white p-0.5 border border-emerald-400/40 shrink-0 shadow"
              />
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold text-emerald-300 block truncate">
                  Join this WhatsApp group
                </span>
                <span className="text-[10px] text-white/60 block truncate">Scan QR for official updates</span>
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
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && renderDashboardTab()}
              {activeTab === 'my-team' && renderMyTeamTab()}
              {activeTab === 'problem-statements' && renderProblemStatementsTab()}
              {activeTab === 'announcements' && renderAnnouncementsTab()}
              {activeTab !== 'dashboard' &&
                activeTab !== 'my-team' &&
                activeTab !== 'problem-statements' &&
                activeTab !== 'announcements' && (
                  <GlassCard className="p-8 text-center space-y-4" hoverable={false}>
                    <h3 className="text-xl font-bold text-white capitalize">{activeTab} Module</h3>
                    <p className="text-xs text-white/70">
                      This section is active and ready for your Hackspora 2.0 workflow.
                    </p>
                  </GlassCard>
                )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
