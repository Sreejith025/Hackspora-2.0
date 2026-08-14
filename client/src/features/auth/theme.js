export const clerkAppearance = {
 elements: {
 // Card: tighter padding on phones, normal on larger screens
 card: 'bg-slate-900/90 backdrop-blur-2xl border border-slate-800 shadow-2xl text-slate-100 rounded-2xl p-4 sm:p-6',
 // Title: smaller on phones
 headerTitle: 'text-[#DDF7FF] text-glow-ice font-extrabold text-xl sm:text-2xl',
 headerSubtitle: 'text-slate-400 text-xs sm:text-sm font-medium',
 socialButtonsBlockButton: 'bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700/80 text-slate-200 font-medium transition-colors text-sm',
 socialButtonsBlockButtonText: 'text-slate-200 font-semibold text-sm',
 dividerLine: 'bg-slate-800',
 dividerText: 'text-slate-500 text-xs uppercase',
 formFieldLabel: 'text-slate-300 font-medium text-xs uppercase tracking-wider',
 formFieldInput: 'bg-slate-950/80 border border-slate-800 text-slate-100 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 text-sm sm:text-base',
 formButtonPrimary: 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white font-extrabold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 transition-all text-sm sm:text-base min-h-[44px]',
 footerActionLink: 'text-cyan-400 hover:text-cyan-300 font-bold text-sm',
 identityPreviewText: 'text-slate-300 text-sm',
 identityPreviewEditButtonIcon: 'text-cyan-400',
 // Allow the Clerk root to use the available width
 rootBox: 'w-full',
 },
 // Hide the "Secured by Clerk" badge on mobile to free up vertical space
 // (it eats ~30px of footer on a 360px viewport).
 layout: {
 socialButtonsPlacement: 'top',
 },
};
