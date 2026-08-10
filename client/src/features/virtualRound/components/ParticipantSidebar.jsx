import {
  HiDocumentText,
  HiCloudArrowUp,
  HiFolder,
  HiMegaphone,
  HiBookOpen,
  HiCheckCircle,
} from 'react-icons/hi2';

const navItems = [
  { id: 'problem', label: 'Problem Statement', icon: HiDocumentText },
  { id: 'submission', label: 'Turn-in Submission', icon: HiCloudArrowUp },
  { id: 'resources', label: 'Resources & API Keys', icon: HiFolder },
  { id: 'announcements', label: 'Announcements', icon: HiMegaphone, badge: 'NEW' },
  { id: 'rules', label: 'Rules & Rubric', icon: HiBookOpen },
];

export default function ParticipantSidebar({ activeTab, setActiveTab, submission }) {
  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800/80 shadow-2xl flex flex-col space-y-4">
      <div className="px-2 pt-1 pb-2 border-b border-slate-800/80">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          WORKSPACE NAVIGATION
        </h3>
      </div>

      <nav className="flex flex-col space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-transparent text-cyan-300 border-l-4 border-cyan-400 shadow-md shadow-cyan-950/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.id === 'submission' && submission.isSubmitted && (
                <HiCheckCircle className="w-4 h-4 text-emerald-400" />
              )}

              {item.badge && !submission.isSubmitted && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Institutional Details & AIDS Logo under Left Sidebar */}
      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-2 pt-3">
        <div className="flex items-center space-x-2">
          <img
            src="/logos/aids.jpg"
            alt="AIDS Logo"
            className="h-7 w-auto rounded object-contain bg-white p-0.5 border border-cyan-500/30 shrink-0"
          />
          <div className="text-[11px] font-bold text-white leading-tight">
            KARPAGAM ACADEMY OF HIGHER EDUCATION
          </div>
        </div>
        <p className="text-[9px] text-slate-400 leading-snug">
          (Deemed to be University) (Established Under Section 3 of UGC Act, 1956) Accredited with A+ Grade by NAAC in the Second cycle, Pollachi Main Road, Eachanari Post, Coimbatore-641 021.INDIA
        </p>
      </div>
    </div>
  );
}
