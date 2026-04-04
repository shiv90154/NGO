import React, { useEffect, useState } from "react";

const Profile = () => {
    const studentId = localStorage.getItem("studentId");
    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Student",
        joined: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/students/profile/${studentId}`);
                const data = await res.json();
                if (data.success) {
                    setUser(data.data);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        fetchProfile();
    }, [studentId]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/students/profile/${studentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const data = await res.json();
            if (data.success) {
                setEditMode(false);
                console.log("Profile updated successfully");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                {/* Header */}
                <h2 className="text-2xl font-bold mb-6 text-center text-[#1e3a5f]">
                    My Profile
                </h2>

                {/* Profile Fields */}
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="text-sm text-gray-500">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ff8c42]"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ff8c42]"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-sm text-gray-500">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            disabled={!editMode}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ff8c42]"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="text-sm text-gray-500">Role</label>
                        <input
                            type="text"
                            value={user.role}
                            disabled
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                    </div>

                    {/* Joined */}
                    <div>
                        <label className="text-sm text-gray-500">Joined Date</label>
                        <input
                            type="text"
                            value={new Date(user.joined).toLocaleDateString()}
                            disabled
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                    </div>
                </div>

                {/* Buttons */}
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
                                className="w-1/2 bg-[#ff6b22] text-white py-2 rounded-md hover:bg-[#e65a1c] active:scale-95 transition"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="w-1/2 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 active:scale-95 transition"
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