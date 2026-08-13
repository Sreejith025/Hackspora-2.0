import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
 HiEnvelope,
 HiPhone,
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
 <footer className="relative border-t border-slate-800 bg-black text-slate-300 pt-16 pb-8 overflow-hidden">
 <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-800">

 {/* Column 1: Brand & Bio (4 cols) */}
 <div className="lg:col-span-4 space-y-4">
 <Link
 to="/"
 onClick={() => handleNavClick('home')}
 className="inline-flex items-center space-x-2.5 group cursor-pointer"
 >
 <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500 transition-colors">
 <img
 src="/logos/hackspora.jpg"
 alt="Hackspora 2.0 Logo"
 className="h-9 w-auto rounded-lg object-contain bg-white p-0.5"
 />
 </div>
 <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
 Hackspora <span className="text-blue-300 font-black">2.0</span>
 </span>
 </Link>

 <div className="flex items-center space-x-2.5">
 <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] sm:text-xs font-medium">
 <img src="/logos/kahe.jpg" alt="KAHE Logo" className="h-4 w-auto rounded bg-white p-0.5" />
 <img src="/logos/aids.jpg" alt="AIDS Logo" className="h-4 w-auto rounded bg-white p-0.5" />
 <span className="ml-1">Dept. of AI & DS, KAHE</span>
 </div>
 </div>

 <p className="text-sm sm:text-sm text-slate-400 leading-relaxed max-w-sm">
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
 className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] hover:scale-110 active:scale-95 transition-colors"
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
 <h3 className="text-sm sm:text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center space-x-1.5">
 <HiUserGroup className="w-4 h-4 text-blue-300" />
 <span>MISSION CONTROL</span>
 </h3>
 <ul className="space-y-1 text-sm sm:text-sm text-slate-300 pl-1">
 <li className="flex items-center space-x-2">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
 <span>Ms. ANUSRI A</span>
 </li>
 <li className="flex items-center space-x-2">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
 <span>Mr. PRASANNA S</span>
 </li>
 </ul>
 </div>

 {/* Tech Force */}
 <div className="space-y-2.5 pt-2 border-t border-slate-800">
 <h3 className="text-sm sm:text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center space-x-1.5">
 <HiCpuChip className="w-4 h-4 text-blue-300" />
 <span>TECH FORCE</span>
 </h3>
 <ul className="space-y-1 text-sm sm:text-sm text-slate-300 pl-1">
 <li className="flex items-center space-x-2">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
 <span>Mr. SREEJITH M</span>
 </li>
 <li className="flex items-center space-x-2">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
 <span>Mr. SAILESH T</span>
 </li>
 </ul>
 </div>
 </div>

 {/* Column 3: Help Zone & Support Email (3 cols) */}
 <div className="lg:col-span-3 space-y-5">
 {/* Help Zone */}
 <div className="space-y-3">
 <h3 className="text-sm sm:text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center space-x-1.5">
 <HiPhone className="w-4 h-4 text-blue-300" />
 <span>HELP ZONE</span>
 </h3>
 <div className="space-y-2.5 text-sm sm:text-sm text-slate-300 pl-1">
 <div>
 <div className="font-semibold text-white">Mr. SUYAMBU ANANDH J</div>
 <a
 href="tel:+917708118216"
 className="inline-flex items-center space-x-1.5 text-blue-300 hover:text-blue-200 transition-colors mt-0.5 text-sm sm:text-xs font-medium"
 >
 <HiPhone className="w-3 h-3 text-blue-300" />
 <span>+91 77081 18216</span>
 </a>
 </div>

 <div>
 <div className="font-semibold text-white">Mr. DHAYANITHI N</div>
 <a
 href="tel:+918056698240"
 className="inline-flex items-center space-x-1.5 text-blue-300 hover:text-blue-200 transition-colors mt-0.5 text-sm sm:text-xs font-medium"
 >
 <HiPhone className="w-3 h-3 text-blue-300" />
 <span>+91 73393 64267</span>
 </a>
 </div>
 </div>
 </div>

 {/* Support Email */}
 <div className="pt-3 border-t border-slate-800 space-y-1.5">
 <div className="text-sm sm:text-[11px] uppercase tracking-wider text-blue-300 font-bold">
 SUPPORT EMAIL
 </div>
 <a
 href="mailto:hackspora2.0@gmail.com"
 className="inline-flex items-center space-x-2 text-sm sm:text-sm text-white hover:text-slate-200 transition-colors break-all"
 >
 <HiEnvelope className="w-4 h-4 text-white shrink-0" />
 <span className="font-medium">hackspora2.0@gmail.com</span>
 </a>
 </div>
 </div>

 {/* Column 4: Quick Navigation & Back to Top (2 cols) */}
 <div className="lg:col-span-2 space-y-5 flex flex-col justify-between items-start">
 <div className="w-full space-y-3">
 <h3 className="text-sm sm:text-xs font-bold uppercase tracking-wider text-blue-300">
 Quick Navigation
 </h3>
 <ul className="space-y-1.5 text-sm text-slate-400">
 {quickLinks.map((link) => (
 <li key={link.id}>
 <button
 onClick={() => handleNavClick(link.id)}
 className="hover:text-white transition-colors cursor-pointer"
 >
 {link.name}
 </button>
 </li>
 ))}
 </ul>
 </div>
 </div>

 </div>

 {/* Bottom copyright and legal section */}
 <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm sm:text-xs text-slate-400 text-center sm:text-left">
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-1 gap-y-1">
 <span>&copy; {new Date().getFullYear()} Hackspora 2.0.</span>
 <span>All rights reserved. Built with</span>
 <HiHeart className="w-3.5 h-3.5 text-red-500 inline mx-0.5" />
 <span>by Dept. of AI & DS</span>
 </div>

 <div className="flex items-center justify-center gap-2 sm:-translate-x-16 text-sm">
 <span>Powered by</span>
 <a
 href="https://www.codecraftnet.com/"
 target="_blank"
 rel="noopener noreferrer"
 className="text-slate-400 hover:text-[#4a5cd9] transition-colors font-semibold"
 >
 Code Craft
 </a>
 </div>

 <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6">
 <Link
 to="/terms"
 className="hover:text-white transition-colors flex items-center space-x-1"
 >
 <HiDocumentText className="w-3.5 h-3.5 text-white" />
 <span>Terms</span>
 </Link>
 <Link
 to="/privacy"
 className="hover:text-white transition-colors flex items-center space-x-1"
 >
 <HiShieldCheck className="w-3.5 h-3.5 text-white" />
 <span>Privacy</span>
 </Link>
 </div>
 </div>

 </div>
 </footer>
 );
}