// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', './templates');

// GenAI Setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const modelName = 'gemini-1.5-flash';

async function generateResponse(userQuery, conversationHistory, temperature = 0.8) {
  const model = genAI.getGenerativeModel({ model: modelName });

  const history = conversationHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  const chat = model.startChat({
    history: history, // Must begin with user role
    generationConfig: {
      temperature: temperature,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
    systemInstruction: {
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
  return result.response.text();
}


// Routes
app.get('/', (req, res) => {
  if (!req.session.history) req.session.history = [];
  res.render('chat', { history: req.session.history });
});

app.post('/', async (req, res) => {
  if (!req.session.history) {
    req.session.history = [];
  }

  const userInput = req.body.user_input?.trim();
  if (userInput) {
    req.session.history.push({ role: 'user', content: userInput });

    try {
      const reply = await generateResponse(userInput, req.session.history);
      req.session.history.push({ role: 'model', content: reply });
    } catch (err) {
      console.error("Error generating response:", err);
      req.session.history.push({ role: 'model', content: "Oops! Something went wrong." });
    }
  }

  res.redirect('/');
});


app.get('/reset', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
