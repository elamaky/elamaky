// caster.js
const axios = require('axios');

const publicToken = '52fd78a9-8b7e-4b0c-aaf1-ab6502ccd171'; // Tvoj public token
const streamUrl = 'http://your-stream-url.com'; // URL tvoje strimovane muzike ili zvuka

// Funkcija za slanje strimovanih podataka na Caster.fm
async function streamToCaster() {
  try {
    const response = await axios.post('https://api.caster.fm/stream', {
      token: publicToken,
      url: streamUrl,
    });

    console.log('Stream successfully sent to Caster.fm', response.data);
  } catch (error) {
    console.error('Error streaming to Caster.fm', error);
     res.status(500).send('Error streaming to Caster.fm');
  }
}

// Izvoz funkcije
module.exports = streamToCaster;
