import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const initialConfig = {
 roundName: 'Hackspora 2.0 Virtual Round 1',
 description: '7-Hour Online Virtual Screening Hackathon & Code Auditing',
 startDate: '2026-08-23',
 startTime: '09:30',
 endDate: '2026-08-23',
 endTime: '16:30',
 durationHours: 7,
 registrationCutoff: '2026-08-22T23:59:00',
 submissionDeadline: '2026-08-23T18:00:00',
 autoReleaseProblems: true,
 autoLockSubmissions: true,
 githubRequired: true,
 demoVideoRequired: true,
 maxSubmissionAttempts: 3,
};

const initialActivityLogs = [
 { id: 1, type: 'SUBMISSION', team: 'Team CyberPulse', text: 'Submitted final project brief for PS-101', time: 'Just now' },
 { id: 2, type: 'DRAFT', team: 'Team QuantumCoders', text: 'Saved draft code repository URL', time: '2 mins ago' },
 { id: 3, type: 'PROBLEM', team: 'Team NeuralHackers', text: 'Opened Problem Statement PS-102 (Web3 ZK-Proofs)', time: '5 mins ago' },
 { id: 4, type: 'LOGIN', team: 'Team ApexDevs', text: 'Logged in from Chennai Hub (4 members online)', time: '8 mins ago' },
 { id: 5, type: 'STATUS', team: 'System Admin', text: 'Problems released to all registered teams', time: '15 mins ago' },
];

export function useVirtualRoundControl() {
 const [config, setConfig] = useState(initialConfig);
 const [status, setStatus] = useState('Live'); // 'Not Started' | 'Live' | 'Paused' | 'Ended'
 const [isLocked, setIsLocked] = useState(false);
 const [areProblemsReleased, setAreProblemsReleased] = useState(true);

 // Metrics
 const [metrics] = useState({
 participantsOnline: 1420,
 teamsWorking: 388,
 submissionsReceived: 124,
 totalTeams: 400,
 });

 // Activity Feed
 const [activityLogs, setActivityLogs] = useState(initialActivityLogs);

 // Real-Time Server Clock
 const [serverTime, setServerTime] = useState(new Date());

 // Pending Confirmation Action State
 const [pendingAction, setPendingAction] = useState(null);
 const [confirmModalOpen, setConfirmModalOpen] = useState(false);
 const [configModalOpen, setConfigModalOpen] = useState(false);

 // Live ticking server time clock
 useEffect(() => {
 const timer = setInterval(() => {
 setServerTime(new Date());
 }, 1000);
 return () => clearInterval(timer);
 }, []);

 // Calculate Countdown Time Remaining
 const timeRemaining = useMemo(() => {
 const target = new Date(config.submissionDeadline).getTime();
 const current = serverTime.getTime();
 const diff = Math.max(0, target - current);

 const hours = Math.floor(diff / (1000 * 60 * 60));
 const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
 const seconds = Math.floor((diff % (1000 * 60)) / 1000);

 return {
 hours: String(hours).padStart(2, '0'),
 minutes: String(minutes).padStart(2, '0'),
 seconds: String(seconds).padStart(2, '0'),
 totalMs: diff,
 };
 }, [config.submissionDeadline, serverTime]);

 // Submission Progress Percentage
 const submissionProgress = useMemo(() => {
 if (metrics.totalTeams === 0) return 0;
 return Math.round((metrics.submissionsReceived / metrics.totalTeams) * 100);
 }, [metrics.submissionsReceived, metrics.totalTeams]);

 // Trigger Confirmation Modal for Round Actions
 const requestAction = useCallback((actionType, actionLabel, description) => {
 setPendingAction({ type: actionType, label: actionLabel, description });
 setConfirmModalOpen(true);
 }, []);

 // Execute Confirmed Round Action
 const executeConfirmedAction = useCallback(() => {
 if (!pendingAction) return;

 const action = pendingAction.type;
 const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

 switch (action) {
 case 'START_ROUND':
 setStatus('Live');
 toast.success('Virtual Round is now live.');
 setActivityLogs((prev) => [
 { id: Date.now(), type: 'STATUS', team: 'System Admin', text: 'Started Virtual Round 1', time: nowStr },
 ...prev,
 ]);
 break;
 case 'PAUSE_ROUND':
 setStatus('Paused');
 toast.error('Virtual Round has been paused.');
 setActivityLogs((prev) => [
 { id: Date.now(), type: 'STATUS', team: 'System Admin', text: 'Paused Virtual Round', time: nowStr },
 ...prev,
 ]);
 break;
 case 'RESUME_ROUND':
 setStatus('Live');
 toast.success('Virtual Round resumed.');
 setActivityLogs((prev) => [
 { id: Date.now(), type: 'STATUS', team: 'System Admin', text: 'Resumed Virtual Round', time: nowStr },
 ...prev,
 ]);
 break;
 case 'END_ROUND':
 setStatus('Ended');
 setIsLocked(true);
 toast.error('Virtual Round has ended.');
 setActivityLogs((prev) => [
 { id: Date.now(), type: 'STATUS', team: 'System Admin', text: 'Ended Virtual Round & Locked Submissions', time: nowStr },
 ...prev,
 ]);
 break;
 case 'LOCK_SUBMISSIONS':
 setIsLocked(true);
 toast.error('Submissions have been locked.');
 setActivityLogs((prev) => [
 { id: Date.now(), type: 'STATUS', team: 'System Admin', text: 'Locked all team submissions', time: nowStr },
 ...prev,
 ]);
 break;
 case 'UNLOCK_SUBMISSIONS':
 setIsLocked(false);
 toast.success('Submissions unlocked.');
 setActivityLogs((prev) => [
 { id: Date.now(), type: 'STATUS', team: 'System Admin', text: 'Unlocked team submissions', time: nowStr },
 ...prev,
 ]);
 break;
 case 'RELEASE_PROBLEMS':
 setAreProblemsReleased(true);
 toast.success('Problem statements released.');
 setActivityLogs((prev) => [
 { id: Date.now(), type: 'PROBLEM', team: 'System Admin', text: 'Released all problem statements', time: nowStr },
 ...prev,
 ]);
 break;
 default:
 break;
 }

 setConfirmModalOpen(false);
 setPendingAction(null);
 }, [pendingAction]);

 // Save Configuration
 const handleSaveConfig = useCallback((newConfig) => {
 setConfig(newConfig);
 toast.success('Round Configuration updated successfully!');
 setConfigModalOpen(false);
 }, []);

 return {
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
 };
}
