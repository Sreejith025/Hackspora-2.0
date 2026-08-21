import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 HiQuestionMarkCircle,
 HiPlus,
 HiMinus,
} from 'react-icons/hi2';

const faqs = [
 {
 q: 'Who is organizing HackSpora 2.0 and who can participate?',
 a: 'HackSpora 2.0 is organized by the Department of Artificial Intelligence and Data Science, Karpagam Academy of Higher Education (KAHE) in association with AI Qubit. It is open to all undergraduate, postgraduate, and diploma students across recognized institutions in India.',
 },
 {
 q: 'When is the registration fee collected?',
 a: 'Initial team registration is open. The registration fee of ₹1250 per Team is collected ONLY after a team is shortlisted in the Round 1 Virtual Screening Round and confirms participation in the Offline Grand Finale.',
 },
 {
 q: 'What is the required team size?',
 a: 'Teams must have a minimum of 3 members and a maximum of 5 members (Team Leader + 2 to 4 members). All team members must carry a valid College ID Card.',
 },
 {
 q: 'What are the event rounds and dates?',
 a: 'Round 1 (Virtual Screening) is on 23 August 2026 (7-hour hackathon, problem statements at 9:30 AM, submission 5:00-6:00 PM). Round 2 (Grand Finale) is a 24-hour offline hackathon on 18 & 19 September 2026 at KAHE, Coimbatore.',
 },
 {
 q: 'Are problem statements the same for Virtual and Offline rounds?',
 a: 'No! The problem statements for the Virtual Screening Round and the Offline Grand Finale will be completely different and released at the start of each respective round.',
 },
 {
 q: 'What is the dress code and conduct requirement for the Grand Finale?',
 a: 'Participants must attend the Offline Grand Finale in formal or smart professional attire, wear a valid College ID Card at all times, and maintain professional behavior throughout the event.',
 },
];

const faqGlassCard =
 'group rounded-2xl border border-white/25 bg-white/[0.12] backdrop-blur-2xl shadow-2xl shadow-black/25 hover:border-white/40 hover:bg-white/[0.16] transition-all duration-300 overflow-hidden';

export default function FaqSection() {
 const [openIndex, setOpenIndex] = useState(0);

 const toggleFaq = (idx) => {
 setOpenIndex((prev) => (prev === idx ? null : idx));
 };

 return (
 <section id="faq" className="scroll-mt-20 sm:scroll-mt-28 relative py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
 <motion.div
 initial={{ opacity: 0, y: 50 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.15 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 className="space-y-10 sm:space-y-16"
 >
 {/* Header */}
 <div className="text-center space-y-4 sm:space-y-5 max-w-3xl mx-auto">
 <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/25 backdrop-blur-2xl text-[#4a5cd9] text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-lg shadow-black/20">
 <HiQuestionMarkCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4a5cd9]" />
 <span>Frequently Asked Questions</span>
 </div>

 <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
 Got Questions? We Have
 <br />
 <span className="text-[#4a5cd9]">Answers</span>
 </h2>

 <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto">
 Find official details about registration, fee payment, team rules, and logistics for HackSpora 2.0.
 </p>
 </div>

 {/* Accordion List */}
 <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
 {faqs.map((faq, idx) => {
 const isOpen = openIndex === idx;
 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.2 }}
 transition={{ duration: 0.5, delay: idx * 0.05 }}
 className={faqGlassCard}
 >
 <button
 type="button"
 onClick={() => toggleFaq(idx)}
 aria-expanded={isOpen}
 aria-controls={`faq-panel-${idx}`}
 className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-2xl"
 >
 <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
 <span
 className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black border transition-colors duration-300 ${
 isOpen
 ? 'bg-white text-black border-white'
 : 'bg-white/[0.16] border-white/25 text-white'
 }`}
 >
 {String(idx + 1).padStart(2, '0')}
 </span>
 <span className="text-sm sm:text-base font-bold text-white leading-snug break-words">{faq.q}</span>
 </div>

 <div
 className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
 isOpen
 ? 'bg-white text-black border-white rotate-90'
 : 'bg-white/[0.16] border-white/25 text-white group-hover:bg-white/25'
 }`}
 >
 {isOpen ? (
 <HiMinus className="w-4 h-4 sm:w-5 sm:h-5" />
 ) : (
 <HiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
 )}
 </div>
 </button>

 <AnimatePresence initial={false}>
 {isOpen && (
 <motion.div
 id={`faq-panel-${idx}`}
 key="content"
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{
 height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
 opacity: { duration: 0.25, ease: 'easeInOut' },
 }}
 className="overflow-hidden"
 >
 <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 border-t border-white/15 mt-0">
 <motion.p
 initial={{ y: 6, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 6, opacity: 0 }}
 transition={{ duration: 0.3, delay: 0.05 }}
 className="text-xs sm:text-[15px] text-slate-300 leading-relaxed pl-0 sm:pl-[3.25rem]"
 >
 {faq.a}
 </motion.p>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 );
 })}
 </div>

 {/* Bottom helper */}
 <div className="max-w-3xl mx-auto text-center pt-2">
 <p className="text-xs sm:text-sm text-slate-400">
 Still curious? Reach out to the organizing team via the contact page.
 </p>
 </div>
 </motion.div>
 </section>
 );
}
