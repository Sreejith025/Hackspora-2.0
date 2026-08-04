import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiXMark,
  HiUser,
  HiEnvelope,
  HiPhone,
  HiAcademicCap,
  HiCodeBracket,
  HiMapPin,
  HiBuildingLibrary,
  HiCheckCircle,
} from 'react-icons/hi2';

export default function AddMemberModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  memberIndex = null,
  defaultCollege = '',
  defaultBranch = '',
  defaultCity = '',
  defaultState = '',
}) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        github: initialData.github || '',
        collegeName: initialData.collegeName || defaultCollege || '',
        course: initialData.course || 'B.Tech',
        branch: initialData.branch || defaultBranch || '',
        year: initialData.year || '3rd Year',
        city: initialData.city || defaultCity || '',
        state: initialData.state || defaultState || '',
      };
    }
    return {
      fullName: '',
      email: '',
      phone: '',
      github: '',
      collegeName: defaultCollege || '',
      course: 'B.Tech',
      branch: defaultBranch || '',
      year: '3rd Year',
      city: defaultCity || '',
      state: defaultState || '',
    };
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College Name is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData, memberIndex);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative z-10 w-full max-w-2xl bg-[#070c1a]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 max-h-[90vh] overflow-y-auto"
        >
          {/* Neon Glow Header Bar */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 rounded-full" />

          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <HiUser className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {initialData !== null ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
                <p className="text-xs text-slate-400">
                  {memberIndex !== null && memberIndex !== undefined
                    ? memberIndex < 2
                      ? `Member ${memberIndex + 2} (Required)`
                      : `Member ${memberIndex + 2} (Optional)`
                    : 'Provide member personal & academic credentials'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <HiUser className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Alex Johnson"
                    className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative">
                  <HiEnvelope className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@college.edu"
                    className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-400 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  Phone Number *
                </label>
                <div className="relative">
                  <HiPhone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  GitHub Profile URL
                </label>
                <div className="relative">
                  <HiCodeBracket className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/alexjohnson"
                    className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              {/* College Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  College Name *
                </label>
                <div className="relative">
                  <HiBuildingLibrary className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
                {errors.collegeName && (
                  <p className="text-xs text-rose-400 mt-1">{errors.collegeName}</p>
                )}
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  Course *
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
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
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
                {errors.branch && (
                  <p className="text-xs text-rose-400 mt-1">{errors.branch}</p>
                )}
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  Year of Study *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
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
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Chennai"
                    className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
                {errors.city && (
                  <p className="text-xs text-rose-400 mt-1">{errors.city}</p>
                )}
              </div>

              {/* State */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-cyan-300 font-bold mb-1 uppercase tracking-wider">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
                {errors.state && (
                  <p className="text-xs text-rose-400 mt-1">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800/80 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:scale-105 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <HiCheckCircle className="w-4 h-4" />
                <span>{initialData !== null ? 'Save Changes' : 'Add Member'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
