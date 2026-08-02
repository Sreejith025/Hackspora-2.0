import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const defaultProblem = {
  id: 'PS-101',
  title: 'Autonomous AI Agent for Automated Code Auditing & Vulnerability Patching',
  categoryName: 'Artificial Intelligence & ML',
  difficulty: 'Hard',
  shortDescription: 'Build an autonomous AI agent leveraging LLMs to detect zero-day vulnerabilities in source code and generate automated pull requests with regression testing.',
  detailedDescription: 'Modern software development requires instant security auditing. Participants must build an end-to-end agentic workflow that analyzes repository diffs, identifies security threats based on CVE databases, and formulates automated patch recommendations.',
  requirements: 'Must integrate AST parser, support Python & JavaScript/TypeScript, provide confidence score metrics, and output patch diff files.',
  expectedDeliverables: 'Working GitHub App / CLI tool, architecture diagram, benchmark evaluation report, and 3-minute video demo.',
  evaluationCriteria: 'Accuracy of vulnerability detection (30%), Quality of generated patches (30%), System latency (20%), UX & Developer Experience (20%).',
  suggestedTechStack: ['Python', 'LangChain / LlamaIndex', 'OpenAI / Claude API', 'Tree-sitter', 'Docker'],
  referenceLinks: ['https://cve.mitre.org', 'https://github.com/features/security'],
  attachments: [{ name: 'Problem_Brief_AI_Auditor.pdf', size: '2.4 MB' }],
};

const initialAnnouncements = [
  { id: 1, title: '📢 Mid-Round Evaluation Milestone', content: 'Ensure your GitHub repositories have public access enabled before 18:00 IST.', time: '10:30 AM', isNew: true },
  { id: 2, title: '🚀 API Keys Distributed', content: 'Check team email for free OpenAI & Cloud credits provided by hackathon sponsors.', time: '09:15 AM', isNew: false },
];

export function useParticipantWorkspace() {
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'submission' | 'resources' | 'announcements' | 'rules'
  const [problem] = useState(defaultProblem);
  const [announcements] = useState(initialAnnouncements);

  // Form Submission State
  const [submission, setSubmission] = useState({
    projectTitle: 'AIAuditor Pro - Autonomous Vulnerability Remediation Agent',
    githubRepoUrl: 'https://github.com/team-cyberpulse/ai-code-auditor',
    demoVideoUrl: 'https://loom.com/share/hackspora-2-demo',
    projectDescription: 'An autonomous agent that scans pull requests for AST vulnerabilities and auto-generates patch diffs.',
    techStack: 'Python, LangChain, OpenAI GPT-4, FastAPI, React',
    additionalNotes: 'Configured Docker setup in /docker directory. Tested against OWASP Top 10 sample repos.',
    isSubmitted: false,
    submittedAt: null,
  });

  // Auto Save State
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [lastSavedTime, setLastSavedTime] = useState(new Date());

  // Quick Notes State
  const [quickNotes, setQuickNotes] = useState('Key API endpoints:\n- POST /api/scan\n- GET /api/patches');

  // Server Time & Target Deadline (24 hours from now)
  const [serverTime, setServerTime] = useState(new Date());
  const [deadline] = useState(() => new Date(Date.now() + 18 * 3600 * 1000 + 45 * 60 * 1000)); // 18h 45m left

  // Modal State
  const [finalModalOpen, setFinalModalOpen] = useState(false);

  // Ticking server clock
  useEffect(() => {
    const timer = setInterval(() => {
      setServerTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 30-Second Auto Save Engine
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (!submission.isSubmitted) {
        setSaveStatus('Saving...');
        setTimeout(() => {
          setSaveStatus('Saved');
          setLastSavedTime(new Date());
        }, 800);
      }
    }, 30000);
    return () => clearInterval(autoSaveTimer);
  }, [submission.isSubmitted]);

  // Calculate Countdown Time & Dynamic Gauge Color
  const countdown = useMemo(() => {
    const diff = Math.max(0, deadline.getTime() - serverTime.getTime());
    const totalMinutes = Math.floor(diff / (1000 * 60));

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Color State: Blue default -> Orange under 60m -> Red under 15m
    let colorState = 'blue';
    if (totalMinutes <= 15) {
      colorState = 'red';
    } else if (totalMinutes <= 60) {
      colorState = 'orange';
    }

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      totalMinutes,
      colorState,
      percentRemaining: Math.min(100, Math.round((diff / (24 * 3600 * 1000)) * 100)),
    };
  }, [deadline, serverTime]);

  // Manual Draft Save Trigger
  const handleSaveDraft = useCallback(() => {
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Saved');
      setLastSavedTime(new Date());
      toast.success('Draft saved successfully!');
    }, 500);
  }, []);

  // Final Submit Handler
  const handleFinalSubmit = useCallback(() => {
    setSubmission((prev) => ({
      ...prev,
      isSubmitted: true,
      submittedAt: new Date().toISOString(),
    }));
    setFinalModalOpen(false);
    toast.success('🎉 Final Submission Lock Confirmed! Your project has been turned in.');
  }, []);

  return {
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
  };
}
