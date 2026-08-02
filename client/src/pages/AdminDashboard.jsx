import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiSquares2X2,
  HiUserGroup,
  HiDocumentText,
  HiRocketLaunch,
  HiMegaphone,
  HiAcademicCap,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
  HiMagnifyingGlass,
  HiCheckBadge,
  HiSparkles,
  HiBuildingLibrary,
  HiUser,
  HiShieldCheck,
  HiCalendar,
} from 'react-icons/hi2';
import { registrationService } from '../services/registrationService';
import { isAdminUser, ADMIN_EMAIL } from '../constants/authConfig';

const adminSidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HiSquares2X2 },
  { id: 'registrations', label: 'Registrations', icon: HiUserGroup },
  { id: 'problem-statements', label: 'Problem Statements', icon: HiDocumentText },
  { id: 'virtual-round', label: 'Virtual Round', icon: HiRocketLaunch },
  { id: 'announcements', label: 'Announcements', icon: HiMegaphone },
  { id: 'certificates', label: 'Certificates', icon: HiAcademicCap },
  { id: 'settings', label: 'Settings', icon: HiCog6Tooth },
];

export default function AdminDashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const hasAccess = isAdminUser(userEmail);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalTeams: 187,
    targetTeams: 250,
    totalParticipants: 748,
    totalColleges: 42,
    latestRegistration: {
      teamName: 'Astra Innovators',
      teamId: 'HS2026-187',
      registeredAt: new Date().toISOString(),
    },
  });

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  // Load Admin Data
  useEffect(() => {
    async function loadAdminData() {
      try {
        const [statsData, teamsRes] = await Promise.all([
          registrationService.getStats(),
          registrationService.getAllRegistrations({
            search: searchTerm,
            college: collegeFilter,
            sort: sortOrder,
          }),
        ]);

        if (statsData) setStats(statsData);
        if (teamsRes?.data) {
          setTeams(teamsRes.data);
          setSelectedTeam((prev) => prev || (teamsRes.data.length > 0 ? teamsRes.data[0] : null));
        }
      } catch (err) {
        console.error('Failed to load admin dashboard data', err);
      }
    }

    if (hasAccess) {
      loadAdminData();
    }
  }, [hasAccess, searchTerm, collegeFilter, sortOrder]);

  const handleLogout = () => {
    signOut(() => navigate('/'));
    toast.success('Admin logged out successfully');
  };

  // Restrict access if not admin email and demo access disabled
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#02040A] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <HiShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          Only administrator <strong className="text-cyan-300">{ADMIN_EMAIL}</strong> is authorized to view the admin control center.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer"
        >
          Return to Home Page
        </button>
      </div>
    );
  }

  // Calculate unique colleges list for filters
  const uniqueColleges = ['All', ...new Set(teams.map((t) => t.collegeName).filter(Boolean))];

  // Render Dashboard Overview Analytics
  const renderDashboardAnalytics = () => (
    <div className="space-y-8">
      {/* Live Registration Progress Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-purple-950/40 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold">
              <HiSparkles className="w-4 h-4" />
              <span>LIVE REGISTRATION TRACKER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {stats.totalTeams} / {stats.targetTeams} Teams Registered
            </h2>
            <p className="text-xs text-slate-300">
              Live registrations across partner universities & engineering colleges.
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-sm font-mono font-bold shrink-0">
            {((stats.totalTeams / stats.targetTeams) * 100).toFixed(1)}% CAPACITY
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="relative w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((stats.totalTeams / stats.targetTeams) * 100, 100)}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 rounded-full shadow-lg shadow-cyan-500/50"
          />
        </div>
      </div>

      {/* Top 4 Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Registered Teams */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between text-cyan-400">
            <HiUserGroup className="w-6 h-6" />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              TEAMS
            </span>
          </div>
          <div className="text-3xl font-black text-white">{stats.totalTeams}</div>
          <span className="text-xs text-slate-400 block">Total Registered Teams</span>
        </div>

        {/* Total Participants */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <HiUser className="w-6 h-6" />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30">
              PARTICIPANTS
            </span>
          </div>
          <div className="text-3xl font-black text-white">{stats.totalParticipants}</div>
          <span className="text-xs text-slate-400 block">Total Hackers & Coders</span>
        </div>

        {/* Total Colleges */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <HiBuildingLibrary className="w-6 h-6" />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">
              INSTITUTIONS
            </span>
          </div>
          <div className="text-3xl font-black text-white">{stats.totalColleges}</div>
          <span className="text-xs text-slate-400 block">Universities & Colleges</span>
        </div>

        {/* Latest Registration */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <HiCalendar className="w-6 h-6" />
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              LATEST
            </span>
          </div>
          <div className="text-lg font-bold text-white truncate">
            {stats.latestRegistration?.teamName || 'Team Astra'}
          </div>
          <span className="text-xs text-cyan-300 font-mono">
            {stats.latestRegistration?.teamId || 'HS2026-187'}
          </span>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white">Registration Management</h3>
          <p className="text-xs text-slate-400">
            Search, inspect, and manage verified squad registrations in real-time.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('registrations')}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer flex items-center space-x-2"
        >
          <span>Open Registrations Panel</span>
          <HiArrowRightOnRectangle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Render Two-Panel Registration Management Page
  const renderRegistrationsManagement = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* LEFT PANEL: Scrollable Team List */}
      <div className="lg:col-span-5 glass-card p-5 rounded-3xl border border-cyan-500/20 shadow-2xl flex flex-col max-h-[800px]">
        {/* Search & Filter Header */}
        <div className="space-y-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">Registered Teams</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              {teams.length} Teams
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Team, Leader, College, ID..."
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
            >
              <option value="All">All Colleges</option>
              {uniqueColleges.filter((c) => c !== 'All').map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Scrollable Team List */}
        <div className="overflow-y-auto flex-1 py-4 space-y-3 pr-1 custom-scrollbar">
          {teams.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-8">No teams found matching search criteria.</p>
          ) : (
            teams.map((team) => {
              const isSelected = selectedTeam?._id === team._id || selectedTeam?.teamId === team.teamId;
              return (
                <div
                  key={team._id || team.teamId}
                  onClick={() => setSelectedTeam(team)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400/60 shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-cyan-300">{team.teamId}</span>
                    <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      <HiCheckBadge className="w-3 h-3" />
                      <span>{team.status || 'Verified'}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{team.teamName}</h4>
                    <p className="text-xs text-slate-400 truncate">Leader: {team.leaderName}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span className="truncate max-w-[180px]">{team.collegeName}</span>
                    <span className="font-mono">{new Date(team.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Selected Team Details View */}
      <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
        {selectedTeam ? (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30">
                    {selectedTeam.teamId}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                    <HiCheckBadge className="w-4 h-4" />
                    <span>Verified</span>
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white mt-2">{selectedTeam.teamName}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  College: <strong className="text-slate-200">{selectedTeam.collegeName}</strong>
                </p>
              </div>

              <div className="text-right text-xs text-slate-400 font-mono">
                <div>Total Members: <strong className="text-cyan-300">{1 + (selectedTeam.members ? selectedTeam.members.length : 0)}</strong></div>
                <div>Registered: {new Date(selectedTeam.createdAt).toLocaleString()}</div>
              </div>
            </div>

            {/* Team Leader Credentials Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Team Leader Details
                </span>
                <span className="text-[10px] font-mono text-cyan-300">👑 Primary Contact</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Full Name</span>
                  <span className="font-bold text-white">{selectedTeam.leaderName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Email</span>
                  <span className="font-mono text-slate-200">{selectedTeam.leaderEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Phone</span>
                  <span className="font-semibold text-slate-200">{selectedTeam.leaderPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">College</span>
                  <span className="font-semibold text-slate-200">{selectedTeam.collegeName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Course & Branch</span>
                  <span className="font-semibold text-slate-200">
                    {selectedTeam.course} - {selectedTeam.branch}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-mono text-[10px]">Year & City</span>
                  <span className="font-semibold text-slate-200">
                    {selectedTeam.year} ({selectedTeam.city}, {selectedTeam.state})
                  </span>
                </div>
              </div>
            </div>

            {/* Members Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Squad Members ({selectedTeam.members ? selectedTeam.members.length : 0})
              </h3>

              {!selectedTeam.members || selectedTeam.members.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No additional team members added.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Email & Phone</th>
                        <th className="py-2.5 px-3">College & Branch</th>
                        <th className="py-2.5 px-3">Year & Location</th>
                        <th className="py-2.5 px-3">GitHub</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {selectedTeam.members.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3 px-3 font-bold text-white">{m.fullName}</td>
                          <td className="py-3 px-3">
                            <div className="text-slate-200 font-mono">{m.email}</div>
                            <div className="text-slate-400">{m.phone}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="text-slate-200 truncate max-w-[160px]">{m.collegeName}</div>
                            <div className="text-slate-400">{m.branch}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-300">
                            <div>{m.year}</div>
                            <div className="text-slate-400">{m.city}, {m.state}</div>
                          </td>
                          <td className="py-3 px-3">
                            <a
                              href={m.github || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline font-mono text-[11px]"
                            >
                              {m.github ? 'Profile' : 'N/A'}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-slate-400">
            Select a team from the left panel to inspect detailed registration credentials.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#02040A] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Admin Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-2">
          {/* Admin Profile Header */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/50 to-indigo-950/50 border border-cyan-500/30 mb-4 space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-black text-base shadow-md shadow-cyan-500/30">
                A
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-black text-white truncate">Admin Panel</h4>
                <span className="text-[11px] text-cyan-300 font-mono block truncate">
                  {ADMIN_EMAIL}
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {adminSidebarItems.map((item) => {
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

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer mt-4"
            >
              <HiArrowRightOnRectangle className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Admin Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && renderDashboardAnalytics()}
            {activeTab === 'registrations' && renderRegistrationsManagement()}
            {activeTab !== 'dashboard' && activeTab !== 'registrations' && (
              <div className="glass-card p-8 rounded-3xl border border-slate-800 text-center space-y-4">
                <HiSparkles className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
                <h3 className="text-xl font-bold text-white capitalize">{activeTab} Control</h3>
                <p className="text-xs text-slate-400">
                  Admin section active for Hackspora 2.0.
                </p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
