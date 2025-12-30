import { storage } from './StorageUtils';

export const seedTestReviews = () => {
    const REVIEWS_KEY = 'moodbrew_reviews';
    const existingReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');

    if (existingReviews.length > 0) {
        return; // Data already exists, do not overwrite
    }

    const testReviews = [
        // Cafe 1: Serenity Brew (Quiet & Cozy)
        {
            id: 101,
            userId: 'test_user_1',
            userName: 'Alice Kim',
            cafeId: 1,
            rating: 5,
            comment: "정말 조용하고 집중하기 좋은 곳이에요. 캐모마일 티가 맛있습니다.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
        },
        {
            id: 102,
            userId: 'test_user_2',
            userName: 'John Doe',
            cafeId: 1,
            rating: 4,
            comment: "Peaceful atmosphere. A bit pricey but worth it.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
        },

        // Cafe 2: Neon Pulse Espresso (Modern & Energetic)
        {
            id: 201,
            userId: 'test_user_3',
            userName: 'Mike Lee',
            cafeId: 2,
            rating: 5,
            comment: "에너지가 넘치는 곳! 니트로 콜드 브루 강추합니다.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
        },
        {
            id: 202,
            userId: 'test_user_1',
            userName: 'Alice Kim',
            cafeId: 2,
            rating: 3,
            comment: "Too loud for me, but good coffee.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() // 1 day ago
        },

        // Cafe 3: The Comfort Corner (Warm & Homely)
        {
            id: 301,
            userId: 'test_user_4',
            userName: 'Sarah Park',
            cafeId: 3,
            rating: 5,
            comment: "핫초코가 진짜 진하고 맛있어요. 겨울에 딱입니다.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
        },

        // Cafe 4: Focus Lab (Minimalist & Bright)
        {
            id: 401,
            userId: 'test_user_2',
            userName: 'John Doe',
            cafeId: 4,
            rating: 4,
            comment: "Great for working. Fast wifi and good outlets.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() // 10 days ago
        },
        {
            id: 402,
            userId: 'test_user_5',
            userName: 'David Choi',
            cafeId: 4,
            rating: 5,
            comment: "깔끔하고 모던한 인테리어가 마음에 듭니다.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
        },

        // Cafe 5: Sunshine Roastery (Bright & Airy)
        {
            id: 501,
            userId: 'test_user_3',
            userName: 'Mike Lee',
            cafeId: 5,
            rating: 5,
            comment: "채광이 너무 좋아서 기분이 좋아지는 카페에요.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() // 1 day ago
        }
    ];

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(testReviews));
    console.log('Test reviews seeded successfully!');
};
