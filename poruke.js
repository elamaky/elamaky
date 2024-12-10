let io;
let newImage = [];

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    io = serverIo;

    io.on('connection', (clientSocket) => {
        clientSocket.emit('initial-images', newImage);

        clientSocket.on('add-image', (imageSource, position, dimensions) => {
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

        clientSocket.on('update-image', (data) => {
            const image = newImage.find(img => img.imageUrl === data.imageUrl);
            if (image) {
                image.position = data.position;
                image.dimensions = data.dimensions;
            }
            io.emit('sync-image', data);
        });

        clientSocket.on('remove-image', (imageUrl) => {
            const index = newImage.findIndex(img => img.imageUrl === imageUrl);
            if (index !== -1) {
                newImage.splice(index, 1);
            }
            io.emit('update-images', newImage);
        });

        // Obrada chat poruka
        clientSocket.on('chatMessage', (msgData) => {
            const time = new Date().toLocaleTimeString();
            const messageToSend = {
                text: msgData.text,
                bold: msgData.bold,
                italic: msgData.italic,
                color: msgData.color,
                nickname: msgData.nickname || 'Guest', // Dodajte provere za guests
                time: time
            };
            io.emit('chatMessage', messageToSend);
        });

        // Brisanje chata
        clientSocket.on('clear-chat', () => {
            console.log(`Zahtev za brisanje chata primljen od ${clientSocket.id}`);
            io.emit('chat-cleared');
        });
    });
}

// Eksportovanje funkcija
module.exports = { setSocket };

