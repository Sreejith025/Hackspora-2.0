import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSparkles,
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
  HiRocketLaunch,
  HiBanknotes,
} from 'react-icons/hi2';

const timelineRounds = [
  {
    round: 'Round 1 – Virtual Screening Round',
    badge: 'Online • 7 Hours',
    badgeColor: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300',
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
    badgeColor: 'bg-purple-500/10 border-purple-500/40 text-purple-300',
    date: '18 & 19 September 2026',
    details: [
      'Reporting Time: 7:00 AM – 9:00 AM',
      'Inauguration & Briefing: 9:00 AM',
      'Problem Statement Release: 9:45 AM',
      'Hackathon Begins: 10:00 AM (18 September 2026)',
      'Hackathon Ends: 12:00 PM (19 September 2026)',
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
  { icon: HiRocketLaunch, title: 'Real-World Problems', desc: 'Solve challenging industry problem statements.' },
  { icon: HiSparkles, title: 'National Platform', desc: 'Showcase your skills on a prestigious national stage.' },
];

const judgingCriteria = [
  { name: 'Innovation & Creativity', weight: '20%' },
  { name: 'Technical Implementation', weight: '25%' },
  { name: 'Problem-Solving Approach', weight: '20%' },
  { name: 'Scalability & Impact', weight: '15%' },
  { name: 'GitHub Repo Quality', weight: '10%' },
  { name: 'Demo Video & Pitch', weight: '10%' },
];

export default function GuidelinesSection() {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <section id="guidelines" className="scroll-mt-28 relative py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-14"
      >
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
            <HiSparkles className="w-4 h-4 text-cyan-400" />
            <span>OFFICIAL GUIDELINES • HACKSPORA 2.0</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            HackSpora 2.0 – <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">National Level Hackathon</span>
          </h2>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto border-b border-slate-800/80 pb-4">
          {[
            { id: 'timeline', label: '📅 Timeline & Rounds', icon: HiCalendar },
            { id: 'team', label: '👥 Team Rules', icon: HiUserGroup },
            { id: 'general', label: '💡 General Guidelines', icon: HiLightBulb },
            { id: 'dress', label: '👔 Dress Code', icon: HiShieldCheck },
            { id: 'benefits', label: '🏆 Why Participate', icon: HiTrophy },
            { id: 'judging', label: '🏅 Judging Criteria', icon: HiScale },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
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
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {timelineRounds.map((rd, idx) => (
                    <div
                      key={idx}
                      className="glass-card p-6 rounded-3xl border border-cyan-500/20 hover:border-cyan-400/50 space-y-4 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${rd.badgeColor}`}>
                            {rd.badge}
                          </span>
                          <span className="text-xs font-mono font-bold text-white flex items-center space-x-1">
                            <HiClock className="w-4 h-4 text-cyan-400" />
                            <span>{rd.date}</span>
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white leading-snug">{rd.round}</h3>

                        <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                          {rd.details.map((d, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <HiCheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Registration Fee Note */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                  <div className="flex items-center space-x-2 font-mono font-bold text-amber-300 text-sm">
                    <HiExclamationTriangle className="w-5 h-5 text-amber-400 shrink-0" />
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
                className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6"
              >
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <HiUserGroup className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Team Composition & Requirements</h3>
                    <p className="text-xs text-slate-400">Rules governing team registration and eligibility</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {teamRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-xs sm:text-sm text-slate-200"
                    >
                      <HiCheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
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
                className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6"
              >
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                    <HiLightBulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">General Hackathon Guidelines</h3>
                    <p className="text-xs text-slate-400">Core rules for building, submitting, and logistics</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {generalGuidelines.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-300"
                    >
                      <HiCodeBracket className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
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
                className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6"
              >
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                  <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <HiShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Dress Code & Professional Conduct</h3>
                    <p className="text-xs text-slate-400">Standards for attending the Offline Grand Finale</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {dressCodeRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 text-xs sm:text-sm text-slate-200"
                    >
                      <HiCheckCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
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
                      className="glass-card p-5 rounded-3xl border border-slate-800 hover:border-cyan-500/40 space-y-3 transition-all"
                    >
                      <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
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
                className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6"
              >
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <HiScale className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Judging & Evaluation Criteria</h3>
                    <p className="text-xs text-slate-400">How projects will be evaluated by industry judges</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {judgingCriteria.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 flex flex-col justify-between"
                    >
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                        Criterion #{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <div className="pt-2 border-t border-slate-800 text-right">
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
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
        <div className="max-w-4xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-purple-950/40 border border-cyan-500/30 shadow-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-widest">
            <HiSparkles className="w-4 h-4 text-cyan-400" />
            <span>THINK. BUILD. INNOVATE.</span>
          </div>
          <h3 className="text-2xl font-black text-white">Ready to Showcase Your Innovations on a National Platform?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            HackSpora 2.0 is your opportunity to compete with top tech minds across the nation. Form your squad (3-5 members) and register today!
          </p>
        </div>
      </motion.div>
    </section>
  );
}
