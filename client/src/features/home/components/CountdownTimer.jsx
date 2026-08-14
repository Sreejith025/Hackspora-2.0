import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCalendarDays, HiClock } from 'react-icons/hi2';

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

export default function CountdownTimer({ targetDate = '2026-08-23T09:30:00' }) {
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
 <div className="w-80 rounded-xl border border-white/20 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
 <div className="mb-4 flex items-start justify-between gap-4">
 <div>
 <div className="flex items-center gap-2 text-white">
 <HiClock className="h-4 w-4 text-[#b77611]" />
 <span className="text-[11px] font-extrabold uppercase tracking-widest">
 Event Starts In
 </span>
 </div>
 <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">
 <HiCalendarDays className="h-3.5 w-3.5 text-white/60" />
 <span>23 Aug 2026</span>
 </div>
 </div>
 <div className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/80">
 09:30 AM
 </div>
 </div>

 <div className="grid grid-cols-4 gap-2 text-center">
 {timeUnits.map((unit) => (
 <div
 key={unit.label}
 className="rounded-lg border border-white/15 bg-white/90 px-2 py-2.5 shadow-sm"
 >
 <div className="relative flex h-9 items-center justify-center overflow-hidden">
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
 <span className="mt-1 block text-[8px] font-extrabold uppercase tracking-wide text-slate-500">
 {unit.label}
 </span>
 </div>
 ))}
 </div>
 </div>
 );
}
