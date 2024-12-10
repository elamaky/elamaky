let io;
let newImage = [];  

// Funkcija za setovanje io objekta
function setSocket(serverIo) {
    io = serverIo;

    io.on('connection', (socket) => {
        socket.emit('initial-images', newImage);

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

        // Obrada slanja poruka u četu
        socket.on('chatMessage', (msgData) => {
            const time = new Date().toLocaleTimeString();
            const messageToSend = {
                text: msgData.text,
                bold: msgData.bold,
                italic: msgData.italic,
                color: msgData.color,
                nickname: guests[socket.id], // Korišćenje nadimka za slanje poruke
                time: time,
            };
            // Spremi IP, poruku i nickname u fajl
            saveIpData(socket.handshake.address, msgData.text, guests[socket.id]);

            io.emit('chatMessage', messageToSend);
        });

        // Funkcija za brisanje chata
        socket.on('clear-chat', () => {
            io.emit('chat-cleared');
        });
    });
}

// Izvoz funkcije setSocket
module.exports = { setSocket };
