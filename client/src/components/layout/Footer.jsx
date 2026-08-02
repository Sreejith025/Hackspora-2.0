import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi2';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white group-hover:scale-105 transition-transform">
            <HiSparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
            Hackspora 2.0
          </span>
        </Link>
        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Hackspora 2.0. All rights reserved. Built for innovators.
        </p>
      </div>
    </footer>
  );
}
