import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
 HiCheck,
 HiClock,
 HiCalendarDays,
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

const PROBLEM_UNLOCK_TARGET = new Date('2026-08-23T09:30:00');

// Small accent pill (replaces the previous cyan-500/10 chips).
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

 // Countdown to problem-statement release.
 const [problemUnlockLeft, setProblemUnlockLeft] = useState(() => {
   const diff = PROBLEM_UNLOCK_TARGET - new Date();
   if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
   return {
     days: Math.floor(diff / (1000 * 60 * 60 * 24)),
     hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
     minutes: Math.floor((diff / 1000 / 60) % 60),
     seconds: Math.floor((diff / 1000) % 60),
   };
 });

 useEffect(() => {
   const tick = () => {
     const diff = PROBLEM_UNLOCK_TARGET - new Date();
     if (diff <= 0) {
       setProblemUnlockLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
       return;
     }
     setProblemUnlockLeft({
       days: Math.floor(diff / (1000 * 60 * 60 * 24)),
       hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
       minutes: Math.floor((diff / 1000 / 60) % 60),
       seconds: Math.floor((diff / 1000) % 60),
     });
   };
   const id = setInterval(tick, 1000);
   return () => clearInterval(id);
 }, []);

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
 <span className="text-xs text-white/70">Auto-Verified</span>
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
 <HiLockClosed className="w-4 h-4 text-amber-400" />
 </div>
 <div className="pt-1 space-y-1">
 <div className="text-lg font-bold text-amber-400 flex items-center space-x-1.5">
 <span>Locked until released</span>
 </div>
 <p className="text-xs text-white/70">
 Statements unlock when the admin publishes them.
 </p>
 </div>
 </GlassCard>

 {/* Card 5: Virtual Round */}
 <GlassCard className="p-6 space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-white/70 uppercase">Virtual Round</span>
 <AccentPill>STAGE 1</AccentPill>
 </div>
 <div className="pt-1">
 <div className="text-xl font-black text-white flex items-center space-x-2">
 <HiClock className="w-5 h-5 text-white" />
 <span>Upcoming</span>
 </div>
 <p className="text-xs text-white/70 mt-1">7-Hour online coding round</p>
 </div>
 </GlassCard>

 {/* Card 6: Announcements */}
 <GlassCard className="p-6 space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-white/70 uppercase">Announcements</span>
 <HiMegaphone className="w-4 h-4 text-white" />
 </div>
 <div className="pt-1">
 <div className="text-sm font-bold text-white">Welcome to Hackspora 2.0</div>
 <p className="text-xs text-white/70 mt-0.5 truncate">
 Registration is verified. Prepare for problem statement releases!
 </p>
 </div>
 </GlassCard>
 </div>

 {/* Beautiful Timeline Component */}
 <GlassCard className="p-6 sm:p-8 space-y-6" hoverable={false}>
 <div className="flex items-center justify-between pb-4 border-b border-white/15">
 <div>
 <h3 className="text-xl font-black text-white">Hackathon Milestone Timeline</h3>
 <p className="text-xs text-white/70">Track your journey through Hackspora 2.0</p>
 </div>
 <AccentPill>STAGE 3 / 6</AccentPill>
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
 <AccentPill className="px-3.5 py-1.5 self-start sm:self-auto">{totalMembersCount} Members Registered</AccentPill>
 </div>

 {/* Leader Card */}
 <GlassCard className="p-5 sm:p-6 space-y-4" hoverable={false}>
 <div className="flex items-start sm:items-center justify-between border-b border-white/15 pb-3 gap-3 flex-col sm:flex-row">
 <div className="flex items-center space-x-3">
 <div className="w-12 h-12 rounded-2xl bg-[#4a5cd9] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-[#4a5cd9]/30 shrink-0">
 {displayTeam.leaderName.charAt(0)}
 </div>
 <div className="min-w-0">
 <h3 className="text-base sm:text-lg font-bold text-white truncate">{displayTeam.leaderName}</h3>
 <p className="text-xs text-white/70 truncate">{displayTeam.leaderEmail}</p>
 </div>
 </div>
 <AccentPill>👑 Team Leader</AccentPill>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
 <div className="min-w-0">
 <span className="text-white/60 block uppercase text-[10px]">Phone</span>
 <span className="font-semibold text-white break-words">{displayTeam.leaderPhone}</span>
 </div>
 <div className="min-w-0">
 <span className="text-white/60 block uppercase text-[10px]">College</span>
 <span className="font-semibold text-white break-words">{displayTeam.collegeName}</span>
 </div>
 <div className="min-w-0">
 <span className="text-white/60 block uppercase text-[10px]">Branch & Year</span>
 <span className="font-semibold text-white break-words">
 {displayTeam.branch} ({displayTeam.year})
 </span>
 </div>
 <div className="min-w-0">
 <span className="text-white/60 block uppercase text-[10px]">Location</span>
 <span className="font-semibold text-white break-words">
 {displayTeam.city}, {displayTeam.state}
 </span>
 </div>
 </div>
 </GlassCard>

 {/* Members Cards */}
 <h3 className="text-base sm:text-lg font-bold text-white pt-2">Additional Squad Members</h3>
 {displayTeam.members && displayTeam.members.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
 {displayTeam.members.map((m, idx) => (
 <GlassCard key={idx} className="p-6 space-y-3">
 <div className="flex items-center space-x-3 pb-3 border-b border-white/15">
 <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-sm border border-white/15">
 {m.fullName.charAt(0)}
 </div>
 <div>
 <h4 className="text-base font-bold text-white">{m.fullName}</h4>
 <p className="text-xs text-white/70">{m.email}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-2 text-xs">
 <div>
 <span className="text-white/60 block uppercase text-[10px]">Phone</span>
 <span className="text-white">{m.phone}</span>
 </div>
 <div>
 <span className="text-white/60 block uppercase text-[10px]">GitHub</span>
 <a
 href={m.github || '#'}
 target="_blank"
 rel="noreferrer"
 className="text-[#aeb5ff] hover:text-white hover:underline truncate block"
 >
 {m.github ? 'GitHub Profile' : 'N/A'}
 </a>
 </div>
 <div>
 <span className="text-white/60 block uppercase text-[10px]">College</span>
 <span className="text-white truncate block">{m.collegeName}</span>
 </div>
 <div>
 <span className="text-white/60 block uppercase text-[10px]">Branch & Year</span>
 <span className="text-white">
 {m.branch} ({m.year})
 </span>
 </div>
 </div>
 </GlassCard>
 ))}
 </div>
 ) : (
 <p className="text-xs text-white/70 italic">No additional team members added.</p>
 )}
 </div>
 );

 const renderProblemStatementsTab = () => (
 <div className="space-y-5 sm:space-y-6 max-w-2xl mx-auto my-6 sm:my-8">
 {/* Locked Card */}
 <GlassCard className="p-6 sm:p-8 text-center space-y-5 sm:space-y-6" hoverable={false}>
 <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/50">
 <HiLockClosed className="w-7 h-7 sm:w-8 sm:h-8" />
 </div>
 <div className="space-y-2">
 <h2 className="text-xl sm:text-3xl font-black text-white">
 Problem Statements Are Locked
 </h2>
 <p className="text-[11px] sm:text-sm text-white/70 leading-relaxed">
 Problem statements will be released on{' '}
 <strong className="text-white">23 August 2026 at 09:30 AM</strong>. The
 countdown below ticks down to the unlock moment.
 </p>
 </div>
 </GlassCard>

 {/* Countdown Timer (separate card below) */}
 <GlassCard className="p-5 sm:p-8 text-center space-y-4 sm:space-y-5" hoverable={false}>
 <div className="flex items-center justify-center gap-2 text-white/80 pb-3 sm:pb-4">
 <HiCalendarDays className="w-4 h-4 text-white/70" />
 <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest">
 Problem Statements Unlock In
 </span>
 </div>
 <div className="grid grid-cols-4 gap-2 sm:gap-3">
 {[
 { label: 'Days', value: problemUnlockLeft.days },
 { label: 'Hours', value: problemUnlockLeft.hours },
 { label: 'Minutes', value: problemUnlockLeft.minutes },
 { label: 'Seconds', value: problemUnlockLeft.seconds },
 ].map((unit) => (
 <div
 key={unit.label}
 className="min-w-[64px] rounded-xl border border-white/15 bg-white/95 px-3 py-2.5 text-center shadow-sm"
 >
 <div className="relative flex h-10 items-center justify-center overflow-hidden">
 <AnimatePresence mode="popLayout">
 <motion.span
 key={unit.value}
 initial={{ y: -12, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 12, opacity: 0 }}
 transition={{ duration: 0.25, ease: 'easeOut' }}
 className="text-2xl font-black tracking-tight text-slate-950"
 >
 {String(unit.value).padStart(2, '0')}
 </motion.span>
 </AnimatePresence>
 </div>
 <span className="mt-1 block text-[9px] font-extrabold uppercase tracking-wide text-slate-500">
 {unit.label}
 </span>
 </div>
 ))}
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
 {activeTab !== 'dashboard' &&
 activeTab !== 'my-team' &&
 activeTab !== 'problem-statements' && (
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
 </div>
 );
}
