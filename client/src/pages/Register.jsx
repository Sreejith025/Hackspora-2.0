import { motion } from 'framer-motion';
import { SpaceBackground } from '../features/home';
import TeamRegistrationWizard from '../features/registration/components/TeamRegistrationWizard';
import { HiSparkles } from 'react-icons/hi2';

export default function Register() {
  return (
    <div className="relative min-h-screen bg-[#02040A] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Galaxy & Stars */}
      <SpaceBackground />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Page Header Banner */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase shadow-md shadow-cyan-950/50"
          >
            <HiSparkles className="w-4 h-4 text-cyan-400" />
            <span>HACKSPORA 2.0 • SQUAD REGISTRATION</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-white"
          >
            Register Your Team
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto"
          >
            Complete the 3-step registration wizard to claim your official Team ID and enter the Hackspora 2.0 arena.
          </motion.p>
        </div>

        {/* 3-Step Wizard */}
        <TeamRegistrationWizard />
      </div>
    </div>
  );
}
