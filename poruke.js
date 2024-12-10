
let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
const newImage = []; // Skladištenje URL-ova slika, pozicija i dimenzije

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    io.on('connection', (socket) => {
        // Emitujemo sve slike kada se novi klijent poveže
        socket.emit('initial-images', newImage); // Ovdje šaljemo postojeće slike

        // Osluškujemo kada klijent doda novu sliku
        socket.on('add-image', (imageSource, position, dimensions) => {
            if (!imageSource || !position || !dimensions) {
                return; // Izlazimo ako nedostaju podaci
            }

            // Dodajemo sliku u listu sa pozicijom i dimenzijama
            newImage.push({
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

        // Kada server primi 'update-image' događaj od klijenta
        socket.on('update-image', (data) => {
            const image = newImage.find(img => img.imageUrl === data.imageUrl);
            if (image) {
                image.position = data.position;
                image.dimensions = data.dimensions;
            }

            // Emitujemo promene svim ostalim klijentima
            io.emit('sync-image', data);
        });

        socket.on('remove-image', (imageUrl) => {
            newImage = newImage.filter(img => img.imageUrl !== imageUrl); // Uklanjamo sliku
            io.emit('update-images', newImage); // Emitujemo novu listu svima
        });

    }); // Zatvaranje 'io.on' bloka

    // Funkcija za obradu slanja poruka u chatu
    function chatMessage() {
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
            io.emit('chat-cleared'); // Emituj svim korisnicima da je chat obrisan
        });
    }
}

// Eksportovanje funkcija
module.exports = { setSocket, chatMessage, clearChat };


