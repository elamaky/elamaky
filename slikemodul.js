let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;
    console.log(`Socket i IO objekti su inicijalizovani za korisnika ${socket.id}`);
}

// Funkcija kada korisnik pošalje URL slike
function sendImage() {
    socket.on('send-image', (imageUrl) => {
        console.log(`Primljen URL slike od ${socket.id}: ${imageUrl}`);
        io.emit('receive-image', imageUrl); // Emitovanje slike svim korisnicima
        console.log(`Slika emitovana svim korisnicima: ${imageUrl}`);
    });
}

// Funkcija za obradu slanja poruka u četu
function chatMessage(guests) {
    socket.on('chatMessage', (msgData) => {
        console.log(`Primljena poruka od ${socket.id}: ${JSON.stringify(msgData)}`);
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[socket.id],
            time: time
        };
        console.log(`Poruka koja će biti emitovana: ${JSON.stringify(messageToSend)}`);
        io.emit('chatMessage', messageToSend); // Emitovanje poruke svim korisnicima
        console.log(`Poruka emitovana svim korisnicima: ${messageToSend.text}`);
    });
}

// Funkcija za brisanje chata
function clearChat() {
    socket.on('clear-chat', () => {
        console.log(`Zahtev za brisanje chata primljen od ${socket.id}`);
        io.emit('chat-cleared'); // Emituj svim korisnicima da je chat obrisan
        console.log(`Emitovan događaj 'chat-cleared' svim korisnicima`);
    });
}

// Eksportovanje funkcija
module.exports = { setSocket, sendImage, chatMessage, clearChat };
