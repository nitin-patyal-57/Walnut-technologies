import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FiArrowLeft, FiSend, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase,
  FiCalendar, FiDollarSign, FiFileText, FiGlobe, FiCheckCircle,
  FiLinkedin, FiStar, FiChevronRight, FiUpload, FiAward, FiClock
} from 'react-icons/fi';

const steps = [
  { id: 1, label: 'Personal', icon: FiUser },
  { id: 2, label: 'Experience', icon: FiBriefcase },
  { id: 3, label: 'Education', icon: FiFileText },
  { id: 4, label: 'Skills', icon: FiGlobe },
  { id: 5, label: 'Submit', icon: FiSend },
];

export default function JobApplicationPage() {
  const [searchParams] = useSearchParams();
  const jobTitle = searchParams.get('title') || 'Position';
  const department = searchParams.get('dept') || '';
  const experience = searchParams.get('exp') || '';
  const salary = searchParams.get('salary') || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', location: '',
    currentCompany: '', currentDesignation: '', totalExperience: '',
    relevantExperience: '', expectedSalary: '', noticePeriod: '',
    education: '', university: '', yearOfPassing: '',
    skills: '', linkedin: '', portfolio: '',
    whyJoin: '', relocation: '', referralSource: '', resume: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.dataTransfer.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm placeholder:text-slate-400";
  const selectClass = "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.5em_1.5em] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]";

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30"
          >
            <FiCheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold font-display text-white mb-4"
          >
            Application Submitted!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/60 mb-10 text-lg"
          >
            Thank you for applying for <strong className="text-white">{jobTitle}</strong>. 
            Our HR team will review your application and get back to you within 5-7 business days.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/career" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors">
              <FiArrowLeft className="w-4 h-4" /> Back to Careers
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors">
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/career" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-6">
            <FiArrowLeft className="w-4 h-4" /> Back to Careers
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-4"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Now Hiring
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold font-display text-white mb-2"
              >
                Apply for <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{jobTitle}</span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 text-sm text-white/60"
              >
                {department && <span className="flex items-center gap-1.5"><FiBriefcase className="w-3.5 h-3.5 text-cyan-400" /> {department}</span>}
                {experience && <span className="flex items-center gap-1.5"><FiClock className="w-3.5 h-3.5 text-blue-400" /> {experience}</span>}
                {salary && <span className="flex items-center gap-1.5 font-semibold text-emerald-400"><FiDollarSign className="w-3.5 h-3.5" /> {salary}</span>}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-6 text-center"
            >
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10">
                <div className="text-2xl font-bold text-white">Step {currentStep}</div>
                <div className="text-xs text-white/50">of 5</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 overflow-x-auto">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {isCompleted ? (
                      <FiCheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-semibold hidden sm:inline">{step.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Personal Information</h2>
                        <p className="text-sm text-white/70">Tell us about yourself</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Current Location *</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="Gurugram, Haryana" className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Professional Experience */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <FiBriefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Professional Experience</h2>
                        <p className="text-sm text-white/70">Your work history and expectations</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Current Company</label>
                        <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange} placeholder="ABC Technologies" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Current Designation</label>
                        <input type="text" name="currentDesignation" value={formData.currentDesignation} onChange={handleChange} placeholder="Senior Engineer" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Total Experience *</label>
                        <select name="totalExperience" value={formData.totalExperience} onChange={handleChange} required className={selectClass}>
                          <option value="">Select experience</option>
                          <option value="Fresher">Fresher</option>
                          <option value="0-1 years">0-1 years</option>
                          <option value="1-3 years">1-3 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5-8 years">5-8 years</option>
                          <option value="8-12 years">8-12 years</option>
                          <option value="12+ years">12+ years</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Relevant Experience *</label>
                        <select name="relevantExperience" value={formData.relevantExperience} onChange={handleChange} required className={selectClass}>
                          <option value="">Select experience</option>
                          <option value="0-1 years">0-1 years</option>
                          <option value="1-3 years">1-3 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5-8 years">5-8 years</option>
                          <option value="8+ years">8+ years</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Salary (LPA) *</label>
                        <input type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} required placeholder="e.g. 10-15 LPA" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Notice Period *</label>
                        <select name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} required className={selectClass}>
                          <option value="">Select notice period</option>
                          <option value="Immediate">Immediate</option>
                          <option value="15 days">15 days</option>
                          <option value="30 days">30 days</option>
                          <option value="60 days">60 days</option>
                          <option value="90 days">90 days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Education */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <FiAward className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Education</h2>
                        <p className="text-sm text-white/70">Your academic background</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Highest Education *</label>
                        <select name="education" value={formData.education} onChange={handleChange} required className={selectClass}>
                          <option value="">Select degree</option>
                          <option value="B.Tech/B.E.">B.Tech / B.E.</option>
                          <option value="M.Tech/M.E.">M.Tech / M.E.</option>
                          <option value="BCA">BCA</option>
                          <option value="MCA">MCA</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="M.Sc">M.Sc</option>
                          <option value="MBA">MBA</option>
                          <option value="Diploma">Diploma</option>
                          <option value="PhD">PhD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">University / College</label>
                        <input type="text" name="university" value={formData.university} onChange={handleChange} placeholder="IIT Delhi" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Year of Passing</label>
                        <input type="text" name="yearOfPassing" value={formData.yearOfPassing} onChange={handleChange} placeholder="2020" className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Skills & Links */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <FiStar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Skills & Links</h2>
                        <p className="text-sm text-white/70">Showcase your expertise</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Key Skills *</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} required placeholder="e.g. STM32, Altium, SMT, ISO 13485, PCB Design" className={inputClass} />
                        <p className="text-xs text-slate-400 mt-2">Separate skills with commas</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">LinkedIn Profile</label>
                        <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Portfolio / GitHub</label>
                        <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://github.com/yourprofile" className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Additional & Submit */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <FiSend className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Final Step</h2>
                        <p className="text-sm text-white/70">Upload resume and submit</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Why do you want to join Walnut? *</label>
                      <textarea
                        name="whyJoin"
                        value={formData.whyJoin}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Tell us what excites you about this role and Walnut Technologies..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Willing to relocate to Manesar? *</label>
                        <select name="relocation" value={formData.relocation} onChange={handleChange} required className={selectClass}>
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Open to discussion">Open to discussion</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">How did you hear about us?</label>
                        <select name="referralSource" value={formData.referralSource} onChange={handleChange} className={selectClass}>
                          <option value="">Select</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Naukri">Naukri</option>
                          <option value="Referral">Employee Referral</option>
                          <option value="Company Website">Company Website</option>
                          <option value="Job Fair">Job Fair</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Resume *</label>
                      <label
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                          dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : formData.resume
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <input type="file" name="resume" onChange={handleChange} required accept=".pdf,.doc,.docx" className="hidden" />
                        {formData.resume ? (
                          <>
                            <FiCheckCircle className="w-10 h-10 text-emerald-500 mb-2" />
                            <p className="text-sm font-semibold text-emerald-700">{formData.resume.name}</p>
                            <p className="text-xs text-emerald-500 mt-1">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <FiUpload className="w-10 h-10 text-slate-300 mb-2" />
                            <p className="text-sm font-semibold text-slate-600">Drop your resume here or click to browse</p>
                            <p className="text-xs text-slate-400 mt-1">PDF, DOC, or DOCX (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>

                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-slate-400">By submitting, you agree to our privacy policy.</p>
                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
                      >
                        Submit Application
                        <FiSend className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 hover:text-slate-900'
              }`}
            >
              <FiArrowLeft className="w-4 h-4" />
              Previous
            </button>
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-slate-900/10"
              >
                Continue
                <FiChevronRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
