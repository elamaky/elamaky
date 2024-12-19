const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Definisanje šeme za stranicu
const pageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

const Page = mongoose.model('Page', pageSchema);

// Ruta za spremanje stranice
router.post('/api/savePage', async (req, res) => {
  const { userId, name } = req.body;
  // Tvoja logika za spremanje stranice
  res.send('Stranica je sačuvana');
});

  if (!userId || !name) {
    return res.status(400).json({ success: false, message: "UserId i name su obavezni." });
  }

  try {
    const newPage = new Page({ userId, name });
    await newPage.save();
    res.status(200).json({ success: true, message: "Stranica je sačuvana!" });
  } catch (error) {
    console.error('Greška pri čuvanju stranice:', error);
    res.status(500).json({ success: false, message: "Greška pri čuvanju stranice." });
  }
});

// Ruta za dobijanje stranica
router.get('/api/getPages', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: "UserId je obavezan." });
  }

  try {
    const pages = await Page.find({ userId });
    res.status(200).json({ success: true, pages });
  } catch (error) {
    console.error('Greška pri dobijanju stranica:', error);
    res.status(500).json({ success: false, message: "Greška pri dobijanju stranica." });
  }
});

module.exports.memoryRouter = router;
