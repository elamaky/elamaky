const axios = require('axios');

const privateToken = '9327d0f7-2b66-460c-87cb-82b45055361c';
const streamUrl = 'https://sapircast.caster.fm';

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
            console.log('Token je validan:', response.data);
            return true;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Nevažeći token');
        } else {
            console.error('Greška pri verifikaciji tokena:', error.message);
        }
        return false;
    }
}

// Funkcija za slanje strimovanih podataka
async function streamToCaster() {
    const isTokenValid = await verifyToken();
    if (!isTokenValid) {
        console.error('Nije moguće strimovati jer token nije validan.');
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

        console.log('Strim je uspešno poslat na Caster.fm', response.data);
    } catch (error) {
        console.error('Greška pri strimovanju na Caster.fm', error.response ? error.response.data : error.message);
    }
}

// Izvoz funkcija
module.exports = {
    verifyToken,
    streamToCaster
};

// Ako se fajl direktno pokreće
if (require.main === module) {
    streamToCaster().catch(error => {
        console.error('Greška pri pokretanju streama:', error);
    });
}
