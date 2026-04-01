import React, { useEffect, useState } from "react";

const MOCK_NOTES = [
    {
        _id: "1",
        title: "DBMS Unit 1",
        description: "Introduction to Database Management Systems",
        fileUrl: "",
    },
    {
        _id: "2",
        title: "Operating Systems",
        description: "Process management and scheduling",
        fileUrl: "",
    },
    {
        _id: "3",
        title: "Computer Networks",
        description: "OSI Model and TCP/IP basics",
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

                // If backend is not ready, this may fail
                if (!res.ok) throw new Error("Backend not ready");

                const data = await res.json();
                setNotes(data);
            } catch (error) {
                console.warn("Using mock data:", error.message);

                // fallback to mock data
                setNotes(MOCK_NOTES);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow">

                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-center">
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
                                className="flex justify-between items-center bg-gray-50 p-4 rounded-md border"
                            >
                                <div>
                                    <p className="font-medium">{note.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {note.description}
                                    </p>
                                </div>

                                <a
                                    href={note.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:underline"
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