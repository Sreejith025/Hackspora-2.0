import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  HiSparkles,
  HiArrowRight,
  HiCheck,
  HiClock,
} from 'react-icons/hi2';
import { registrationService } from '../services/registrationService';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HiSquares2X2 },
  { id: 'my-team', label: 'My Team', icon: HiUserGroup },
  { id: 'problem-statements', label: 'Problem Statements', icon: HiDocumentText },
  { id: 'virtual-round', label: 'Virtual Round', icon: HiRocketLaunch },
  { id: 'announcements', label: 'Announcements', icon: HiMegaphone },
  { id: 'profile', label: 'Profile', icon: HiUser },
  { id: 'settings', label: 'Settings', icon: HiCog6Tooth },
];

export default function ParticipantDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  const userEmail = user?.primaryEmailAddress?.emailAddress || 'abisri024@gmail.com';
  const userName = user?.fullName || 'Participant';

  const [activeTab, setActiveTab] = useState('dashboard');
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    async function loadTeam() {
      try {
        const team = await registrationService.getMyTeam(userEmail);
        setTeamData(team);
      } catch (err) {
        console.error('Failed to load team data', err);
      }
    }
    loadTeam();
  }, [userEmail]);

  // Default fallback mock team if no team found yet
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
    members: [
      {
        fullName: 'Priya Sharma',
        email: 'priya.s@gmail.com',
        phone: '+91 9876543211',
        github: 'https://github.com/priyasharma',
        collegeName: 'Anna University',
        course: 'B.Tech',
        branch: 'Information Technology',
        year: '4th Year',
        city: 'Chennai',
        state: 'Tamil Nadu',
      },
      {
        fullName: 'Rohan Verma',
        email: 'rohan.v@gmail.com',
        phone: '+91 9876543212',
        github: 'https://github.com/rohanv',
        collegeName: 'Anna University',
        course: 'B.Tech',
        branch: 'Computer Science',
        year: '3rd Year',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
      },
    ],
  };

  const totalMembersCount = 1 + (displayTeam.members ? displayTeam.members.length : 0);

  // Timeline events definition
  const timelineEvents = [
    { label: 'Account Created', status: 'completed' },
    { label: 'Registration Completed', status: 'completed' },
    { label: 'Registration Verified', status: 'completed' },
    { label: 'Problem Statements', status: 'locked' },
    { label: 'Virtual Round', status: 'upcoming' },
    { label: 'Results', status: 'upcoming' },
  ];

  const renderDashboardTab = () => (
    <div className="space-y-8">
      {/* Top Welcome Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-purple-950/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-cyan-400 text-xs font-mono font-bold">
            <HiSparkles className="w-4 h-4" />
            <span>STUDENT HACKATHON HUB</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {displayTeam.leaderName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Registered Squad: <strong className="text-cyan-300 font-bold">{displayTeam.teamName}</strong> ({displayTeam.teamId})
          </p>
        </div>

        <button
          onClick={() => setActiveTab('virtual-round')}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-105 transition-all shadow-lg shadow-cyan-500/25 shrink-0 cursor-pointer"
        >
          <span>Virtual Round Info</span>
          <HiArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Registration Status */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Registration Status</span>
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="flex items-center space-x-3 pt-1">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <HiCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{displayTeam.status || 'Verified'}</div>
              <span className="text-xs text-cyan-300 font-mono">Auto-Verified</span>
            </div>
          </div>
        </div>

        {/* Card 2: Team ID */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Team ID</span>
            <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              HS2026
            </span>
          </div>
          <div className="pt-1">
            <div className="text-2xl font-black font-mono text-cyan-300 tracking-wider">
              {displayTeam.teamId}
            </div>
            <span className="text-xs text-slate-400">{displayTeam.teamName}</span>
          </div>
        </div>

        {/* Card 3: Members */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Squad Members</span>
            <span className="text-xs text-slate-400 font-mono">Max 5</span>
          </div>
          <div className="flex items-center space-x-3 pt-1">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <HiUserGroup className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{totalMembersCount} Members</div>
              <span className="text-xs text-slate-400">Leader + {displayTeam.members ? displayTeam.members.length : 0} Members</span>
            </div>
          </div>
        </div>

        {/* Card 4: Problem Statements */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Problem Statements</span>
            <HiLockClosed className="w-4 h-4 text-amber-400" />
          </div>
          <div className="pt-1 space-y-1">
            <div className="text-lg font-bold text-amber-400 flex items-center space-x-1.5">
              <span>Locked until released</span>
            </div>
            <p className="text-xs text-slate-400">
              Statements unlock when the admin publishes them.
            </p>
          </div>
        </div>

        {/* Card 5: Virtual Round */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Virtual Round</span>
            <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">
              STAGE 1
            </span>
          </div>
          <div className="pt-1">
            <div className="text-xl font-black text-white flex items-center space-x-2">
              <HiClock className="w-5 h-5 text-cyan-400" />
              <span>Upcoming</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">24-Hour online coding round</p>
          </div>
        </div>

        {/* Card 6: Announcements */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Announcements</span>
            <HiMegaphone className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="pt-1">
            <div className="text-sm font-bold text-white">Welcome to Hackspora 2.0</div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              Registration is verified. Prepare for problem statement releases!
            </p>
          </div>
        </div>
      </div>

      {/* Beautiful Timeline Component */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/20 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-black text-white">Hackathon Milestone Timeline</h3>
            <p className="text-xs text-slate-400">Track your journey through Hackspora 2.0</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            STAGE 3 / 6
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {timelineEvents.map((evt, idx) => {
            const isDone = evt.status === 'completed';
            const isLocked = evt.status === 'locked';
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                  isDone
                    ? 'bg-cyan-950/20 border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                    : isLocked
                    ? 'bg-amber-950/10 border-amber-500/30'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    0{idx + 1}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isDone
                        ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30'
                        : isLocked
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isDone ? (
                      <HiCheck className="w-4 h-4 stroke-[3]" />
                    ) : isLocked ? (
                      <HiLockClosed className="w-3.5 h-3.5" />
                    ) : (
                      <span>○</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className={`text-xs font-bold ${isDone ? 'text-white' : 'text-slate-400'}`}>
                    {evt.label}
                  </h4>
                  <span
                    className={`text-[10px] font-mono block ${
                      isDone ? 'text-cyan-300' : isLocked ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  >
                    {isDone ? 'Completed' : isLocked ? 'Locked' : 'Upcoming'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMyTeamTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white">My Squad • {displayTeam.teamName}</h2>
          <p className="text-xs text-slate-400">Team ID: {displayTeam.teamId}</p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold w-fit">
          {totalMembersCount} Members Registered
        </span>
      </div>

      {/* Leader Card */}
      <div className="glass-card p-6 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-purple-950/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-cyan-500/30">
              {displayTeam.leaderName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{displayTeam.leaderName}</h3>
              <p className="text-xs text-cyan-300 font-mono">{displayTeam.leaderEmail}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold">
            👑 Team Leader
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block uppercase font-mono text-[10px]">Phone</span>
            <span className="font-semibold text-slate-200">{displayTeam.leaderPhone}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-mono text-[10px]">College</span>
            <span className="font-semibold text-slate-200">{displayTeam.collegeName}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-mono text-[10px]">Branch & Year</span>
            <span className="font-semibold text-slate-200">
              {displayTeam.branch} ({displayTeam.year})
            </span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-mono text-[10px]">Location</span>
            <span className="font-semibold text-slate-200">
              {displayTeam.city}, {displayTeam.state}
            </span>
          </div>
        </div>
      </div>

      {/* Members Cards */}
      <h3 className="text-lg font-bold text-white pt-2">Additional Squad Members</h3>
      {displayTeam.members && displayTeam.members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayTeam.members.map((m, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-sm border border-slate-700">
                  {m.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{m.fullName}</h4>
                  <p className="text-xs text-slate-400 font-mono">{m.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px]">Phone</span>
                  <span className="text-slate-300">{m.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px]">GitHub</span>
                  <a
                    href={m.github || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline truncate block"
                  >
                    {m.github ? 'GitHub Profile' : 'N/A'}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px]">College</span>
                  <span className="text-slate-300 truncate block">{m.collegeName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px]">Branch & Year</span>
                  <span className="text-slate-300">
                    {m.branch} ({m.year})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No additional team members added.</p>
      )}
    </div>
  );

  const renderProblemStatementsTab = () => (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-8 border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900/90 to-purple-950/20 text-center space-y-4 max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/50">
          <HiLockClosed className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Problem Statements Are Locked
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Problem statements remain locked until released by the Hackspora 2.0 admin committee. Check back soon when the countdown timer reaches zero!
        </p>
        <button
          onClick={() => navigate('/problem-statements')}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer inline-flex items-center space-x-2"
        >
          <span>View Public Problem Page</span>
          <HiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#02040A] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-2">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 flex items-center justify-center font-black text-base shadow-md">
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-white truncate">{userName}</h4>
                <span className="text-[11px] text-cyan-300 font-mono block truncate">
                  {displayTeam.teamId}
                </span>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border-l-4 border-cyan-400 shadow-md shadow-cyan-950/40'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Institutional Info & AIDS Logo under Left Sidebar Navbar */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2.5 mt-4 shadow-xl">
            <div className="flex items-center space-x-2.5">
              <img
                src="/logos/aids.jpg"
                alt="AIDS Logo"
                className="h-8 w-auto rounded-lg object-contain bg-white p-0.5 border border-cyan-500/30 shrink-0"
              />
              <div className="text-xs font-bold text-white leading-tight">
                KARPAGAM ACADEMY OF HIGHER EDUCATION
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
              (Deemed to be University) (Established Under Section 3 of UGC Act, 1956) Accredited with A+ Grade by NAAC in the Second cycle, Pollachi Main Road, Eachanari Post, Coimbatore-641 021.INDIA
            </p>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && renderDashboardTab()}
            {activeTab === 'my-team' && renderMyTeamTab()}
            {activeTab === 'problem-statements' && renderProblemStatementsTab()}
            {activeTab !== 'dashboard' &&
              activeTab !== 'my-team' &&
              activeTab !== 'problem-statements' && (
                <div className="glass-card p-8 rounded-3xl border border-slate-800 text-center space-y-4">
                  <HiSparkles className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-white capitalize">{activeTab} Module</h3>
                  <p className="text-xs text-slate-400">
                    This section is active and ready for your Hackspora 2.0 workflow.
                  </p>
                </div>
              )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
