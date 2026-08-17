import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 HiCheckCircle,
 HiUserGroup,
 HiAcademicCap,
 HiCalendar,
 HiClock,
 HiExclamationTriangle,
 HiTrophy,
 HiBriefcase,
 HiLightBulb,
 HiShieldCheck,
 HiCodeBracket,
 HiScale,
 HiBanknotes,
} from 'react-icons/hi2';

const timelineRounds = [
 {
 round: 'Round 1 – Virtual Screening Round',
 badge: 'Online • 7 Hours',
 date: '23 August 2026',
 details: [
 'Problem Statements Released: 9:30 AM',
 'Hackathon Duration: 7 Hours',
 'Submission Window: 5:00 PM – 6:00 PM',
 'Required Submissions: GitHub Repository Link & Demo Video Link',
 'Evaluation based on GitHub repo quality, demo video, innovation, and implementation.',
 'Problem statements for Virtual Round and Offline Grand Finale are different.',
 'Shortlisted teams will receive a verification and confirmation email.',
 ],
 },
 {
 round: 'Round 2 – Grand Finale (24-Hour Offline Hackathon)',
 badge: 'Offline • 24 Hours',
 date: '19 & 20 September 2026',
 details: [
 'Reporting Time: 7:00 AM – 9:00 AM',
 'Inauguration & Briefing: 9:00 AM',
 'Problem Statement Release: 9:45 AM',
 'Hackathon Begins: 10:00 AM (19 September 2026)',
 'Hackathon Ends: 12:00 PM (20 September 2026)',
 'A fresh set of new problem statements will be released at the beginning of the offline round.',
 ],
 },
];

const teamRules = [
 'Team Size: Minimum 3 – Maximum 5 Members.',
 'Only shortlisted teams from the Virtual Screening Round are eligible for the Offline Grand Finale.',
 'The Team Leader is responsible for registering the team and filling details accurately during registration.',
 'All participants must carry a valid College ID Card.',
];

const dressCodeRules = [
 'Participants must attend the Offline Grand Finale in formal or smart professional attire.',
 'A valid College ID Card must be worn and presented during reporting and throughout the event.',
 'Participants are expected to maintain professional behavior with judges, mentors, industry experts, and peers.',
];

const generalGuidelines = [
 'Teams must develop their solution strictly during the hackathon timeline.',
 'Open-source libraries, frameworks, and APIs may be used with proper attribution.',
 'Regular commits to the GitHub repository are strongly encouraged.',
 'Plagiarism, copying, or any form of malpractice will result in immediate disqualification.',
 'Teams requiring additional hardware components will be provided reasonable time to purchase items during the offline round.',
 'Refreshments, dinner, Wi-Fi, power supply, and dedicated workspaces will be provided during the 24-hour hackathon.',
 'The decision of the judges and organizing committee will be final and binding.',
];

const whyParticipate = [
 { icon: HiBanknotes, title: 'Cash Prizes', desc: 'Exciting cash rewards for top-performing teams.' },
 { icon: HiBriefcase, title: 'Internship Offers', desc: 'Direct internship opportunities from leading industry partners.' },
 { icon: HiUserGroup, title: 'Networking', desc: 'Connect with top tech companies, judges, and mentors.' },
 { icon: HiAcademicCap, title: 'Certificates', desc: 'National-level participation and winner certificates.' },
 { icon: HiCodeBracket, title: 'Real-World Problems', desc: 'Solve challenging industry problem statements.' },
 { icon: HiAcademicCap, title: 'National Platform', desc: 'Showcase your skills on a prestigious national stage.' },
];

const judgingCriteria = [
 { name: 'Innovation & Creativity', weight: '20%' },
 { name: 'Technical Implementation', weight: '25%' },
 { name: 'Problem-Solving Approach', weight: '20%' },
 { name: 'Scalability & Impact', weight: '15%' },
 { name: 'GitHub Repo Quality', weight: '10%' },
 { name: 'Demo Video & Pitch', weight: '10%' },
];

const glassCardClass = 'group relative overflow-hidden rounded-3xl border border-white/25 bg-white/[0.16] shadow-2xl shadow-black/25 backdrop-blur-2xl transition-all duration-300 hover:border-white/40 hover:bg-white/[0.2]';
const glassSheenClass = 'pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80';
const glassIconClass = 'relative p-3 rounded-2xl bg-white/15 border border-white/25 text-white w-fit shadow-lg shadow-black/20 backdrop-blur-xl transition-colors duration-300 group-hover:border-cyan-300/50 group-hover:text-cyan-200';
const glassMiniCardClass = 'relative rounded-2xl border border-white/20 bg-black/20 backdrop-blur-xl transition-colors duration-300 hover:border-white/35 hover:bg-white/[0.12]';

export default function GuidelinesSection() {
 const [activeTab, setActiveTab] = useState('timeline');

 return (
 <section id="guidelines" className="scroll-mt-20 sm:scroll-mt-28 relative py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
 <motion.div
 initial={{ opacity: 0, y: 50 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.15 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 className="space-y-10 sm:space-y-14"
 >
 {/* Header Banner */}
 <div className="text-center space-y-4 max-w-4xl mx-auto">
 <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/25 backdrop-blur-2xl text-[#4a5cd9] text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-lg shadow-black/20">
 <HiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4a5cd9]" />
 <span>OFFICIAL GUIDELINES • HACKSPORA 2.0</span>
 </div>

 <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
 HackSpora 2.0 – <span className="text-[#4a5cd9]">National Level Hackathon</span>
 </h2>
 </div>

 {/* Navigation Tabs */}
 <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto border-b border-slate-800 pb-4 px-1">
 {[
 { id: 'timeline', label: 'Timeline & Rounds', icon: HiCalendar },
 { id: 'team', label: 'Team Rules', icon: HiUserGroup },
 { id: 'general', label: 'General Guidelines', icon: HiLightBulb },
 { id: 'dress', label: 'Dress Code', icon: HiShieldCheck },
 { id: 'benefits', label: 'Why Participate', icon: HiTrophy },
 { id: 'judging', label: 'Judging Criteria', icon: HiScale },
 ].map((tab) => {
 const Icon = tab.icon;
 return (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer flex items-center space-x-2 ${
 activeTab === tab.id
 ? 'bg-[#3645bf] text-white border border-[#3645bf] shadow-lg shadow-[#3645bf]/40'
 : 'bg-white/[0.16] text-white border border-white/25 hover:bg-white/[0.2] hover:border-white/40 backdrop-blur-2xl'
 }`}
 >
 <Icon className="w-4 h-4 shrink-0" />
 <span>{tab.label}</span>
 </button>
 );
 })}
 </div>

 {/* Tab Content Display */}
 <div className="max-w-4xl mx-auto">
 <AnimatePresence mode="wait">
 {/* Timeline Tab */}
 {activeTab === 'timeline' && (
 <motion.div
 key="timeline"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="space-y-5 sm:space-y-6"
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
 {timelineRounds.map((rd, idx) => (
 <div
 key={idx}
 className={`${glassCardClass} p-5 sm:p-7 space-y-5 flex flex-col justify-between`}
 >
 <div className={glassSheenClass} />
 <div className="relative space-y-3">
 <div className="flex items-center justify-between flex-wrap gap-2">
 <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold border border-white/25 bg-white/15 text-white backdrop-blur-xl">
 {rd.badge}
 </span>
 <span className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
 <HiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-200" />
 <span>{rd.date}</span>
 </span>
 </div>

 <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-snug">{rd.round}</h3>

 <ul className="space-y-3 text-xs sm:text-sm text-white pt-3 border-t border-white/15">
 {rd.details.map((d, i) => (
 <li key={i} className={`${glassMiniCardClass} flex items-start space-x-3 p-3 sm:p-3.5`}>
 <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3645bf] text-[11px] font-black text-white">
 {i + 1}
 </span>
 <span className="leading-relaxed">{d}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 ))}
 </div>

 {/* Important Registration Fee Note */}
 <div className={`${glassMiniCardClass} p-6 text-white text-sm space-y-3`}>
 <div className="flex items-center space-x-3 font-extrabold text-white text-base">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-300/40 bg-amber-400/15">
 <HiExclamationTriangle className="w-5 h-5 text-amber-300" />
 </div>
 <span>IMPORTANT: Registration Fee Details</span>
 </div>
 <p className="leading-relaxed">
 The registration fee of <strong className="text-white">₹1250 Per Team</strong> will be collected <strong>ONLY</strong> after a team is shortlisted in the Virtual Screening Round (Round 1) and confirms participation for the Offline Grand Finale (Round 2).
 </p>
 </div>
 </motion.div>
 )}

 {/* Team Rules Tab */}
 {activeTab === 'team' && (
 <motion.div
 key="team"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className={`${glassCardClass} p-7 sm:p-9 space-y-7`}
 >
 <div className={glassSheenClass} />
 <div className="relative flex items-center space-x-3 pb-4 border-b border-white/15">
 <div className={glassIconClass}>
 <HiUserGroup className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-2xl font-extrabold text-white">Team Composition & Requirements</h3>
 <p className="text-sm text-white/75">Rules governing team registration and eligibility</p>
 </div>
 </div>

 <div className="relative grid grid-cols-1 gap-4">
 {teamRules.map((rule, idx) => (
 <div
 key={idx}
 className={`${glassMiniCardClass} p-5 flex items-start space-x-4 text-sm sm:text-base text-white`}
 >
 <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#3645bf] text-xs font-black text-white">
 0{idx + 1}
 </span>
 <span className="leading-relaxed">{rule}</span>
 </div>
 ))}
 </div>
 </motion.div>
 )}

 {/* General Guidelines Tab */}
 {activeTab === 'general' && (
 <motion.div
 key="general"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className={`${glassCardClass} p-7 sm:p-9 space-y-7`}
 >
 <div className={glassSheenClass} />
 <div className="relative flex items-center space-x-3 pb-4 border-b border-white/15">
 <div className={glassIconClass}>
 <HiLightBulb className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-2xl font-extrabold text-white">General Hackathon Guidelines</h3>
 <p className="text-sm text-white/75">Core rules for building, submitting, and logistics</p>
 </div>
 </div>

 <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
 {generalGuidelines.map((item, idx) => (
 <div
 key={idx}
 className={`${glassMiniCardClass} p-5 flex items-start space-x-4 text-sm text-white`}
 >
 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-cyan-100">
 <HiCodeBracket className="w-5 h-5" />
 </div>
 <span className="leading-relaxed">{item}</span>
 </div>
 ))}
 </div>
 </motion.div>
 )}

 {/* Dress Code Tab */}
 {activeTab === 'dress' && (
 <motion.div
 key="dress"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className={`${glassCardClass} p-7 sm:p-9 space-y-7`}
 >
 <div className={glassSheenClass} />
 <div className="relative flex items-center space-x-3 pb-4 border-b border-white/15">
 <div className={glassIconClass}>
 <HiShieldCheck className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-2xl font-extrabold text-white">Dress Code & Professional Conduct</h3>
 <p className="text-sm text-white/75">Standards for attending the Offline Grand Finale</p>
 </div>
 </div>

 <div className="relative grid grid-cols-1 gap-4">
 {dressCodeRules.map((rule, idx) => (
 <div
 key={idx}
 className={`${glassMiniCardClass} p-5 flex items-start space-x-4 text-sm sm:text-base text-white`}
 >
 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-cyan-100">
 <HiCheckCircle className="w-5 h-5" />
 </div>
 <span className="leading-relaxed">{rule}</span>
 </div>
 ))}
 </div>
 </motion.div>
 )}

 {/* Why Participate Tab */}
 {activeTab === 'benefits' && (
 <motion.div
 key="benefits"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
 >
 {whyParticipate.map((item, idx) => {
 const Icon = item.icon;
 return (
 <div
 key={idx}
 className={`${glassCardClass} p-6 space-y-4`}
 >
 <div className={glassSheenClass} />
 <div className={glassIconClass}>
 <Icon className="w-6 h-6" />
 </div>
 <h4 className="relative text-lg font-extrabold text-white">{item.title}</h4>
 <p className="relative text-sm text-white/75 leading-relaxed">{item.desc}</p>
 </div>
 );
 })}
 </motion.div>
 )}

 {/* Judging Criteria Tab */}
 {activeTab === 'judging' && (
 <motion.div
 key="judging"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className={`${glassCardClass} p-7 sm:p-9 space-y-7`}
 >
 <div className={glassSheenClass} />
 <div className="relative flex items-center space-x-3 pb-4 border-b border-white/15">
 <div className={glassIconClass}>
 <HiScale className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-2xl font-extrabold text-white">Judging & Evaluation Criteria</h3>
 <p className="text-sm text-white/75">How projects will be evaluated by industry judges</p>
 </div>
 </div>

 <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
 {judgingCriteria.map((item, idx) => (
 <div
 key={idx}
 className={`${glassMiniCardClass} p-5 space-y-3 flex flex-col justify-between min-h-[150px]`}
 >
 <span className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-cyan-100 uppercase">
 Criterion #{idx + 1}
 </span>
 <h4 className="text-base font-extrabold text-white leading-snug">{item.name}</h4>
 <div className="pt-2 border-t border-white/15 text-right">
 <span className="text-sm font-extrabold text-white bg-[#3645bf] px-3 py-1.5 rounded-full">
 Weight: {item.weight}
 </span>
 </div>
 </div>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Bottom Callout Banner */}
 <div className={`${glassCardClass} max-w-4xl mx-auto text-center p-8 sm:p-10 space-y-4`}>
 <div className={glassSheenClass} />
 <div className="relative inline-flex items-center space-x-2 text-cyan-200 text-xs font-bold uppercase tracking-widest">
 <HiCheckCircle className="w-4 h-4 text-cyan-200" />
 <span>THINK. BUILD. INNOVATE.</span>
 </div>
 <h3 className="relative text-2xl sm:text-3xl font-black text-white">Ready to Showcase Your Innovations on a National Platform?</h3>
 <p className="relative text-sm sm:text-base text-white/75 max-w-2xl mx-auto leading-relaxed">
 HackSpora 2.0 is your opportunity to compete with top tech minds across the nation. Form your squad (3-5 members) and register today!
 </p>
 </div>
 </motion.div>
 </section>
 );
}
