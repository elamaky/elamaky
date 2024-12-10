// Poruke.js

// Funkcija za obradu slanja poruka u četu
function chatMessage(socket, io, guests) {
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
function clearChat(socket, io) {
    socket.on('clear-chat', () => {
        console.log(`Zahtev za brisanje chata primljen od ${socket.id}`);
        io.emit('chat-cleared');
    });
}

// Funkcija za slanje i upravljanje slikama
function handleImages(socket, io) {
    let newImage = [];

    // Emitovanje početnih slika
    socket.emit('initial-images', newImage);

    // Dodavanje nove slike
    socket.on('add-image', (imageSource, position, dimensions) => {
        if (!imageSource || !position || !dimensions) return;

        newImage.push({ imageUrl: imageSource, position, dimensions });
        io.emit('display-image', { imageUrl: imageSource, position, dimensions });
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
        if (index !== -1) newImage.splice(index, 1);
        io.emit('update-images', newImage);
    });
}

module.exports = { chatMessage, clearChat, handleImages };
