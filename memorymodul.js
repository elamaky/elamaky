const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Definisanje šeme za stranicu
const pageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
router.post('/save-page', async (req, res) => {
  const { username, name } = req.body;  // Koristi username ili UUID umesto userId

  try {
    console.log(`[INFO] Pokušaj spremanja stranice - username: ${username}, name: ${name}`);

    const newPage = new Page({ username, name });  // Koristi username
    await newPage.save();

    console.log(`[INFO] Stranica sačuvana - username: ${username}, name: ${name}`);
    res.status(200).json({ message: "Stranica je sačuvana!" });
  } catch (error) {
    console.error(`[ERROR] Greška pri čuvanju stranice - username: ${username}`, error);
    res.status(500).json({ message: "Greška pri čuvanju stranice.", error });
  }
});

// Ruta za učitavanje stranice
router.get('/load-page/:username/:name', async (req, res) => {
  const { username, name } = req.params;  // Koristi username umesto userId

  try {
    console.log(`[INFO] Pokušaj učitavanja stranice - username: ${username}, name: ${name}`);

    const page = await Page.findOne({ username, name });  // Traži po username
    if (page) {
      console.log(`[INFO] Stranica učitana - username: ${username}, name: ${name}`);
      res.status(200).json(page);  // Vraćamo podatke stranice
    } else {
      console.log(`[INFO] Stranica nije pronađena - username: ${username}, name: ${name}`);
      res.status(404).json({ message: "Stranica nije pronađena." });
    }
  } catch (error) {
    console.error(`[ERROR] Greška pri učitavanju stranice - username: ${username}`, error);
    res.status(500).json({ message: "Greška pri učitavanju stranice.", error });
  }
});

// Ruta za dobijanje svih sačuvanih stranica za korisnika
router.get('/saved-pages/:username', async (req, res) => {
  const { username } = req.params;  // Koristi username umesto userId

  try {
    console.log(`[INFO] Pokušaj dobijanja stranica za korisnika - username: ${username}`);

    const pages = await Page.find({ username });  // Traži stranice po username
    console.log(`[INFO] Stranice za korisnika učitane - username: ${username}`);
    res.status(200).json(pages);  // Vraćamo listu svih stranica
  } catch (error) {
    console.error(`[ERROR] Greška pri dobijanju stranica - username: ${username}`, error);
    res.status(500).json({ message: "Greška pri dobijanju stranica.", error });
  }
});

module.exports = router;  // Izvoz rute
