import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiClock } from 'react-icons/hi2';

const calculateTimeLeft = (target) => {
  const difference = +new Date(target) - +new Date();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export default function CountdownTimer({ targetDate = '2026-10-24T09:00:00' }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full rounded-2xl glass-card p-5 sm:p-6 border border-cyan-500/20 shadow-[0_0_40px_rgba(56,189,248,0.12)] relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <HiClock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-cyan-300 uppercase">
            HACKATHON COUNTDOWN
          </span>
        </div>
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Grid of Time Units */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-inner"
          >
            <div className="relative overflow-hidden h-8 sm:h-12 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: -20, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-mono bg-gradient-to-b from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent text-glow-ice"
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-slate-400 tracking-wider mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
