import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiSparkles,
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiPaperAirplane,
  HiBuildingLibrary,
} from 'react-icons/hi2';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all contact fields.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setForm({ name: '', email: '', message: '' });
      toast.success('Your message has been sent to the Hackspora team!');
    }, 1000);
  };

  return (
    <section id="contact" className="scroll-mt-28 relative py-24 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
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
            <span>CONTACT & VENUE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Get in Touch With <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">Us</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            Have questions or sponsorship inquiries? Send us a message and our team will get back to you shortly.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Left Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Contact Details</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                    <HiEnvelope className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Email Support</span>
                    <span className="font-bold text-white">support@hackspora.in</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
                    <HiPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Helpline</span>
                    <span className="font-bold text-white">+91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
                    <HiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[10px]">Venue Location</span>
                    <span className="font-bold text-white">Main Tech Park Campus, Chennai, TN</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-indigo-950/30 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-300 text-xs font-mono font-bold">
                <HiBuildingLibrary className="w-4 h-4 text-cyan-400" />
                <span>ORGANIZED BY</span>
              </div>
              <h4 className="text-base font-bold text-white">Hackspora 2.0 Organizing Committee</h4>
              <p className="text-xs text-slate-400">Department of Computer Science & Engineering</p>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-white">Send Us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="alex@college.edu"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  Message *
                </label>
                <textarea
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your query or message..."
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 rounded-xl font-extrabold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-[1.01] shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <HiPaperAirplane className="w-4 h-4" />
                <span>{isSending ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
