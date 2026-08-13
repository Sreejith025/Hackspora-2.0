import { useEffect, useState } from 'react';

export default function CinematicLoader({ onComplete }) {
 const [progress, setProgress] = useState(0);

 useEffect(() => {
 const startTime = Date.now();
 const duration = 4000; // 4 seconds total

 const interval = setInterval(() => {
 const elapsed = Date.now() - startTime;
 const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
 setProgress(pct);

 if (pct >= 100) {
 clearInterval(interval);
 setTimeout(() => {
 if (onComplete) onComplete();
 }, 200);
 }
 }, 40);

 return () => clearInterval(interval);
 }, [onComplete]);

 return (
 <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center px-6">
 <div className="flex flex-col items-center space-y-8 max-w-md w-full">
 <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-center">
 HACKSPORA <span className="text-cyan-400">2.0</span>
 </h1>

 <div className="text-xs uppercase tracking-widest text-slate-400">
 Loading {progress}%
 </div>

 {/* Progress bar */}
 <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
 <div
 className="h-full bg-cyan-400 transition-all duration-100 ease-out"
 style={{ width: `${progress}%` }}
 />
 </div>

 <button
 onClick={() => {
 setProgress(100);
 if (onComplete) onComplete();
 }}
 className="px-5 py-2 rounded-full bg-slate-900 border border-cyan-500 text-xs text-cyan-400 hover:bg-slate-800 hover:border-cyan-400 transition-colors cursor-pointer"
 >
 SKIP INTRO
 </button>
 </div>
 </div>
 );
}