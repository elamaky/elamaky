let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
const imageList = []; // Skladištenje URL-ova slika

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;
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

 socket.emit('initial-images', imageList); // Emitujemo inicijalne slike

    // Osluškujemo kad klijent doda novu sliku
    socket.on('add-image', (imageSource) => {
        console.log("Primljen URL slike:", imageSource);
        imageList.push(imageSource); // Sačuvajte URL slike
        io.emit('display-image', imageSource); // Emitujte sliku svim klijentima
    });

    // Osluškujemo promene slike (pomeranje, dimenzije)
    socket.on('update-image', (data) => {
        io.emit('sync-image', data);  // Emitovanje promjena svim klijentima
    });

// Eksportovanje funkcija
module.exports = { setSocket, chatMessage, clearChat };
