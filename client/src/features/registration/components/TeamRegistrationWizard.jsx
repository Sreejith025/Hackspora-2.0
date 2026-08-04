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
  HiSparkles,
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
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        toast.error('Please fill in all required team information');
        return;
      }
    }

    if (currentStep === 2) {
      const totalSquadSize = 1 + members.length;
      if (totalSquadSize < 3) {
        toast.error('A team must contain at least 3 members.');
        return;
      }
      if (totalSquadSize > 5) {
        toast.error('Maximum team size is 5 members.');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3));
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
  const handleSubmitRegistration = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm that all provided information is correct.');
      return;
    }

    const totalSquadSize = 1 + members.length;
    if (totalSquadSize < 3) {
      toast.error('A team must contain at least 3 members.');
      return;
    }
    if (totalSquadSize > 5) {
      toast.error('Maximum team size is 5 members.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        clerkId: user?.id || '',
        ...teamInfo,
        members,
      };

      const result = await registrationService.registerTeam(payload);
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
      if (err.response?.data?.registered || err.response?.data?.data) {
        setAlreadyRegisteredData(err.response.data.data || null);
        setIsAlreadyRegisteredModalOpen(true);
        toast.error('You are already registered for Hackspora 2.0.');
      } else {
        toast.error(err.message || 'Registration failed. Please try again.');
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
      className="space-y-6"
    >
      <div className="border-b border-slate-800/80 pb-4">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <span>Step 1: Team & Leader Details</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter your official team identity and primary leader contact information.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Team Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
            Team Name *
          </label>
          <input
            type="text"
            name="teamName"
            value={teamInfo.teamName}
            onChange={handleTeamInfoChange}
            placeholder="e.g. Quantum Cybernetics"
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-semibold"
          />
          {errors.teamName && <p className="text-xs text-rose-400 mt-1">{errors.teamName}</p>}
        </div>

        {/* Team Leader Name */}
        <div>
          <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
            Team Leader Name *
          </label>
          <div className="relative">
            <HiUser className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="leaderName"
              value={teamInfo.leaderName}
              onChange={handleTeamInfoChange}
              placeholder="e.g. John Doe"
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
          {errors.leaderName && <p className="text-xs text-rose-400 mt-1">{errors.leaderName}</p>}
        </div>

        {/* Team Leader Email */}
        <div>
          <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
            Team Leader Email *
          </label>
          <div className="relative">
            <HiEnvelope className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="email"
              name="leaderEmail"
              value={teamInfo.leaderEmail}
              onChange={handleTeamInfoChange}
              placeholder="leader@college.edu"
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
          {errors.leaderEmail && <p className="text-xs text-rose-400 mt-1">{errors.leaderEmail}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
            Phone Number *
          </label>
          <div className="relative">
            <HiPhone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              name="leaderPhone"
              value={teamInfo.leaderPhone}
              onChange={handleTeamInfoChange}
              placeholder="+91 9876543210"
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
          {errors.leaderPhone && <p className="text-xs text-rose-400 mt-1">{errors.leaderPhone}</p>}
        </div>

        {/* College Name */}
        <div>
          <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
            College Name *
          </label>
          <div className="relative">
            <HiBuildingLibrary className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="collegeName"
              value={teamInfo.collegeName}
              onChange={handleTeamInfoChange}
              placeholder="e.g. Anna University"
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
          {errors.collegeName && <p className="text-xs text-rose-400 mt-1">{errors.collegeName}</p>}
        </div>

        {/* Course */}
        <div>
          <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
            Course *
          </label>
          <select
            name="course"
            value={teamInfo.course}
            onChange={handleTeamInfoChange}
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
          >
            <option value="B.Tech">B.Tech / B.E</option>
            <option value="M.Tech">M.Tech / M.E</option>
            <option value="B.Sc">B.Sc Computer Science</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Branch */}
        <div>
          <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
            Branch *
          </label>
          <div className="relative">
            <HiAcademicCap className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="branch"
              value={teamInfo.branch}
              onChange={handleTeamInfoChange}
              placeholder="e.g. Computer Science"
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
          {errors.branch && <p className="text-xs text-rose-400 mt-1">{errors.branch}</p>}
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
            Year *
          </label>
          <select
            name="year"
            value={teamInfo.year}
            onChange={handleTeamInfoChange}
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
          >
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
            City *
          </label>
          <div className="relative">
            <HiMapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="city"
              value={teamInfo.city}
              onChange={handleTeamInfoChange}
              placeholder="e.g. Chennai"
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
          {errors.city && <p className="text-xs text-rose-400 mt-1">{errors.city}</p>}
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={teamInfo.state}
            onChange={handleTeamInfoChange}
            placeholder="e.g. Tamil Nadu"
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          {errors.state && <p className="text-xs text-rose-400 mt-1">{errors.state}</p>}
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
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Step 2: Team Members
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Add squad members. <strong className="text-cyan-300">Minimum 3 members</strong> required (Leader + Member 2 & 3), <strong className="text-purple-300">Maximum 5 members</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold w-fit ${
                isMinSatisfied
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-300 animate-pulse'
              }`}
            >
              <HiCheckBadge className="w-4 h-4 text-cyan-400" />
              <span>Team Size: {totalMembersCount} / 5 {isMinSatisfied ? '✅' : '(Min 3)'}</span>
            </div>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Member 1: Team Leader Card (Required) */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-indigo-950/30 border border-cyan-400/40 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 text-slate-950 flex items-center justify-center font-black text-base shadow-md shadow-cyan-500/20">
                  {teamInfo.leaderName ? teamInfo.leaderName.charAt(0).toUpperCase() : 'L'}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {teamInfo.leaderName || 'Team Leader'}
                  </h4>
                  <p className="text-xs text-cyan-300 font-mono">{teamInfo.leaderEmail}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/50 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                👑 Member 1 (Leader) • Required
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">College</span>
                <span className="font-semibold text-slate-200 truncate block">
                  {teamInfo.collegeName || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Branch & Year</span>
                <span className="font-semibold text-slate-200 truncate block">
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
                className="relative p-5 rounded-2xl bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50 shadow-xl space-y-3 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 flex items-center justify-center font-bold text-sm">
                      {member.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-tight">
                        {member.fullName}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isRequiredMember ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                        ⭐ Member {idx + 2} (Required)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-mono">
                        Member {idx + 2} (Optional)
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenEditModal(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all cursor-pointer"
                      title="Edit Member"
                    >
                      <HiPencilSquare className="w-4 h-4" />
                    </button>

                    {!isRequiredMember && (
                      <button
                        onClick={() => handleRemoveMember(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all cursor-pointer"
                        title="Remove Member 4/5"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">College</span>
                    <span className="font-semibold text-slate-200 truncate block">
                      {member.collegeName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Branch & Year</span>
                    <span className="font-semibold text-slate-200 truncate block">
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
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer group min-h-[140px] ${
                members.length < 2
                  ? 'border-cyan-500/60 bg-cyan-950/20 text-cyan-300 shadow-lg shadow-cyan-950/40'
                  : 'border-slate-800 hover:border-cyan-400/60 bg-slate-950/40 hover:bg-cyan-950/20 text-slate-400 hover:text-cyan-300'
              }`}
            >
              <div className="p-3 rounded-2xl bg-slate-900 group-hover:bg-cyan-500/10 border border-slate-800 group-hover:border-cyan-500/30 text-cyan-400 transition-all">
                <HiPlus className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold font-mono tracking-wider uppercase">
                {members.length < 2
                  ? `+ Add Member ${members.length + 2} (Required for Min 3)`
                  : `+ Add Member ${members.length + 2} (Optional - Max 5)`}
              </span>
            </motion.button>
          ) : (
            <div className="p-6 rounded-2xl border-2 border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center space-y-2 text-slate-500 min-h-[140px]">
              <HiLockClosed className="w-6 h-6 text-slate-600" />
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-500">
                Maximum Team Size Reached (5/5)
              </span>
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
      className="space-y-6"
    >
      <div className="border-b border-slate-800/80 pb-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Step 3: Review & Submit
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Review all details carefully before finalizing team registration.
        </p>
      </div>

      {/* Summary Container */}
      <div className="space-y-5">
        {/* Team & College Info */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Team Information
            </span>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs font-bold text-slate-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <HiPencilSquare className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block font-mono uppercase text-[10px]">Team Name</span>
              <span className="font-bold text-white text-sm">{teamInfo.teamName}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono uppercase text-[10px]">College</span>
              <span className="font-semibold text-slate-200">{teamInfo.collegeName}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono uppercase text-[10px]">Location</span>
              <span className="font-semibold text-slate-200">
                {teamInfo.city}, {teamInfo.state}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono uppercase text-[10px]">Total Members</span>
              <span className="font-bold text-cyan-300">{1 + members.length} Members</span>
            </div>
          </div>
        </div>

        {/* Leader Info */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Leader Information
            </span>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs font-bold text-slate-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <HiPencilSquare className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block font-mono uppercase text-[10px]">Leader Name</span>
              <span className="font-bold text-white">{teamInfo.leaderName}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono uppercase text-[10px]">Email</span>
              <span className="font-semibold text-slate-200 font-mono">{teamInfo.leaderEmail}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono uppercase text-[10px]">Phone</span>
              <span className="font-semibold text-slate-200">{teamInfo.leaderPhone}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-mono uppercase text-[10px]">Branch & Year</span>
              <span className="font-semibold text-slate-200">
                {teamInfo.branch} ({teamInfo.year})
              </span>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Additional Team Members ({members.length})
            </span>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs font-bold text-slate-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <HiPencilSquare className="w-3.5 h-3.5" />
              <span>Manage Members</span>
            </button>
          </div>

          {members.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No additional team members added. Single leader team.</p>
          ) : (
            <div className="space-y-2">
              {members.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-bold text-[10px] flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-bold text-white block">{m.fullName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{m.email}</span>
                    </div>
                  </div>
                  <div className="text-right text-slate-300">
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
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-start space-x-3">
          <input
            type="checkbox"
            id="confirmCheck"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-950 cursor-pointer"
          />
          <label htmlFor="confirmCheck" className="text-xs text-slate-200 cursor-pointer leading-relaxed">
            I confirm that all information provided above is correct, accurate, and complete. I understand that registration verification is final.
          </label>
        </div>

        {/* Large Glowing Submit Button */}
        <button
          type="button"
          disabled={!isConfirmed || isSubmitting}
          onClick={handleSubmitRegistration}
          className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center space-x-2 shadow-2xl cursor-pointer ${
            isConfirmed && !isSubmitting
              ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 text-slate-950 shadow-cyan-500/30 hover:scale-[1.02] active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <HiSparkles className="w-5 h-5 animate-spin" />
              <span>Verifying & Completing Registration...</span>
            </div>
          ) : (
            <>
              <HiShieldCheck className="w-6 h-6 text-slate-950" />
              <span>Complete Registration</span>
            </>
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
      className="text-center py-8 space-y-8 max-w-2xl mx-auto"
    >
      {/* Animated Checkmark Badge */}
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/40 relative z-10">
          <HiCheck className="w-14 h-14 stroke-[3]" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
          <HiSparkles className="w-4 h-4 text-cyan-400" />
          <span>AUTO-VERIFICATION COMPLETE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Registration Successful!
        </h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Your squad has been officially registered & verified for Hackspora 2.0.
        </p>
      </div>

      {/* Team ID Card */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 shadow-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-purple-950/40 space-y-4 max-w-lg mx-auto">
        <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-widest block">
          YOUR OFFICIAL TEAM ID
        </span>
        <div className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 tracking-wider">
          {registeredResult?.teamId || 'HS2026-001'}
        </div>

        <div className="flex items-center justify-center space-x-4 pt-2 border-t border-slate-800 text-xs text-slate-300">
          <div>
            <span className="text-slate-500 block font-mono text-[10px]">Team Name</span>
            <span className="font-bold text-white">{registeredResult?.teamName}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block font-mono text-[10px]">Registration Status</span>
            <span className="inline-flex items-center space-x-1 font-bold text-cyan-400">
              <HiCheckBadge className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-105 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2"
        >
          <span>Go to Dashboard</span>
          <HiArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('/problem-statements')}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-extrabold text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer flex items-center justify-center space-x-2"
        >
          <HiLockClosed className="w-4 h-4 text-cyan-400" />
          <span>Explore Problem Statements</span>
        </button>
      </div>

      <p className="text-xs text-slate-500 italic">
        Note: Problem statements remain locked until released by the hackathon committee.
      </p>
    </motion.div>
  );

  if (registeredResult) {
    return renderSuccessView();
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Progress Bar Indicator */}
      <div className="glass-card p-6 rounded-2xl border border-cyan-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className="text-cyan-400">REGISTRATION WIZARD</span>
          <span className="text-slate-400">STEP {currentStep} OF 3</span>
        </div>

        {/* Step Nodes */}
        <div className="relative flex items-center justify-between">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 -z-0 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 -translate-y-1/2 -z-0 rounded-full transition-all duration-500"
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
              <div key={s.step} className="relative z-10 flex flex-col items-center space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (s.step < currentStep) setCurrentStep(s.step);
                  }}
                  className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30'
                      : isCurrent
                      ? 'bg-slate-950 text-cyan-300 border-2 border-cyan-400 shadow-lg shadow-cyan-400/40 ring-4 ring-cyan-500/20'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isCompleted ? <HiCheck className="w-5 h-5 stroke-[3]" /> : s.step}
                </button>
                <span
                  className={`text-[11px] font-mono font-semibold hidden sm:block ${
                    isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-300' : 'text-slate-500'
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
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl bg-gradient-to-b from-[#080d1e]/90 via-[#040711]/90 to-[#080d1e]/90">
        <AnimatePresence mode="wait">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </AnimatePresence>

        {/* Navigation Control Buttons */}
        <div className="pt-8 flex items-center justify-between border-t border-slate-800/80 mt-8">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={handlePrevStep}
            className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentStep === 1
                ? 'opacity-40 text-slate-600 cursor-not-allowed bg-slate-900'
                : 'text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-white'
            }`}
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 3 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-105 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <HiArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

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
