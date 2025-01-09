const axios = require('axios');

const publicToken = process.env.PUBLIC_TOKEN; 
const streamUrl = process.env.STREAM_URL;

async function streamToCaster() {
  try {
    const response = await axios.post('https://api.caster.fm/stream', JSON.stringify({
      token: publicToken,
      url: streamUrl,
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Stream successfully sent to Caster.fm', response.data);
  } catch (error) {
    console.error('Error streaming to Caster.fm', error);
  }
}

module.exports = streamToCaster;
