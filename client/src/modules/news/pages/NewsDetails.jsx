import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNews } from "../services/news.api";
import {
    ArrowLeft,
    Heart,
    Share2,
    MessageCircle,
    Tag
} from "lucide-react";

const NewsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newsItem, setNewsItem] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await getNews();
            const item = data.find((n) => n.id === Number(id));
            setNewsItem(item);
        };
        fetch();
    }, [id]);

    if (!newsItem) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-4 text-[#1e3a5f] hover:underline"
            >
                <ArrowLeft size={18} /> Back
            </button>

            {/* FULL PAGE CARD */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* MEDIA */}
                {newsItem.media && (
                    <div className="w-full h-[350px]">
                        {newsItem.media.type === "image" ? (
                            <img
                                src={newsItem.media.url}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video
                                src={newsItem.media.url}
                                controls
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                )}

                {/* CONTENT */}
                <div className="p-6">

                    {/* TITLE */}
                    <h1 className="text-3xl font-bold text-[#1e3a5f] mb-3">
                        {newsItem.title}
                    </h1>

                    {/* CATEGORY */}
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                        <Tag size={16} />
                        <span>{newsItem.category}</span>
                    </div>

                    {/* SHORT CONTENT */}
                    <p className="text-gray-700 mb-4">
                        {newsItem.content}
                    </p>

                    {/* LONG DESCRIPTION */}
                    {newsItem.description && (
                        <p className="text-gray-800 leading-relaxed mb-4">
                            {newsItem.description}
                        </p>
                    )}

                    {/* STATS */}
                    <div className="mt-6 flex gap-6 text-sm text-gray-600">

                        <div className="flex items-center gap-1">
                            <Heart size={16} className="text-red-500" />
                            {newsItem.likes}
                        </div>

                        <div className="flex items-center gap-1">
                            <Share2 size={16} className="text-blue-500" />
                            {newsItem.shares}
                        </div>

                        <div className="flex items-center gap-1">
                            <MessageCircle size={16} className="text-gray-500" />
                            {newsItem.comments.length}
                        </div>

                    </div>

                    {/* COMMENTS */}
                    <div className="mt-6">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <MessageCircle size={18} />
                            Comments
                        </h3>

                        <div className="space-y-2">
                            {newsItem.comments.map((c, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-100 p-3 rounded-lg text-sm"
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NewsDetails;