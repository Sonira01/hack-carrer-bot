import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Support for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env file from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  const { userQuery, history } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        temperature: 0.8,
      },
      systemInstruction: {
        role: "system",
        parts: [{
          text: `
You are a friendly and knowledgeable career guidance assistant. Ask the user one thoughtful question at a time to understand their interests, strengths, and goals.
Keep your questions and responses short and clear. After each user reply, ask the next most relevant question.
Once you have enough information, suggest personalized career paths, skills to learn, and free or affordable resources.
          `
        }]
      }
    });

    const result = await chat.sendMessage(userQuery);
    const response = result.response.text();

    res.json({ response });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
