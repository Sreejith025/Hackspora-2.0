import { motion } from 'framer-motion';
import {
 HiShieldCheck,
 HiUserGroup,
 HiEnvelope,
 HiCalendar,
 HiLockClosed,
 HiDocumentText,
 HiEye,
 HiShare,
 HiTrash,
 HiScale,
} from 'react-icons/hi2';

const glassCard =
 'rounded-3xl border border-white/25 bg-white/[0.12] backdrop-blur-2xl shadow-2xl shadow-black/25 transition-all duration-300';

const sections = [
 {
 icon: HiUserGroup,
 title: '1. Information We Collect',
 body: 'When you register for HackSpora 2.0, we collect the information you provide directly: full name, college name, email address, phone number, team name, and team member details. If you create an account through our authentication provider, we receive basic profile information such as your name, email, and profile picture (if you choose to provide one). We also collect technical information automatically when you visit our site, including IP address, browser type, device type, and pages visited, through standard server logs.',
 },
 {
 icon: HiEye,
 title: '2. How We Use Your Information',
 body: 'We use the information we collect to: (a) process your registration and manage your team for the Event, (b) communicate important updates about the Virtual Screening Round, Offline Grand Finale, and judging results, (c) verify your identity and college affiliation during on-site reporting, (d) issue certificates of participation and winner certificates, (e) respond to your queries sent via the Contact form, and (f) improve our website, services, and event experience for future editions.',
 },
 {
 icon: HiShare,
 title: '3. How We Share Your Information',
 body: 'We do not sell your personal information. We share data only with: (a) judging and mentor teams, who receive team rosters and project submissions for evaluation, (b) event sponsors, who may receive anonymized, aggregate statistics (never individual identifying data), (c) service providers who help us operate the site, send emails, or process payments, bound by confidentiality obligations, and (d) authorities when required by law or to protect the safety of participants.',
 },
 {
 icon: HiLockClosed,
 title: '4. Data Security',
 body: 'We implement reasonable administrative, technical, and physical safeguards to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Account passwords are handled exclusively by our authentication provider (Clerk) using industry-standard hashing; we never store raw passwords. Despite our efforts, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
 },
 {
 icon: HiDocumentText,
 title: '5. Cookies & Analytics',
 body: 'Our website uses a small number of essential cookies to keep you signed in and remember your preferences. We may use privacy-respecting analytics to understand aggregate traffic patterns. We do not use third-party advertising cookies. You can disable cookies in your browser settings; doing so may affect certain site features.',
 },
 {
 icon: HiCalendar,
 title: '6. Data Retention',
 body: 'We retain your registration data for the duration of the Event and for up to 12 months afterward for certificate issuance, dispute resolution, and post-event communications. After this period, identifying data is anonymized or deleted, except where retention is required by law (for example, financial transaction records).',
 },
 {
 icon: HiTrash,
 title: '7. Your Rights & Choices',
 body: 'You have the right to: (a) access the personal data we hold about you, (b) request correction of inaccurate or incomplete data, (c) request deletion of your data (subject to the retention rules above), (d) withdraw consent for optional communications such as marketing emails, and (e) lodge a complaint with the appropriate data protection authority. To exercise any of these rights, contact us at hackspora2.0@gmail.com.',
 },
 {
 icon: HiScale,
 title: '8. Children\'s Privacy',
 body: 'HackSpora 2.0 is intended for college and university students and is not directed at children under 16. We do not knowingly collect personal information from anyone under 16. If we become aware that we have collected data from a child under 16, we will delete it promptly.',
 },
 {
 icon: HiEnvelope,
 title: '9. Changes to This Policy',
 body: 'We may update this Privacy Policy from time to time. Material changes will be communicated to registered participants via email and posted on this page with a revised "Last updated" date. Your continued use of our website and participation in the Event after such updates constitutes acceptance of the revised policy.',
 },
];

export default function PrivacyPolicy() {
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
 <HiShieldCheck className="w-4 h-4 text-white" />
 <span>Legal</span>
 </div>

 <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
 Privacy
 <br />
 <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
 Policy
 </span>
 </h1>

 <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
 This policy explains what personal information HackSpora 2.0 collects, how we use it, and the choices you have.
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
 By using our website and participating in HackSpora 2.0, you acknowledge that you have read and understood this Privacy Policy.
 </div>
 </motion.div>
 </section>
 );
}