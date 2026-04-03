import React, { useEffect, useState } from "react";

const MOCK_NOTES = [
    {
        _id: "1",
        title: "English Unit 1",
        description: "Fables and Folk Tales",
        fileUrl: "",
    },
    {
        _id: "2",
        title: "Hindi Lesson 2 ",
        description: "समास ",
        fileUrl: "",
    },
    {
        _id: "3",
        title: "Social Science Chapter 3",
        description: "Landforms and Life",
        fileUrl: "",
    },
];

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/notes`);

                if (!res.ok) throw new Error("Backend not ready");

                const data = await res.json();
                setNotes(data);
            } catch (error) {
                console.warn("Using mock data:", error.message);
                setNotes(MOCK_NOTES);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow border border-gray-200">

                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-center text-[#1e3a5f]">
                    Study Notes
                </h2>

                {/* Loading */}
                {loading ? (
                    <p className="text-center text-gray-500">Loading notes...</p>
                ) : (
                    <div className="space-y-3">
                        {notes.map((note) => (
                            <div
                                key={note._id}
                                className="flex justify-between items-center bg-gray-50 p-4 rounded-md border border-gray-200 hover:shadow-md transition"
                            >
                                <div>
                                    <p className="font-medium text-[#1e3a5f]">
                                        {note.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {note.description}
                                    </p>
                                </div>

                                <a
                                    href={note.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#ff8c42] hover:text-[#ff6b22] hover:underline transition"
                                >
                                    View / Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Notes;