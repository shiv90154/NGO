import { useState } from "react";
import { Heart, Share2, MessageCircle } from "lucide-react";

const NewsCard = ({ news, onLike, onShare, onComment }) => {
    const [comment, setComment] = useState("");

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">

            {/* MEDIA */}
            {news.media && (
                <div className="w-full h-[200px] bg-gray-100">
                    {news.media.type === "image" ? (
                        <img
                            src={news.media.url}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <video
                            src={news.media.url}
                            controls
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            )}

            {/* CONTENT */}
            <div className="p-4">
                <h2 className="text-lg font-semibold text-[#1e3a5f] line-clamp-2">
                    {news.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {news.content}
                </p>

                {/* ACTIONS */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                    <button
                        onClick={() => onLike(news.id)}
                        className="flex items-center gap-1 hover:text-red-500 transition"
                    >
                        <Heart size={16} /> {news.likes}
                    </button>

                    <button
                        onClick={() => onShare(news.id)}
                        className="flex items-center gap-1 hover:text-blue-500 transition"
                    >
                        <Share2 size={16} /> {news.shares}
                    </button>

                    <span className="flex items-center gap-1">
                        <MessageCircle size={16} /> {news.comments.length}
                    </span>
                </div>

                {/* COMMENT INPUT */}
                <div className="mt-4 flex gap-2">
                    <input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a6b9e]"
                    />
                    <button
                        onClick={() => {
                            if (!comment.trim()) return;
                            onComment(news.id, comment);
                            setComment("");
                        }}
                        className="bg-[#1e3a5f] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#2a6b9e]"
                    >
                        Post
                    </button>
                </div>

                {/* COMMENTS LIST */}
                <div className="mt-3 max-h-[100px] overflow-y-auto text-sm text-gray-600 space-y-1">
                    {news.comments.map((c, i) => (
                        <div key={i} className="flex gap-1">
                            <MessageCircle size={14} className="mt-[2px]" />
                            <span>{c}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsCard;