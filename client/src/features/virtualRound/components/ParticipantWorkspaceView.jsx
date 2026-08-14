import { AnimatePresence } from 'framer-motion';
import { useParticipantWorkspace } from '../../../hooks/useParticipantWorkspace';
import ParticipantTopNav from './ParticipantTopNav';
import ParticipantSidebar from './ParticipantSidebar';
import ProblemViewerTab from './ProblemViewerTab';
import SubmissionTab from './SubmissionTab';
import ResourcesTab from './ResourcesTab';
import AnnouncementsTab from './AnnouncementsTab';
import RulesTab from './RulesTab';
import ParticipantRightPanel from './ParticipantRightPanel';
import FinalSubmitModal from './FinalSubmitModal';

export default function ParticipantWorkspaceView() {
 const {
 activeTab,
 setActiveTab,
 problem,
 announcements,
 submission,
 setSubmission,
 saveStatus,
 lastSavedTime,
 quickNotes,
 setQuickNotes,
 serverTime,
 countdown,
 finalModalOpen,
 setFinalModalOpen,
 handleSaveDraft,
 handleFinalSubmit,
 } = useParticipantWorkspace();

 const renderActiveTabContent = () => {
 switch (activeTab) {
 case 'problem':
 return (
 <ProblemViewerTab
 problem={problem}
 onGoToSubmission={() => setActiveTab('submission')}
 />
 );
 case 'submission':
 return (
 <SubmissionTab
 submission={submission}
 setSubmission={setSubmission}
 saveStatus={saveStatus}
 lastSavedTime={lastSavedTime}
 onSaveDraft={handleSaveDraft}
 onOpenFinalModal={() => setFinalModalOpen(true)}
 />
 );
 case 'resources':
 return <ResourcesTab />;
 case 'announcements':
 return <AnnouncementsTab announcements={announcements} />;
 case 'rules':
 return <RulesTab />;
 default:
 return (
 <ProblemViewerTab
 problem={problem}
 onGoToSubmission={() => setActiveTab('submission')}
 />
 );
 }
 };

 return (
 <div className="min-h-screen w-full bg-[#02040A] text-slate-100 flex flex-col ">
 {/* Sticky Top Navigation */}
 <ParticipantTopNav
 serverTime={serverTime}
 countdown={countdown}
 submission={submission}
 />

 {/* Main 3-Column Desktop Workspace Layout */}
 <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* LEFT SIDEBAR: Navigation (3 Columns / 20%) */}
 <div className="lg:col-span-3 xl:col-span-2">
 <ParticipantSidebar
 activeTab={activeTab}
 setActiveTab={setActiveTab}
 submission={submission}
 />
 </div>

 {/* CENTER WORKSPACE: Active Tab Content (6 Columns / 55%) */}
 <div className="lg:col-span-9 xl:col-span-7">
 <AnimatePresence mode="wait">
 {renderActiveTabContent()}
 </AnimatePresence>
 </div>

 {/* RIGHT PANEL: Live Countdown, Status & Scratchpad (3 Columns / 25%) */}
 <div className="lg:col-span-12 xl:col-span-3">
 <ParticipantRightPanel
 countdown={countdown}
 submission={submission}
 saveStatus={saveStatus}
 lastSavedTime={lastSavedTime}
 quickNotes={quickNotes}
 setQuickNotes={setQuickNotes}
 />
 </div>
 </div>
 </main>

 {/* Final Submission Confirmation Dialog */}
 <FinalSubmitModal
 isOpen={finalModalOpen}
 onClose={() => setFinalModalOpen(false)}
 onConfirm={handleFinalSubmit}
 submission={submission}
 />
 </div>
 );
}
