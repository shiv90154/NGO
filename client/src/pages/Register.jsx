import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaLock, FaMobile, FaCalendarAlt, FaVenusMars, FaUserMd, FaArrowLeft, FaCheckCircle,
  FaCloudUploadAlt, FaEye, FaEyeSlash, FaChevronRight, FaGraduationCap,
  FaNewspaper, FaCode, FaMoneyBillWave, FaIdCard, FaTint, FaSeedling, FaLaptopCode
} from 'react-icons/fa';
import { GiFarmer } from 'react-icons/gi';

const api = import.meta.env.VITE_API_URL;

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Basic Info (Step 1 - Compulsory)
  const [basicInfo, setBasicInfo] = useState({
    name: '', email: '', password: '', confirmPassword: '', mobile: '', dob: '', gender: '', role: 'user',
  });

  // Module 1: Finance/Identity
  const [financeInfo, setFinanceInfo] = useState({
    aadharCard: '', aadharFile: null, panCard: '', panFile: null, voterId: '', passportNumber: ''
  });

  // Module 2: Healthcare
  const [healthInfo, setHealthInfo] = useState({
    bloodGroup: '', allergies: '', medicalHistory: '', emergencyContactName: '', emergencyContactRelation: '', emergencyContactPhone: ''
  });

  // Module 3: Agriculture
  const [agriInfo, setAgriInfo] = useState({
    landSize: '', cropType: '', farmLocation: '', irrigationType: ''
  });

  // Module 4: Education
  const [educationInfo, setEducationInfo] = useState({
    className: '', schoolName: '', board: '', percentage: '',
  });

  // Module 5: IT
  const [itInfo, setItInfo] = useState({
    projectType: '', techStack: '', experience: ''
  });

  // Module 6: Social Media
  const [socialInfo, setSocialInfo] = useState({
    username: '', bio: '', profilePicture: null, interests: '',
  });

  const aadharInputRef = useRef();
  const panInputRef = useRef();
  const profilePicInputRef = useRef();

  const projectTypeOptions = [
    'Mobile App Development', 'Web Application Development', 'E-commerce Platform',
    'Custom Software', 'API Development', 'AI/ML Integration', 'Other'
  ];

  const techStackOptions = [
    'MERN (MongoDB, Express, React, Node)', 'MEAN (MongoDB, Express, Angular, Node)',
    'Python (Django/Flask)', 'Java (Spring Boot)', 'PHP (Laravel)',
    'Mobile (React Native/Flutter)', 'Other'
  ];

  const handleBasicChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    if (error[e.target.name]) setError({ ...error, [e.target.name]: '' });
  };

  const handleFinanceChange = (e) => {
    setFinanceInfo({ ...financeInfo, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'application/pdf')) {
      setFinanceInfo({ ...financeInfo, [fieldName]: file });
    } else {
      setError({ ...error, [fieldName]: 'Only JPG, JPEG, or PDF files are allowed' });
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
      setSocialInfo({ ...socialInfo, profilePicture: file });
    } else {
      setError({ ...error, profilePicture: 'Only JPG, JPEG, or PNG files are allowed' });
    }
  };

  const handleHealthChange = (e) => {
    setHealthInfo({ ...healthInfo, [e.target.name]: e.target.value });
  };

  const handleAgriChange = (e) => {
    setAgriInfo({ ...agriInfo, [e.target.name]: e.target.value });
  };

  const handleEducationChange = (e) => {
    setEducationInfo({ ...educationInfo, [e.target.name]: e.target.value });
  };

  const handleITChange = (e) => {
    setItInfo({ ...itInfo, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e) => {
    setSocialInfo({ ...socialInfo, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!basicInfo.name) newErrors.name = "Name is required";
    if (!basicInfo.email) newErrors.email = "Email is required";
    else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(basicInfo.email)) newErrors.email = "Only Gmail addresses are allowed";
    if (!basicInfo.password) newErrors.password = "Password is required";
    else if (basicInfo.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (basicInfo.password !== basicInfo.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!basicInfo.mobile) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(basicInfo.mobile)) newErrors.mobile = "Mobile number must be 10 digits";
    if (!basicInfo.dob) newErrors.dob = "Date of birth is required";
    if (!basicInfo.gender) newErrors.gender = "Gender is required";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (nextStep) => {
    if (step === 1 && !validateStep1()) return;
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = (prevStep) => {
    setStep(prevStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError({});

    const formData = new FormData();

    // Basic info
    formData.append('name', basicInfo.name);
    formData.append('email', basicInfo.email);
    formData.append('password', basicInfo.password);
    formData.append('phone', basicInfo.mobile);
    formData.append('dob', basicInfo.dob);
    formData.append('gender', basicInfo.gender);
    formData.append('role', basicInfo.role);

    // Finance
    if (financeInfo.aadharFile) formData.append('aadhaarImage', financeInfo.aadharFile);
    if (financeInfo.panFile) formData.append('panImage', financeInfo.panFile);
    if (financeInfo.aadharCard) formData.append('aadharCard', financeInfo.aadharCard);
    if (financeInfo.panCard) formData.append('panCard', financeInfo.panCard);
    if (financeInfo.voterId) formData.append('voterId', financeInfo.voterId);
    if (financeInfo.passportNumber) formData.append('passportNumber', financeInfo.passportNumber);

    // Healthcare
    Object.keys(healthInfo).forEach(key => {
      if (healthInfo[key]) formData.append(key, healthInfo[key]);
    });

    // Agriculture
    Object.keys(agriInfo).forEach(key => {
      if (agriInfo[key]) formData.append(key, agriInfo[key]);
    });

    // Education
    Object.keys(educationInfo).forEach(key => {
      if (educationInfo[key]) formData.append(key, educationInfo[key]);
    });

    // IT
    Object.keys(itInfo).forEach(key => {
      if (itInfo[key]) formData.append(key, itInfo[key]);
    });

    // Social Media
    if (socialInfo.profilePicture) formData.append('profileImage', socialInfo.profilePicture);
    if (socialInfo.username) formData.append('username', socialInfo.username);
    if (socialInfo.bio) formData.append('bio', socialInfo.bio);
    if (socialInfo.interests) formData.append('interests', socialInfo.interests);

    try {
      const response = await axios.post(`${api}/users/register`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email
      }));
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: basicInfo.email } });
      }, 2000);
    } catch (err) {
      setError({ submit: err.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: '📝' },
    { number: 2, title: 'Identity', icon: '🆔' },
    { number: 3, title: 'Health', icon: '🏥' },
    { number: 4, title: 'Agriculture', icon: '🌾' },
    { number: 5, title: 'Education', icon: '🎓' },
    { number: 6, title: 'IT', icon: '💻' },
    { number: 7, title: 'Social', icon: '📱' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Government Emblem */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#FF9933] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#138808]"></div>
              </div>
            </div>
            <span className="text-xs text-gray-500">Government of India</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Samraddh Bharat Foundation</h1>
          <p className="text-gray-500 mt-1">Citizen Registration Portal</p>
          <div className="flex justify-center gap-1 mt-3">
            <div className="w-12 h-0.5 bg-[#FF9933]"></div>
            <div className="w-12 h-0.5 bg-white"></div>
            <div className="w-12 h-0.5 bg-[#138808]"></div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            {steps.map((s) => (
              <button
                key={s.number}
                onClick={() => setStep(s.number)}
                className="flex flex-col items-center group focus:outline-none"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step > s.number ? 'bg-green-600 text-white' :
                    step === s.number ? 'bg-blue-700 text-white ring-2 ring-blue-300' :
                      'bg-gray-200 text-gray-500'}`}
                >
                  {step > s.number ? '✓' : s.number}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${step === s.number ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </button>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 rounded-full w-full"></div>
            <div className="absolute top-0 left-0 h-1 bg-blue-700 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 6) * 100}%` }}></div>
          </div>
        </div>

        {/* Success / Error Messages */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-600 text-green-700 p-4 rounded-md mb-6 flex items-center gap-2">
            <FaCheckCircle className="text-green-600" />
            <span>{success}</span>
          </div>
        )}
        {error.submit && (
          <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded-md mb-6">
            {error.submit}
          </div>
        )}

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-xl font-bold text-blue-800">Step 1: Basic Information</h2>
              <p className="text-blue-600 text-sm">All fields marked with * are mandatory</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={basicInfo.name} onChange={handleBasicChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.name ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter your full name" />
                  {error.name && <p className="text-red-500 text-xs mt-1">{error.name}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={basicInfo.email} onChange={handleBasicChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.email ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="you@gmail.com" />
                  {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" value={basicInfo.password} onChange={handleBasicChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.password ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Min. 6 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={basicInfo.confirmPassword} onChange={handleBasicChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.confirmPassword ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Re-enter password" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {error.confirmPassword && <p className="text-red-500 text-xs mt-1">{error.confirmPassword}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="mobile" value={basicInfo.mobile} onChange={handleBasicChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.mobile ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="10-digit mobile number" />
                  {error.mobile && <p className="text-red-500 text-xs mt-1">{error.mobile}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Date of Birth <span className="text-red-500">*</span></label>
                  <input type="date" name="dob" value={basicInfo.dob} onChange={handleBasicChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.dob ? 'border-red-400' : 'border-gray-300'}`} />
                  {error.dob && <p className="text-red-500 text-xs mt-1">{error.dob}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Gender <span className="text-red-500">*</span></label>
                  <select name="gender" value={basicInfo.gender} onChange={handleBasicChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error.gender ? 'border-red-400' : 'border-gray-300'}`}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {error.gender && <p className="text-red-500 text-xs mt-1">{error.gender}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Role (Optional)</label>
                  <select name="role" value={basicInfo.role} onChange={handleBasicChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="user">User</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="AGENT">Agent</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button onClick={() => handleNext(2)} className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-md transition flex items-center gap-2 shadow-sm">
                  Next <FaChevronRight className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Identity (Finance) */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100">
              <h2 className="text-xl font-bold text-yellow-800">Step 2: Identity Documents</h2>
              <p className="text-yellow-600 text-sm">Upload or enter your identity proofs (optional but recommended)</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Aadhar Card Number</label>
                  <div className="flex gap-2">
                    <input type="text" name="aadharCard" placeholder="12-digit Aadhar" value={financeInfo.aadharCard} onChange={handleFinanceChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={() => aadharInputRef.current.click()} className="bg-gray-100 px-3 rounded-md hover:bg-gray-200 text-gray-700 text-sm">
                      Upload
                    </button>
                    <input type="file" ref={aadharInputRef} onChange={(e) => handleFileChange(e, 'aadharFile')} accept=".jpg,.jpeg,.pdf" className="hidden" />
                  </div>
                  {financeInfo.aadharFile && <p className="text-green-600 text-xs mt-1">✓ File uploaded</p>}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">PAN Card Number</label>
                  <div className="flex gap-2">
                    <input type="text" name="panCard" placeholder="PAN Number" value={financeInfo.panCard} onChange={handleFinanceChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={() => panInputRef.current.click()} className="bg-gray-100 px-3 rounded-md hover:bg-gray-200 text-gray-700 text-sm">
                      Upload
                    </button>
                    <input type="file" ref={panInputRef} onChange={(e) => handleFileChange(e, 'panFile')} accept=".jpg,.jpeg,.pdf" className="hidden" />
                  </div>
                  {financeInfo.panFile && <p className="text-green-600 text-xs mt-1">✓ File uploaded</p>}
                </div>
                <input type="text" name="voterId" placeholder="Voter ID" value={financeInfo.voterId} onChange={handleFinanceChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="passportNumber" placeholder="Passport Number" value={financeInfo.passportNumber} onChange={handleFinanceChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => handleBack(1)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md transition flex items-center gap-2">
                  <FaArrowLeft /> Back
                </button>
                <button onClick={() => handleNext(3)} className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-md transition flex items-center gap-2">
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Healthcare */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
              <h2 className="text-xl font-bold text-green-800">Step 3: Healthcare Information</h2>
              <p className="text-green-600 text-sm">For better health services</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <select name="bloodGroup" value={healthInfo.bloodGroup} onChange={handleHealthChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Blood Group</option>
                  <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option>
                  <option value="B-">B-</option><option value="O+">O+</option><option value="O-">O-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                </select>
                <input type="text" name="allergies" placeholder="Allergies (if any)" value={healthInfo.allergies} onChange={handleHealthChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <textarea name="medicalHistory" placeholder="Medical History" value={healthInfo.medicalHistory} onChange={handleHealthChange}
                  rows="2" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" />
                <input type="text" name="emergencyContactName" placeholder="Emergency Contact Name" value={healthInfo.emergencyContactName} onChange={handleHealthChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="emergencyContactRelation" placeholder="Relation" value={healthInfo.emergencyContactRelation} onChange={handleHealthChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="tel" name="emergencyContactPhone" placeholder="Emergency Phone" value={healthInfo.emergencyContactPhone} onChange={handleHealthChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => handleBack(2)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md transition flex items-center gap-2">
                  <FaArrowLeft /> Back
                </button>
                <button onClick={() => handleNext(4)} className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-md transition flex items-center gap-2">
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Agriculture */}
        {step === 4 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
              <h2 className="text-xl font-bold text-green-800">Step 4: Agriculture Details</h2>
              <p className="text-green-600 text-sm">For farmers and agri-entrepreneurs</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="number" name="landSize" placeholder="Land Size (acres)" value={agriInfo.landSize} onChange={handleAgriChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="cropType" placeholder="Crop Types (comma separated)" value={agriInfo.cropType} onChange={handleAgriChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="farmLocation" placeholder="Farm Location" value={agriInfo.farmLocation} onChange={handleAgriChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="irrigationType" placeholder="Irrigation Type" value={agriInfo.irrigationType} onChange={handleAgriChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => handleBack(3)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md transition flex items-center gap-2">
                  <FaArrowLeft /> Back
                </button>
                <button onClick={() => handleNext(5)} className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-md transition flex items-center gap-2">
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Education */}
        {step === 5 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-xl font-bold text-blue-800">Step 5: Education Details</h2>
              <p className="text-blue-600 text-sm">For educational services</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Class / Qualification</label>
                  <input type="text" name="className" placeholder="e.g., 10th, Graduate" value={educationInfo.className} onChange={handleEducationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">School / College</label>
                  <input type="text" name="schoolName" placeholder="Institution name" value={educationInfo.schoolName} onChange={handleEducationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Board / University</label>
                  <input type="text" name="board" placeholder="e.g., CBSE" value={educationInfo.board} onChange={handleEducationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Percentage / CGPA</label>
                  <input type="text" name="percentage" placeholder="85% or 8.5 CGPA" value={educationInfo.percentage} onChange={handleEducationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => handleBack(4)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md transition flex items-center gap-2">
                  <FaArrowLeft /> Back
                </button>
                <button onClick={() => handleNext(6)} className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-md transition flex items-center gap-2">
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: IT */}
        {step === 6 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
              <h2 className="text-xl font-bold text-purple-800">Step 6: IT & Development</h2>
              <p className="text-purple-600 text-sm">For tech professionals and service seekers</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <select name="projectType" value={itInfo.projectType} onChange={handleITChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Project Type</option>
                  {projectTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <select name="techStack" value={itInfo.techStack} onChange={handleITChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Tech Stack</option>
                  {techStackOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <input type="text" name="experience" placeholder="Experience Level" value={itInfo.experience} onChange={handleITChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2" />
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => handleBack(5)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md transition flex items-center gap-2">
                  <FaArrowLeft /> Back
                </button>
                <button onClick={() => handleNext(7)} className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-md transition flex items-center gap-2">
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Social Media */}
        {step === 7 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-pink-50 px-6 py-4 border-b border-pink-100">
              <h2 className="text-xl font-bold text-pink-800">Step 7: Social & Media Profile</h2>
              <p className="text-pink-600 text-sm">Final step – complete your profile</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
                    {socialInfo.profilePicture ? (
                      <img src={URL.createObjectURL(socialInfo.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FaUser className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  <div>
                    <button onClick={() => profilePicInputRef.current.click()} className="bg-gray-100 px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 border border-gray-300">
                      <FaCloudUploadAlt className="inline mr-1" /> Upload Photo
                    </button>
                    <input type="file" ref={profilePicInputRef} onChange={handleProfilePictureChange} accept=".jpg,.jpeg,.png" className="hidden" />
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG only</p>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Username</label>
                  <input type="text" name="username" placeholder="@username" value={socialInfo.username} onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Bio</label>
                  <textarea name="bio" placeholder="Short bio" value={socialInfo.bio} onChange={handleSocialChange}
                    rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Interests</label>
                  <input type="text" name="interests" placeholder="e.g., Technology, Farming" value={socialInfo.interests} onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => handleBack(6)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-md transition flex items-center gap-2">
                  <FaArrowLeft /> Back
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-6 rounded-md transition disabled:opacity-50 flex items-center gap-2">
                  {loading ? 'Registering...' : 'Submit Registration'} <FaCheckCircle />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Link */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          Already have an account? <a href="/login" className="text-blue-700 hover:underline">Sign in here</a>
        </div>
      </div>
    </div>
  );
};

export default Register;