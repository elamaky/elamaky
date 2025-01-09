const axios = require('axios');

const publicToken = '9327d0f7-2b66-460c-87cb-82b45055361c'; // Tvoj public token
const streamUrl = 'https://sapircast.caster.fm'; // Server hostname za strimovanje

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
    console.error('Error streaming to Caster.fm', error.response ? error.response.data : error.message);
  }
}

// Izvoz funkcije
module.exports = streamToCaster;
