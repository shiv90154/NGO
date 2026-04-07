import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, MapPin, Landmark, Building2, Settings, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const api = import.meta.env.VITE_API_URL;

const AgricultureProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        farmerDetails: {
            phoneNumber: '', alternatePhone: '', dateOfBirth: '', gender: '',
            address: {
                village: '', district: '', state: '', pincode: '', landmark: ''
            },
            landHoldings: [],
            bankDetails: {
                accountNumber: '', ifscCode: '', bankName: '', accountHolderName: '', upiId: ''
            }
        },
        preferences: {
            language: 'hindi', preferredPaymentMethod: ''
        }
    });

    const [newLandHolding, setNewLandHolding] = useState({
        surveyNumber: '', areaInAcres: '', soilType: '', irrigationType: '', ownershipType: 'owned'
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${api}/agriculture/my-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setProfile(response.data.data);
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.put(
                `${api}/agriculture/farmers/${profile._id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {
                setProfile(response.data.data);
                setEditing(false);
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const addLandHolding = () => {
        if (!newLandHolding.surveyNumber || !newLandHolding.areaInAcres) {
            toast.error('Please fill survey number and area');
            return;
        }

        const updatedLandHoldings = [...(formData.farmerDetails.landHoldings || []), newLandHolding];
        setFormData({
            ...formData,
            farmerDetails: { ...formData.farmerDetails, landHoldings: updatedLandHoldings }
        });
        setNewLandHolding({
            surveyNumber: '', areaInAcres: '', soilType: '', irrigationType: '', ownershipType: 'owned'
        });
        toast.success('Land holding added');
    };

    const removeLandHolding = (index) => {
        const updatedLandHoldings = formData.farmerDetails.landHoldings.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            farmerDetails: { ...formData.farmerDetails, landHoldings: updatedLandHoldings }
        });
    };

    const handleChange = (e, section) => {
        const { name, value } = e.target;

        if (section === 'address') {
            setFormData({
                ...formData,
                farmerDetails: {
                    ...formData.farmerDetails,
                    address: { ...formData.farmerDetails.address, [name]: value }
                }
            });
        } else if (section === 'bankDetails') {
            setFormData({
                ...formData,
                farmerDetails: {
                    ...formData.farmerDetails,
                    bankDetails: { ...formData.farmerDetails.bankDetails, [name]: value }
                }
            });
        } else if (section === 'farmerDetails') {
            setFormData({
                ...formData,
                farmerDetails: { ...formData.farmerDetails, [name]: value }
            });
        } else if (section === 'preferences') {
            setFormData({
                ...formData,
                preferences: { ...formData.preferences, [name]: value }
            });
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-[#1e3a5f] text-xl">Loading profile...</div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer />
            <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] flex items-center gap-2">
                                    👤 Farmer Profile
                                </h1>
                                <p className="text-gray-500 mt-1">Manage your personal and farming details</p>
                            </div>
                            <div className="flex gap-3">
                                {!editing ? (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="bg-[#1e3a5f] hover:bg-[#162d48] px-4 py-2 rounded-lg text-white transition flex items-center gap-2"
                                    >
                                        <Edit2 size={16} /> Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditing(false);
                                                setFormData(profile);
                                            }}
                                            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white transition flex items-center gap-2"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                        <button
                                            onClick={updateProfile}
                                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => navigate('/agriculture/')}
                                    className="bg-[#ff8c42] hover:bg-[#e67e22] px-4 py-2 rounded-lg text-white transition"
                                >
                                    ← Dashboard
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                            <User size={20} className="text-[#ff8c42]" /> Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.farmerDetails.phoneNumber || ''}
                                    onChange={(e) => handleChange(e, 'farmerDetails')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Alternate Phone</label>
                                <input
                                    type="text"
                                    name="alternatePhone"
                                    value={formData.farmerDetails.alternatePhone || ''}
                                    onChange={(e) => handleChange(e, 'farmerDetails')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.farmerDetails.dateOfBirth?.split('T')[0] || ''}
                                    onChange={(e) => handleChange(e, 'farmerDetails')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.farmerDetails.gender || ''}
                                    onChange={(e) => handleChange(e, 'farmerDetails')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                            <MapPin size={20} className="text-[#ff8c42]" /> Address
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Village</label>
                                <input
                                    type="text"
                                    name="village"
                                    value={formData.farmerDetails.address?.village || ''}
                                    onChange={(e) => handleChange(e, 'address')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">District</label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.farmerDetails.address?.district || ''}
                                    onChange={(e) => handleChange(e, 'address')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.farmerDetails.address?.state || ''}
                                    onChange={(e) => handleChange(e, 'address')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.farmerDetails.address?.pincode || ''}
                                    onChange={(e) => handleChange(e, 'address')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600 block mb-1">Landmark</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.farmerDetails.address?.landmark || ''}
                                    onChange={(e) => handleChange(e, 'address')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Land Holdings Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                            <Landmark size={20} className="text-[#ff8c42]" /> Land Holdings
                        </h2>

                        {editing && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                                <h3 className="text-[#1e3a5f] font-semibold mb-3">Add New Land Holding</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Survey Number"
                                        value={newLandHolding.surveyNumber}
                                        onChange={(e) => setNewLandHolding({ ...newLandHolding, surveyNumber: e.target.value })}
                                        className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 focus:outline-none focus:border-[#ff8c42]"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Area (Acres)"
                                        value={newLandHolding.areaInAcres}
                                        onChange={(e) => setNewLandHolding({ ...newLandHolding, areaInAcres: e.target.value })}
                                        className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 focus:outline-none focus:border-[#ff8c42]"
                                    />
                                    <select
                                        value={newLandHolding.soilType}
                                        onChange={(e) => setNewLandHolding({ ...newLandHolding, soilType: e.target.value })}
                                        className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 focus:outline-none focus:border-[#ff8c42]"
                                    >
                                        <option value="">Soil Type</option>
                                        <option value="alluvial">Alluvial</option>
                                        <option value="black">Black</option>
                                        <option value="red">Red</option>
                                        <option value="sandy">Sandy</option>
                                        <option value="clay">Clay</option>
                                    </select>
                                    <select
                                        value={newLandHolding.irrigationType}
                                        onChange={(e) => setNewLandHolding({ ...newLandHolding, irrigationType: e.target.value })}
                                        className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 focus:outline-none focus:border-[#ff8c42]"
                                    >
                                        <option value="">Irrigation Type</option>
                                        <option value="canal">Canal</option>
                                        <option value="borewell">Borewell</option>
                                        <option value="rainfed">Rainfed</option>
                                        <option value="drip">Drip</option>
                                        <option value="sprinkler">Sprinkler</option>
                                    </select>
                                    <button
                                        onClick={addLandHolding}
                                        className="bg-[#ff8c42] hover:bg-[#e67e22] px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Add Land
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {formData.farmerDetails.landHoldings?.map((land, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center border border-gray-200">
                                    <div>
                                        <p className="text-[#1e3a5f] font-semibold">Survey: {land.surveyNumber}</p>
                                        <p className="text-sm text-gray-600">Area: {land.areaInAcres} acres</p>
                                        {land.soilType && <p className="text-sm text-gray-600">Soil: {land.soilType}</p>}
                                    </div>
                                    {editing && (
                                        <button
                                            onClick={() => removeLandHolding(index)}
                                            className="text-red-500 hover:text-red-700 transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {formData.farmerDetails.landHoldings?.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No land holdings added</p>
                            )}
                        </div>
                    </div>

                    {/* Bank Details Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                            <Building2 size={20} className="text-[#ff8c42]" /> Bank Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Account Number</label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.farmerDetails.bankDetails?.accountNumber || ''}
                                    onChange={(e) => handleChange(e, 'bankDetails')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={formData.farmerDetails.bankDetails?.ifscCode || ''}
                                    onChange={(e) => handleChange(e, 'bankDetails')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Bank Name</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.farmerDetails.bankDetails?.bankName || ''}
                                    onChange={(e) => handleChange(e, 'bankDetails')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">UPI ID</label>
                                <input
                                    type="text"
                                    name="upiId"
                                    value={formData.farmerDetails.bankDetails?.upiId || ''}
                                    onChange={(e) => handleChange(e, 'bankDetails')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                            <Settings size={20} className="text-[#ff8c42]" /> Preferences
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Language</label>
                                <select
                                    name="language"
                                    value={formData.preferences?.language || 'hindi'}
                                    onChange={(e) => handleChange(e, 'preferences')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                >
                                    <option value="hindi">हिन्दी (Hindi)</option>
                                    <option value="english">English</option>
                                    <option value="marathi">मराठी (Marathi)</option>
                                    <option value="punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Preferred Payment Method</label>
                                <select
                                    name="preferredPaymentMethod"
                                    value={formData.preferences?.preferredPaymentMethod || ''}
                                    onChange={(e) => handleChange(e, 'preferences')}
                                    disabled={!editing}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 disabled:opacity-50 focus:outline-none focus:border-[#ff8c42]"
                                >
                                    <option value="">Select</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AgricultureProfile;