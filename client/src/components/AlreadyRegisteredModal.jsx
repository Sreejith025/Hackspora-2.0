import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HiCheckBadge,
  HiXMark,
  HiArrowRight,
  HiUserGroup,
  HiShieldCheck,
  HiSparkles,
} from 'react-icons/hi2';

export default function AlreadyRegisteredModal({
  isOpen,
  onClose,
  teamData = null,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur & Dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-[#030712] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-white space-y-6"
          >
            {/* Background Neon Glow Orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

            {/* Close Cross Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-900/80 transition-colors cursor-pointer"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            {/* Success Animated Badge */}
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 relative z-10">
                  <HiShieldCheck className="w-12 h-12 text-slate-950" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-bold tracking-wider">
                  <HiSparkles className="w-3.5 h-3.5" />
                  <span>REGISTRATION VERIFIED</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  You are Already Registered!
                </h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                  You have already registered your squad for <strong className="text-cyan-300">Hackspora 2.0</strong>. Duplicate registrations are not allowed.
                </p>
              </div>
            </div>

            {/* Team Details Summary Card */}
            {teamData && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-3 font-sans">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                    OFFICIAL TEAM RECORD
                  </span>
                  <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-semibold">
                    <HiCheckBadge className="w-4 h-4" />
                    <span>Active</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block font-mono text-[10px] uppercase">Team ID</span>
                    <span className="font-mono font-bold text-cyan-300 text-base">{teamData.teamId || 'HS2026-REG'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-mono text-[10px] uppercase">Team Name</span>
                    <span className="font-bold text-white text-sm truncate block">{teamData.teamName || 'Your Squad'}</span>
                  </div>
                  {teamData.leaderName && (
                    <div className="col-span-2 pt-1 border-t border-slate-800/60">
                      <span className="text-slate-500 block font-mono text-[10px] uppercase">Team Leader</span>
                      <span className="font-medium text-slate-200">{teamData.leaderName} ({teamData.leaderEmail})</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <HiUserGroup className="w-4 h-4" />
                <span>Go to Dashboard</span>
                <HiArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-sm text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:text-white transition-all cursor-pointer text-center min-h-[48px]"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
