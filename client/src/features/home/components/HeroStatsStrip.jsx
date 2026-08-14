import { motion } from 'framer-motion';
import {
 HiTrophy,
 HiUsers,
 HiUserGroup,
 HiAcademicCap,
 HiCalendarDays,
 HiMapPin,
 HiBuildingOffice2,
} from 'react-icons/hi2';

const metrics = [
 {
 icon: HiTrophy,
 stat: '₹1,LAKH+',
 label: 'Prize Pool',
 sub: 'Pool & Swag',
 },
 {
 icon: HiUsers,
 stat: '1,500+',
 label: 'Innovators',
 sub: 'Pan-India',
 },
 {
 icon: HiUserGroup,
 stat: '250+',
 label: 'Teams',
 sub: 'Competing',
 },
 {
 icon: HiAcademicCap,
 stat: '50+',
 label: 'Mentors',
 sub: 'Industry Experts',
 },
];

export default function HeroStatsStrip() {
 return (
 <section className="relative overflow-hidden bg-black">
 <div className="max-w-[1600px] mx-auto px-3 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
 {/* Metrics Grid */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
 {metrics.map((m, idx) => {
 const Icon = m.icon;
 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.2 }}
 transition={{ duration: 0.5, delay: idx * 0.08 }}
 whileHover={{ y: -4 }}
 className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/25 bg-white/[0.12] p-4 sm:p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl transition-all duration-300 hover:border-white/40 hover:bg-white/[0.16]"
 >
 <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80" />
 <div className="flex items-center justify-between mb-3 sm:mb-4">
 <div className="relative p-2 rounded-xl sm:rounded-2xl bg-white/15 border border-white/25 text-white shadow-lg shadow-black/20 backdrop-blur-xl transition-colors duration-300 group-hover:border-cyan-300/50 group-hover:text-cyan-200">
 <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
 </div>
 <span className="relative rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-widest text-white/60 uppercase">
 0{idx + 1}
 </span>
 </div>
 <span className="relative block text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
 {m.stat}
 </span>
 <span className="relative block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-cyan-100 mt-1">
 {m.label}
 </span>
 <span className="relative block text-[10px] sm:text-xs text-white/70 mt-0.5">
 {m.sub}
 </span>
 </motion.div>
 );
 })}
 </div>

 {/* Date / Venue / Sponsors secondary row */}
 <div className="mt-3 sm:mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
 <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/25 bg-white/[0.12] p-4 sm:p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition-all duration-300 hover:border-white/40 hover:bg-white/[0.16] flex items-center space-x-3">
 <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80" />
 <div className="relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/15 border border-white/25 text-cyan-100 shrink-0 shadow-lg shadow-black/20">
 <HiCalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
 </div>
 <div className="relative min-w-0">
 <span className="block text-[10px] font-semibold text-white/65 uppercase tracking-wider">Event Dates</span>
 <span className="block text-xs sm:text-sm font-bold text-white truncate">Aug 23 & Sep 18–20, 2026</span>
 </div>
 </div>

 <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/25 bg-white/[0.12] p-4 sm:p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition-all duration-300 hover:border-white/40 hover:bg-white/[0.16] flex items-center space-x-3">
 <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80" />
 <div className="relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/15 border border-white/25 text-cyan-100 shrink-0 shadow-lg shadow-black/20">
 <HiMapPin className="w-4 h-4 sm:w-5 sm:h-5" />
 </div>
 <div className="relative min-w-0">
 <span className="block text-[10px] font-semibold text-white/65 uppercase tracking-wider">Venue</span>
 <span className="block text-xs sm:text-sm font-bold text-white truncate">KAHE, Coimbatore</span>
 </div>
 </div>

 <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/25 bg-white/[0.12] p-4 sm:p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl transition-all duration-300 hover:border-white/40 hover:bg-white/[0.16] flex items-center justify-between gap-3 sm:gap-4">
 <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80" />
 <div className="relative flex items-center space-x-2 text-white/85 shrink-0">
 <HiBuildingOffice2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-100" />
 <span className="text-xs uppercase tracking-wider">Sponsors</span>
 </div>
 <div className="relative flex items-center space-x-2 text-[10px] sm:text-[11px] tracking-wider text-cyan-100">
 <span>DEVNET</span>
 <span>•</span>
 <span>NEXUS</span>
 <span>•</span>
 <span>CLOUD</span>
 </div>
 </div>
 </div>
 </div>
 </section>
 );
}
