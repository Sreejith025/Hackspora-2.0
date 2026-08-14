import { motion } from 'framer-motion';
import { useVirtualRoundControl } from '../../../hooks/useVirtualRoundControl';
import RoundStatusHeader from './RoundStatusHeader';
import ControlPanelButtons from './ControlPanelButtons';
import SubmissionWindowCard from './SubmissionWindowCard';
import LiveActivityFeed from './LiveActivityFeed';
import ConfirmationModal from './ConfirmationModal';
import RoundConfigModal from './RoundConfigModal';
import { HiSparkles, HiShieldCheck } from 'react-icons/hi2';

export default function VirtualRoundControlView() {
 const {
 config,
 status,
 isLocked,
 areProblemsReleased,
 metrics,
 activityLogs,
 serverTime,
 timeRemaining,
 submissionProgress,

 confirmModalOpen,
 setConfirmModalOpen,
 pendingAction,
 configModalOpen,
 setConfigModalOpen,

 requestAction,
 executeConfirmedAction,
 handleSaveConfig,
 } = useVirtualRoundControl();

 return (
 <motion.div
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 15 }}
 className="min-h-screen w-full bg-[#02040A] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8"
 >
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
 <div>
 <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-1">
 <HiSparkles className="w-4 h-4" />
 <span>COMMAND CONTROL CENTER</span>
 </div>
 <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
 Virtual Round Control Engine
 </h1>
 <p className="text-sm text-slate-400 mt-1">
 Real-time control center for Hackspora 2.0. Start, pause, resume, and monitor submission telemetry.
 </p>
 </div>

 <div className="flex items-center space-x-3">
 <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
 <HiShieldCheck className="w-4 h-4 text-emerald-400" />
 <span>ROUND CONTROL ONLINE</span>
 </div>
 </div>
 </div>

 {/* Round Status Header Bar */}
 <RoundStatusHeader
 status={status}
 isLocked={isLocked}
 serverTime={serverTime}
 timeRemaining={timeRemaining}
 metrics={metrics}
 submissionProgress={submissionProgress}
 />

 {/* Master Control Buttons Panel */}
 <ControlPanelButtons
 status={status}
 isLocked={isLocked}
 areProblemsReleased={areProblemsReleased}
 onRequestAction={requestAction}
 onOpenConfig={() => setConfigModalOpen(true)}
 />

 {/* Bottom Grid: Submission Window & Live Activity Stream */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 {/* Submission Window Card (5 Columns) */}
 <div className="lg:col-span-5">
 <SubmissionWindowCard
 config={config}
 isLocked={isLocked}
 timeRemaining={timeRemaining}
 />
 </div>

 {/* Real-time Activity Feed (7 Columns) */}
 <div className="lg:col-span-7">
 <LiveActivityFeed activityLogs={activityLogs} />
 </div>
 </div>

 {/* Confirmation Dialog Modal */}
 <ConfirmationModal
 isOpen={confirmModalOpen}
 onClose={() => setConfirmModalOpen(false)}
 onConfirm={executeConfirmedAction}
 pendingAction={pendingAction}
 />

 {/* Round Configuration Settings Modal */}
 <RoundConfigModal
 isOpen={configModalOpen}
 onClose={() => setConfigModalOpen(false)}
 onSave={handleSaveConfig}
 currentConfig={config}
 />
 </motion.div>
 );
}
