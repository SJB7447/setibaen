export const getRecommendations = (emotion, language = 'en') => {
    const cafes = [
        {
            id: 1,
            name: language === 'ko' ? "어니언 안국" : "Onion Anguk",
            type: language === 'ko' ? "한옥 베이커리 카페" : "Hanok Bakery Cafe",
            distance: "1.2km",
            image: "https://images.unsplash.com/photo-1596061320491-03080033c46d?auto=format&fit=crop&q=80&w=1000",
            description: language === 'ko' ? "전통적인 한옥에서 즐기는 현대적인 빵과 커피." : "Modern bread and coffee in a traditional Hanok.",
            emotions: ['relaxed', 'happy'],
            location: { lat: 37.5768, lng: 126.9856 },
            menu: [
                { name: language === 'ko' ? "팡도르" : "Pandoro", price: "₩5,000", desc: language === 'ko' ? "눈내린 듯한 달콤한 빵" : "Sweet snowy bread" },
                { name: language === 'ko' ? "앙버터" : "An-butter", price: "₩4,500", desc: language === 'ko' ? "버터와 팥의 조화" : "Butter and red bean" }
            ]
        },
        {
            id: 2,
            name: language === 'ko' ? "블루보틀 삼청" : "Blue Bottle Samcheong",
            type: language === 'ko' ? "스페셜티 커피" : "Specialty Coffee",
            distance: "2.5km",
            image: "https://images.unsplash.com/photo-1500630459720-3a74535496c1?auto=format&fit=crop&q=80&w=1000",
            description: language === 'ko' ? "북악산 뷰와 함께하는 프리미엄 커피 경험." : "Premium coffee experience with Bukak Mountain view.",
            emotions: ['tired', 'excited'],
            location: { lat: 37.5807, lng: 126.9806 },
            menu: [
                { name: language === 'ko' ? "뉴올리언스" : "New Orleans", price: "₩6,000", desc: language === 'ko' ? "치커리 풍미의 아이스 커피" : "Chicory iced coffee" },
                { name: language === 'ko' ? "싱글 오리진" : "Single Origin", price: "₩6,500", desc: language === 'ko' ? "핸드 드립" : "Hand drip" }
            ]
        },
        {
            id: 3,
            name: language === 'ko' ? "스타벅스 더북한산점" : "Starbucks The Bukhansan",
            type: language === 'ko' ? "뷰 맛집 카페" : "Scenic View Cafe",
            distance: "8.0km",
            image: "https://images.unsplash.com/photo-1600093463592-29d99c4d96a6?auto=format&fit=crop&q=80&w=1000",
            description: language === 'ko' ? "북한산의 웅장한 전경을 감상할 수 있는 곳." : "Enjoy the magnificent panoramic view of Bukhansan.",
            emotions: ['stressed', 'relaxed'],
            location: { lat: 37.6482, lng: 126.9479 },
            menu: [
                { name: language === 'ko' ? "사과 주스" : "Apple Juice", price: "₩5,000", desc: language === 'ko' ? "상큼한 과일 주스" : "Fresh juice" },
                { name: language === 'ko' ? "브런치 세트" : "Brunch Set", price: "₩12,000", desc: language === 'ko' ? "든든한 한 끼" : "Hearty meal" }
            ]
        },
        {
            id: 4,
            name: language === 'ko' ? "프릳츠 도화" : "Fritz Coffee Company",
            type: language === 'ko' ? "레트로 감성 카페" : "Retro Vibe Cafe",
            distance: "4.1km",
            image: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=1000",
            description: language === 'ko' ? "빈티지한 한국적 감성의 베이커리 카페." : "Vintage Korean aesthetic bakery cafe.",
            emotions: ['excited', 'happy', 'tired'],
            location: { lat: 37.5421, lng: 126.9537 },
            menu: [
                { name: language === 'ko' ? "크루아상" : "Croissant", price: "₩3,800", desc: language === 'ko' ? "버터 풍미 가득" : "Buttery flavor" },
                { name: language === 'ko' ? "콜드브루" : "Cold Brew", price: "₩5,000", desc: language === 'ko' ? "깔끔한 맛" : "Clean taste" }
            ]
        },
        {
            id: 5,
            name: language === 'ko' ? "앤트러사이트 합정" : "Anthracite Hapjeong",
            type: language === 'ko' ? "인더스트리얼 카페" : "Industrial Cafe",
            distance: "6.2km",
            image: "https://images.unsplash.com/photo-1493857676977-45535d04b46c?auto=format&fit=crop&q=80&w=1000",
            description: language === 'ko' ? "폐공장을 개조한 감각적인 공간." : "Sensational space renovated from an old factory.",
            emotions: ['sad', 'stressed'],
            location: { lat: 37.5487, lng: 126.9220 },
            menu: [
                { name: language === 'ko' ? "공기와 꿈" : "Air and Dreams", price: "₩6,000", desc: language === 'ko' ? "시그니처 블렌드" : "Signature blend" },
                { name: language === 'ko' ? "레몬 파운드" : "Lemon Pound", price: "₩4,500", desc: language === 'ko' ? "상큼한 디저트" : "Tangy dessert" }
            ]
        }
    ];

    return cafes.filter(cafe => cafe.emotions.includes(emotion));
};
