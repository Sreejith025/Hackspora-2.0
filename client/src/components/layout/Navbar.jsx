import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, UserButton } from '@clerk/clerk-react';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { isAdminUser } from '../../constants/authConfig';
import { useRegisterFlow } from '../../hooks';

const sectionLinks = [
 { name: 'Home', id: 'home' },
 { name: 'About', id: 'about' },
 { name: 'Guidelines', id: 'guidelines' },
 { name: 'Schedule', id: 'schedule' },
 { name: 'FAQ', id: 'faq' },
 { name: 'Contact', id: 'contact' },
];

export default function Navbar() {
 const [isScrolled, setIsScrolled] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [activeSection, setActiveSection] = useState('home');
 const scrollSpySuspendedRef = useRef(false);

 const location = useLocation();
 const navigate = useNavigate();
 const { isSignedIn, user } = useUser();

 const userEmail = user?.primaryEmailAddress?.emailAddress;
 const isAdmin = isSignedIn && isAdminUser(userEmail);

 const { isRegistered } = useRegisterFlow();

 // Handle Navbar Blur and Scroll Spy
 useEffect(() => {
 const handleScroll = () => {
 // Navbar Glassmorphism Blur state
 if (window.scrollY > 20) {
 setIsScrolled(true);
 } else {
 setIsScrolled(false);
 }
 };

 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 // Intersection Observer for Scroll Spy
 useEffect(() => {
 if (location.pathname !== '/') return;

 const sectionIds = sectionLinks.map((s) => s.id);

 const computeActive = () => {
 const sections = sectionIds
 .map((id) => document.getElementById(id))
 .filter(Boolean);
 if (!sections.length) return 'home';

 // Anchor to viewport-relative rect.top so this works for both native scroll
 // and Lenis (which uses CSS transforms and makes window.scrollY unreliable).
 const navOffset = 120; // navbar height + buffer
 const referenceTop = -(window.innerHeight * 0.4); // active when section reaches ~40% from top

 // Walk the sections in DOM order. DOM order matches their vertical layout in this page,
 // so as soon as we find one whose top is below the reference line, the previous section
 // is the active one.
 let lastActiveId = sections[0].id;
 for (const section of sections) {
 const top = section.getBoundingClientRect().top;
 if (top <= navOffset) {
 lastActiveId = section.id;
 }
 if (top > referenceTop) {
 break;
 }
 }
 return lastActiveId;
 };

 const handleScrollSpy = () => {
 // Don't overwrite the click-set active section during a programmatic scroll animation.
 if (scrollSpySuspendedRef.current) return;
 const id = computeActive();
 setActiveSection(id);
 };

 handleScrollSpy();

 // Hook into Lenis scroll if available (the project uses Lenis for smooth scroll,
 // which suppresses native window scroll events on most browsers).
 let rafId = null;
 const onLenisScroll = () => {
 if (rafId !== null) return;
 rafId = window.requestAnimationFrame(() => {
 rafId = null;
 handleScrollSpy();
 });
 };

 const attachLenis = () => {
 if (window.lenis && typeof window.lenis.on === 'function') {
 window.lenis.on('scroll', onLenisScroll);
 return true;
 }
 return false;
 };

 const lenisAttached = attachLenis();

 window.addEventListener('scroll', handleScrollSpy, { passive: true });
 window.addEventListener('resize', handleScrollSpy);

 // Try again shortly after mount in case Lenis initializes after the navbar.
 const retry = setTimeout(() => {
 if (!lenisAttached) attachLenis();
 handleScrollSpy();
 }, 300);

 return () => {
 clearTimeout(retry);
 window.removeEventListener('scroll', handleScrollSpy);
 window.removeEventListener('resize', handleScrollSpy);
 if (rafId !== null) window.cancelAnimationFrame(rafId);
 if (window.lenis && typeof window.lenis.off === 'function') {
 window.lenis.off('scroll', onLenisScroll);
 }
 };
 }, [location.pathname]);

 // Smooth Scroll Click Handler
 const handleNavClick = (sectionId) => {
 setMobileMenuOpen(false);

 // Suppress the scroll-spy for the duration of the smooth-scroll animation so it
 // can't overwrite the section we just selected with an intermediate value.
 scrollSpySuspendedRef.current = true;

 // Update the active section immediately so the navbar reflects the click
 // even before (or without) any scroll event firing.
 if (location.pathname === '/') setActiveSection(sectionId);

 const targetScroll = () => {
 if (window.lenis) {
 window.lenis.scrollTo(`#${sectionId}`, { offset: -80, duration: 1.2, onComplete: () => {
 scrollSpySuspendedRef.current = false;
 setActiveSection(sectionId);
 }});
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
 // Re-enable the spy once native smooth-scroll completes.
 setTimeout(() => {
 scrollSpySuspendedRef.current = false;
 setActiveSection(sectionId);
 }, 700);
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

 return (
 <>
 <header
 className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
 isScrolled
 ? 'bg-black/40 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]'
 : 'bg-black/30 backdrop-blur-md border-b border-white/5 py-2.5 sm:py-4 lg:py-5 lg:bg-transparent lg:border-transparent'
 }`}
 style={{ paddingTop: 'max(0.625rem, env(safe-area-inset-top, 0))' }}
 >
 <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-12">
 <div className="flex items-center justify-between gap-2">
 {/* Header Brand & Institutional Logos */}
 <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0">
 {/* Main Hackspora Logo */}
 <Link
 to="/"
 onClick={() => handleNavClick('home')}
 className="flex items-center space-x-2 sm:space-x-2.5 group cursor-pointer shrink-0"
 >
 <div className="relative p-1 rounded-xl bg-slate-900 transition-all duration-300">
 <img
 src="/logos/hackspora.jpg"
 alt="Hackspora 2.0 Logo"
 className="h-7 sm:h-9 w-auto rounded-lg object-contain"
 />
 </div>
 <span className="text-lg xs:text-xl sm:text-xl lg:text-2xl font-medium tracking-tight text-white whitespace-nowrap">
 <span className="hidden sm:inline" style={{ textShadow: '2px 2px 0px #111184, 3px 3px 0px #000000' }}>
 Hackspora <span className="text-white font-medium">2.0</span>
 </span>
 <span className="sm:hidden">Hackspora <span className="text-white">2.0</span></span>
 </span>
 </Link>
 </div>

 {/* Desktop Navigation Links (Scroll Spy) */}
 <nav className="hidden lg:flex items-center space-x-1 -ml-12">
 {sectionLinks.map((link) => {
 const isActive = location.pathname === '/' && activeSection === link.id;
 return (
 <button
 key={link.id}
 onClick={() => handleNavClick(link.id)}
 className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
 isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
 }`}
 >
 {link.name}
 </button>
 );
 })}

  {/* Virtual Round Link */}
  <Link
    to="/virtual-round"
    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
      location.pathname.startsWith('/virtual-round')
        ? 'text-white font-semibold'
        : 'text-slate-400 hover:text-white'
    }`}
  >
    Virtual Round
  </Link>

 {/* Dashboard Link (only when user is registered) */}
 {isRegistered && (
 <Link
 to="/dashboard"
 className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
 location.pathname.startsWith('/dashboard')
 ? 'text-white font-semibold'
 : 'text-slate-400 hover:text-white'
 }`}
 >
 Dashboard
 </Link>
 )}

 {/* Admin Route Link (Only for abisri024@gmail.com) */}
 {isAdmin && (
 <Link
 to="/admin"
 className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
 location.pathname.startsWith('/admin')
 ? 'text-white font-semibold'
 : 'text-slate-400 hover:text-white'
 }`}
 >
 Admin
 </Link>
 )}
 </nav>

 {/* Desktop Action Buttons */}
 <div className="hidden lg:flex items-center space-x-4">
 {!isSignedIn ? (
 <>
 <Link
 to="/login"
 className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer"
 >
 Login
 </Link>
 <Link
 to="/signup"
 className="relative inline-flex items-center justify-center text-sm font-semibold rounded-xl bg-[#4a5cd9] text-white hover:bg-[#5a6ce9] active:scale-95 transition-all duration-200 cursor-pointer shadow-md shadow-[#4a5cd9]/30 hover:shadow-lg hover:shadow-[#4a5cd9]/40"
 >
 <span className="px-4 py-2">
 Sign Up
 </span>
 </Link>
 </>
 ) : (
 <div className="flex items-center space-x-3">
 <UserButton
 afterSignOutUrl="/"
 appearance={{
 elements: {
 userButtonAvatarBox:
 'w-9 h-9 hover:scale-105 transition-transform',
 },
 }}
 />
 </div>
 )}
 </div>

 {/* Mobile Animated Hamburger Button */}
 <div className="flex lg:hidden items-center space-x-2">
 <button
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 type="button"
 className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 active:scale-95 transition-all"
 aria-label="Toggle menu"
 >
 {mobileMenuOpen ? (
 <HiXMark className="w-6 h-6 text-cyan-400" />
 ) : (
 <HiBars3 className="w-6 h-6" />
 )}
 </button>
 </div>
 </div>
 </div>
 </header>

 {/* Mobile Navigation Drawer — must live OUTSIDE <header> because the header's
 backdrop-filter creates a containing block that would otherwise clip the
 drawer's `fixed` positioning to the navbar row instead of the viewport. */}
 <AnimatePresence>
 {mobileMenuOpen && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setMobileMenuOpen(false)}
 className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden"
 />

 <motion.div
 initial={{ x: '100%', opacity: 0 }}
 animate={{ x: 0, opacity: 1 }}
 exit={{ x: '100%', opacity: 0 }}
 transition={{ type: 'spring', stiffness: 300, damping: 30 }}
 className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-sm bg-black border-l border-slate-800 flex flex-col overflow-y-auto lg:hidden safe-top"
 style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0))', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0))' }}
 >
 {/* Drawer Header */}
 <div className="flex items-center justify-between px-4 sm:px-6 pb-3 border-b border-slate-800/80 shrink-0">
 <div className="flex items-center space-x-2 min-w-0">
 <img
 src="/logos/hackspora.jpg"
 alt="Hackspora 2.0 Logo"
 className="h-7 w-auto rounded-lg object-contain shrink-0"
 />
 <span
 className="font-medium text-sm text-white whitespace-nowrap"
 style={{ textShadow: '2px 2px 0px #111184, 3px 3px 0px #000000' }}
 >
 Hackspora <span className="text-white font-medium">2.0</span>
 </span>
 </div>
 <button
 onClick={() => setMobileMenuOpen(false)}
 className="p-2 rounded-xl text-slate-400 hover:text-white bg-transparent border-0 shrink-0"
 aria-label="Close menu"
 >
 <HiXMark className="w-5 h-5 text-white" />
 </button>
 </div>

 {/* Drawer Body — scrollable middle section */}
 <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 space-y-4">
 {/* Nav Links */}
 <div className="flex flex-col space-y-1">
 {sectionLinks.map((link, idx) => {
 const isActive = location.pathname === '/' && activeSection === link.id;
 return (
 <motion.button
 key={link.id}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: idx * 0.04 + 0.1 }}
 onClick={() => handleNavClick(link.id)}
 className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
 isActive
 ? 'bg-slate-900 text-white'
 : 'text-slate-300 hover:bg-slate-900 hover:text-white'
 }`}
 >
 {link.name}
 </motion.button>
 );
 })}

  {/* Virtual Round Mobile Link */}
  <Link
  to="/virtual-round"
  onClick={() => setMobileMenuOpen(false)}
  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
  location.pathname.startsWith('/virtual-round')
  ? 'bg-slate-900 text-white font-semibold'
  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
  }`}
  >
  Virtual Round
  </Link>

 {/* Dashboard Link (only when user is registered) */}
 {isRegistered && (
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: sectionLinks.length * 0.04 + 0.1 }}
 >
 <Link
 to="/dashboard"
 onClick={() => setMobileMenuOpen(false)}
 className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
 location.pathname.startsWith('/dashboard')
 ? 'bg-slate-900 text-white'
 : 'text-slate-300 hover:bg-slate-900 hover:text-white'
 }`}
 >
 Dashboard
 </Link>
 </motion.div>
 )}

 {isAdmin && (
 <Link
 to="/admin"
 onClick={() => setMobileMenuOpen(false)}
 className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
 location.pathname.startsWith('/admin')
 ? 'bg-slate-900 text-white'
 : 'text-slate-300 hover:bg-slate-900 hover:text-white'
 }`}
 >
 Admin
 </Link>
 )}
 </div>
 </div>

 {/* Drawer Footer — Login / Sign Up pinned at the bottom, always visible */}
 <div className="px-4 sm:px-6 pt-3 border-t border-slate-800/80 flex flex-col space-y-2.5 shrink-0">
 {!isSignedIn ? (
 <>
 <Link
 to="/login"
 onClick={() => setMobileMenuOpen(false)}
 className="w-full text-center py-3 rounded-xl text-white bg-transparent border border-slate-700 hover:border-slate-500 hover:bg-slate-900 text-sm font-semibold active:scale-95 transition-all min-h-[44px] flex items-center justify-center"
 >
 Login
 </Link>
 <Link
 to="/signup"
 onClick={() => setMobileMenuOpen(false)}
 className="w-full text-center py-3 rounded-xl text-white bg-[#4a5cd9] hover:bg-[#5a6ce9] text-sm font-bold active:scale-95 transition-all min-h-[44px] flex items-center justify-center shadow-md shadow-[#4a5cd9]/30"
 >
 Sign Up
 </Link>
 </>
 ) : (
 <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 min-h-[44px]">
 <span className="text-sm font-semibold text-slate-300">Account</span>
 <UserButton afterSignOutUrl="/" />
 </div>
 )}
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </>
 );
}
