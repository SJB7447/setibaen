import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRecommendations } from './RecommendationEngine';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const EMOTIONS = ['happy', 'sad', 'stressed', 'tired', 'excited'];

export const analyzeMood = async (text, history = [], language = 'en') => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Format history for the prompt
        const conversationContext = history.map(msg =>
            `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`
        ).join('\n');

        let systemInstruction = "";
        if (history.length === 0) {
            systemInstruction = "**CRITICAL INSTRUCTION**: This is the FIRST message of the conversation. You MUST ask a follow-up question to clarify the user's mood. DO NOT provide a recommendation yet. Output `needsMoreInfo: true`.";
        }

        const prompt = `
        You are an empathetic AI barista and therapist. Your goal is to understand the user's mood through conversation and eventually recommend a cafe that matches their vibe.

        Context:
        ${conversationContext}
        
        ${systemInstruction}

        User: "${text}"
        
        Available emotions for recommendation: ${EMOTIONS.join(', ')}.
        
        STRICT RULES:
        1. **FIRST TURN**: If the "Context" above is empty (this is the first message), you **MUST** ask a follow-up question. **DO NOT** provide a recommendation yet. This is a hard rule.
        2. **FOLLOW-UP**: If the user's input is short (e.g., "I'm tired"), ask *why* or *how* (e.g., "Physical or mental?").
        3. **RECOMMENDATION**: Only recommend when you have specific details (e.g., "Mental exhaustion from work").
        4. **JSON**: You must respond in valid JSON.

        JSON Structure:
        {
            "thought": "Reasoning...",
            "needsMoreInfo": boolean, // MUST be true if Context is empty.
            "response": "Message to user (in ${language === 'ko' ? 'Korean' : 'English'})",
            "emotion": "detected emotion (only if needsMoreInfo is false)"
        }
        
        Example 1 (First turn / Vague):
        {
            "thought": "First message. User said tired. Need to clarify.",
            "needsMoreInfo": true,
            "response": "I'm sorry. Is it physical tiredness or mental exhaustion?",
            "emotion": null
        }

        Example 2 (Specific / Second turn):
        {
            "thought": "User has mental exhaustion. Recommending quiet spot.",
            "needsMoreInfo": false,
            "response": "I see. A quiet place with tea would be perfect.",
            "emotion": "tired"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up JSON
        const jsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        let recommendation = null;
        let detectedEmotion = null;

        if (!data.needsMoreInfo && data.emotion) {
            detectedEmotion = data.emotion.toLowerCase();
            if (EMOTIONS.includes(detectedEmotion)) {
                const recommendations = getRecommendations(detectedEmotion, language);
                recommendation = recommendations.length > 0 ? recommendations[0] : null;
            }
        }

        return {
            text: data.response,
            emotion: detectedEmotion,
            recommendation: recommendation
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return fallbackAnalysis(text, language);
    }
};

const fallbackAnalysis = (text, language) => {
    const KEYWORDS = {
        happy: ['happy', 'good', 'great', 'awesome', 'excited', 'joy', '행복', '좋아', '신나', '기뻐'],
        sad: ['sad', 'down', 'blue', 'depressed', 'crying', 'melancholy', '슬퍼', '우울', '눈물', '힘드네'],
        stressed: ['stressed', 'anxious', 'busy', 'deadline', 'pressure', '스트레스', '바빠', '불안', '짜증'],
        tired: ['tired', 'exhausted', 'sleepy', 'drained', 'fatigue', '피곤', '지쳐', '졸려', '힘들어'],
        excited: ['pumped', 'energy', 'ready', 'let\'s go', '신나', '에너지', '가자']
    };

    const RESPONSES = {
        en: {
            default: "I'm having trouble connecting to my brain right now, but I'm listening.",
            happy: "That's wonderful! Keep that positive energy flowing.",
            sad: "I'm sorry to hear you're feeling down.",
            stressed: "Take a deep breath. It sounds like you need a break.",
            tired: "It's been a long day, hasn't it?",
            excited: "Love the enthusiasm!"
        },
        ko: {
            default: "지금은 연결이 조금 불안정하지만, 듣고 있어요.",
            happy: "정말 멋져요! 그 긍정적인 에너지를 계속 유지하세요.",
            sad: "기분이 안 좋으시다니 저도 마음이 아프네요.",
            stressed: "깊게 숨을 한번 들이마셔 보세요. 휴식이 필요해 보여요.",
            tired: "긴 하루였군요, 그렇죠?",
            excited: "그 열정 정말 좋아요!"
        }
    };

    const lowerText = text.toLowerCase();
    let detectedEmotion = null;

    for (const [emotion, keywords] of Object.entries(KEYWORDS)) {
        if (keywords.some(k => lowerText.includes(k))) {
            detectedEmotion = emotion;
            break;
        }
    }

    if (detectedEmotion) {
        const recommendations = getRecommendations(detectedEmotion, language);
        return {
            text: RESPONSES[language][detectedEmotion],
            emotion: detectedEmotion,
            recommendation: recommendations[0]
        };
    }

    return {
        text: RESPONSES[language].default,
        emotion: null,
        recommendation: null
    };
};
