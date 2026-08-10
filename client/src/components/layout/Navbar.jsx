import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, UserButton } from '@clerk/clerk-react';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { isAdminUser } from '../../constants/authConfig';

const sectionLinks = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Guidelines', id: 'guidelines' },
  { name: 'Problem Statements', id: 'problems' },
  { name: 'Schedule', id: 'schedule' },
  { name: 'FAQ', id: 'faq' },
  { name: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = isSignedIn && isAdminUser(userEmail);

  // Handle Scroll Progress, Navbar Blur, and Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      // 1. Navbar Glassmorphism Blur state
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Scroll Progress Percentage Bar
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll Spy
  useEffect(() => {
    if (location.pathname !== '/') return;

    const sections = sectionLinks.map((s) => document.getElementById(s.id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '-80px 0px -40% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [location.pathname]);

  // Smooth Scroll Click Handler
  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);

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

  return (
    <>
      {/* Thin Glowing Cyan Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-slate-950">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 py-2.5 shadow-xl shadow-cyan-950/30'
            : 'bg-transparent border-b border-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Header Brand & Institutional Logos */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Main Hackspora Logo */}
              <Link
                to="/"
                onClick={() => handleNavClick('home')}
                className="flex items-center space-x-2.5 group cursor-pointer shrink-0"
              >
                <div className="relative p-1 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-md shadow-cyan-500/20 group-hover:scale-105 group-hover:border-cyan-400 transition-all duration-300">
                  <img
                    src="/logos/hackspora.jpg"
                    alt="Hackspora 2.0 Logo"
                    className="h-8 sm:h-9 w-auto rounded-lg object-contain bg-white p-0.5"
                  />
                </div>
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                  Hackspora <span className="text-cyan-400 font-black">2.0</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links (Scroll Spy) */}
            <nav className="hidden lg:flex items-center space-x-1">
              {sectionLinks.map((link) => {
                const isActive = location.pathname === '/' && activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}

              {/* Admin Route Link (Only for abisri024@gmail.com) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    location.pathname.startsWith('/admin')
                      ? 'text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Admin
                  {location.pathname.startsWith('/admin') && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {!isSignedIn ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 hover:bg-slate-800/60 rounded-xl border border-slate-800/80 hover:border-slate-700/60 cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold rounded-xl group bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span className="px-4 py-2 transition-all ease-in duration-75 rounded-[10px]">
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
                          'w-9 h-9 border-2 border-cyan-400/50 shadow-md shadow-cyan-500/20 hover:scale-105 transition-transform',
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
                className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 active:scale-95 transition-all"
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

        {/* Mobile Navigation Drawer */}
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
                className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800/80 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto lg:hidden"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src="/logos/hackspora.jpg"
                      alt="Hackspora 2.0 Logo"
                      className="h-8 w-auto rounded-lg object-contain bg-white p-0.5 border border-cyan-500/40"
                    />
                    <span className="font-extrabold text-lg text-white">Hackspora 2.0</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                  >
                    <HiXMark className="w-5 h-5 text-cyan-400" />
                  </button>
                </div>

                {/* Institutional Info & AIDS Logo */}
                <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/logos/aids.jpg"
                      alt="AIDS Logo"
                      className="h-6 w-auto rounded object-contain bg-white p-0.5 border border-cyan-500/30 shrink-0"
                    />
                    <div className="text-xs font-bold text-white leading-tight">
                      KARPAGAM ACADEMY OF HIGHER EDUCATION
                    </div>
                  </div>
                  <p className="text-[9.5px] text-slate-400 leading-snug">
                    (Deemed to be University) (Established Under Section 3 of UGC Act, 1956) Accredited with A+ Grade by NAAC in the Second cycle, Pollachi Main Road, Eachanari Post, Coimbatore-641 021.INDIA
                  </p>
                </div>



                <div className="flex flex-col space-y-2 py-6">
                  {sectionLinks.map((link, idx) => {
                    const isActive = location.pathname === '/' && activeSection === link.id;
                    return (
                      <motion.button
                        key={link.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 + 0.1 }}
                        onClick={() => handleNavClick(link.id)}
                        className={`w-full text-left px-4 py-3.5 rounded-xl text-base font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-cyan-500/15 text-cyan-300 border-l-4 border-cyan-400 shadow-md shadow-cyan-950/40'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        {link.name}
                      </motion.button>
                    );
                  })}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${
                        location.pathname.startsWith('/admin')
                          ? 'bg-cyan-500/15 text-cyan-300 border-l-4 border-cyan-400 shadow-md shadow-cyan-950/40'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-800/80 flex flex-col space-y-3">
                  {!isSignedIn ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-3.5 rounded-xl text-slate-200 bg-slate-900 hover:bg-slate-800 text-sm font-semibold border border-slate-800 active:scale-95 transition-all min-h-[48px] flex items-center justify-center"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-3.5 rounded-xl text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-sm font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all min-h-[48px] flex items-center justify-center"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 min-h-[48px]">
                      <span className="text-sm font-semibold text-slate-300">Account</span>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
