import { useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';

const initialCategories = [
 { id: 'cat-1', name: 'Artificial Intelligence & ML', code: 'AI-ML', isActive: true, totalProblems: 4, publishedProblems: 3, draftProblems: 1 },
 { id: 'cat-2', name: 'Web3 & Blockchain', code: 'WEB3', isActive: true, totalProblems: 3, publishedProblems: 2, draftProblems: 1 },
 { id: 'cat-3', name: 'Cybersecurity & Privacy', code: 'CYBER', isActive: true, totalProblems: 2, publishedProblems: 2, draftProblems: 0 },
 { id: 'cat-4', name: 'FinTech & Smart Banking', code: 'FINTECH', isActive: false, totalProblems: 1, publishedProblems: 0, draftProblems: 1 },
];

const initialProblems = [
 {
 id: 'PS-101',
 title: 'Autonomous AI Agent for Automated Code Auditing & Vulnerability Patching',
 categoryId: 'cat-1',
 categoryName: 'Artificial Intelligence & ML',
 difficulty: 'Hard',
 status: 'Published',
 releaseTime: '2026-08-23T09:30:00',
 releaseType: 'Publish Immediately',
 lastUpdated: '2026-07-30T14:20:00',
 shortDescription: 'Build an autonomous AI agent leveraging LLMs to detect zero-day vulnerabilities in source code and generate automated pull requests with regression testing.',
 detailedDescription: 'Modern software development requires instant security auditing. Participants must build an end-to-end agentic workflow that analyzes repository diffs, identifies security threats based on CVE databases, and formulates automated patch recommendations.',
 requirements: 'Must integrate AST parser, support Python & JavaScript/TypeScript, provide confidence score metrics, and output patch diff files.',
 expectedDeliverables: 'Working GitHub App / CLI tool, architecture diagram, benchmark evaluation report, and 3-minute video demo.',
 evaluationCriteria: 'Accuracy of vulnerability detection (30%), Quality of generated patches (30%), System latency (20%), UX & Developer Experience (20%).',
 suggestedTechStack: ['Python', 'LangChain / LlamaIndex', 'OpenAI / Claude API', 'Tree-sitter', 'Docker'],
 tags: ['AI', 'Cybersecurity', 'DevSecOps', 'LLM'],
 maxTeamSize: 4,
 estimatedHours: 24,
 referenceLinks: ['https://cve.mitre.org', 'https://github.com/features/security'],
 attachments: [{ name: 'Problem_Brief_AI_Auditor.pdf', size: '2.4 MB' }],
 },
 {
 id: 'PS-102',
 title: 'Decentralized Cross-Chain Liquidity Aggregator with Zero-Knowledge Proofs',
 categoryId: 'cat-2',
 categoryName: 'Web3 & Blockchain',
 difficulty: 'Hard',
 status: 'Scheduled',
 releaseTime: '2026-10-24T10:30:00',
 releaseType: 'Automatically Release at Configured Time',
 lastUpdated: '2026-07-29T11:15:00',
 shortDescription: 'Construct a privacy-preserving cross-chain liquidity protocol utilizing ZK-SNARKs for stealth transactions across EVM and Solana networks.',
 detailedDescription: 'Interoperability remains a core challenge in DeFi. This problem asks squads to build a decentralized protocol that pools liquidity across multiple EVM chains while hiding transaction metadata using zk-proofs.',
 requirements: 'Smart contracts on Sepolia / Arbitrum testnet, ZK circuit implementation using Circom, and frontend dApp.',
 expectedDeliverables: 'Deployed smart contract addresses, Circom circuits source, dApp repository, and verification proof logs.',
 evaluationCriteria: 'Privacy proof soundness (35%), Cross-chain bridge speed (25%), Contract gas optimization (20%), Frontend UI (20%).',
 suggestedTechStack: ['Solidity', 'Circom', 'Ethers.js / Viem', 'Solana Web3.js', 'Next.js'],
 tags: ['Web3', 'ZK-Proofs', 'DeFi', 'Solidity'],
 maxTeamSize: 4,
 estimatedHours: 24,
 referenceLinks: ['https://circom.io', 'https://ethereum.org/en/zero-knowledge-proofs/'],
 attachments: [{ name: 'ZK_Liquidity_Spec.pdf', size: '1.8 MB' }],
 },
 {
 id: 'PS-103',
 title: 'Real-Time Threat Detection Dashboard for Distributed Cloud Infrastructure',
 categoryId: 'cat-3',
 categoryName: 'Cybersecurity & Privacy',
 difficulty: 'Medium',
 status: 'Published',
 releaseTime: '2026-10-24T09:00:00',
 releaseType: 'Publish Immediately',
 lastUpdated: '2026-07-28T16:45:00',
 shortDescription: 'Develop a high-throughput SIEM dashboard that ingests Syslog streams and detects anomaly spikes using eBPF probes.',
 detailedDescription: 'Security teams need sub-second visibility into kernel telemetry. Build a real-time monitoring engine using eBPF to capture network socket events and flag potential DDoS or unauthorized privilege escalation.',
 requirements: 'Kernel event capture using eBPF/BCC, stream processing pipeline, and live web dashboard with alert webhooks.',
 expectedDeliverables: 'eBPF C probe code, backend telemetry service, frontend dashboard, and load test simulation script.',
 evaluationCriteria: 'Ingestion throughput (30%), Detection latency (30%), Dashboard visual UX (20%), Alert accuracy (20%).',
 suggestedTechStack: ['C / eBPF', 'Go / Rust', 'TimescaleDB', 'React', 'Tailwind CSS'],
 tags: ['Cybersecurity', 'eBPF', 'Cloud Native', 'Linux'],
 maxTeamSize: 3,
 estimatedHours: 18,
 referenceLinks: ['https://ebpf.io', 'https://bcc.io'],
 attachments: [{ name: 'eBPF_Telemetry_Guide.pdf', size: '3.1 MB' }],
 },
 {
 id: 'PS-104',
 title: 'Adaptive Fraud Prevention Engine for UPI & Micro-Payments',
 categoryId: 'cat-4',
 categoryName: 'FinTech & Smart Banking',
 difficulty: 'Medium',
 status: 'Draft',
 releaseTime: '2026-10-24T12:00:00',
 releaseType: 'Hide Until Virtual Round Starts',
 lastUpdated: '2026-07-31T09:00:00',
 shortDescription: 'Build an ultra-fast graph neural network model to detect mule accounts and fraud networks in real-time instant payment systems.',
 detailedDescription: 'Digital payment frauds exploit complex networks of mule accounts. This problem challenges participants to model transaction graphs and flag high-risk transaction paths within 50 milliseconds.',
 requirements: 'Graph database / NetworkX implementation, risk score API endpoint, and admin review dashboard.',
 expectedDeliverables: 'Trained model weights, REST API implementation, interactive network graph frontend, and benchmarking logs.',
 evaluationCriteria: 'Model precision & recall (35%), API response latency <50ms (35%), System scalability (15%), Presentation (15%).',
 suggestedTechStack: ['Python', 'PyTorch Geometric', 'Neo4j / NetworkX', 'FastAPI', 'React'],
 tags: ['FinTech', 'Fraud Detection', 'Graph Neural Networks', 'UPI'],
 maxTeamSize: 4,
 estimatedHours: 24,
 referenceLinks: ['https://pytorch-geometric.readthedocs.io'],
 attachments: [{ name: 'UPI_Fraud_Datasets.zip', size: '5.6 MB' }],
 },
];

export function useProblemStatements() {
 const [categories, setCategories] = useState(initialCategories);
 const [problems, setProblems] = useState(initialProblems);

 // Filters & State
 const [categorySearch, setCategorySearch] = useState('');
 const [problemSearch, setProblemSearch] = useState('');
 const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
 const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('ALL');
 const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
 const [sortBy, setSortBy] = useState('lastUpdated');
 const [sortOrder, setSortOrder] = useState('desc');
 const [currentPage, setCurrentPage] = useState(1);
 const [itemsPerPage] = useState(5);

 // Modals state
 const [categoryModalOpen, setCategoryModalOpen] = useState(false);
 const [editingCategory, setEditingCategory] = useState(null);

 const [problemModalOpen, setProblemModalOpen] = useState(false);
 const [editingProblem, setEditingProblem] = useState(null);

 const [previewModalOpen, setPreviewModalOpen] = useState(false);
 const [previewingProblem, setPreviewingProblem] = useState(null);

 // Filtered Categories
 const filteredCategories = useMemo(() => {
 return categories.filter((cat) =>
 cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
 cat.code.toLowerCase().includes(categorySearch.toLowerCase())
 );
 }, [categories, categorySearch]);

 // Filtered & Sorted Problems
 const filteredProblems = useMemo(() => {
 return problems
 .filter((p) => {
 const matchesSearch =
 p.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
 p.id.toLowerCase().includes(problemSearch.toLowerCase()) ||
 p.tags.some((t) => t.toLowerCase().includes(problemSearch.toLowerCase()));

 const matchesCategory =
 selectedCategoryFilter === 'ALL' || p.categoryId === selectedCategoryFilter;

 const matchesDifficulty =
 selectedDifficultyFilter === 'ALL' || p.difficulty === selectedDifficultyFilter;

 const matchesStatus =
 selectedStatusFilter === 'ALL' || p.status === selectedStatusFilter;

 return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
 })
 .sort((a, b) => {
 let valA = a[sortBy];
 let valB = b[sortBy];
 if (sortBy === 'lastUpdated' || sortBy === 'releaseTime') {
 valA = new Date(valA).getTime();
 valB = new Date(valB).getTime();
 }
 if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
 if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
 return 0;
 });
 }, [problems, problemSearch, selectedCategoryFilter, selectedDifficultyFilter, selectedStatusFilter, sortBy, sortOrder]);

 // Paginated Problems
 const paginatedProblems = useMemo(() => {
 const start = (currentPage - 1) * itemsPerPage;
 return filteredProblems.slice(start, start + itemsPerPage);
 }, [filteredProblems, currentPage, itemsPerPage]);

 const totalPages = Math.ceil(filteredProblems.length / itemsPerPage) || 1;

 // Category Actions
 const handleSaveCategory = useCallback((categoryData) => {
 if (editingCategory) {
 setCategories((prev) =>
 prev.map((c) => (c.id === editingCategory.id ? { ...c, ...categoryData } : c))
 );
 toast.success(`Category "${categoryData.name}" updated successfully!`);
 } else {
 const newCat = {
 id: `cat-${Date.now()}`,
 ...categoryData,
 totalProblems: 0,
 publishedProblems: 0,
 draftProblems: 0,
 };
 setCategories((prev) => [...prev, newCat]);
 toast.success(`Category "${categoryData.name}" created successfully!`);
 }
 setCategoryModalOpen(false);
 setEditingCategory(null);
 }, [editingCategory]);

 const handleDeleteCategory = useCallback((id) => {
 setCategories((prev) => prev.filter((c) => c.id !== id));
 toast.success('Category deleted successfully!');
 }, []);

 const handleToggleCategoryStatus = useCallback((id) => {
 setCategories((prev) =>
 prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
 );
 toast.success('Category status updated!');
 }, []);

 // Problem Actions
 const handleSaveProblem = useCallback((formData) => {
 const selectedCat = categories.find((c) => c.id === formData.categoryId);
 const categoryName = selectedCat ? selectedCat.name : 'General';

 if (editingProblem) {
 setProblems((prev) =>
 prev.map((p) =>
 p.id === editingProblem.id
 ? {
 ...p,
 ...formData,
 categoryName,
 lastUpdated: new Date().toISOString(),
 }
 : p
 )
 );
 toast.success(`Problem Statement "${formData.title}" updated!`);
 } else {
 const newId = `PS-${100 + problems.length + 1}`;
 const newProblem = {
 id: newId,
 ...formData,
 categoryName,
 lastUpdated: new Date().toISOString(),
 };
 setProblems((prev) => [newProblem, ...prev]);
 toast.success(`Problem Statement "${formData.title}" created successfully!`);
 }
 setProblemModalOpen(false);
 setEditingProblem(null);
 }, [editingProblem, categories, problems.length]);

 const handleDeleteProblem = useCallback((id) => {
 setProblems((prev) => prev.filter((p) => p.id !== id));
 toast.success('Problem statement deleted!');
 }, []);

 const handleDuplicateProblem = useCallback((problem) => {
 const duplicated = {
 ...problem,
 id: `PS-${Date.now().toString().slice(-3)}`,
 title: `${problem.title} (Copy)`,
 status: 'Draft',
 lastUpdated: new Date().toISOString(),
 };
 setProblems((prev) => [duplicated, ...prev]);
 toast.success(`Duplicated "${problem.title}"!`);
 }, []);

 const handleTogglePublish = useCallback((id) => {
 setProblems((prev) =>
 prev.map((p) => {
 if (p.id === id) {
 const nextStatus = p.status === 'Published' ? 'Draft' : 'Published';
 toast.success(`Problem statement ${nextStatus.toLowerCase()}!`);
 return { ...p, status: nextStatus, lastUpdated: new Date().toISOString() };
 }
 return p;
 })
 );
 }, []);

 return {
 categories: filteredCategories,
 allCategories: categories,
 categorySearch,
 setCategorySearch,
 categoryModalOpen,
 setCategoryModalOpen,
 editingCategory,
 setEditingCategory,
 handleSaveCategory,
 handleDeleteCategory,
 handleToggleCategoryStatus,

 problems: paginatedProblems,
 allFilteredProblemsCount: filteredProblems.length,
 problemSearch,
 setProblemSearch,
 selectedCategoryFilter,
 setSelectedCategoryFilter,
 selectedDifficultyFilter,
 setSelectedDifficultyFilter,
 selectedStatusFilter,
 setSelectedStatusFilter,
 sortBy,
 setSortBy,
 sortOrder,
 setSortOrder,
 currentPage,
 setCurrentPage,
 totalPages,

 problemModalOpen,
 setProblemModalOpen,
 editingProblem,
 setEditingProblem,
 previewModalOpen,
 setPreviewModalOpen,
 previewingProblem,
 setPreviewingProblem,

 handleSaveProblem,
 handleDeleteProblem,
 handleDuplicateProblem,
 handleTogglePublish,
 };
}
