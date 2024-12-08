const queryString = require('query-string'); // Importovanje query-string

let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
const imageList = []; // Skladištenje URL-ova slika
const currentImages = []; // Skladištenje URL-ova slika

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    // Emitujemo inicijalne slike
    socket.emit('initial-images', imageList); // Emitujemo inicijalne slike
    socket.emit('initial-images', currentImages); // Pošaljemo samo trenutno stanje
    console.log('Inicijalne slike poslata:', currentImages); // Logujemo trenutno stanje slika

    // Osluškujemo kad klijent doda novu sliku
    socket.on('add-image', (imageSource, position, dimensions) => {
        if (!imageSource) {
            socket.emit('error', 'Invalid image URL');
            console.error('Greška: Nevalidan URL slike.');
            return;
        }

        if (!position || !dimensions) {
            console.error('Greška: Pozicija ili dimenzije slike nisu prosleđene.');
            return;
        }

        console.log('Slika sa URL-om:', imageSource, 'pozicija:', position, 'dimenzije:', dimensions);

        // Formiramo URL sa parametrima za poziciju i dimenzije slike
        const params = {
            width: dimensions.width,
            height: dimensions.height,
            x: position.x,
            y: position.y
        };
        const formattedUrl = `${imageSource}?${queryString.stringify(params)}`;

        // Dodajemo sliku u listu trenutnih slika sa novim URL-om
        currentImages.push({
            imageUrl: formattedUrl,
            position: position,
            dimensions: dimensions
        });

        // Emitujemo sliku svim klijentima
        io.emit('display-image', {
            imageUrl: formattedUrl,
            position: position,
            dimensions: dimensions
        });
        console.log('Slika emitovana svim klijentima:', formattedUrl);
    });

    // Osluškujemo promene slike (pomeranje, dimenzije)
    socket.on('update-image', (data) => {
        console.log('Primljen zahtev za update slike:', data);

        if (!data || !data.imageUrl || !data.position || !data.dimensions) {
            socket.emit('error', 'Invalid update data');
            console.error('Greška: Nedostaju podaci za update slike.');
            return;
        }

        console.log('Slika ažurirana. URL:', data.imageUrl, 'pozicija:', data.position, 'dimenzije:', data.dimensions);

        // Emitovanje promjena svim klijentima
        io.emit('sync-image', data);
        console.log('Promene slike emitovane svim klijentima:', data);
    });

    clearChat(); // Pozivamo clearChat radi registrovanja događaja
    chatMessage(); // Pozivamo chatMessage radi registrovanja događaja
}

// Funkcija za obradu slanja poruka u četu
function chatMessage(guests) {
    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[socket.id],
            time: time
        };
        io.emit('chatMessage', messageToSend);
    });
}

// Funkcija za brisanje chata
function clearChat() {
    socket.on('clear-chat', () => {
        console.log(`Zahtev za brisanje chata primljen od ${socket.id}`);
        io.emit('chat-cleared'); // Emituj svim korisnicima da je chat obrisan
    });
}

// Eksportovanje funkcija
module.exports = { setSocket, chatMessage, clearChat };

