import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import {
  HiUsers,
  HiUserGroup,
  HiCheckBadge,
  HiClock,
  HiXCircle,
  HiCalendar,
  HiChartBar,
  HiBuildingLibrary,
  HiMagnifyingGlass,
  HiFunnel,
  HiArrowPath,
  HiArrowDownTray,
  HiPlus,
  HiEye,
  HiPencilSquare,
  HiTrash,
  HiXMark,
  HiDocumentText,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiSparkles,
  HiArrowTopRightOnSquare,
} from 'react-icons/hi2';
import { registrationService } from '../../../services/registrationService';

export default function AdminRegistrationManagement() {
  // Main Data States
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalParticipants: 0,
    verifiedTeams: 0,
    pendingTeams: 0,
    rejectedTeams: 0,
    todayRegistrations: 0,
    avgTeamSize: '0',
    topCollege: 'N/A',
  });
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  // Multi-Selection States
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // UI States (Drawer, Modals, Dropdowns)
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingTeamData, setEditingTeamData] = useState(null);

  const downloadMenuRef = useRef(null);

  // Close download dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) {
        setIsDownloadMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Data Function (Supports silent background refetch)
  const fetchData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [statsRes, teamsRes] = await Promise.all([
        registrationService.getStats(),
        registrationService.getAllRegistrations({ search: '', college: 'All', sort: 'newest' }),
      ]);

      if (statsRes) setStats(statsRes);
      if (teamsRes?.data) setTeams(teamsRes.data);
    } catch (err) {
      console.error('Failed to load registrations from MongoDB:', err);
      if (!isSilent) toast.error('Failed to load registration data from MongoDB.');
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      registrationService.getStats(),
      registrationService.getAllRegistrations({ search: '', college: 'All', sort: 'newest' }),
    ])
      .then(([statsRes, teamsRes]) => {
        if (!isMounted) return;
        if (statsRes) setStats(statsRes);
        if (teamsRes?.data) setTeams(teamsRes.data);
      })
      .catch((err) => {
        console.error('Failed to load registrations from MongoDB:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Socket.IO Real-time Synchronization
    const rawApiUrl =
      import.meta.env.VITE_API_URL ||
      (import.meta.env.PROD ? 'https://hackspora-2-0.onrender.com/api/registrations' : '/api/registrations');
    const backendUrl = rawApiUrl.startsWith('http')
      ? rawApiUrl.replace(/\/api\/registrations\/?$/, '')
      : window.location.origin;
    const socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[SOCKET.IO] Admin Dashboard connected for real-time registration sync.');
    });

    socket.on('new_registration', (newTeam) => {
      toast.success(`⚡ New team registered: ${newTeam.teamName} (${newTeam.teamId})`);
      fetchData(true);
    });

    socket.on('registration_updated', () => {
      fetchData(true);
    });

    socket.on('registration_deleted', () => {
      fetchData(true);
    });

    // 5-second automatic background polling refetch
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);


  // Derived Filter Options
  const uniqueColleges = useMemo(() => {
    const set = new Set(teams.map((t) => t.collegeName).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [teams]);

  const uniqueDepts = useMemo(() => {
    const set = new Set(teams.map((t) => t.branch).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [teams]);

  // Filtered & Sorted Teams
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // Search check
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const matchTeam = team.teamId?.toLowerCase().includes(q) || team.teamName?.toLowerCase().includes(q);
        const matchLeader = team.leaderName?.toLowerCase().includes(q) || team.leaderEmail?.toLowerCase().includes(q) || team.leaderPhone?.includes(q);
        const matchCollege = team.collegeName?.toLowerCase().includes(q) || team.branch?.toLowerCase().includes(q);
        const matchMembers = team.members?.some((m) => m.fullName?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q));
        if (!matchTeam && !matchLeader && !matchCollege && !matchMembers) return false;
      }

      // College check
      if (collegeFilter !== 'All' && team.collegeName !== collegeFilter) return false;

      // Department check
      if (deptFilter !== 'All' && team.branch !== deptFilter) return false;

      // Year check
      if (yearFilter !== 'All' && team.year !== yearFilter) return false;

      // Status check
      if (statusFilter !== 'All' && (team.status || 'Verified') !== statusFilter) return false;

      // Date check
      if (dateFilter !== 'All' && team.createdAt) {
        const regDate = new Date(team.createdAt);
        const now = new Date();
        if (dateFilter === 'Today') {
          if (regDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === '7Days') {
          const diffDays = (now - regDate) / (1000 * 3600 * 24);
          if (diffDays > 7) return false;
        } else if (dateFilter === '30Days') {
          const diffDays = (now - regDate) / (1000 * 3600 * 24);
          if (diffDays > 30) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === 'teamName') return a.teamName.localeCompare(b.teamName);
      if (sortOrder === 'college') return a.collegeName.localeCompare(b.collegeName);
      if (sortOrder === 'size') return (b.members?.length || 0) - (a.members?.length || 0);
      return 0;
    });
  }, [teams, searchTerm, collegeFilter, deptFilter, yearFilter, statusFilter, dateFilter, sortOrder]);

  // Paginated Teams
  const totalPages = Math.ceil(filteredTeams.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTeams = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredTeams.slice(start, start + pageSize);
  }, [filteredTeams, safePage, pageSize]);

  // Checkbox Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedTeams.map((t) => t._id || t.teamId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Status Badge Helper
  const renderStatusBadge = (status = 'Verified') => {
    if (status === 'Verified') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
          <HiCheckBadge className="w-3.5 h-3.5" />
          <span>Verified</span>
        </span>
      );
    }
    if (status === 'Pending') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold">
          <HiClock className="w-3.5 h-3.5" />
          <span>Pending</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-mono font-bold">
        <HiXCircle className="w-3.5 h-3.5" />
        <span>Rejected</span>
      </span>
    );
  };

  // Status Action Handlers
  const handleUpdateStatus = async (team, newStatus) => {
    try {
      await registrationService.updateStatus(team._id || team.teamId, newStatus);
      toast.success(`Team ${team.teamId} status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteTeam = async (team) => {
    if (window.confirm(`Are you sure you want to delete team "${team.teamName}" (${team.teamId})?`)) {
      try {
        await registrationService.deleteRegistration(team._id || team.teamId);
        toast.success(`Team ${team.teamName} deleted`);
        fetchData();
        if (selectedTeam?._id === team._id) {
          setIsDrawerOpen(false);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete team');
      }
    }
  };

  // Bulk Action Handlers
  const handleBulkStatus = async (newStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await registrationService.bulkUpdateStatus(selectedIds, newStatus);
      toast.success(`Updated ${selectedIds.length} teams to ${newStatus}`);
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Bulk status update failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to DELETE ${selectedIds.length} selected team registrations?`)) {
      try {
        await registrationService.bulkDeleteRegistrations(selectedIds);
        toast.success(`Deleted ${selectedIds.length} teams`);
        setSelectedIds([]);
        fetchData();
      } catch (err) {
        toast.error(err.message || 'Bulk delete failed');
      }
    }
  };

  const handleBulkExport = () => {
    const selectedTeams = teams.filter((t) => selectedIds.includes(t._id) || selectedIds.includes(t.teamId));
    registrationService.exportToExcel(selectedTeams, 'Hackspora_Selected_Teams.xlsx');
    toast.success(`Exported ${selectedTeams.length} selected teams to Excel`);
  };

  // Export Downloads
  const handleDownloadExcel = (dataset = filteredTeams, filename = 'Hackspora_2.0_Registrations.xlsx') => {
    registrationService.exportToExcel(dataset, filename);
    toast.success('Excel spreadsheet download initiated!');
    setIsDownloadMenuOpen(false);
  };

  const handleDownloadCSV = (dataset = filteredTeams, filename = 'Hackspora_2.0_Registrations.csv') => {
    registrationService.exportToCSV(dataset, filename);
    toast.success('CSV download initiated!');
    setIsDownloadMenuOpen(false);
  };

  const handleDownloadPDF = (dataset = filteredTeams) => {
    toast.success(`Generating PDF report for ${dataset.length} registrations...`);
    window.print();
    setIsDownloadMenuOpen(false);
  };

  // Drawer Opener
  const handleOpenDrawer = (team) => {
    setSelectedTeam(team);
    setIsDrawerOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCollegeFilter('All');
    setDeptFilter('All');
    setYearFilter('All');
    setStatusFilter('All');
    setDateFilter('All');
    setSortOrder('newest');
    toast.success('Filters reset to default');
  };

  return (
    <div className="space-y-8 text-white font-sans">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase mb-1">
            <HiSparkles className="w-4 h-4 text-cyan-400" />
            <span>ENTERPRISE REGISTRATION DASHBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Registrations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage all hackathon team registrations, verification statuses, exports, and participant details.
          </p>
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              fetchData(false);
              toast.success('Live registrations refreshed from MongoDB');
            }}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:text-white transition-all cursor-pointer min-h-[42px] active:scale-95"
            title="Refresh registrations from MongoDB"
          >
            <HiArrowPath className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setEditingTeamData(null);
              setIsAddEditModalOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/20 transition-all cursor-pointer min-h-[42px]"
          >
            <HiPlus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Registration</span>

          </button>

          {/* Download All Data Dropdown */}
          <div className="relative" ref={downloadMenuRef}>
            <button
              onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:text-white transition-all cursor-pointer min-h-[42px]"
            >
              <HiArrowDownTray className="w-4 h-4 text-cyan-400" />
              <span>Download All Data</span>
              <HiChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <AnimatePresence>
              {isDownloadMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#030712]/95 border border-cyan-500/30 p-2 shadow-2xl backdrop-blur-xl z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    EXPORTS & REPORTS
                  </div>
                  <button
                    onClick={() => handleDownloadExcel(teams, 'Hackspora_2.0_All_Registrations.xlsx')}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-emerald-400 transition-colors text-left"
                  >
                    <HiDocumentText className="w-4 h-4 text-emerald-400" />
                    <span>Download Excel (.xlsx)</span>
                  </button>

                  <button
                    onClick={() => handleDownloadCSV(teams, 'Hackspora_2.0_All_Registrations.csv')}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-cyan-400 transition-colors text-left"
                  >
                    <HiDocumentText className="w-4 h-4 text-cyan-400" />
                    <span>Download CSV (.csv)</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(teams)}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-rose-400 transition-colors text-left"
                  >
                    <HiDocumentText className="w-4 h-4 text-rose-400" />
                    <span>Download PDF (.pdf)</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    onClick={() => handleDownloadExcel(teams.filter((t) => selectedIds.includes(t._id) || selectedIds.includes(t.teamId)), 'Selected_Teams.xlsx')}
                    disabled={selectedIds.length === 0}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                      selectedIds.length > 0 ? 'text-slate-200 hover:bg-slate-800/80 hover:text-cyan-300' : 'text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <HiCheckBadge className="w-4 h-4 text-cyan-400" />
                    <span>Download Selected ({selectedIds.length})</span>
                  </button>

                  <button
                    onClick={() => handleDownloadExcel(teams.filter((t) => (t.status || 'Verified') === 'Verified'), 'Verified_Teams.xlsx')}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-emerald-400 transition-colors text-left"
                  >
                    <HiCheckBadge className="w-4 h-4 text-emerald-400" />
                    <span>Download Verified Teams</span>
                  </button>

                  <button
                    onClick={() => handleDownloadExcel(teams.filter((t) => t.status === 'Pending'), 'Pending_Teams.xlsx')}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-amber-400 transition-colors text-left"
                  >
                    <HiClock className="w-4 h-4 text-amber-400" />
                    <span>Download Pending Teams</span>
                  </button>

                  <button
                    onClick={() => handleDownloadExcel(teams.filter((t) => t.status === 'Rejected'), 'Rejected_Teams.xlsx')}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-rose-400 transition-colors text-left"
                  >
                    <HiXCircle className="w-4 h-4 text-rose-400" />
                    <span>Download Rejected Teams</span>
                  </button>

                  <button
                    onClick={() => handleDownloadExcel(filteredTeams, 'Filtered_Results.xlsx')}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-purple-400 transition-colors text-left"
                  >
                    <HiFunnel className="w-4 h-4 text-purple-400" />
                    <span>Download Current Filter Results ({filteredTeams.length})</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:text-cyan-400 transition-all cursor-pointer"
            title="Refresh Data"
          >
            <HiArrowPath className={`w-5 h-5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. STATISTICS CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Participants */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Total Participants</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <HiUsers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalParticipants || 0}</div>
          <span className="text-[11px] text-slate-400 block font-medium">Individual coders registered</span>
        </div>

        {/* Total Teams */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Total Teams</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <HiUserGroup className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalTeams || teams.length}</div>
          <span className="text-[11px] text-slate-400 block font-medium">Target: {stats.targetTeams || 250} Teams</span>
        </div>

        {/* Verified Teams */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Verified Teams</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <HiCheckBadge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.verifiedTeams || 0}</div>
          <span className="text-[11px] text-emerald-300/80 block font-mono">Approved for Hackathon</span>
        </div>

        {/* Pending Approval */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Pending Approval</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <HiClock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">{stats.pendingTeams || 0}</div>
          <span className="text-[11px] text-amber-300/80 block font-mono">Awaiting verification</span>
        </div>

        {/* Rejected Teams */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-rose-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Rejected Teams</span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <HiXCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">{stats.rejectedTeams || 0}</div>
          <span className="text-[11px] text-rose-300/80 block font-mono">Invalid or duplicate</span>
        </div>

        {/* Today's Registrations */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-sky-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Today&apos;s Regs</span>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <HiCalendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-300">{stats.todayRegistrations || 0}</div>
          <span className="text-[11px] text-slate-400 block font-medium">New teams registered today</span>
        </div>

        {/* Average Team Size */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Avg Team Size</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <HiChartBar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300">{stats.avgTeamSize || '3.5'}</div>
          <span className="text-[11px] text-slate-400 block font-medium">Members per squad</span>
        </div>

        {/* Top College */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Top College</span>
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <HiBuildingLibrary className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-teal-300 truncate">{stats.topCollege || 'Anna Univ'}</div>
          <span className="text-[11px] text-slate-400 block font-medium">{stats.totalColleges || 0} Total Colleges</span>
        </div>
      </div>

      {/* 3. ADVANCED STICKY FILTER BAR */}
      <div className="sticky top-20 z-30 p-4 rounded-2xl bg-[#030712]/90 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <HiMagnifyingGlass className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search team, leader, email, college, ID..."
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-medium"
            />
          </div>

          {/* College Filter */}
          <div>
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none transition-all"
            >
              <option value="All">All Colleges</option>
              {uniqueColleges.filter((c) => c !== 'All').map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Dept Filter */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none transition-all"
            >
              <option value="All">All Depts</option>
              {uniqueDepts.filter((d) => d !== 'All').map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none transition-all font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">🟢 Verified</option>
              <option value="Pending">🟠 Pending</option>
              <option value="Rejected">🔴 Rejected</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none transition-all"
            >
              <option value="All">All Time</option>
              <option value="Today">Registered Today</option>
              <option value="7Days">Last 7 Days</option>
              <option value="30Days">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 font-mono text-[11px]">
              Showing <strong className="text-cyan-300 font-bold">{filteredTeams.length}</strong> of {teams.length} teams
            </span>

            {/* Sort Order */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 text-[11px]">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-[11px] focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="teamName">Team Name (A-Z)</option>
                <option value="college">College (A-Z)</option>
                <option value="size">Team Size (High-Low)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors text-[11px] font-mono"
            >
              Reset Filters
            </button>
            <button
              onClick={() => handleDownloadExcel(filteredTeams, 'Filtered_Hackspora_Teams.xlsx')}
              className="px-3 py-1.5 rounded-lg text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors text-[11px] font-mono font-bold flex items-center space-x-1"
            >
              <HiArrowDownTray className="w-3.5 h-3.5" />
              <span>Export Current Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. BULK ACTION TOOLBAR */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 font-bold font-mono text-[11px] flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="font-bold text-white font-mono">Teams Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkStatus('Verified')}
              className="px-3 py-1.5 rounded-lg font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <HiCheckBadge className="w-4 h-4" />
              <span>Bulk Verify</span>
            </button>

            <button
              onClick={() => handleBulkStatus('Rejected')}
              className="px-3 py-1.5 rounded-lg font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <HiXCircle className="w-4 h-4" />
              <span>Bulk Reject</span>
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-lg font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <HiTrash className="w-4 h-4" />
              <span>Bulk Delete</span>
            </button>

            <button
              onClick={handleBulkExport}
              className="px-3 py-1.5 rounded-lg font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <HiArrowDownTray className="w-4 h-4" />
              <span>Bulk Export (.xlsx)</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* 5. ENTERPRISE DATA TABLE */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/90 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-slate-800">
                <th className="py-4 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedTeams.length > 0 && selectedIds.length === paginatedTeams.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                  />
                </th>
                <th className="py-4 px-4 font-bold text-cyan-400">Reg ID</th>
                <th className="py-4 px-4 font-bold text-white">Team Name</th>
                <th className="py-4 px-4 font-bold text-white">Leader Info</th>
                <th className="py-4 px-4 font-bold text-white">College & Branch</th>
                <th className="py-4 px-4 font-bold text-cyan-300">Members</th>
                <th className="py-4 px-4 font-bold text-white">Registered Date</th>
                <th className="py-4 px-4 font-bold text-white">Status</th>
                <th className="py-4 px-4 text-right font-bold text-white">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan={9} className="py-6 px-4">
                      <div className="h-6 bg-slate-800/50 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : paginatedTeams.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 px-4 text-center text-slate-500 italic">
                    No registrations found matching the applied filter parameters.
                  </td>
                </tr>
              ) : (
                paginatedTeams.map((team, index) => {
                  const isChecked = selectedIds.includes(team._id || team.teamId);
                  const isEven = index % 2 === 0;

                  return (
                    <motion.tr
                      key={team._id || team.teamId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`transition-colors group ${
                        isChecked
                          ? 'bg-cyan-950/30'
                          : isEven
                          ? 'bg-slate-950/40 hover:bg-slate-900/60'
                          : 'bg-slate-900/20 hover:bg-slate-900/60'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(team._id || team.teamId)}
                          className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                        />
                      </td>

                      {/* Reg ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-300 text-xs">
                        {team.teamId}
                      </td>

                      {/* Team Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                          {team.teamName}
                        </div>
                        <div className="text-[11px] text-slate-400">{team.city || 'N/A'}, {team.state || 'N/A'}</div>
                      </td>

                      {/* Leader Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200">{team.leaderName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{team.leaderEmail}</div>
                        <div className="text-[10px] text-slate-500">{team.leaderPhone}</div>
                      </td>

                      {/* College & Branch */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-semibold text-slate-200 truncate">{team.collegeName}</div>
                        <div className="text-[11px] text-slate-400">{team.branch} ({team.year})</div>
                      </td>

                      {/* Squad Members */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono font-bold">
                          <HiUserGroup className="w-3.5 h-3.5" />
                          <span>{1 + (team.members?.length || 0)} Members</span>
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(team.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenDrawer(team)}
                            className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                            title="View Team Details"
                          >
                            <HiEye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingTeamData(team);
                              setIsAddEditModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit Registration"
                          >
                            <HiPencilSquare className="w-4 h-4" />
                          </button>

                          {team.status !== 'Verified' && (
                            <button
                              onClick={() => handleUpdateStatus(team, 'Verified')}
                              className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                              title="Verify Team"
                            >
                              <HiCheckBadge className="w-4 h-4" />
                            </button>
                          )}

                          {team.status !== 'Rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(team, 'Rejected')}
                              className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors"
                              title="Reject Team"
                            >
                              <HiXCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteTeam(team)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Registration"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-mono text-[11px]">
              Page <strong className="text-white">{currentPage}</strong> of {totalPages}
            </span>

            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`p-1.5 rounded-lg border transition-all ${
                  currentPage === 1
                    ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer'
                }`}
              >
                <HiChevronLeft className="w-4 h-4" />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={`p-1.5 rounded-lg border transition-all ${
                  currentPage === totalPages
                    ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer'
                }`}
              >
                <HiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. TEAM DETAILS SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && selectedTeam && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Slide-over Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 right-0 max-w-2xl w-full bg-[#030712] border-l border-cyan-500/30 p-6 sm:p-8 overflow-y-auto z-50 text-white shadow-2xl space-y-6 custom-scrollbar"
            >
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30">
                      {selectedTeam.teamId}
                    </span>
                    {renderStatusBadge(selectedTeam.status)}
                  </div>
                  <h2 className="text-2xl font-black text-white mt-2">{selectedTeam.teamName}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Registered: {selectedTeam.createdAt ? new Date(selectedTeam.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              {/* Team Leader Details */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Team Leader Details
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">👑 Primary Contact</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Leader Name</span>
                    <span className="font-bold text-white text-sm">{selectedTeam.leaderName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Email Address</span>
                    <span className="font-mono text-slate-200">{selectedTeam.leaderEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Phone Number</span>
                    <span className="font-semibold text-slate-200">{selectedTeam.leaderPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">College</span>
                    <span className="font-semibold text-slate-200">{selectedTeam.collegeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Course & Branch</span>
                    <span className="font-semibold text-slate-200">{selectedTeam.course} - {selectedTeam.branch}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Year & Location</span>
                    <span className="font-semibold text-slate-200">{selectedTeam.year} ({selectedTeam.city}, {selectedTeam.state})</span>
                  </div>
                </div>
              </div>

              {/* Squad Members */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Squad Members ({selectedTeam.members?.length || 0})
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">Total Team Size: 1 + {selectedTeam.members?.length || 0}</span>
                </div>

                {!selectedTeam.members || selectedTeam.members.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                    No additional team members added. Single leader registration.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedTeam.members.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-white flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-mono text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span>{m.fullName}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{m.year}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                          <div><span className="text-slate-500 font-mono">Email:</span> {m.email}</div>
                          <div><span className="text-slate-500 font-mono">Phone:</span> {m.phone}</div>
                          <div><span className="text-slate-500 font-mono">College:</span> {m.collegeName}</div>
                          <div><span className="text-slate-500 font-mono">Branch:</span> {m.branch}</div>
                        </div>

                        {m.github && (
                          <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-2">
                            <a
                              href={m.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline font-mono text-[11px] inline-flex items-center space-x-1"
                            >
                              <span>GitHub Profile</span>
                              <HiArrowTopRightOnSquare className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Registration Timeline */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  Registration & Event Milestone Timeline
                </span>

                <div className="space-y-3 text-xs pt-1">
                  <div className="flex items-center space-x-3 text-emerald-400 font-semibold">
                    <HiCheckBadge className="w-4 h-4 shrink-0" />
                    <span>1. Team Account & Form Submission</span>
                  </div>
                  <div className="flex items-center space-x-3 text-emerald-400 font-semibold">
                    <HiCheckBadge className="w-4 h-4 shrink-0" />
                    <span>2. Registration Verification ({selectedTeam.status || 'Verified'})</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-400">
                    <HiClock className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span>3. Virtual Round Problem Statement Selection</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-500">
                    <HiCalendar className="w-4 h-4 shrink-0" />
                    <span>4. Final 24H Offline Hackathon Event</span>
                  </div>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedTeam, 'Verified')}
                    className="px-4 py-2 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
                  >
                    Verify Team
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedTeam, 'Rejected')}
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 transition-colors"
                  >
                    Reject Team
                  </button>
                </div>

                <button
                  onClick={() => handleDownloadExcel([selectedTeam], `${selectedTeam.teamId}_Details.xlsx`)}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-cyan-300 bg-slate-900 border border-cyan-500/30 hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
                >
                  <HiArrowDownTray className="w-4 h-4" />
                  <span>Download Excel</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. ADD / EDIT TEAM MODAL */}
      <AnimatePresence>
        {isAddEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddEditModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-xl rounded-3xl bg-[#030712] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-xl font-black text-white">
                  {editingTeamData ? `Edit Team: ${editingTeamData.teamId}` : 'Add New Team Registration'}
                </h3>
                <button onClick={() => setIsAddEditModalOpen(false)} className="text-slate-400 hover:text-white">
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const payload = {
                    teamName: formData.get('teamName'),
                    leaderName: formData.get('leaderName'),
                    leaderEmail: formData.get('leaderEmail'),
                    leaderPhone: formData.get('leaderPhone'),
                    collegeName: formData.get('collegeName'),
                    course: formData.get('course'),
                    branch: formData.get('branch'),
                    year: formData.get('year'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    status: formData.get('status'),
                  };

                  try {
                    if (editingTeamData) {
                      await registrationService.updateRegistration(editingTeamData._id || editingTeamData.teamId, payload);
                      toast.success('Team registration updated!');
                    } else {
                      await registrationService.registerTeam(payload);
                      toast.success('New team registered successfully!');
                    }
                    setIsAddEditModalOpen(false);
                    fetchData();
                  } catch (err) {
                    toast.error(err.message || 'Failed to save team registration');
                  }
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Team Name *</label>
                    <input
                      type="text"
                      name="teamName"
                      defaultValue={editingTeamData?.teamName || ''}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Status</label>
                    <select
                      name="status"
                      defaultValue={editingTeamData?.status || 'Verified'}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Leader Name *</label>
                    <input
                      type="text"
                      name="leaderName"
                      defaultValue={editingTeamData?.leaderName || ''}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Leader Email *</label>
                    <input
                      type="email"
                      name="leaderEmail"
                      defaultValue={editingTeamData?.leaderEmail || ''}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Leader Phone *</label>
                    <input
                      type="text"
                      name="leaderPhone"
                      defaultValue={editingTeamData?.leaderPhone || ''}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">College Name *</label>
                    <input
                      type="text"
                      name="collegeName"
                      defaultValue={editingTeamData?.collegeName || ''}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Course</label>
                    <input
                      type="text"
                      name="course"
                      defaultValue={editingTeamData?.course || 'B.Tech'}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Branch / Dept *</label>
                    <input
                      type="text"
                      name="branch"
                      defaultValue={editingTeamData?.branch || ''}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Year</label>
                    <select
                      name="year"
                      defaultValue={editingTeamData?.year || '3rd Year'}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={editingTeamData?.city || 'Chennai'}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-indigo-300 shadow-lg"
                  >
                    Save Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
