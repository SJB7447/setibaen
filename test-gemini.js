import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testConnection() {
    try {
        const envPath = path.join(__dirname, '.env');
        if (!fs.existsSync(envPath)) {
            console.error(".env file not found");
            return;
        }
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

        if (!match || !match[1]) {
            console.error("VITE_GEMINI_API_KEY not found in .env");
            return;
        }

        const apiKey = match[1].trim();
        console.log("Testing with key ending in:", apiKey.slice(-4));

        const genAI = new GoogleGenerativeAI(apiKey);

        try {
            console.log("Testing model: gemini-flash-latest");
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
            const result = await model.generateContent("Hello");
            console.log("Response from gemini-flash-latest:", result.response.text());
            console.log("SUCCESS: gemini-flash-latest is working!");
        } catch (e) {
            console.error("gemini-flash-latest failed:", e.message);
        }

    } catch (error) {
        console.error("General Error:", error);
    }
}

testConnection();
