import React, { useState } from "react";

const Profile = () => {
    // Dummy user data (replace with API data later)
    const [user, setUser] = useState({
        name: "USER 1234",
        email: "abc@example.com",
        phone: "9876543210",
        role: "Student",
        joined: "2025-01-10",
    });

    const [editMode, setEditMode] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // later connect to backend API here
        console.log("Saved user:", user);
        setEditMode(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6">

                {/* Header */}
                <h2 className="text-2xl font-bold mb-6 text-center">
                    My Profile
                </h2>

                {/* Profile Fields */}
                <div className="space-y-4">

                    {/* Name */}
                    <div>
                        <label className="text-sm text-gray-600">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border rounded-md disabled:bg-gray-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border rounded-md disabled:bg-gray-100"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border rounded-md disabled:bg-gray-100"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="text-sm text-gray-600">Role</label>
                        <input
                            type="text"
                            value={user.role}
                            disabled
                            className="w-full mt-1 p-2 border rounded-md bg-gray-100"
                        />
                    </div>

                    {/* Joined */}
                    <div>
                        <label className="text-sm text-gray-600">Joined Date</label>
                        <input
                            type="text"
                            value={user.joined}
                            disabled
                            className="w-full mt-1 p-2 border rounded-md bg-gray-100"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                    {!editMode ? (
                        <button
                            onClick={() => setEditMode(true)}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="w-1/2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="w-1/2 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500"
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