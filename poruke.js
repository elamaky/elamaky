let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
let images = []; // Lista za slike

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    // Dodavanje slike
    socket.on('addImage', (imageData) => {
        images.push(imageData); // Dodaje sliku
        io.emit('updateImages', images); // Šalje ažurirani spisak svim klijentima
    });

    // Uklanjanje slike
    socket.on('removeImage', (imageIndex) => {
        if (images[imageIndex]) {
            images.splice(imageIndex, 1); // Uklanja sliku
            io.emit('updateImages', images); // Šalje ažurirani spisak
        }
    });

    // Ažuriranje slike
    socket.on('updateImage', ({ index, updatedData }) => {
        if (images[index]) {
            images[index] = updatedData; // Ažuriraj podatke slike
            io.emit('updateImages', images); // Obavesti sve klijente
        }
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
            nickname: guests[socket.id] || 'Nepoznat korisnik', // Dodaje fallback za nickname
            time: time,
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
