let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
let currentImages = [];  // Čuva samo trenutne slike

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    // Emitujemo inicijalne slike prilikom povezivanja
    socket.emit('initial-images', currentImages);  // Pošaljemo samo trenutno stanje

    // Osluškujemo kada klijent doda novu sliku
    socket.on('add-image', (imageSource) => {
        if (!imageSource) {
            // Emitujemo grešku ako je URL slike nevalidan
            socket.emit('error', 'Invalid image URL');
            return;
        }

        console.log("Primljen URL slike:", imageSource);
        currentImages.push(imageSource); // Dodajemo URL slike u listu trenutnih slika
        io.emit('display-image', imageSource); // Emitujemo sliku svim klijentima
    });

    // Osluškujemo promene slike (pomeranje, dimenzije)
    socket.on('update-image', (data) => {
        if (!data) {
            socket.emit('error', 'Invalid update data');
            return;
        }

        io.emit('sync-image', data);  // Emitovanje promjena svim klijentima
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

