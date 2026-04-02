import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
    getNews,
    likeNews,
    shareNews,
    addNews
} from "../services/news.api";

import {
    Heart,
    MessageCircle,
    Share2,
    TrendingUp,
    Plus
} from "lucide-react";

/* =======================
   BLUR IMAGE COMPONENT
======================= */

const loadedImages = new Set();

const BlurImage = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(loadedImages.has(src));

    useEffect(() => {
        if (loaded) loadedImages.add(src);
    }, [loaded, src]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-200">
            {/* Skeleton */}
            {!loaded && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />
            )}

            {/* Image */}
            <img
                src={src}
                alt={alt || ""}
                loading="lazy"
                className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
};
const Dashboard = () => {
    const [news, setNews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        category: "Top Stories",
        content: "",
        description: "",
        media: null
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const data = await getNews();
        setNews(data);
    };

    const handlePublish = async () => {
        await addNews(form);
        setShowForm(false);
        fetchNews();
    };

    const categories = ["Top Stories", "Technology", "Health", "Sports"];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#1e3a5f]">
                    News Dashboard
                </h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-[#ff6b22] text-white px-4 py-2 rounded-lg hover:scale-105 transition"
                >
                    <Plus size={16} /> Publish
                </button>
            </div>

            {/* MODAL */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-[90%] max-w-lg">

                        <h2 className="text-xl font-semibold mb-3">
                            Publish News
                        </h2>

                        <input
                            placeholder="Title"
                            className="w-full border p-2 mb-2 rounded"
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />

                        <select
                            className="w-full border p-2 mb-2 rounded"
                            onChange={(e) =>
                                setForm({ ...form, category: e.target.value })
                            }
                        >
                            {categories.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>

                        <textarea
                            placeholder="Short Content"
                            className="w-full border p-2 mb-2 rounded"
                            onChange={(e) =>
                                setForm({ ...form, content: e.target.value })
                            }
                        />

                        <textarea
                            placeholder="Full Description"
                            className="w-full border p-2 mb-2 rounded"
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />

                        <input
                            type="file"
                            className="w-full border-2 border-dashed border-gray-300 p-2 rounded mb-3 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const url = URL.createObjectURL(file);

                                setForm({
                                    ...form,
                                    media: {
                                        type: file.type.startsWith("video")
                                            ? "video"
                                            : "image",
                                        url
                                    }
                                });
                            }}
                        />

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                            <button
                                onClick={handlePublish}
                                className="bg-[#1e3a5f] text-white px-4 py-1 rounded hover:scale-105 transition"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CATEGORY SECTIONS */}
            <div className="space-y-10">
                {categories.map((cat) => (
                    <section key={cat}>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={20} className="text-[#ff6b22]" />
                            <h2 className="text-xl font-semibold text-[#1e3a5f]">
                                {cat}
                            </h2>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {news
                                .filter((n) => n.category === cat)
                                .map((n) => (
                                    <div
                                        key={n.id}
                                        onClick={() => navigate(`/news/${n.id}`)}
                                        className="min-w-[280px] max-w-[280px] h-[340px] bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl hover:scale-[1.02] transition cursor-pointer"
                                    >
                                        {/* MEDIA */}
                                        {n.media && (
                                            <div className="h-[140px] w-full">
                                                {n.media.type === "image" ? (
                                                    <BlurImage
                                                        src={n.media.url}
                                                        alt={n.title}
                                                    />
                                                ) : (
                                                    <video
                                                        src={n.media.url}
                                                        className="w-full h-full object-cover"
                                                        muted
                                                        controls
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* CONTENT */}
                                        <div className="p-3 flex flex-col justify-between flex-1">
                                            <div>
                                                <h3 className="font-semibold text-[#1e3a5f] line-clamp-2">
                                                    {n.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {n.content}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center mt-3 text-gray-600 text-sm">

                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        await likeNews(n.id);
                                                        fetchNews();
                                                    }}
                                                    className="flex items-center gap-1 hover:text-red-500 transition"
                                                >
                                                    <Heart size={16} /> {n.likes}
                                                </button>

                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        await shareNews(n.id);
                                                        fetchNews();
                                                    }}
                                                    className="flex items-center gap-1 hover:text-blue-500 transition"
                                                >
                                                    <Share2 size={16} /> {n.shares}
                                                </button>

                                                <span className="flex items-center gap-1">
                                                    <MessageCircle size={16} /> {n.comments.length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">

                {/* FEED */}
                <div className="lg:col-span-2 bg-white p-4 rounded-2xl shadow-md h-[520px] overflow-y-auto">
                    <h2 className="text-lg font-semibold text-[#1e3a5f] mb-3">
                        Latest News
                    </h2>

                    <div className="space-y-4">
                        {news.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => navigate(`/news/${n.id}`)}
                                className="p-4 border rounded-xl hover:shadow-lg transition cursor-pointer"
                            >
                                {n.media && (
                                    <div className="mb-2 h-48">
                                        {n.media.type === "image" ? (
                                            <BlurImage
                                                src={n.media.url}
                                                alt={n.title}
                                            />
                                        ) : (
                                            <video
                                                src={n.media.url}
                                                controls
                                                className="w-full h-48 rounded"
                                            />
                                        )}
                                    </div>
                                )}

                                <h3 className="font-semibold text-[#1e3a5f]">
                                    {n.title}
                                </h3>

                                <p className="text-sm text-gray-600 mt-1">
                                    {n.content}
                                </p>

                                <div className="flex gap-4 mt-3 text-sm text-gray-600">
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            await likeNews(n.id);
                                            fetchNews();
                                        }}
                                        className="flex items-center gap-1 hover:text-red-500 transition"
                                    >
                                        <Heart size={16} /> {n.likes}
                                    </button>

                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            await shareNews(n.id);
                                            fetchNews();
                                        }}
                                        className="flex items-center gap-1 hover:text-blue-500 transition"
                                    >
                                        <Share2 size={16} /> {n.shares}
                                    </button>

                                    <span className="flex items-center gap-1">
                                        <MessageCircle size={16} /> {n.comments.length}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="bg-white p-4 rounded-2xl shadow-md h-[520px] overflow-y-auto">
                    <h2 className="text-lg font-semibold text-[#1e3a5f] mb-3">
                        Trending
                    </h2>

                    <div className="space-y-3">
                        {news
                            .slice()
                            .sort((a, b) => b.likes - a.likes)
                            .slice(0, 6)
                            .map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => navigate(`/news/${n.id}`)}
                                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition hover:scale-[1.02]"
                                >
                                    <p className="font-medium text-[#1e3a5f] line-clamp-2">
                                        {n.title}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        {n.likes} likes • {n.shares} shares
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;