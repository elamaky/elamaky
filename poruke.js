let io;
let socket;
let newImage = [];

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    io.on('connection', (socket) => {
        console.log(`Korisnik povezan: ${socket.id}`);

        // Slanje inicijalnih slika
        socket.emit('initial-images', newImage);

        // Dodavanje slike
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

        // Ažuriranje slike
        socket.on('update-image', (data) => {
            const image = newImage.find(img => img.imageUrl === data.imageUrl);
            if (image) {
                image.position = data.position;
                image.dimensions = data.dimensions;
            }
            io.emit('sync-image', data);
        });

        // Brisanje slike
        socket.on('remove-image', (imageUrl) => {
            const index = newImage.findIndex(img => img.imageUrl === imageUrl);
            if (index !== -1) {
                newImage.splice(index, 1);
            }
            io.emit('update-images', newImage);
        });

        // Obrada poruka u četu
        socket.on('chatMessage', (msgData) => {
            const time = new Date().toLocaleTimeString();
            const messageToSend = {
                text: msgData.text,
                bold: msgData.bold,
                italic: msgData.italic,
                color: msgData.color,
                nickname: msgData.nickname || 'Guest', // Provera za nickname
                time: time
            };
            io.emit('chatMessage', messageToSend);
        });

        // Brisanje chata
        socket.on('clear-chat', () => {
            console.log(`Zahtev za brisanje chata primljen od ${socket.id}`);
            io.emit('chat-cleared');
        });
    });
}

module.exports = { setSocket };
