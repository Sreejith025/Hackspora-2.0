import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiTrophy, HiCheckBadge, HiBuildingLibrary, HiSparkles, HiMagnifyingGlass } from 'react-icons/hi2';
import { virtualRoundService } from '../../../services/virtualRoundService';

export default function PublicResultsSection() {
  const [shortlistedTeams, setShortlistedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadPublicResults() {
      try {
        setLoading(true);
        const res = await virtualRoundService.getPublicResults();
        if (res?.success && Array.isArray(res.data)) {
          setShortlistedTeams(res.data);
        }
      } catch (err) {
        console.error('Failed to load public shortlisted teams:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPublicResults();
  }, []);

  const filteredTeams = shortlistedTeams.filter(
    (t) =>
      t.teamName.toLowerCase().includes(search.toLowerCase()) ||
      t.teamId.toLowerCase().includes(search.toLowerCase()) ||
      t.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      t.problemStatementName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <HiTrophy className="w-4 h-4" />
            <span>Shortlisted Teams & Finalists</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Virtual Round Results & Selected Teams
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Congratulations to all teams shortlisted for the Hackspora 2.0 Grand Finale!
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search team, ID or college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Results Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading shortlisted teams...</span>
        </div>
      ) : shortlistedTeams.length === 0 ? (
        <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <HiSparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Results Under Evaluation</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            The Virtual Round submissions are currently under review by our jury panel. Shortlisted teams will be announced here once evaluations complete.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team, idx) => (
            <motion.div
              key={team.teamId || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-slate-950 border border-amber-500/30 hover:border-amber-500/60 shadow-xl transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold">
                  {team.teamId}
                </span>
                <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                  <HiCheckBadge className="w-3.5 h-3.5" />
                  <span>Shortlisted</span>
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">{team.teamName}</h4>
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
                  <HiBuildingLibrary className="w-4 h-4 text-slate-500" />
                  <span className="truncate">{team.collegeName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Track / Problem Statement</span>
                <p className="text-slate-300 font-medium truncate mt-0.5">{team.problemStatementName}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
