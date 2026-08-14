import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import {
 HiUser,
 HiEnvelope,
 HiPhone,
 HiBuildingLibrary,
 HiAcademicCap,
 HiMapPin,
 HiPlus,
 HiPencilSquare,
 HiTrash,
 HiCheckBadge,
 HiArrowPath,
 HiArrowRight,
 HiArrowLeft,
 HiShieldCheck,
 HiLockClosed,
 HiCheck,
} from 'react-icons/hi2';
import AddMemberModal from './AddMemberModal';
import AlreadyRegisteredModal from '../../../components/AlreadyRegisteredModal';
import { registrationService } from '../../../services/registrationService';

export default function TeamRegistrationWizard() {
 const navigate = useNavigate();
 const { user } = useUser();

 const userEmail = user?.primaryEmailAddress?.emailAddress || '';
 const userName = user?.fullName || '';

 const [currentStep, setCurrentStep] = useState(1);

 // Form State
 const [teamInfo, setTeamInfo] = useState({
 teamName: '',
 leaderName: userName || '',
 leaderEmail: userEmail || '',
 leaderPhone: '',
 collegeName: '',
 course: 'B.Tech',
 branch: '',
 year: '3rd Year',
 city: '',
 state: '',
 });

 const [members, setMembers] = useState([]);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingIndex, setEditingIndex] = useState(null);
 const [editingData, setEditingData] = useState(null);

 const [isConfirmed, setIsConfirmed] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [registeredResult, setRegisteredResult] = useState(null);
 const [errors, setErrors] = useState({});

 const [isAlreadyRegisteredModalOpen, setIsAlreadyRegisteredModalOpen] = useState(false);
 const [alreadyRegisteredData, setAlreadyRegisteredData] = useState(null);

 // Check if user is already registered upon page mount
 useEffect(() => {
 const verifyUserRegistration = async () => {
 const clerkId = user?.id || '';
 if (!clerkId && !userEmail) return;

 try {
 const res = await registrationService.checkRegistrationStatus(clerkId, userEmail);
 if (res?.registered) {
 setAlreadyRegisteredData(res.data || null);
 setIsAlreadyRegisteredModalOpen(true);
 }
 } catch (err) {
 console.error('Error verifying registration on mount:', err);
 }
 };

 verifyUserRegistration();
 }, [user?.id, userEmail]);

 // Sync Clerk User Data into Form State when Clerk finishes loading
 const [prevUserId, setPrevUserId] = useState(user?.id);
 if (user?.id && user.id !== prevUserId) {
 setPrevUserId(user.id);
 if (!teamInfo.leaderName || !teamInfo.leaderEmail) {
 setTeamInfo((prev) => ({
 ...prev,
 leaderName: prev.leaderName || user.fullName || '',
 leaderEmail: prev.leaderEmail || user.primaryEmailAddress?.emailAddress || '',
 }));
 }
 }

 // Handle Team Info Field Change
 const handleTeamInfoChange = (e) => {
 const { name, value } = e.target;
 setTeamInfo((prev) => ({ ...prev, [name]: value }));
 if (errors[name]) {
 setErrors((prev) => ({ ...prev, [name]: '' }));
 }
 };

 // Step 1 Validation
 const validateStep1 = () => {
 const errs = {};
 if (!teamInfo.teamName.trim()) errs.teamName = 'Team Name is required';
 if (!teamInfo.leaderName.trim()) errs.leaderName = 'Team Leader Name is required';
 if (!teamInfo.leaderEmail.trim() || !teamInfo.leaderEmail.includes('@'))
 errs.leaderEmail = 'Valid Email is required';
 if (!teamInfo.leaderPhone.trim()) errs.leaderPhone = 'Phone Number is required';
 if (!teamInfo.collegeName.trim()) errs.collegeName = 'College Name is required';
 if (!teamInfo.branch.trim()) errs.branch = 'Branch is required';
 if (!teamInfo.city.trim()) errs.city = 'City is required';
 if (!teamInfo.state.trim()) errs.state = 'State is required';

 setErrors(errs);
 if (Object.keys(errs).length > 0) {
 const firstError = Object.values(errs)[0];
 toast.error(firstError || 'Please fill in all required fields.');
 window.scrollTo({ top: 120, behavior: 'smooth' });
 return false;
 }
 return true;
 };

 const handleNextStep = () => {
 if (currentStep === 1) {
 if (!validateStep1()) return;
 }

 if (currentStep === 2) {
 const totalSquadSize = 1 + members.length;
 if (totalSquadSize < 3) {
 toast.error('A team must contain at least 3 members (Leader + at least 2 squad members).');
 return;
 }
 if (totalSquadSize > 5) {
 toast.error('Maximum team size is 5 members.');
 return;
 }
 }

 setCurrentStep((prev) => Math.min(prev + 1, 3));
 window.scrollTo({ top: 100, behavior: 'smooth' });
 };

 const handlePrevStep = () => {
 setCurrentStep((prev) => Math.max(prev - 1, 1));
 };

 // Member Modal Handler
 const handleOpenAddModal = () => {
 if (members.length >= 4) {
 toast.error('Maximum team size is 5 members.');
 return;
 }
 setEditingIndex(null);
 setEditingData(null);
 setIsModalOpen(true);
 };

 const handleOpenEditModal = (idx) => {
 setEditingIndex(idx);
 setEditingData(members[idx]);
 setIsModalOpen(true);
 };

 const handleSaveMember = (memberData, index) => {
 if (index !== null && index !== undefined) {
 setMembers((prev) => {
 const copy = [...prev];
 copy[index] = memberData;
 return copy;
 });
 toast.success('Member updated!');
 } else {
 if (members.length >= 4) {
 toast.error('Maximum team size is 5 members.');
 return;
 }
 setMembers((prev) => [...prev, memberData]);
 toast.success('Member added to team!');
 }
 };

 const handleRemoveMember = (index) => {
 if (index < 2) {
 toast.error('Member 2 and Member 3 are required to satisfy the minimum 3-member team rule.');
 return;
 }
 setMembers((prev) => prev.filter((_, idx) => idx !== index));
 toast.success('Member removed');
 };

 // Submit Final Registration
 const handleSubmitRegistration = async (e) => {
 if (e && e.preventDefault) e.preventDefault();

 if (isSubmitting) return;

 console.log("Button Clicked: Submit Registration");

 if (!isConfirmed) {
 console.warn("Registration blocked: confirmation checkbox is false");
 toast.error('Please tap the confirmation checkbox below to complete registration.');
 const checkEl = document.getElementById('confirmCheck');
 if (checkEl) checkEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
 return;
 }

 const totalSquadSize = 1 + members.length;
 if (totalSquadSize < 3) {
 console.warn(`Registration blocked: squad size is ${totalSquadSize} (< 3)`);
 toast.error('A team must contain at least 3 members (Leader + at least 2 members).');
 return;
 }
 if (totalSquadSize > 5) {
 console.warn(`Registration blocked: squad size is ${totalSquadSize} (> 5)`);
 toast.error('Maximum team size is 5 members.');
 return;
 }

 console.log("Sending Registration Request...");
 setIsSubmitting(true);
 try {
 const payload = {
 clerkId: user?.id || '',
 ...teamInfo,
 members,
 };

 console.log("Payload sent to registration API:", payload);
 const result = await registrationService.registerTeam(payload);
 console.log("Registration API Response Success:", result);

 setRegisteredResult(result);

 // Trigger Fireworks Confetti Effect
 confetti({
 particleCount: 120,
 spread: 80,
 origin: { y: 0.6 },
 colors: ['#38bdf8', '#818cf8', '#a855f7', '#06b6d4'],
 });

 toast.success('Registration Completed Successfully!');
 } catch (err) {
 console.error("Registration Error Caught:", err);
 if (err.response?.data?.registered || err.response?.data?.data) {
 setAlreadyRegisteredData(err.response.data.data || null);
 setIsAlreadyRegisteredModalOpen(true);
 toast.error('You are already registered for Hackspora 2.0.');
 } else {
 const errMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
 toast.error(errMsg);
 console.error("Toast error displayed:", errMsg);
 }
 } finally {
 setIsSubmitting(false);
 }
 };

 // Render Step 1
 const renderStep1 = () => (
 <motion.div
 key="step1"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="relative space-y-5 sm:space-y-6"
 >
 <div className="border-b border-white/20 pb-4">
 <h2 className="text-lg sm:text-2xl font-black text-white flex items-center space-x-2">
 <span>Step 1: Team & Leader Details</span>
 </h2>
 <p className="text-[11px] sm:text-xs text-white/70 mt-1">
 Enter your official team identity and primary leader contact information.
 </p>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
 {/* Team Name */}
 <div className="sm:col-span-2">
 <label className="block text-xs text-[#a8b3ff] font-bold mb-1 uppercase tracking-wider">
 Team Name *
 </label>
 <input
 type="text"
 name="teamName"
 value={teamInfo.teamName}
 onChange={handleTeamInfoChange}
 placeholder="e.g. Quantum Cybernetics"
 className="w-full bg-white/[0.08] border border-white/25 focus:border-white/60 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all font-semibold"
 />
 {errors.teamName && <p className="text-xs text-rose-300 mt-1">{errors.teamName}</p>}
 </div>

 {/* Team Leader Name */}
 <div>
 <label className="block text-xs text-[#a8b3ff] font-bold mb-1 uppercase tracking-wider">
 Team Leader Name *
 </label>
 <div className="relative">
 <HiUser className="absolute left-3.5 top-3.5 w-4 h-4 text-white/60" />
 <input
 type="text"
 name="leaderName"
 value={teamInfo.leaderName}
 onChange={handleTeamInfoChange}
 placeholder="e.g. John Doe"
 className="w-full bg-white/[0.08] border border-white/25 focus:border-white/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
 />
 </div>
 {errors.leaderName && <p className="text-xs text-rose-300 mt-1">{errors.leaderName}</p>}
 </div>

 {/* Team Leader Email */}
 <div>
 <label className="block text-xs text-[#a8b3ff] font-bold mb-1 uppercase tracking-wider">
 Team Leader Email *
 </label>
 <div className="relative">
 <HiEnvelope className="absolute left-3.5 top-3.5 w-4 h-4 text-white/60" />
 <input
 type="email"
 name="leaderEmail"
 value={teamInfo.leaderEmail}
 onChange={handleTeamInfoChange}
 placeholder="leader@college.edu"
 className="w-full bg-white/[0.08] border border-white/25 focus:border-white/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
 />
 </div>
 {errors.leaderEmail && <p className="text-xs text-rose-300 mt-1">{errors.leaderEmail}</p>}
 </div>

 {/* Phone Number */}
 <div>
 <label className="block text-xs text-[#a8b3ff] font-bold mb-1 uppercase tracking-wider">
 Phone Number *
 </label>
 <div className="relative">
 <HiPhone className="absolute left-3.5 top-3.5 w-4 h-4 text-white/60" />
 <input
 type="tel"
 name="leaderPhone"
 value={teamInfo.leaderPhone}
 onChange={handleTeamInfoChange}
 placeholder="+91 9876543210"
 className="w-full bg-white/[0.08] border border-white/25 focus:border-white/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
 />
 </div>
 {errors.leaderPhone && <p className="text-xs text-rose-300 mt-1">{errors.leaderPhone}</p>}
 </div>

 {/* College Name */}
 <div>
 <label className="block text-xs text-[#a8b3ff] font-bold mb-1 uppercase tracking-wider">
 College Name *
 </label>
 <div className="relative">
 <HiBuildingLibrary className="absolute left-3.5 top-3.5 w-4 h-4 text-white/60" />
 <input
 type="text"
 name="collegeName"
 value={teamInfo.collegeName}
 onChange={handleTeamInfoChange}
 placeholder="e.g. Anna University"
 className="w-full bg-white/[0.08] border border-white/25 focus:border-white/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
 />
 </div>
 {errors.collegeName && <p className="text-xs text-rose-300 mt-1">{errors.collegeName}</p>}
 </div>

 {/* Course */}
 <div>
 <label className="block text-xs text-[#a8b3ff] font-bold mb-1 uppercase tracking-wider">
 Course *
 </label>
 <select
 name="course"
 value={teamInfo.course}
 onChange={handleTeamInfoChange}
 className="w-full bg-white/[0.08] border border-white/25 focus:border-white/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
 >
 <option value="B.Tech" className="bg-slate-900">B.Tech / B.E</option>
 <option value="M.Tech" className="bg-slate-900">M.Tech / M.E</option>
 <option value="B.Sc" className="bg-slate-900">B.Sc Computer Science</option>
 <option value="BCA" className="bg-slate-900">BCA</option>
 <option value="MCA" className="bg-slate-900">MCA</option>
 <option value="Other" className="bg-slate-900">Other</option>
 </select>
 </div>

 {/* Branch */}
 <div>
 <label className="block text-xs text-[#a8b3ff] font-bold mb-1 uppercase tracking-wider">
 Branch *
 </label>
 <div className="relative">
 <HiAcademicCap className="absolute left-3.5 top-3.5 w-4 h-4 text-white/60" />
 <input
 type="text"
 name="branch"
 value={teamInfo.branch}
 onChange={handleTeamInfoChange}
 placeholder="e.g. Computer Science"
 className="w-full bg-white/[0.08] border border-white/25 focus:border-white/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
 />
 </div>
 {errors.branch && <p className="text-xs text-rose-300 mt-1">{errors.branch}</p>}
 </div>

 {/* Year */}
 <div>
 <label className="block text-xs text-[#a8b3ff] font-bold mb-1 uppercase tracking-wider">
 Year *
 </label>
 <select
 name="year"
 value={teamInfo.year}
 onChange={handleTeamInfoChange}
 className="w-full bg-white/[0.08] border border-white/25 focus:border-white/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
 >
 <option value="1st Year" className="bg-slate-900">1st Year</option>
 <option value="2nd Year" className="bg-slate-900">2nd Year</option>
 <option value="3rd Year" className="bg-slate-900">3rd Year</option>
 <option value="4th Year" className="bg-slate-900">4th Year</option>
 <option value="Postgraduate" className="bg-slate-900">Postgraduate</option>
 </select>
 </div>

 {/* City */}
 <div>
 <label className="block text-xs text-[#a8b3ff] font-bold mb-1 uppercase tracking-wider">
 City *
 </label>
 <div className="relative">
 <HiMapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-white/60" />
 <input
 type="text"
 name="city"
 value={teamInfo.city}
 onChange={handleTeamInfoChange}
 placeholder="e.g. Chennai"
 className="w-full bg-white/[0.08] border border-white/25 focus:border-white/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
 />
 </div>
 {errors.city && <p className="text-xs text-rose-300 mt-1">{errors.city}</p>}
 </div>

 {/* State */}
 <div>
 <label className="block text-xs text-[#a8b3ff] font-bold mb-1 uppercase tracking-wider">
 State *
 </label>
 <input
 type="text"
 name="state"
 value={teamInfo.state}
 onChange={handleTeamInfoChange}
 placeholder="e.g. Tamil Nadu"
 className="w-full bg-white/[0.08] border border-white/25 focus:border-white/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
 />
 {errors.state && <p className="text-xs text-rose-300 mt-1">{errors.state}</p>}
 </div>
 </div>
 </motion.div>
 );

 // Render Step 2
 const renderStep2 = () => {
 const totalMembersCount = 1 + members.length;
 const isMinSatisfied = totalMembersCount >= 3;
 const isMaxReached = members.length >= 4;

 return (
 <motion.div
 key="step2"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="relative space-y-5 sm:space-y-6"
 >
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
 <div className="min-w-0">
 <h2 className="text-lg sm:text-2xl font-black text-white">
 Step 2: Team Members
 </h2>
 <p className="text-[11px] sm:text-xs text-white/70 mt-1">
 Add squad members. <strong className="text-[#a8b3ff]">Minimum 3 members</strong> required (Leader + Member 2 & 3), <strong className="text-purple-200/90">Maximum 5 members</strong>.
 </p>
 </div>

 <div className="flex items-center space-x-2">
 <div
 className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-bold w-fit ${
 isMinSatisfied
 ? 'bg-white/[0.16] border-white/40 text-white'
 : 'bg-amber-500/15 border-amber-300/40 text-amber-200'
 }`}
 >
 <HiCheckBadge className="w-4 h-4 text-white" />
 <span>Team Size: {totalMembersCount} / 5 {isMinSatisfied ? 'Ready' : '(Min 3)'}</span>
 </div>
 </div>
 </div>

 {/* Member Cards Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 {/* Member 1: Team Leader Card (Required) */}
 <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/[0.16] p-5 space-y-3">
 <div className="relative flex items-start justify-between">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 rounded-full bg-[#4a5cd9] text-white flex items-center justify-center font-black text-base">
 {teamInfo.leaderName ? teamInfo.leaderName.charAt(0).toUpperCase() : 'L'}
 </div>
 <div>
 <h4 className="text-base font-bold text-white leading-tight">
 {teamInfo.leaderName || 'Team Leader'}
 </h4>
 <p className="text-xs text-white/80 ">{teamInfo.leaderEmail}</p>
 </div>
 </div>
 <span className="px-2.5 py-1 rounded-full bg-white/20 border border-white/40 text-white text-[10px] font-bold uppercase tracking-wider">
 Member 1 (Leader) - Required
 </span>
 </div>

 <div className="relative pt-2 border-t border-white/20 grid grid-cols-2 gap-2 text-xs text-white/80">
 <div>
 <span className="text-white/60 block text-[10px] uppercase ">College</span>
 <span className="font-semibold text-white truncate block">
 {teamInfo.collegeName || 'N/A'}
 </span>
 </div>
 <div>
 <span className="text-white/60 block text-[10px] uppercase ">Branch & Year</span>
 <span className="font-semibold text-white truncate block">
 {teamInfo.branch} ({teamInfo.year})
 </span>
 </div>
 </div>
 </div>

 {/* Added Members Cards */}
 {members.map((member, idx) => {
 const isRequiredMember = idx < 2; // Member 2 & Member 3 are required

 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/[0.12] p-5 space-y-3 group"
 >
 <div className="relative flex items-start justify-between">
 <div className="flex items-center space-x-3">
 <div className="w-10 h-10 rounded-full bg-white/15 border border-white/30 text-white flex items-center justify-center font-bold text-sm">
 {member.fullName.charAt(0).toUpperCase()}
 </div>
 <div>
 <h4 className="text-base font-bold text-white leading-tight">
 {member.fullName}
 </h4>
 <p className="text-xs text-white/70 ">{member.email}</p>
 </div>
 </div>

 <div className="flex items-center space-x-2">
 {isRequiredMember ? (
 <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-300/40 text-amber-200 text-[10px] font-bold">
 Member {idx + 2} (Required)
 </span>
 ) : (
 <span className="px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/25 text-white/70 text-[10px]">
 Member {idx + 2} (Optional)
 </span>
 )}

 <button
 onClick={() => handleOpenEditModal(idx)}
 className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
 title="Edit Member"
 >
 <HiPencilSquare className="w-4 h-4" />
 </button>

 {!isRequiredMember && (
 <button
 onClick={() => handleRemoveMember(idx)}
 className="p-1.5 rounded-lg text-white/70 hover:text-rose-200 hover:bg-rose-500/20 transition-all cursor-pointer"
 title="Remove Member 4/5"
 >
 <HiTrash className="w-4 h-4" />
 </button>
 )}
 </div>
 </div>

 <div className="relative pt-2 border-t border-white/20 grid grid-cols-2 gap-2 text-xs text-white/80">
 <div>
 <span className="text-white/60 block text-[10px] uppercase ">College</span>
 <span className="font-semibold text-white truncate block">
 {member.collegeName}
 </span>
 </div>
 <div>
 <span className="text-white/60 block text-[10px] uppercase ">Branch & Year</span>
 <span className="font-semibold text-white truncate block">
 {member.branch} ({member.year})
 </span>
 </div>
 </div>
 </motion.div>
 );
 })}

 {/* Add Member Slot Button */}
 {!isMaxReached ? (
 <motion.button
 type="button"
 onClick={handleOpenAddModal}
 className={`relative overflow-hidden p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center space-y-2 cursor-pointer group min-h-[140px] ${
 members.length < 2
 ? 'border-white/50 bg-white/[0.16] text-white'
 : 'border-white/25 bg-white/[0.08] text-white/70'
 }`}
 >
 <div className="relative p-3 rounded-2xl bg-white/15 border border-white/30 text-white">
 <HiPlus className="w-6 h-6" />
 </div>
 <span className="relative text-xs font-bold tracking-wider uppercase">
 {members.length < 2
 ? `+ Add Member ${members.length + 2} (Required for Min 3)`
 : `+ Add Member ${members.length + 2} (Optional - Max 5)`}
 </span>
 </motion.button>
 ) : (
 <div className="relative overflow-hidden p-6 rounded-2xl border-2 border-white/20 bg-white/[0.06] flex flex-col items-center justify-center space-y-2 text-white/60 min-h-[140px]">
 <div className="relative flex flex-col items-center space-y-2">
 <HiLockClosed className="w-6 h-6 text-white/50" />
 <span className="text-xs font-bold tracking-wider uppercase text-white/60">
 Maximum Team Size Reached (5/5)
 </span>
 </div>
 </div>
 )}
 </div>
 </motion.div>
 );
 };

 // Render Step 3
 const renderStep3 = () => (
 <motion.div
 key="step3"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="relative space-y-6"
 >
 <div className="border-b border-white/20 pb-4">
 <h2 className="text-xl sm:text-2xl font-black text-white">
 Step 3: Review & Submit
 </h2>
 <p className="text-xs text-white/70 mt-1">
 Review all details carefully before finalizing team registration.
 </p>
 </div>

 {/* Summary Container */}
 <div className="space-y-5">
 {/* Team & College Info */}
 <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/[0.12] p-5 space-y-3">
 <div className="relative flex items-center justify-between pb-3 border-b border-white/20">
 <span className="text-xs text-[#a8b3ff] font-bold uppercase tracking-wider">
 Team Information
 </span>
 <button
 onClick={() => setCurrentStep(1)}
 className="text-xs font-bold text-white/70 hover:text-white flex items-center space-x-1 transition-colors"
 >
 <HiPencilSquare className="w-3.5 h-3.5" />
 <span>Edit</span>
 </button>
 </div>

 <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
 <div>
 <span className="text-white/60 block uppercase text-[10px]">Team Name</span>
 <span className="font-bold text-white text-sm">{teamInfo.teamName}</span>
 </div>
 <div>
 <span className="text-white/60 block uppercase text-[10px]">College</span>
 <span className="font-semibold text-white/90">{teamInfo.collegeName}</span>
 </div>
 <div>
 <span className="text-white/60 block uppercase text-[10px]">Location</span>
 <span className="font-semibold text-white/90">
 {teamInfo.city}, {teamInfo.state}
 </span>
 </div>
 <div>
 <span className="text-white/60 block uppercase text-[10px]">Total Members</span>
 <span className="font-bold text-white">{1 + members.length} Members</span>
 </div>
 </div>
 </div>

 {/* Leader Info */}
 <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/[0.12] p-5 space-y-3">
 <div className="relative flex items-center justify-between pb-3 border-b border-white/20">
 <span className="text-xs text-[#a8b3ff] font-bold uppercase tracking-wider">
 Leader Information
 </span>
 <button
 onClick={() => setCurrentStep(1)}
 className="text-xs font-bold text-white/70 hover:text-white flex items-center space-x-1 transition-colors"
 >
 <HiPencilSquare className="w-3.5 h-3.5" />
 <span>Edit</span>
 </button>
 </div>

 <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
 <div>
 <span className="text-white/60 block uppercase text-[10px]">Leader Name</span>
 <span className="font-bold text-white">{teamInfo.leaderName}</span>
 </div>
 <div>
 <span className="text-white/60 block uppercase text-[10px]">Email</span>
 <span className="font-semibold text-white/90 ">{teamInfo.leaderEmail}</span>
 </div>
 <div>
 <span className="text-white/60 block uppercase text-[10px]">Phone</span>
 <span className="font-semibold text-white/90">{teamInfo.leaderPhone}</span>
 </div>
 <div>
 <span className="text-white/60 block uppercase text-[10px]">Branch & Year</span>
 <span className="font-semibold text-white/90">
 {teamInfo.branch} ({teamInfo.year})
 </span>
 </div>
 </div>
 </div>

 {/* Team Members List */}
 <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/[0.12] p-5 space-y-3">
 <div className="relative flex items-center justify-between pb-3 border-b border-white/20">
 <span className="text-xs text-[#a8b3ff] font-bold uppercase tracking-wider">
 Additional Team Members ({members.length})
 </span>
 <button
 onClick={() => setCurrentStep(2)}
 className="text-xs font-bold text-white/70 hover:text-white flex items-center space-x-1 transition-colors"
 >
 <HiPencilSquare className="w-3.5 h-3.5" />
 <span>Manage Members</span>
 </button>
 </div>

 {members.length === 0 ? (
 <p className="relative text-xs text-white/70 italic">No additional team members added. Single leader team.</p>
 ) : (
 <div className="relative space-y-2">
 {members.map((m, i) => (
 <div
 key={i}
 className="flex items-center justify-between p-3 rounded-xl bg-white/[0.08] border border-white/20 text-xs"
 >
 <div className="flex items-center space-x-3">
 <span className="w-6 h-6 rounded-full bg-white/15 border border-white/30 text-white font-bold text-[10px] flex items-center justify-center">
 {i + 1}
 </span>
 <div>
 <span className="font-bold text-white block">{m.fullName}</span>
 <span className="text-[11px] text-white/70 ">{m.email}</span>
 </div>
 </div>
 <div className="text-right text-white/80">
 <span>
 {m.collegeName} • {m.branch}
 </span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Confirmation Checkbox */}
 <div className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/[0.16] p-4 flex items-start space-x-3">
 <input
 type="checkbox"
 id="confirmCheck"
 checked={isConfirmed}
 onChange={(e) => setIsConfirmed(e.target.checked)}
 className="relative mt-1 w-5 h-5 min-w-[20px] min-h-[20px] rounded border-white/40 bg-white/10 text-[#4a5cd9] focus:ring-white/40 focus:ring-offset-0 cursor-pointer"
 />
 <label htmlFor="confirmCheck" className="relative text-xs sm:text-sm text-white/90 cursor-pointer leading-relaxed select-none">
 I confirm that all information provided above is correct, accurate, and complete. I understand that registration verification is final.
 </label>
 </div>

 {/* Large Glowing Submit Button */}
 <button
 type="submit"
 disabled={isSubmitting}
 onClick={(e) => {
 e.preventDefault();
 console.log("Button Clicked: Complete Registration Submit");
 handleSubmitRegistration(e);
 }}
 className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center space-x-2 cursor-pointer touch-manipulation relative z-20 ${
 isConfirmed && !isSubmitting
 ? 'bg-[#3645bf] hover:bg-[#4a5cd9] text-white hover:scale-[1.02] active:scale-95'
 : 'bg-white/[0.08] text-white/60 hover:text-white border border-white/25'
 }`}
 >
 {isSubmitting ? (
 <div className="flex items-center space-x-2 pointer-events-none">
 <HiArrowPath className="w-5 h-5 animate-spin" />
 <span>Verifying & Completing Registration...</span>
 </div>
 ) : (
 <div className="flex items-center space-x-2 pointer-events-none">
 <HiShieldCheck className="w-6 h-6 text-white" />
 <span>Complete Registration</span>
 </div>
 )}
 </button>
 </div>
 </motion.div>
 );

 // Render Post-Submit Success View
 const renderSuccessView = () => (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="text-center py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-2xl mx-auto"
 >
 {/* Animated Checkmark Badge */}
 <div className="relative inline-flex items-center justify-center">
 <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#4a5cd9] text-white flex items-center justify-center relative z-10 border border-white/30">
 <HiCheck className="w-12 h-12 sm:w-14 sm:h-14 stroke-[3]" />
 </div>
 </div>

 <div className="space-y-3">
 <div className="inline-flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/[0.12] border border-white/30 text-[#a8b3ff] text-[10px] sm:text-xs font-bold tracking-widest uppercase">
 <HiCheckBadge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4a5cd9]" />
 <span>AUTO-VERIFICATION COMPLETE</span>
 </div>

 <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
 Registration Successful!
 </h2>
 <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
 Your squad has been officially registered & verified for Hackspora 2.0.
 </p>
 </div>

 {/* Team ID Card */}
 <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/[0.12] p-5 sm:p-6 space-y-4 max-w-lg mx-auto">
 <div className="relative">
 <span className="text-[10px] sm:text-xs text-[#a8b3ff] font-bold uppercase tracking-widest block">
 YOUR OFFICIAL TEAM ID
 </span>
 <div className="text-3xl sm:text-5xl font-black text-white tracking-wider mt-2 break-all">
 {registeredResult?.teamId || 'HS2026-001'}
 </div>

 <div className="flex flex-col xs:flex-row items-center justify-center gap-3 xs:gap-4 pt-4 mt-2 border-t border-white/20 text-xs text-white/80">
 <div>
 <span className="text-white/60 block text-[10px]">Team Name</span>
 <span className="font-bold text-white break-words">{registeredResult?.teamName}</span>
 </div>
 <div className="hidden xs:block h-6 w-px bg-white/20" />
 <div className="hidden xs:block w-px h-6 bg-white/20" />
 <div>
 <span className="text-white/60 block text-[10px]">Registration Status</span>
 <span className="inline-flex items-center space-x-1 font-bold text-white">
 <HiCheckBadge className="w-3.5 h-3.5" />
 <span>Verified</span>
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
 <button
 onClick={() => navigate('/dashboard')}
 className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-extrabold text-white bg-[#3645bf] hover:bg-[#4a5cd9] hover:scale-105 transition-all cursor-pointer flex items-center justify-center space-x-2"
 >
 <span>Go to Dashboard</span>
 <HiArrowRight className="w-4 h-4" />
 </button>

 <button
 onClick={() => navigate('/problem-statements')}
 className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-extrabold text-white bg-white/[0.10] hover:bg-white/[0.18] border border-white/25 hover:border-white/40 transition-all cursor-pointer flex items-center justify-center space-x-2"
 >
 <HiLockClosed className="w-4 h-4 text-white" />
 <span>Explore Problem Statements</span>
 </button>
 </div>

 <p className="text-xs text-white/60 italic">
 Note: Problem statements remain locked until released by the hackathon committee.
 </p>
 </motion.div>
 );

 if (registeredResult) {
 return renderSuccessView();
 }

 return (
 <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-8">
 {/* Progress Bar Indicator */}
 <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/25 bg-white/[0.12] p-4 sm:p-6 space-y-3 sm:space-y-4">
 <div className="relative flex items-center justify-between text-[10px] sm:text-xs font-bold">
 <span className="text-[#4a5cd9] tracking-widest">REGISTRATION WIZARD</span>
 <span className="text-slate-200">STEP {currentStep} OF 3</span>
 </div>

 {/* Step Nodes */}
 <div className="relative flex items-center justify-between gap-1">
 {/* Connector Line */}
 <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2 -z-0 rounded-full" />
 <div
 className="absolute top-1/2 left-0 h-1 bg-[#4a5cd9] -translate-y-1/2 -z-0 rounded-full transition-all duration-500"
 style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
 />

 {[
 { step: 1, label: 'Team Info' },
 { step: 2, label: 'Team Members' },
 { step: 3, label: 'Review & Submit' },
 ].map((s) => {
 const isCompleted = currentStep > s.step;
 const isCurrent = currentStep === s.step;
 return (
 <div key={s.step} className="relative z-10 flex flex-col items-center space-y-1 sm:space-y-2 min-w-0">
 <button
 type="button"
 onClick={() => {
 if (s.step < currentStep) setCurrentStep(s.step);
 }}
 className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-xs flex items-center justify-center transition-all touch-manipulation ${
 isCompleted
 ? 'bg-[#4a5cd9] text-white'
 : isCurrent
 ? 'bg-white/20 text-white border-2 border-white'
 : 'bg-white/[0.08] text-white/60 border border-white/20'
 }`}
 >
 {isCompleted ? <HiCheck className="w-5 h-5 stroke-[3]" /> : s.step}
 </button>
 <span
 className={`text-[9px] sm:text-[11px] font-semibold text-center px-1 ${
 isCurrent ? 'text-white' : isCompleted ? 'text-white/80' : 'text-white/50'
 }`}
 >
 {s.label}
 </span>
 </div>
 );
 })}
 </div>
 </div>

 {/* Main Wizard Form Card */}
 <form
 onSubmit={(e) => {
 e.preventDefault();
 if (currentStep === 3) {
 handleSubmitRegistration(e);
 } else {
 handleNextStep();
 }
 }}
 className="relative overflow-hidden p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/25 bg-white/[0.12]"
 >
 <AnimatePresence mode="wait">
 {currentStep === 1 && renderStep1()}
 {currentStep === 2 && renderStep2()}
 {currentStep === 3 && renderStep3()}
 </AnimatePresence>

 {/* Navigation Control Buttons */}
 <div className="relative pt-8 flex items-center justify-between border-t border-white/20 mt-8">
 <button
 type="button"
 disabled={currentStep === 1}
 onClick={handlePrevStep}
 className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer touch-manipulation relative z-20 ${
 currentStep === 1
 ? 'opacity-40 text-white/40 cursor-not-allowed bg-white/[0.06] border border-white/15'
 : 'text-white bg-white/[0.10] hover:bg-white/[0.18] border border-white/25 hover:border-white/40'
 }`}
 >
 <HiArrowLeft className="w-4 h-4" />
 <span>Previous</span>
 </button>

 {currentStep < 3 && (
 <button
 type="button"
 onClick={handleNextStep}
 className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl text-xs font-extrabold text-white bg-[#3645bf] hover:bg-[#4a5cd9] hover:scale-105 transition-all cursor-pointer touch-manipulation relative z-20"
 >
 <span>Next Step</span>
 <HiArrowRight className="w-4 h-4" />
 </button>
 )}
 </div>
 </form>

 {/* Member Modal */}
 <AddMemberModal
 isOpen={isModalOpen}
 onClose={() => setIsModalOpen(false)}
 onSave={handleSaveMember}
 initialData={editingData}
 memberIndex={editingIndex}
 />

 {/* Already Registered Modal */}
 <AlreadyRegisteredModal
 isOpen={isAlreadyRegisteredModalOpen}
 onClose={() => {
 setIsAlreadyRegisteredModalOpen(false);
 navigate('/dashboard');
 }}
 teamData={alreadyRegisteredData}
 />
 </div>
 );
}
