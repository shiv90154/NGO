import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaLock, FaMobile, FaCalendarAlt, FaVenusMars,
  FaChevronDown, FaChevronUp, FaArrowLeft, FaCheckCircle,
  FaCloudUploadAlt, FaEye, FaEyeSlash, FaChevronRight,
  FaGraduationCap, FaCode, FaMoneyBillWave, FaNewspaper, FaUserMd,
  FaHeartbeat, FaTractor, FaLaptopCode, FaShareAlt, FaSpinner
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

  const [basic, setBasic] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    mobile: '', dob: '', gender: '', role: 'user',
  });

  const [finance, setFinance] = useState({
    aadharCard: '', aadharFile: null, panCard: '', panFile: null,
    voterId: '', passportNumber: ''
  });

  const [health, setHealth] = useState({
    bloodGroup: '', allergies: '', medicalHistory: '',
    emergencyContactName: '', emergencyContactRelation: '', emergencyContactPhone: ''
  });

  const [agri, setAgri] = useState({
    landSize: '', cropType: '', farmLocation: '', irrigationType: ''
  });

  const [education, setEducation] = useState({
    className: '', schoolName: '', board: '', percentage: '',
  });

  const [it, setIt] = useState({
    projectType: '', techStack: '', experience: ''
  });

  const [social, setSocial] = useState({
    username: '', bio: '', profilePicture: null, interests: '',
  });

  const [openSection, setOpenSection] = useState(null);

  const aadharRef = useRef();
  const panRef = useRef();
  const profileRef = useRef();

  const projectOptions = ['Mobile App', 'Web App', 'E-commerce', 'Custom Software', 'API Development', 'AI/ML'];
  const techOptions = ['MERN', 'MEAN', 'Python', 'Java', 'PHP', 'Mobile'];
  const bloodOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleBasic = (e) => {
    setBasic({ ...basic, [e.target.name]: e.target.value });
    if (error[e.target.name]) setError({ ...error, [e.target.name]: '' });
  };

  const handleFinance = (e) => {
    setFinance({ ...finance, [e.target.name]: e.target.value });
  };

  const handleFile = (e, field) => {
    const file = e.target.files[0];
    if (file) setFinance({ ...finance, [field]: file });
  };

  const handleProfile = (e) => {
    const file = e.target.files[0];
    if (file) setSocial({ ...social, profilePicture: file });
  };

  const handleHealth = (e) => {
    setHealth({ ...health, [e.target.name]: e.target.value });
  };

  const handleAgri = (e) => {
    setAgri({ ...agri, [e.target.name]: e.target.value });
  };

  const handleEducation = (e) => {
    setEducation({ ...education, [e.target.name]: e.target.value });
  };

  const handleIT = (e) => {
    setIt({ ...it, [e.target.name]: e.target.value });
  };

  const handleSocial = (e) => {
    setSocial({ ...social, [e.target.name]: e.target.value });
  };

  const validateBasic = () => {
    const err = {};
    if (!basic.name) err.name = 'Name required';
    if (!basic.email) err.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(basic.email)) err.email = 'Invalid email';
    if (!basic.password) err.password = 'Password required';
    else if (basic.password.length < 6) err.password = 'Min 6 characters';
    if (basic.password !== basic.confirmPassword) err.confirmPassword = 'Passwords do not match';
    if (!basic.mobile) err.mobile = 'Mobile required';
    else if (!/^\d{10}$/.test(basic.mobile)) err.mobile = '10 digits required';
    if (!basic.dob) err.dob = 'DOB required';
    if (!basic.gender) err.gender = 'Gender required';
    
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError({});

    const fd = new FormData();
    fd.append('name', basic.name);
    fd.append('email', basic.email);
    fd.append('password', basic.password);
    fd.append('phone', basic.mobile);
    fd.append('dob', basic.dob);
    fd.append('gender', basic.gender);
    fd.append('role', basic.role);

    if (finance.aadharFile) fd.append('aadhaarImage', finance.aadharFile);
    if (finance.panFile) fd.append('panImage', finance.panFile);
    if (social.profilePicture) fd.append('profileImage', social.profilePicture);
    
    const textFields = {
      aadharCard: finance.aadharCard, panCard: finance.panCard, voterId: finance.voterId, passportNumber: finance.passportNumber,
      bloodGroup: health.bloodGroup, allergies: health.allergies, medicalHistory: health.medicalHistory,
      emergencyContactName: health.emergencyContactName, emergencyContactRelation: health.emergencyContactRelation, emergencyContactPhone: health.emergencyContactPhone,
      landSize: agri.landSize, cropType: agri.cropType, farmLocation: agri.farmLocation, irrigationType: agri.irrigationType,
      className: education.className, schoolName: education.schoolName, board: education.board, percentage: education.percentage,
      projectType: it.projectType, techStack: it.techStack, experience: it.experience,
      username: social.username, bio: social.bio, interests: social.interests
    };
    
    Object.keys(textFields).forEach(key => {
      if (textFields[key]) fd.append(key, textFields[key]);
    });

    try {
      const res = await axios.post(`${api}/users/register`, fd);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ _id: res.data._id, name: res.data.name, email: res.data.email }));
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/verify-otp', { state: { email: basic.email } }), 2000);
    } catch (err) {
      setError({ submit: err.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'finance', title: 'Finance & Identity', icon: FaMoneyBillWave, fields: [
      { name: 'aadharCard', placeholder: 'Aadhar Number', type: 'text' },
      { name: 'panCard', placeholder: 'PAN Number', type: 'text' },
      { name: 'voterId', placeholder: 'Voter ID', type: 'text' },
      { name: 'passportNumber', placeholder: 'Passport Number', type: 'text' }
    ], hasFiles: true },
    { id: 'health', title: 'Healthcare', icon: FaHeartbeat, fields: [
      { name: 'bloodGroup', placeholder: 'Blood Group', type: 'select', options: bloodOptions },
      { name: 'allergies', placeholder: 'Allergies', type: 'text' },
      { name: 'medicalHistory', placeholder: 'Medical History', type: 'textarea' },
      { name: 'emergencyContactName', placeholder: 'Emergency Contact', type: 'text' },
      { name: 'emergencyContactRelation', placeholder: 'Relation', type: 'text' },
      { name: 'emergencyContactPhone', placeholder: 'Emergency Phone', type: 'tel' }
    ] },
    { id: 'agriculture', title: 'Agriculture', icon: FaTractor, fields: [
      { name: 'landSize', placeholder: 'Land Size (acres)', type: 'number' },
      { name: 'cropType', placeholder: 'Crop Types', type: 'text' },
      { name: 'farmLocation', placeholder: 'Farm Location', type: 'text' },
      { name: 'irrigationType', placeholder: 'Irrigation Type', type: 'text' }
    ] },
    { id: 'education', title: 'Education', icon: FaGraduationCap, fields: [
      { name: 'className', placeholder: 'Class/Qualification', type: 'text' },
      { name: 'schoolName', placeholder: 'School/College', type: 'text' },
      { name: 'board', placeholder: 'Board/University', type: 'text' },
      { name: 'percentage', placeholder: 'Percentage/CGPA', type: 'text' }
    ] },
    { id: 'it', title: 'IT Services', icon: FaLaptopCode, fields: [
      { name: 'projectType', placeholder: 'Project Type', type: 'select', options: projectOptions },
      { name: 'techStack', placeholder: 'Tech Stack', type: 'select', options: techOptions },
      { name: 'experience', placeholder: 'Experience', type: 'text' }
    ] },
    { id: 'social', title: 'Social Profile', icon: FaShareAlt, fields: [
      { name: 'username', placeholder: 'Username', type: 'text' },
      { name: 'bio', placeholder: 'Bio', type: 'textarea' },
      { name: 'interests', placeholder: 'Interests', type: 'text' }
    ], hasProfilePic: true }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">Citizen Registration</h1>
          <p className="text-gray-600 text-sm">Government of India - Digital Portal</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className={step === 1 ? 'text-blue-800 font-medium' : 'text-gray-500'}>Step 1: Basic Info</span>
            <span className={step === 2 ? 'text-blue-800 font-medium' : 'text-gray-500'}>Step 2: Additional Info</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full">
            <div className={`h-full bg-blue-800 rounded-full ${step === 1 ? 'w-1/2' : 'w-full'}`} />
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex items-center gap-2">
            <FaCheckCircle /> {success}
          </div>
        )}
        {error.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error.submit}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white rounded shadow p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="name" value={basic.name} onChange={handleBasic}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${error.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter full name" />
                {error.name && <p className="text-red-500 text-xs mt-1">{error.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" value={basic.email} onChange={handleBasic}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${error.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="you@example.com" />
                {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={basic.password} onChange={handleBasic}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${error.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Min 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2.5 text-gray-400">
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
                {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={basic.confirmPassword} onChange={handleBasic}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${error.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Re-enter password" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-2.5 text-gray-400">
                    {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
                {error.confirmPassword && <p className="text-red-500 text-xs mt-1">{error.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input type="tel" name="mobile" value={basic.mobile} onChange={handleBasic}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${error.mobile ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="9876543210" />
                {error.mobile && <p className="text-red-500 text-xs mt-1">{error.mobile}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input type="date" name="dob" value={basic.dob} onChange={handleBasic}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${error.dob ? 'border-red-500' : 'border-gray-300'}`} />
                {error.dob && <p className="text-red-500 text-xs mt-1">{error.dob}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select name="gender" value={basic.gender} onChange={handleBasic}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${error.gender ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {error.gender && <p className="text-red-500 text-xs mt-1">{error.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <select name="role" value={basic.role} onChange={handleBasic}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button onClick={() => validateBasic() && setStep(2)}
                className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2 rounded text-sm flex items-center gap-2">
                Next <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="bg-white rounded shadow p-5">
            <button onClick={() => setStep(1)} className="mb-4 flex items-center gap-2 text-blue-700 text-sm">
              <FaArrowLeft size={12} /> Back
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-4">Additional Information</h2>
            <p className="text-gray-500 text-sm mb-4">All fields are optional</p>

            {sections.map(section => {
              const isOpen = openSection === section.id;
              const data = {
                finance, health, agriculture: agri, education, it, social
              }[section.id];
              const handler = {
                finance: handleFinance, health: handleHealth,
                agriculture: handleAgri, education: handleEducation,
                it: handleIT, social: handleSocial
              }[section.id];
              
              return (
                <div key={section.id} className="mb-2 border border-gray-200 rounded">
                  <button onClick={() => setOpenSection(isOpen ? null : section.id)}
                    className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <section.icon /> {section.title}
                    </span>
                    {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                  </button>
                  
                  {isOpen && (
                    <div className="p-3 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {section.fields.map(field => (
                          <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                            {field.type === 'select' ? (
                              <select name={field.name} value={data[field.name]} onChange={handler}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm">
                                <option value="">Select {field.placeholder}</option>
                                {field.options.map(opt => <option key={opt}>{opt}</option>)}
                              </select>
                            ) : field.type === 'textarea' ? (
                              <textarea name={field.name} placeholder={field.placeholder} value={data[field.name]} onChange={handler}
                                rows="2" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
                            ) : (
                              <input type={field.type} name={field.name} placeholder={field.placeholder} value={data[field.name]} onChange={handler}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
                            )}
                          </div>
                        ))}
                        
                        {section.hasFiles && (
                          <>
                            <div>
                              <label className="text-xs text-gray-500">Aadhar</label>
                              <div className="flex gap-2 mt-1">
                                <input type="text" placeholder="Number" value={finance.aadharCard} onChange={handleFinance}
                                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                <button onClick={() => aadharRef.current.click()} className="px-2 bg-gray-100 border rounded text-sm">
                                  <FaCloudUploadAlt /> 
                                </button>
                                <input type="file" ref={aadharRef} onChange={(e) => handleFile(e, 'aadharFile')} hidden />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">PAN</label>
                              <div className="flex gap-2 mt-1">
                                <input type="text" placeholder="Number" value={finance.panCard} onChange={handleFinance}
                                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm" />
                                <button onClick={() => panRef.current.click()} className="px-2 bg-gray-100 border rounded text-sm">
                                  <FaCloudUploadAlt />
                                </button>
                                <input type="file" ref={panRef} onChange={(e) => handleFile(e, 'panFile')} hidden />
                              </div>
                            </div>
                          </>
                        )}
                        
                        {section.hasProfilePic && (
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                {social.profilePicture ? 
                                  <img src={URL.createObjectURL(social.profilePicture)} className="w-full h-full rounded-full object-cover" /> :
                                  <FaUser className="text-gray-400" />
                                }
                              </div>
                              <button onClick={() => profileRef.current.click()} className="px-3 py-1.5 bg-gray-100 border rounded text-sm">
                                <FaCloudUploadAlt className="inline mr-1" /> Upload
                              </button>
                              <input type="file" ref={profileRef} onChange={handleProfile} accept="image/*" hidden />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex gap-3 mt-5 pt-4 border-t">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded text-sm font-medium">
                Back
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 rounded text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><FaSpinner className="animate-spin" /> Please wait...</> : <>Submit <FaCheckCircle /></>}
              </button>
            </div>
          </div>
        )}

        {/* Login Link */}
        <div className="text-center mt-5">
          <p className="text-sm text-gray-600">
            Already registered? <a href="/login" className="text-blue-800 hover:underline">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;