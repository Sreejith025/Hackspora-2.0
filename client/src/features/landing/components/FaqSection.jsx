import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles, HiChevronDown } from 'react-icons/hi2';

const faqs = [
  {
    q: 'Who is organizing HackSpora 2.0 and who can participate?',
    a: 'HackSpora 2.0 is organized by the Department of Artificial Intelligence and Data Science, Karpagam Academy of Higher Education (KAHE) in association with AI Qubit. It is open to all undergraduate, postgraduate, and diploma students across recognized institutions in India.',
  },
  {
    q: 'When is the registration fee collected?',
    a: 'Initial team registration is open. The registration fee of ₹250 per participant is collected ONLY after a team is shortlisted in the Round 1 Virtual Screening Round and confirms participation in the Offline Grand Finale.',
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

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="scroll-mt-28 relative py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-16"
      >
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
            <HiSparkles className="w-4 h-4 text-cyan-400" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Got Questions? We Have <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">Answers</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            Find official details about registration, fee payment, team rules, and logistics.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="glass-card rounded-2xl border border-slate-800 hover:border-cyan-500/40 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-tight">{faq.q}</span>
                  <div
                    className={`p-1.5 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-cyan-500/10 border-cyan-500/30' : ''
                    }`}
                  >
                    <HiChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
