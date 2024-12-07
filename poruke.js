let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
let currentImages = []; // Čuva samo trenutne slike

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    // Emitujemo inicijalne slike
    socket.emit('initial-images', currentImages); // Pošaljemo samo trenutno stanje
    console.log('Inicijalne slike poslata:', currentImages); // Logujemo trenutno stanje slika

    // Osluškujemo kad klijent doda novu sliku
    handleAddImage();

    // Osluškujemo promene slike (pomeranje, dimenzije)
    handleUpdateImage();

    clearChat(); // Pozivamo clearChat radi registrovanja događaja
}

// Funkcija za obradu dodavanja novih slika
function handleAddImage() {
    socket.on('add-image', (imageData) => {
        const { imageUrl, position, dimensions } = imageData; // Destrukturiranje podataka

        // Validacija podataka
        if (!imageUrl) {
            socket.emit('error', 'Invalid image URL');
            console.error('Greška: Nevalidan URL slike.');
            return;
        }

        if (!position || !dimensions) {
            console.error('Greška: Pozicija ili dimenzije slike nisu prosleđene.');
            return;
        }

        console.log('Slika sa URL-om:', imageUrl, 'pozicija:', position, 'dimenzije:', dimensions);

        // Dodajemo sliku u listu trenutnih slika sa pozicijom i dimenzijama
        currentImages.push({
            imageUrl: imageUrl,
            position: position,
            dimensions: dimensions
        });

        // Emitujemo sliku svim klijentima
        io.emit('display-image', {
            imageUrl: imageUrl,
            position: position,
            dimensions: dimensions
        });
        console.log('Slika emitovana svim klijentima:', imageUrl);
    });
}

// Funkcija za obradu promena slike (pomeranje, dimenzije)
function handleUpdateImage() {
    socket.on('update-image', (data) => {
        console.log('Primljen zahtev za update slike:', data);

        // Validacija podataka
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
            nickname: guests[socket.id], // Dodajte provere za guests
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
