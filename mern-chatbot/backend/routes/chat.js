const express = require('express');
const router = express.Router();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;

router.post('/', async (req, res) => {
  const { user_input, history } = req.body;
  const MAX_HISTORY = 5;
  const messages = [];
  (history || []).slice(-MAX_HISTORY).forEach(([user, bot]) => {
    messages.push({ role: 'user', parts: [{ text: user }] });
    messages.push({ role: 'model', parts: [{ text: bot }] });
  });
  messages.push({ role: 'user', parts: [{ text: user_input }] });

  try {
    const response = await axios.post(GEMINI_URL, { contents: messages });
    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.json({ reply });
  } catch (err) {
    res.json({ reply: "API Error: " + (err.response?.data?.error?.message || err.message) });
  }
});

module.exports = router; 