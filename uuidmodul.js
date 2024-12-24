const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Lista banovanih UUID-ova
const bannedUuids = [
  '681ed98a-77f8-48d5-b43c-8cc882cc82fb', 
  'uuid2', 
  'uuid3', 
  'uuid4', 
  'uuid5'
];

// Definisanje modela za goste
const guestSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true },
    nickname: { type: String, required: true },
    ipAddress: { type: String, required: true },
    timeIn: { type: Date, default: Date.now },
    timeOut: { type: Date, default: null }
});

const Guest = mongoose.model('Guest', guestSchema);

// POST ruta za čuvanje podataka gostiju
router.post('/', async (req, res) => {
    const { nickname, uuid } = req.body;

      // Provera da li je UUID banovan
    if (bannedUuids.includes(uuid)) {
        return res.status(403).json({ error: 'Korisnik je banovan' });
    }

    // Validacija podataka
    if (!nickname || !uuid) {
        return res.status(400).json({ error: 'Nedostaju podaci' });
    }

    // Dobijanje IP adrese
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress;

    console.log('IP adresa korisnika:', ipAddress);

    try {
        // Provera da li postoji gost sa istim UUID-om
        const existingGuest = await Guest.findOne({ uuid });

        if (existingGuest) {
            // Ako postoji, ažuriraj podatke
            existingGuest.nickname = nickname;
            existingGuest.ipAddress = ipAddress;
            existingGuest.timeIn = Date.now(); // Ažuriraj vreme kada je gost ponovo pristupio

            await existingGuest.save();
            console.log('Podaci uspešno ažurirani u MongoDB:', `UUID: ${uuid}, Nickname: ${nickname}, IP: ${ipAddress}`);
          res.status(200).json({ message: 'Podaci primljeni i sačuvani' });

        }

        // Ako ne postoji, sačuvaj novog gosta
        const guest = new Guest({ uuid, nickname, ipAddress });
        await guest.save();

        console.log('Podaci uspešno sačuvani u MongoDB:', `UUID: ${uuid}, Nickname: ${nickname}, IP: ${ipAddress}`);

       res.status(200).json({ message: 'Podaci primljeni i sačuvani' });

    } catch (err) {
        console.error('Greška pri čuvanju podataka:', err);
        res.status(500).json({ error: 'Greška pri čuvanju podataka' });
    }
});

// GET ruta za dobijanje podataka po UUID-u
router.get('/:uuid', async (req, res) => {
    const { uuid } = req.params;

    try {
        // Dohvatanje podataka iz MongoDB
        const guest = await Guest.findOne({ uuid });

        if (!guest) {
            return res.status(404).json({ error: 'Podaci za dati UUID nisu pronađeni' });
        }

        res.status(200).json(guest);
    } catch (err) {
        console.error('Greška pri dohvatanju podataka:', err);
        res.status(500).json({ error: 'Greška pri dohvatanju podataka' });
    }
});

module.exports = router;
