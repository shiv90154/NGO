
let newsData = [
    // ================= TOP STORIES =================

    {
        id: 1,
        title: "Global economy shows recovery",
        content: `
Markets are stabilizing after recent fluctuations.

Global financial systems have started showing signs of recovery after months of instability caused by inflation, interest rate changes, and global geopolitical tensions. Stock markets across major economies have shown gradual upward movement, indicating renewed investor confidence.

Economists suggest that while the recovery is positive, it remains fragile and dependent on global policy coordination, energy prices, and supply chain stability.
    `,
        category: "Top Stories",
        likes: 180,
        shares: 60,
        comments: ["Good news", "Hope it continues"],
        media: {
            type: "image",
            url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44"
        }
    },

    {
        id: 2,
        title: "Political summit held successfully",
        content: `
Leaders discussed global cooperation strategies.

A major international summit concluded successfully with participation from multiple world leaders. Discussions focused on climate change, trade agreements, and global security challenges.

Several agreements were signed to strengthen international cooperation and support sustainable development goals.
    `,
        category: "Top Stories",
        likes: 140,
        shares: 40,
        comments: ["Important event"],
        media: {
            type: "image",
            url: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe"
        }
    },

    {
        id: 3,
        title: "Climate change awareness rising",
        content: `
More countries committing to green initiatives.

Climate change awareness has increased globally, with governments investing heavily in renewable energy sources like solar and wind power.

Environmental organizations emphasize the urgency of reducing carbon emissions to prevent long-term ecological damage.
    `,
        category: "Top Stories",
        likes: 200,
        shares: 75,
        comments: ["Needed change"],
        media: {
            type: "video",
            url: "https://www.w3schools.com/html/mov_bbb.mp4"
        }
    },

    {
        id: 20,
        title: "Hyderabad mother kills two sons, dies by suicide over husband's second marriage",
        content: `
A 29-year-old woman and her two sons were found dead in their Hyderabad home, suspected to be a suicide linked to ongoing family disputes.

According to initial reports, the woman was allegedly distressed due to her husband's second marriage and long-standing domestic issues. Authorities have begun an investigation to understand the circumstances leading to the tragic incident.

Police officials stated that further forensic analysis and witness statements are being collected. The case has raised serious concerns about mental health awareness and domestic support systems in urban areas.
    `,
        category: "Top Stories",
        likes: 140,
        shares: 40,
        comments: ["My God !"],
        media: {
            type: "image",
            url: "https://th.bing.com/th?id=ONUT._ByrPTBd9VcxoETVV5tQJw&pid=News&w=367&h=200&c=14&rs=2&qlt=90&dpr=1.5"
        }
    },

    // ================= TECHNOLOGY =================

    {
        id: 4,
        title: "AI transforming industries",
        content: `
Automation is redefining productivity.

Artificial Intelligence is rapidly changing industries such as healthcare, finance, education, and manufacturing. Businesses are adopting AI-driven tools to improve efficiency, reduce costs, and enhance decision-making.

In healthcare, AI assists in early disease detection and medical imaging analysis. In finance, it helps in fraud detection and risk assessment. Despite its benefits, concerns about job displacement and ethical use remain significant.
    `,
        category: "Technology",
        likes: 220,
        shares: 90,
        comments: ["Future is now"],
        media: {
            type: "image",
            url: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
        }
    },

    {
        id: 5,
        title: "New smartphone launched",
        content: `
Features include AI camera and better battery.

The latest smartphone launch introduces advanced features such as AI-powered photography, enhanced battery performance, and a high-refresh display for smoother user experience.

The device also includes improved security features and optimized hardware for gaming and multitasking.
    `,
        category: "Technology",
        likes: 170,
        shares: 50,
        comments: ["Looks cool"],
        media: {
            type: "image",
            url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
        }
    },

    {
        id: 6,
        title: "Breakthrough in quantum computing",
        content: `
Scientists achieve new milestone.

Researchers have made significant progress in quantum computing, achieving faster processing speeds and improved qubit stability.

This breakthrough could revolutionize fields like cryptography, drug discovery, and complex system simulations in the coming years.
    `,
        category: "Technology",
        likes: 260,
        shares: 110,
        comments: ["Impressive"],
        media: {
            type: "video",
            url: "https://www.w3schools.com/html/movie.mp4"
        }
    },

    {
        id: 21,
        title: "Xiaomi Mi Notebook Air 4G",
        content: `
Nutrition awareness increasing worldwide.

The Xiaomi Mi Notebook Air 4G is gaining attention for its portability and performance features. It is designed for users who need lightweight laptops with strong connectivity options.

It offers good battery life, compact design, and reliable performance for daily productivity tasks.
    `,
        category: "Technology",
        likes: 90,
        shares: 20,
        comments: ["Helpful info"],
        media: {
            type: "image",
            url: "https://images.gizbot.com/webp/img/2017/04/xiaomiminotebookair4gjio4glaptopwill4glaptopsbecomethenewtrend-06-1491483756.jpg"
        }
    },

    // ================= HEALTH =================

    {
        id: 7,
        title: "Yoga gaining popularity",
        content: `
People adopting healthier lifestyles.

Yoga has become increasingly popular worldwide as people focus on mental and physical well-being. It helps improve flexibility, reduce stress, and enhance overall lifestyle balance.

Fitness centers and online platforms are now offering structured yoga programs for all age groups.
    `,
        category: "Health",
        likes: 130,
        shares: 30,
        comments: ["Very good"],
        media: {
            type: "image",
            url: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3"
        }
    },

    {
        id: 8,
        title: "New diet trends emerging",
        content: `
Nutrition awareness increasing worldwide.

Modern diet trends are focusing more on balanced nutrition, plant-based foods, and sustainable eating habits.

Experts recommend avoiding extreme diets and instead adopting long-term healthy eating patterns for better results.
    `,
        category: "Health",
        likes: 90,
        shares: 20,
        comments: ["Helpful info"],
        media: {
            type: "image",
            url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061"
        }
    },

    {
        id: 9,
        title: "Mental health awareness campaigns",
        content: `
Focus on emotional well-being rising.

Mental health awareness campaigns are being launched globally to reduce stigma and encourage people to seek help when needed.

Governments and NGOs are working to improve access to mental health services and support systems.
    `,
        category: "Health",
        likes: 150,
        shares: 60,
        comments: ["Important topic"],
        media: {
            type: "video",
            url: "https://www.w3schools.com/html/mov_bbb.mp4"
        }
    },

    // ================= SPORTS =================

    {
        id: 10,
        title: "Cricket finals draw near",
        content: `
Top teams preparing for the big match.

The cricket finals are approaching, and teams are undergoing intense training sessions to prepare for the high-stakes match.

Fans worldwide are eagerly waiting as expectations are high for a competitive and thrilling final.
    `,
        category: "Sports",
        likes: 300,
        shares: 120,
        comments: ["Excited!"],
        media: {
            type: "image",
            url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e"
        }
    },

    {
        id: 11,
        title: "Football league heats up",
        content: `
Clubs competing for top position.

The football league is entering a crucial stage as teams compete for the top position in the standings.

Every match is becoming more important as the season approaches its final phase.
    `,
        category: "Sports",
        likes: 210,
        shares: 80,
        comments: ["Great match"],
        media: {
            type: "image",
            url: "https://ichef.bbci.co.uk/news/624/mcs/media/images/77874000/jpg/_77874553_77874552.jpg"
        }
    },

    {
        id: 12,
        title: "Olympics preparation underway",
        content: `
Athletes training rigorously.

Athletes from around the world are preparing for the upcoming Olympics with intense training schedules.

Coaches are focusing on performance optimization, endurance, and mental strength.
    `,
        category: "Sports",
        likes: 190,
        shares: 70,
        comments: ["All the best"],
        media: {
            type: "video",
            url: "https://www.w3schools.com/html/movie.mp4"
        }
    }
];

// ================= API FUNCTIONS =================

export const getNews = () =>
    new Promise((res) => setTimeout(() => res([...newsData]), 500));

export const addNews = (news) =>
    new Promise((res) => {
        const newItem = {
            id: Date.now(),
            likes: 0,
            shares: 0,
            comments: [],
            category: "Top Stories",
            media: null,
            ...news
        };
        newsData.unshift(newItem);
        res(newItem);
    });

export const likeNews = (id) =>
    new Promise((res) => {
        newsData = newsData.map((n) =>
            n.id === id ? { ...n, likes: n.likes + 1 } : n
        );
        res();
    });

export const shareNews = (id) =>
    new Promise((res) => {
        newsData = newsData.map((n) =>
            n.id === id ? { ...n, shares: n.shares + 1 } : n
        );
        res();
    });

export const addComment = (id, comment) =>
    new Promise((res) => {
        newsData = newsData.map((n) =>
            n.id === id
                ? { ...n, comments: [...n.comments, comment] }
                : n
        );
        res();
    });