import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function listModels() {
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

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        console.log("Fetching models from:", url.replace(apiKey, 'HIDDEN_KEY'));

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("Available Models:");
            if (data.models) {
                data.models.forEach(m => console.log(`- ${m.name}`));
            } else {
                console.log("No models found in response.");
            }
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listModels();
