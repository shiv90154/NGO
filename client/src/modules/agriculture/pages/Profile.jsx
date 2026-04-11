import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { State, City } from "country-state-city";

const api = import.meta.env.VITE_API_URL;

const Profile = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        land: "",
        state: "",
        district: "",
        locality: "",
    });
    const [originalLandHoldings, setOriginalLandHoldings] = useState([]); // preserve full array
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    // Fetch both farmer profile and user details
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                console.log("here");
                setLoading(true);
                // 1. Fetch farmer profile (agriculture data)
                const profileRes = await axios.get(`${api}/agriculture/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // 2. Fetch user details (email, name) – adjust endpoint as needed
                let userEmail = "";
                let userName = "";
                try {
                    const userRes = await axios.get(`${api}/users/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (userRes.data.success) {
                        userEmail = userRes.data.data.email || "";
                        userName = userRes.data.data.fullName || userRes.data.data.name || "";
                    }
                } catch (err) {
                    console.warn("Could not fetch user details, using fallback", err);
                }

                if (profileRes.data.success) {
                    const data = profileRes.data.data;
                    const farmer = data.farmerDetails;
                    const landHoldings = farmer.landHoldings || [];
                    setOriginalLandHoldings(landHoldings);
                    let landString = "";
                    if (landHoldings.length > 0) {
                        const totalArea = landHoldings.reduce((sum, l) => sum + (parseFloat(l.areaInAcres) || 0), 0);
                        landString = totalArea.toString();
                    }

                    setUser({
                        name: userName || farmer.bankDetails?.accountHolderName || "",
                        email: userEmail,
                        phone: farmer.phoneNumber || "",
                        land: landString,
                        state: farmer.address?.state || "",
                        district: farmer.address?.district || "",
                        locality: farmer.address?.village || farmer.address?.landmark || "",
                    });
                }
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchAllData();
    }, [token]);

    const handleSave = async () => {
        // Build updated landHoldings array
        let updatedLandHoldings = [...originalLandHoldings];
        const newArea = parseFloat(user.land);

        if (!isNaN(newArea) && newArea > 0) {
            if (updatedLandHoldings.length === 0) {
                // Create a default land holding if none exists
                updatedLandHoldings.push({
                    surveyNumber: "Main",
                    areaInAcres: newArea,
                    soilType: "",
                    irrigationType: "",
                    ownershipType: "owned"
                });
            } else {
                // Update the first land holding's area (or you can update all proportionally)
                updatedLandHoldings[0].areaInAcres = newArea;
            }
        } else if (user.land === "" && updatedLandHoldings.length > 0) {
            // If land field is cleared, you might want to keep existing – decide behaviour
            // Here we keep existing (do nothing)
        }

        const payload = {
            farmerDetails: {
                phoneNumber: user.phone,
                alternatePhone: "", // preserve existing if needed
                dateOfBirth: "",    // preserve existing if needed
                gender: "",         // preserve existing if needed
                address: {
                    village: user.locality,
                    district: user.district,
                    state: user.state,
                    pincode: "",    // preserve existing if needed
                    landmark: "",
                },
                landHoldings: updatedLandHoldings,
                bankDetails: {
                    accountNumber: "",   // preserve existing
                    ifscCode: "",
                    bankName: "",
                    accountHolderName: user.name,
                    upiId: "",
                },
            }
        };

        try {
            setLoading(true);
            const response = await axios.put(`${api}/agriculture/profile`, payload, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (response.data.success) {
                toast.success("Profile updated successfully!");
                setEditMode(false);
                // Refresh data
                const updatedData = response.data.data;
                const farmer = updatedData.farmerDetails;
                setOriginalLandHoldings(farmer.landHoldings || []);
                // Also update user state with new values
                setUser(prev => ({
                    ...prev,
                    phone: farmer.phoneNumber || prev.phone,
                    name: farmer.bankDetails?.accountHolderName || prev.name,
                    state: farmer.address?.state || prev.state,
                    district: farmer.address?.district || prev.district,
                    locality: farmer.address?.village || farmer.address?.landmark || prev.locality,
                    land: (farmer.landHoldings?.reduce((sum, l) => sum + (parseFloat(l.areaInAcres) || 0), 0) || "").toString()
                }));
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleStateChange = (e) => {
        setUser({ ...user, state: e.target.value, district: "", locality: "" });
    };

    const handleDistrictChange = (e) => {
        setUser({ ...user, district: e.target.value, locality: "" });
    };

    const states = State.getStatesOfCountry("IN");
    const districts = City.getCitiesOfState("IN", user.state);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-[#1e3a5f] text-xl">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">Farmer Profile</h1>
                <p className="text-gray-500">Manage your personal and farm details</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff8c42] to-[#ff6b22] flex items-center justify-center text-white text-xl font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[#1e3a5f]">{user.name || "Farmer"}</h2>
                        <p className="text-gray-500 text-sm">Registered Farmer</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* NAME */}
                    <div>
                        <label className="text-sm text-gray-500">Name</label>
                        <input
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border border-gray-200 rounded-md disabled:bg-gray-100 focus:outline-none focus:border-[#ff8c42]"
                        />
                    </div>

                    {/* EMAIL (read-only, fetched from DB) */}
                    <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <input
                            name="email"
                            value={user.email}
                            disabled={true}
                            className="w-full mt-1 p-2 border border-gray-200 rounded-md bg-gray-100"
                        />
                    </div>

                    {/* PHONE */}
                    <div>
                        <label className="text-sm text-gray-500">Phone</label>
                        <input
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border border-gray-200 rounded-md disabled:bg-gray-100 focus:outline-none focus:border-[#ff8c42]"
                        />
                    </div>

                    {/* LAND HOLDING (total acres) */}
                    <div>
                        <label className="text-sm text-gray-500">Total Land Holding (Acres)</label>
                        <input
                            name="land"
                            value={user.land}
                            onChange={handleChange}
                            disabled={!editMode}
                            placeholder="e.g., 5.5"
                            className="w-full mt-1 p-2 border border-gray-200 rounded-md disabled:bg-gray-100 focus:outline-none focus:border-[#ff8c42]"
                        />
                    </div>

                    {/* STATE */}
                    <div>
                        <label className="text-sm text-gray-500">State</label>
                        {editMode ? (
                            <select
                                value={user.state}
                                onChange={handleStateChange}
                                className="w-full mt-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#ff8c42]"
                            >
                                <option value="">Select State</option>
                                {states.map((s) => (
                                    <option key={s.isoCode} value={s.isoCode}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                value={states.find((s) => s.isoCode === user.state)?.name || user.state || ""}
                                disabled
                                className="w-full mt-1 p-2 border border-gray-200 rounded-md bg-gray-100"
                            />
                        )}
                    </div>

                    {/* DISTRICT */}
                    <div>
                        <label className="text-sm text-gray-500">District</label>
                        {editMode ? (
                            <select
                                value={user.district}
                                onChange={handleDistrictChange}
                                disabled={!user.state}
                                className="w-full mt-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#ff8c42] disabled:bg-gray-100"
                            >
                                <option value="">Select District</option>
                                {districts.map((d) => (
                                    <option key={d.name} value={d.name}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                value={user.district}
                                disabled
                                className="w-full mt-1 p-2 border border-gray-200 rounded-md bg-gray-100"
                            />
                        )}
                    </div>

                    {/* LOCALITY / VILLAGE */}
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-500">Village / Locality</label>
                        <input
                            name="locality"
                            value={user.locality}
                            onChange={handleChange}
                            disabled={!editMode}
                            placeholder={editMode ? "Enter village or locality name" : ""}
                            className="w-full mt-1 p-2 border border-gray-200 rounded-md disabled:bg-gray-100 focus:outline-none focus:border-[#ff8c42]"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    {!editMode ? (
                        <button
                            onClick={() => setEditMode(true)}
                            className="w-full bg-[#1e3a5f] text-white py-2 rounded-md hover:bg-[#162d48] active:scale-95 transition"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="w-1/2 bg-[#ff6b22] text-white py-2 rounded-md hover:bg-[#e85a1d] active:scale-95 transition"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 active:scale-95 transition"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;