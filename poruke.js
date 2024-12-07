let io; // Inicijalizacija io
let socket; // Inicijalizacija socket
let images = []; // Lista svih slika

// Funkcija za postavljanje socket i io objekata
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    // Dodavanje nove slike
    socket.on('addImage', (imageData) => {
        images.push(imageData); // Dodaje sliku u listu
        io.emit('updateImages', images); // Ažurira sve klijente
    });

    // Brisanje slike
    socket.on('removeImage', (imageIndex) => {
        images.splice(imageIndex, 1); // Uklanja sliku iz liste
        io.emit('updateImages', images); // Ažurira sve klijente
    });

    // Ažuriranje slike (dimenzija ili pozicije)
    socket.on('updateImage', ({ index, updatedData }) => {
        if (images[index]) {
            images[index] = updatedData; // Ažurira podatke slike
            io.emit('updateImages', images); // Ažurira sve klijente
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
