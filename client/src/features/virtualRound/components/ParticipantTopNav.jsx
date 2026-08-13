import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { HiBell, HiClock, HiSignal } from 'react-icons/hi2';

export default function ParticipantTopNav({ serverTime, countdown, submission }) {
 return (
 <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3 shadow-xl shadow-cyan-950/20">
 <div className="max-w-[1600px] mx-auto flex items-center justify-between">
 {/* Left: Brand Logo & Round Badge */}
 <div className="flex items-center space-x-3 sm:space-x-4">
 <Link to="/" className="flex items-center space-x-2.5 group">
 <div className="p-1 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
 <img
 src="/logos/hackspora.jpg"
 alt="Hackspora 2.0 Logo"
 className="h-7 sm:h-8 w-auto rounded-lg object-contain bg-white p-0.5"
 />
 </div>
 <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
 Hackspora <span className="text-cyan-400 font-black">2.0</span>
 </span>
 </Link>

 {/* KAHE & AIDS Logos */}
 <div className="hidden lg:flex items-center space-x-2 border-l border-slate-800/80 pl-3">
 <img src="/logos/kahe.jpg" alt="KAHE Logo" className="h-6 w-auto rounded object-contain bg-white p-0.5" />
 <img src="/logos/aids.jpg" alt="AIDS Logo" className="h-6 w-auto rounded object-contain bg-white p-0.5" />
 </div>

 <span className="hidden md:inline text-slate-700">•</span>

 <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-bold">
 <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
 <span>VIRTUAL ROUND 1</span>
 </div>
 </div>

 {/* Center: Server Clock & Ticker */}
 <div className="hidden lg:flex items-center space-x-4 text-xs text-slate-400">
 <div className="flex items-center space-x-1 text-cyan-400">
 <HiSignal className="w-3.5 h-3.5 animate-pulse" />
 <span>SYNC OK</span>
 </div>
 <span>•</span>
 <div>
 SERVER: <span className="text-white font-bold">{serverTime.toLocaleTimeString('en-US', { hour12: false })}</span>
 </div>
 <span>•</span>
 <div className="flex items-center space-x-1.5 text-cyan-300">
 <HiClock className="w-3.5 h-3.5" />
 <span>REMAINING: <strong className="text-white font-black">{countdown.hours}:{countdown.minutes}:{countdown.seconds}</strong></span>
 </div>
 </div>

 {/* Right: Notifications & User Avatar */}
 <div className="flex items-center space-x-3">
 {/* Submission Status Badge */}
 {submission.isSubmitted ? (
 <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
 ✓ SUBMITTED
 </span>
 ) : (
 <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
 DRAFT MODE
 </span>
 )}

 {/* Notification Button */}
 <button
 type="button"
 className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
 >
 <HiBell className="w-4 h-4 text-cyan-400" />
 <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
 </button>

 {/* User Button */}
 <UserButton
 afterSignOutUrl="/"
 appearance={{
 elements: {
 userButtonAvatarBox: 'w-8 h-8 border-2 border-cyan-400/40 hover:scale-105 transition-transform',
 },
 }}
 />
 </div>
 </div>
 </header>
 );
}
