let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
const currentImages = []; // Skladištenje URL-ova slika, pozicija i dimenzije

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    // Emitujemo inicijalne slike
    socket.emit('initial-images', currentImages);

    // Osluškujemo kada klijent doda novu sliku
    socket.on('add-image', (imageSource, position, dimensions) => {
        if (!imageSource || !position || !dimensions) {
            console.error('Greška: Nedostaju podaci slike');
            return;
        }

        console.log('Dodata slika:', imageSource, 'Pozicija:', position, 'Dimenzije:', dimensions);

        // Dodajemo sliku u listu sa pozicijom i dimenzijama
        currentImages.push({
            imageUrl: imageSource,
            position: position,
            dimensions: dimensions
        });

        // Emitujemo sliku svim klijentima
        io.emit('display-image', {
            imageUrl: imageSource,
            position: position,
            dimensions: dimensions
        });
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
module.exports = { setSocket, chatMessage, clearChat };

