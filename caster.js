const axios = require('axios');

const privateToken = '9327d0f7-2b66-460c-87cb-82b45055361c'; // Vaš privatni token
const streamUrl = 'https://sapircast.caster.fm'; // URL strima

// Funkcija za verifikaciju privatnog tokena
async function verifyToken() {
  try {
    const response = await axios.get(`https://hub.cloud.caster.fm/private/checkToken?token=${privateToken}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (response.status === 200) {
      console.log('Token is valid:', response.data);
      return true; // Token je validan
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Invalid token');
    } else {
      console.error('Error verifying token:', error.message);
    }
    return false; // Token nije validan
  }
}

// Funkcija za slanje strimovanih podataka
async function streamToCaster() {
  const isTokenValid = await verifyToken(); // Validiraj token pre slanja podataka
  if (!isTokenValid) {
    console.error('Cannot stream because the token is invalid.');
    return;
  }

  try {
    const response = await axios.post('https://hub.cloud.caster.fm/private/POST_ENDPOINT', {
      token: privateToken,
      url: streamUrl,
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Stream successfully sent to Caster.fm', response.data);
  } catch (error) {
    console.error('Error streaming to Caster.fm', error.response ? error.response.data : error.message);
  }
}

// Izvoz funkcija
module.exports = { verifyToken, streamToCaster };

// Pokretanje funkcije za slanje strimovanih podataka (opciono)
if (require.main === module) {
  streamToCaster();
}
