import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiEnvelope,
  HiPhone,
  HiArrowUp,
  HiShieldCheck,
  HiDocumentText,
  HiHeart,
  HiUserGroup,
  HiCpuChip,
} from 'react-icons/hi2';
import { FaGithub, FaLinkedin, FaInstagram, FaXTwitter, FaDiscord } from 'react-icons/fa6';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId) => {
    const targetScroll = () => {
      if (window.lenis) {
        window.lenis.scrollTo(`#${sectionId}`, { offset: -80, duration: 1.2 });
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          const navHeight = 80;
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    };

    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(targetScroll, 120);
    } else {
      targetScroll();
    }
  };

  const quickLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Guidelines', id: 'guidelines' },
    { name: 'Problem Statements', id: 'problems' },
    { name: 'Schedule', id: 'schedule' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact Us', id: 'contact' },
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: FaGithub },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedin },
    { name: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
    { name: 'X / Twitter', href: 'https://x.com', icon: FaXTwitter },
    { name: 'Discord', href: 'https://discord.com', icon: FaDiscord },
  ];

  return (
    <footer className="relative border-t border-slate-800/80 bg-slate-950/90 text-slate-300 pt-16 pb-8 backdrop-blur-xl overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              to="/"
              onClick={() => handleNavClick('home')}
              className="inline-flex items-center space-x-2.5 group cursor-pointer"
            >
              <div className="p-1 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/logos/hackspora.jpg"
                  alt="Hackspora 2.0 Logo"
                  className="h-9 w-auto rounded-lg object-contain bg-white p-0.5"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                Hackspora <span className="text-cyan-400 font-black">2.0</span>
              </span>
            </Link>

            <div className="flex items-center space-x-2.5">
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-medium">
                <img src="/logos/kahe.jpg" alt="KAHE Logo" className="h-4 w-auto rounded bg-white p-0.5" />
                <img src="/logos/aids.jpg" alt="AIDS Logo" className="h-4 w-auto rounded bg-white p-0.5" />
                <span className="ml-1">Dept. of AI & DS, KAHE</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier national-level hackathon driving technology innovation, artificial intelligence solutions, and real-world impact for future creators.
            </p>

            {/* Social Icons */}
            <div className="pt-2 flex items-center space-x-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-slate-800/80 hover:scale-110 active:scale-95 transition-all shadow-md"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Mission Control & Tech Force (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mission Control */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <HiUserGroup className="w-4 h-4 text-cyan-400" />
                <span>MISSION CONTROL</span>
              </h3>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-300 pl-1">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>Ms. ANUSRI A</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>Mr. PRASANNA S</span>
                </li>
              </ul>
            </div>

            {/* Tech Force */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <HiCpuChip className="w-4 h-4 text-indigo-400" />
                <span>TECH FORCE</span>
              </h3>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-300 pl-1">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>Mr. SREEJITH M</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>Mr. PRABHU S</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Help Zone & Support Email (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Help Zone */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <HiPhone className="w-4 h-4 text-emerald-400" />
                <span>HELP ZONE</span>
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 pl-1">
                <div>
                  <div className="font-semibold text-white">Mr. SUYAMBU ANANDH J</div>
                  <a
                    href="tel:+917708118216"
                    className="inline-flex items-center space-x-1.5 text-cyan-300 hover:text-cyan-200 transition-colors mt-0.5 text-xs font-mono font-medium"
                  >
                    <HiPhone className="w-3 h-3 text-cyan-400" />
                    <span>+91 77081 18216</span>
                  </a>
                </div>

                <div>
                  <div className="font-semibold text-white">Mr. HARISH S</div>
                  <a
                    href="tel:+918056698240"
                    className="inline-flex items-center space-x-1.5 text-cyan-300 hover:text-cyan-200 transition-colors mt-0.5 text-xs font-mono font-medium"
                  >
                    <HiPhone className="w-3 h-3 text-cyan-400" />
                    <span>+91 80566 98240</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Support Email */}
            <div className="pt-3 border-t border-slate-800/60 space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                SUPPORT EMAIL
              </div>
              <a
                href="mailto:hackspora2.0@gmail.com"
                className="inline-flex items-center space-x-2 text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                <HiEnvelope className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-medium">hackspora2.0@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Column 4: Quick Navigation & Back to Top (2 cols) */}
          <div className="lg:col-span-2 space-y-5 flex flex-col justify-between items-start md:items-end">
            <div className="w-full space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 md:text-right">
                Quick Navigation
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400 md:text-right">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className="hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={scrollToTop}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400/50 hover:bg-slate-800 transition-all flex items-center space-x-2 text-xs font-semibold shadow-lg group cursor-pointer"
            >
              <span>Back to top</span>
              <HiArrowUp className="w-4 h-4 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

        {/* Bottom copyright and legal section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <span>&copy; {new Date().getFullYear()} Hackspora 2.0. All rights reserved. Built with</span>
            <HiHeart className="w-3.5 h-3.5 text-red-500 inline mx-0.5" />
            <span>by Dept. of AI & DS</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer flex items-center space-x-1">
              <HiDocumentText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Terms of Service</span>
            </span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer flex items-center space-x-1">
              <HiShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Privacy Policy</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
