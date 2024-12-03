let io; // Inicijalizujemo io, koji ćemo koristiti u svim funkcijama
let socket; // Inicijalizujemo socket

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;
}

// Funkcija kada korisnik pošalje URL slike
function sendImage() {
    socket.on('send-image', (imageUrl) => {
        console.log(`Primljen URL slike od ${socket.id}: ${imageUrl}`);
        io.emit('receive-image', imageUrl); // Emitovanje slike svim korisnicima
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
module.exports = { setSocket, sendImage, chatMessage, clearChat };
