import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
 HiEnvelope,
 HiPhone,
 HiMapPin,
 HiPaperAirplane,
 HiBuildingLibrary,
 HiChatBubbleLeftRight,
 HiUser,
 HiAtSymbol,
 HiChatBubbleBottomCenterText,
} from 'react-icons/hi2';

const glassCard =
 'rounded-3xl border border-white/25 bg-white/[0.12] backdrop-blur-2xl shadow-2xl shadow-black/25 transition-all duration-300 overflow-hidden';

const glassCardInteractive =
 'rounded-3xl border border-white/25 bg-white/[0.12] backdrop-blur-2xl shadow-2xl shadow-black/25 hover:border-white/40 hover:bg-white/[0.16] transition-all duration-300';

const detailItems = [
 {
 icon: HiEnvelope,
 label: 'Email Support',
 value: 'hackspora2.0@gmail.com',
 },
 {
 icon: HiPhone,
 label: 'Helpline',
 value: '+91 90438 69570',
 },
 {
 icon: HiMapPin,
 label: 'Venue Location',
 value: 'KAHE, Coimbatore, TN',
 },
];

export default function ContactSection() {
 const [form, setForm] = useState({ name: '', email: '', message: '' });
 const [isSending, setIsSending] = useState(false);

 const handleSubmit = (e) => {
 if (!form.name || !form.email || !form.message) {
 e.preventDefault();
 toast.error('Please fill in all contact fields.');
 return;
 }
 setIsSending(true);
 };

 const inputClass =
 'w-full bg-white/[0.08] border border-white/20 focus:border-white/60 focus:bg-white/[0.14] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none transition-all duration-200 backdrop-blur-xl';

 return (
 <section id="contact" className="scroll-mt-20 sm:scroll-mt-28 relative py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
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
 <HiChatBubbleLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4a5cd9]" />
 <span>Contact & Venue</span>
 </div>

 <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
 Get in Touch With
 <br />
 <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
 Our Team
 </span>
 </h2>

 <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto">
 Have questions or sponsorship inquiries? Send us a message and our organizing team will get back to you shortly.
 </p>
 </div>

 {/* Contact Layout */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch max-w-6xl mx-auto">
 {/* Left Info Cards */}
 <div className="lg:col-span-5 space-y-6 flex flex-col">
 {/* Primary contact card */}
 <div className={`${glassCardInteractive} p-5 sm:p-7 space-y-5 flex-1`}>
 <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80" />
 <div className="relative space-y-4">
 <h3 className="text-base sm:text-xl font-extrabold text-white border-b border-white/15 pb-3">
 Contact Details
 </h3>

 <div className="space-y-3 sm:space-y-4">
 {detailItems.map((item, idx) => {
 const Icon = item.icon;
 return (
 <div
 key={idx}
 className="group/detail flex items-center gap-3 sm:gap-4 p-3 rounded-2xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/35 transition-all duration-300"
 >
 <div className="relative shrink-0 p-2.5 sm:p-3 rounded-xl bg-white/15 border border-white/25 text-white shadow-lg shadow-black/20 backdrop-blur-xl transition-colors duration-300 group-hover/detail:bg-white group-hover/detail:text-black">
 <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
 </div>
 <div className="min-w-0">
 <span className="block uppercase text-[10px] tracking-widest font-bold text-slate-400">
 {item.label}
 </span>
 <span className="block text-xs sm:text-sm font-bold text-white break-words">
 {item.value}
 </span>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Organized-by card */}
 <div className={`${glassCardInteractive} p-5 sm:p-7 space-y-3`}>
 <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80" />
 <div className="relative space-y-3">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.16] border border-white/25 backdrop-blur-xl text-[10px] tracking-widest font-extrabold uppercase text-white">
 <HiBuildingLibrary className="w-4 h-4" />
 <span>Organized by</span>
 </div>
 <h4 className="text-base sm:text-lg font-extrabold text-white">
 HackSpora 2.0 Organizing Committee
 </h4>
 <p className="text-xs sm:text-sm text-slate-300">
 Department of AI &amp; Data Science, KAHE.
 </p>
 </div>
 </div>
 </div>

 {/* Right Form */}
 <div className={`${glassCard} lg:col-span-7 p-5 sm:p-8 space-y-6`}>
 <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/12 via-white/[0.03] to-transparent opacity-80" />
 <div className="relative space-y-6">
 <div className="space-y-2 border-b border-white/15 pb-4">
 <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
 Send Us a Message
 </h3>
 <p className="text-xs sm:text-sm text-slate-300">
 We typically respond within 24–48 hours.
 </p>
 </div>

 <form
 action="https://formsubmit.co/abisri024@gmail.com"
 method="POST"
 onSubmit={handleSubmit}
 className="space-y-5"
 >
 {/* FormSubmit Configuration */}
 <input type="hidden" name="_next" value="https://hackspora-2-0.vercel.app" />
 <input type="hidden" name="_subject" value="New Contact Message - Hackspora 2.0" />
 <input type="hidden" name="_template" value="table" />
 <input type="hidden" name="_captcha" value="false" />

 {/* Name Field */}
 <div className="space-y-1.5">
 <label
 htmlFor="contact-name"
 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-300"
 >
 <HiUser className="w-3.5 h-3.5 text-white/80" />
 <span>Your Name *</span>
 </label>
 <input
 id="contact-name"
 type="text"
 name="name"
 required
 value={form.name}
 onChange={(e) => setForm({ ...form, name: e.target.value })}
 placeholder="e.g. Alex Johnson"
 className={inputClass}
 />
 </div>

 {/* Email Field */}
 <div className="space-y-1.5">
 <label
 htmlFor="contact-email"
 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-300"
 >
 <HiAtSymbol className="w-3.5 h-3.5 text-white/80" />
 <span>Email Address *</span>
 </label>
 <input
 id="contact-email"
 type="email"
 name="email"
 required
 value={form.email}
 onChange={(e) => setForm({ ...form, email: e.target.value })}
 placeholder="alex@college.edu"
 className={inputClass}
 />
 </div>

 {/* Message Field */}
 <div className="space-y-1.5">
 <label
 htmlFor="contact-message"
 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-300"
 >
 <HiChatBubbleBottomCenterText className="w-3.5 h-3.5 text-white/80" />
 <span>Message *</span>
 </label>
 <textarea
 id="contact-message"
 rows="5"
 name="message"
 required
 value={form.message}
 onChange={(e) => setForm({ ...form, message: e.target.value })}
 placeholder="Write your query or message..."
 className={`${inputClass} resize-none`}
 />
 </div>

 {/* Submit Button */}
 <button
 type="submit"
 disabled={isSending}
 className="group/submit relative w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-extrabold text-sm text-white bg-[#3645bf] hover:bg-[#4a5cd9] disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
 >
 <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/submit:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
 <span className="relative inline-flex items-center gap-2.5">
 <HiPaperAirplane className="w-4 h-4 transition-transform duration-300 group-hover/submit:-translate-y-0.5 group-hover/submit:translate-x-0.5" />
 <span>{isSending ? 'Sending Message...' : 'Send Message'}</span>
 </span>
 </button>
 </form>
 </div>
 </div>
 </div>
 </motion.div>
 </section>
 );
}