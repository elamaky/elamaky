const moment = require('moment-timezone');
const lastMessages = {}; // Objekat za čuvanje poslednjih poruka

// Funkcija za obezbeđivanje da 'Radio Galaksija' bude na vrhu liste gostiju
function ensureRadioGalaksijaAtTop(guests) {
    const guestList = Object.values(guests);
    if (guestList.includes('Radio Galaksija')) {
        const index = guestList.indexOf('Radio Galaksija');
        guestList.splice(index, 1); // Ukloni ga iz trenutnog mesta
        guestList.unshift('Radio Galaksija'); // Dodaj ga na vrh
    }
    return guestList;
}

// Funkcija koja se poziva prilikom slanja poruka
function handleChatMessage(io, socket, msgData) {
    // Ignoriši ako je poruka identična
    if (lastMessages[socket.id] === msgData.text) return;
    lastMessages[socket.id] = msgData.text; // Sačuvaj novu poruku

    // Obrada #n komande
    if (msgData.text.includes('#n')) {
        const nickname = getNickname(socket.id); // Pretpostavljamo da funkcija getNickname postoji
        const message = `${nickname} CITA POZ ${nickname}`;
        io.emit('chatMessage', message);
    }

    // Emituj originalnu poruku
    io.emit('chatMessage', msgData.text);

    // Dupliranje poruke ako završava sa #
    if (msgData.text.endsWith('#')) {
        const duplicateMessage = msgData.text.slice(0, -1); // Ukloni #
        io.emit('chatMessage', duplicateMessage); // Emituj duplu poruku
    }

    // Ako korisnik pošalje #g
    if (msgData.text.trim() === '#g') {
        const berlinTime = moment().tz('Europe/Berlin').format('YYYY-MM-DD HH:mm:ss'); // Formatira vreme
        const timeMessage = `Vreme u Berlinu: ${berlinTime}`;
        io.emit('chatMessage', timeMessage); // Emituj vreme u berlinskoj zoni
    }
}

// Registracija događaja kada korisnik pošalje poruku
// Ovaj deo će biti pozvan iz server.js kada se koristi socket
// socket.on('chatMessage', (msgData) => {
//     handleChatMessage(io, socket, msgData);
// });

// Eksport funkcija koje želimo koristiti u serveru
module.exports = {
    ensureRadioGalaksijaAtTop,
    handleChatMessage
};
