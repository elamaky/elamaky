const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Definisanje šeme za stranicu
const pageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,  // Sada koristimo userId da bismo razlikovali korisnike
  },
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,  // Automatski dodaje 'createdAt' i 'updatedAt' polja
});

// Kreiranje modela za stranicu
const Page = mongoose.model('Page', pageSchema);

// Ruta za spremanje stranice
router.post('/api/savePage', async (req, res) => {
  const { userId, name } = req.body;  // Koristimo userId za povezivanje stranice sa korisnikom

  if (!userId || !name) {
    return res.status(400).json({ success: false, message: "UserId i name su obavezni." });
  }

  try {
    console.log(`[INFO] Pokušaj spremanja stranice - userId: ${userId}, name: ${name}`);

    const newPage = new Page({ userId, name });
    await newPage.save();

    console.log(`[INFO] Stranica sačuvana - userId: ${userId}, name: ${name}`);
    res.status(200).json({ success: true, message: "Stranica je sačuvana!" });
  } catch (error) {
    console.error(`[ERROR] Greška pri čuvanju stranice - userId: ${userId}`, error);
    res.status(500).json({ success: false, message: "Greška pri čuvanju stranice.", error });
  }
});

router.get('/api/getPages', async (req, res) => {
  const { userId } = req.query;

  console.log('Primljeni userId:', userId);  // Proverite da li je userId poslat u query

  if (!userId) {
    return res.status(400).json({ success: false, message: "UserId je obavezan." });
  }

  try {
    console.log(`[INFO] Pokušaj dobijanja stranica za korisnika - userId: ${userId}`);
    const pages = await Page.find({ userId });  // Tražimo stranice po userId
    console.log('Pronađene stranice:', pages);  // Logujte stranice koje su pronađene u bazi

    if (pages.length === 0) {
      console.log(`[INFO] Nema stranica za korisnika - userId: ${userId}`);
      res.status(404).json({ success: false, message: "Nema stranica za ovog korisnika." });
    } else {
      res.status(200).json({ success: true, pages });
    }
  } catch (error) {
    console.error(`[ERROR] Greška pri dobijanju stranica - userId: ${userId}`, error);
    res.status(500).json({ success: false, message: "Greška pri dobijanju stranica.", error });
  }
});
