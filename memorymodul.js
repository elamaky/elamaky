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

  try {
    console.log(`[INFO] Pokušaj spremanja stranice - userId: ${userId}, name: ${name}`);

    const newPage = new Page({ userId, name });  // Koristimo userId za povezivanje
    await newPage.save();

    console.log(`[INFO] Stranica sačuvana - userId: ${userId}, name: ${name}`);
    res.status(200).json({ success: true, message: "Stranica je sačuvana!" });
  } catch (error) {
    console.error(`[ERROR] Greška pri čuvanju stranice - userId: ${userId}`, error);
    res.status(500).json({ success: false, message: "Greška pri čuvanju stranice.", error });
  }
});

// Ruta za učitavanje stranice
router.get('/api/loadPage/:userId/:name', async (req, res) => {
  const { userId, name } = req.params;  // Tražimo po userId i name

  try {
    console.log(`[INFO] Pokušaj učitavanja stranice - userId: ${userId}, name: ${name}`);

    const page = await Page.findOne({ userId, name });  // Tražimo po userId i name
    if (page) {
      console.log(`[INFO] Stranica učitana - userId: ${userId}, name: ${name}`);
      res.status(200).json({ success: true, page });  // Vraćamo podatke stranice
    } else {
      console.log(`[INFO] Stranica nije pronađena - userId: ${userId}, name: ${name}`);
      res.status(404).json({ success: false, message: "Stranica nije pronađena." });
    }
  } catch (error) {
    console.error(`[ERROR] Greška pri učitavanju stranice - userId: ${userId}`, error);
    res.status(500).json({ success: false, message: "Greška pri učitavanju stranice.", error });
  }
});

// Ruta za dobijanje svih sačuvanih stranica za korisnika
router.get('/api/savedPages/:userId', async (req, res) => {
  const { userId } = req.params;  // Tražimo stranice za određenog korisnika na osnovu userId

  try {
    console.log(`[INFO] Pokušaj dobijanja stranica za korisnika - userId: ${userId}`);

    const pages = await Page.find({ userId });  // Tražimo stranice po userId
    console.log(`[INFO] Stranice za korisnika učitane - userId: ${userId}`);
    res.status(200).json({ success: true, pages });  // Vraćamo listu svih stranica
  } catch (error) {
    console.error(`[ERROR] Greška pri dobijanju stranica - userId: ${userId}`, error);
    res.status(500).json({ success: false, message: "Greška pri dobijanju stranica.", error });
  }
});

module.exports = router;


