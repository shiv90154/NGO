import React, { useState } from "react";
import { State, City } from "country-state-city";

/* ================= INITIAL DATA ================= */
const initialData = {
    name: "Ramesh Kumar",
    email: "ramesh@gmail.com",
    phone: "9876543210",
    land: "5 Acres",
    state: "PB",
    district: "Mohali",
    locality: "Kharar",
};

const Profile = () => {
    const [user, setUser] = useState(initialData);
    const [editMode, setEditMode] = useState(false);

    /* ================= DATA ================= */
    const states = State.getStatesOfCountry("IN");
    const districts = City.getCitiesOfState("IN", user.state);

    /* ================= HANDLERS ================= */
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleStateChange = (e) => {
        setUser({
            ...user,
            state: e.target.value,
            district: "",
            locality: "",
        });
    };

    const handleDistrictChange = (e) => {
        setUser({
            ...user,
            district: e.target.value,
            locality: "",
        });
    };

    const handleSave = () => {
        console.log("Saved Data:", user);
        setEditMode(false);
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                    Farmer Profile
                </h1>
                <p className="text-gray-500">
                    Manage your personal and farm details
                </p>
            </div>

            {/* CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                {/* USER HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff8c42] to-[#ff6b22] flex items-center justify-center text-white text-xl font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-[#1e3a5f]">
                            {user.name}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Registered Farmer
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <div className="grid md:grid-cols-2 gap-4">

                    {/* NAME */}
                    <div>
                        <label className="text-sm text-gray-500">Name</label>
                        <input
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border border-gray-200 rounded-md disabled:bg-gray-100"
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <input
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border border-gray-200 rounded-md disabled:bg-gray-100"
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
                            className="w-full mt-1 p-2 border border-gray-200 rounded-md disabled:bg-gray-100"
                        />
                    </div>

                    {/* LAND */}
                    <div>
                        <label className="text-sm text-gray-500">Land Holding</label>
                        <input
                            name="land"
                            value={user.land}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border border-gray-200 rounded-md disabled:bg-gray-100"
                        />
                    </div>

                    {/* STATE */}
                    <div>
                        <label className="text-sm text-gray-500">State</label>
                        {editMode ? (
                            <select
                                value={user.state}
                                onChange={handleStateChange}
                                className="w-full mt-1 p-2 border border-gray-200 rounded-md"
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
                                value={
                                    states.find((s) => s.isoCode === user.state)?.name || ""
                                }
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
                                className="w-full mt-1 p-2 border border-gray-200 rounded-md"
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

                    {/* LOCALITY */}
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-500">Locality</label>
                        <input
                            name="locality"
                            value={user.locality}
                            onChange={handleChange}
                            disabled={!editMode}
                            placeholder={editMode ? "Enter locality name" : ""}
                            className="w-full mt-1 p-2 border border-gray-200 rounded-md disabled:bg-gray-100"
                        />
                    </div>

                </div>

                {/* BUTTONS */}
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