const axios = require('axios');

const publicToken = '52fd78a9-8b7e-4b0c-aaf1-ab6502ccd171'; // Tvoj public token
const streamUrl = 'https://elamaky-1.onrender.com/'; // Tvoja prava URL adresa za strimovanje

// Funkcija za slanje strimovanih podataka na Caster.fm
async function streamToCaster() {
  try {
    const response = await axios.post('https://api.caster.fm/stream', JSON.stringify({
      token: publicToken,
      url: streamUrl,
    }), {
      headers: {
        'Content-Type': 'application/json' // Dodajemo header za JSON
      }
    });

    console.log('Stream successfully sent to Caster.fm', response.data);
  } catch (error) {
    console.error('Error streaming to Caster.fm', error);
  }
}

// Izvoz funkcije
module.exports = streamToCaster;

