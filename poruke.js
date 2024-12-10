let io;
let newImage = [];

function setSocket(serverIo) {
    io = serverIo;

    io.on('connection', (clientSocket) => {
        console.log(`Korisnik povezan: ${clientSocket.id}`);

        // Inicijalne slike
        clientSocket.emit('initial-images', newImage);

        // Dodavanje slike
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

        // Ažuriranje slike
        clientSocket.on('update-image', (data) => {
            const image = newImage.find(img => img.imageUrl === data.imageUrl);
            if (image) {
                image.position = data.position;
                image.dimensions = data.dimensions;
            }
            io.emit('sync-image', data);
        });

        // Brisanje slike
        clientSocket.on('remove-image', (imageUrl) => {
            const index = newImage.findIndex(img => img.imageUrl === imageUrl);
            if (index !== -1) {
                newImage.splice(index, 1);
            }
            io.emit('update-images', newImage);
        });

        // Obrada poruka
        clientSocket.on('chatMessage', (msgData) => {
            const time = new Date().toLocaleTimeString();
            const messageToSend = {
                text: msgData.text,
                bold: msgData.bold,
                italic: msgData.italic,
                color: msgData.color,
                nickname: msgData.nickname || 'Guest',
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

module.exports = { setSocket };
