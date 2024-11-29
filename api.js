require('dotenv').config();  // Učitaj sve promenljive iz .env fajla

const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Učitaj ključ iz .env fajla
});
