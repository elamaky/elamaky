let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
const newImage = []; // Skladištenje URL-ova slika, pozicija i dimenzije

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    io.on('connection', (socket) => {
        socket.emit('initial-images', newImage); // Šaljemo postojeće slike
    });

    socket.on('add-image', (imageSource, position, dimensions) => {
        if (!imageSource || !position || !dimensions) return;

        newImage.push({
            imageUrl: imageSource,
            position: position,
            dimensions: dimensions
        });

        io.emit('display-image', {
            imageUrl: imageSource,
            position: position,
            dimensions: dimensions
        });
    });

    socket.on('update-image', (data) => {
        const image = newImage.find(img => img.imageUrl === data.imageUrl);
        if (image) {
            image.position = data.position;
            image.dimensions = data.dimensions;
        }
        io.emit('sync-image', data);
    });

   socket.on('remove-image', (imageUrl) => {
    const index = newImage.findIndex(img => img.imageUrl === imageUrl);
    if (index !== -1) {
        newImage.splice(index, 1); // Uklanjamo element sa specificiranim indeksom
    }
    io.emit('update-images', newImage); // Emitujemo ažuriranu listu
});


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
        io.emit('chat-cleared');
    });
}

// Eksportovanje funkcija
module.exports = { setSocket, chatMessage, clearChat };

