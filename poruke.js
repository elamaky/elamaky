let io;
let socket;
let newImage = [];  

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    io.on('connection', (socket) => {
        socket.emit('initial-images', newImage);
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
            newImage.splice(index, 1);
        }
        io.emit('update-images', newImage);
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
