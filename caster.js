const axios = require('axios');

const publicToken = process.env.PUBLIC_TOKEN; // Koristimo varijablu okruženja za token
const streamUrl = process.env.STREAM_URL; // Koristimo varijablu okruženja za URL

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
