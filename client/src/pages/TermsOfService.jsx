import { motion } from 'framer-motion';
import {
 HiDocumentText,
 HiCheckCircle,
 HiCalendar,
 HiUserGroup,
 HiShieldCheck,
 HiExclamationTriangle,
 HiScale,
} from 'react-icons/hi2';

const glassCard =
 'rounded-3xl border border-white/25 bg-white/[0.12] backdrop-blur-2xl shadow-2xl shadow-black/25 transition-all duration-300';

const sections = [
 {
 icon: HiCheckCircle,
 title: '1. Acceptance of Terms',
 body: 'By registering for, accessing, or participating in HackSpora 2.0 (the "Event"), you agree to be bound by these Terms of Service. If you do not agree, please do not register or participate. The Event is organized by the Department of Artificial Intelligence and Data Science, Karpagam Academy of Higher Education (KAHE) in association with AI Qubit.',
 },
 {
 icon: HiUserGroup,
 title: '2. Eligibility & Team Composition',
 body: 'The Event is open to all undergraduate, postgraduate, and diploma students from recognized institutions in India. Teams must consist of a minimum of 3 and a maximum of 5 members, including the Team Leader. Each participant must carry a valid College ID Card at all times during the Offline Grand Finale. Multiple registrations under different team names by the same individual are not permitted.',
 },
 {
 icon: HiCalendar,
 title: '3. Event Rounds, Schedule & Conduct',
 body: 'Round 1 (Virtual Screening) takes place on 23 August 2026 over a 7-hour window. Round 2 (Grand Finale) is a 24-hour offline hackathon on 18 & 19 September 2026 at KAHE, Coimbatore. Problem statements for the Virtual and Offline rounds are distinct and will be released at the start of each round. Participants must develop solutions strictly within the event timeline and follow all rules of fair play, including the no-plagiarism policy.',
 },
 {
 icon: HiScale,
 title: '4. Intellectual Property',
 body: 'Teams retain ownership of the intellectual property they create during the Event. By participating, you grant the organizers a non-exclusive, royalty-free license to showcase, document, and promote your project for non-commercial purposes related to HackSpora (including on websites, social media, and post-event reports). Open-source libraries, frameworks, and APIs may be used with proper attribution.',
 },
 {
 icon: HiShieldCheck,
 title: '5. Code of Conduct',
 body: 'All participants are expected to maintain professional behavior with judges, mentors, industry experts, organizers, and peers. Harassment, discrimination, plagiarism, cheating, or any form of malpractice will result in immediate disqualification and removal from the venue. Plagiarism detection and code-quality assessments will be conducted throughout the Event.',
 },
 {
 icon: HiExclamationTriangle,
 title: '6. Disqualification & Refunds',
 body: 'The organizing committee reserves the right to disqualify any team that violates these Terms. The ₹250 per-participant fee for the Offline Grand Finale is non-refundable once participation is confirmed, except in cases of Event cancellation by the organizers, in which case a full refund will be processed within 30 working days.',
 },
 {
 icon: HiCheckCircle,
 title: '7. Limitation of Liability',
 body: 'The organizers are not responsible for any loss, theft, or damage to personal property, or for any injury sustained during the Event. Participants attend the Offline Grand Finale at their own risk. The organizers reserve the right to modify the schedule, rules, or venue if circumstances require, with reasonable notice to participants.',
 },
 {
 icon: HiScale,
 title: '8. Modifications & Contact',
 body: 'These Terms may be updated at any time; material changes will be communicated to registered participants via email. Continued participation after such updates constitutes acceptance of the revised Terms. For questions about these Terms, contact the organizing team at hackspora2.0@gmail.com.',
 },
];

export default function TermsOfService() {
 return (
 <section className="scroll-mt-28 relative pt-28 pb-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto bg-black overflow-hidden">
 <motion.div
 initial={{ opacity: 0, y: 50 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.15 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 className="space-y-12"
 >
 {/* Header */}
 <div className="text-center space-y-5 max-w-3xl mx-auto">
 <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.12] border border-white/25 backdrop-blur-2xl text-white text-xs font-bold tracking-widest uppercase shadow-lg shadow-black/20">
 <HiDocumentText className="w-4 h-4 text-white" />
 <span>Legal</span>
 </div>

 <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
 Terms of
 <br />
 <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
 Service
 </span>
 </h1>

 <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
 These terms govern your participation in HackSpora 2.0. Please read them carefully before registering or joining the Event.
 </p>

 <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-slate-400">
 <HiCalendar className="w-3.5 h-3.5" />
 <span>Last updated: August 2026</span>
 </div>
 </div>

 {/* Sections */}
 <div className="max-w-4xl mx-auto space-y-6">
 {sections.map((section, idx) => {
 const Icon = section.icon;
 return (
 <motion.article
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.2 }}
 transition={{ duration: 0.5, delay: idx * 0.05 }}
 className={`${glassCard} p-6 sm:p-8 space-y-4`}
 >
 <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80" />
 <div className="relative flex items-start gap-4">
 <div className="shrink-0 p-3 rounded-2xl bg-white/15 border border-white/25 text-white shadow-lg shadow-black/20 backdrop-blur-xl">
 <Icon className="w-5 h-5" />
 </div>
 <div className="space-y-2 min-w-0">
 <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
 {section.title}
 </h2>
 <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed">
 {section.body}
 </p>
 </div>
 </div>
 </motion.article>
 );
 })}
 </div>

 {/* Acknowledgement */}
 <div className="max-w-4xl mx-auto text-center text-xs sm:text-sm text-slate-400 pt-4">
 By participating in HackSpora 2.0, you acknowledge that you have read, understood, and agreed to these Terms of Service.
 </div>
 </motion.div>
 </section>
 );
}