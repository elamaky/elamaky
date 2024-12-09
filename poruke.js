let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
const newImage = []; // Skladištenje URL-ova slika, pozicija i dimenzije

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    // Emitujemo inicijalne slike
    console.log('Inicijalne slike:', newImage);
    socket.emit('initial-images', newImage);

    // Osluškujemo kada klijent doda novu sliku
    socket.on('add-image', (imageSource, position, dimensions) => {
        if (!imageSource || !position || !dimensions) {
            console.error('Greška: Nedostaju podaci slike');
            return;
        }

        console.log('Dodata slika:', imageSource, 'Pozicija:', position, 'Dimenzije:', dimensions);

        // Dodajemo sliku u listu sa pozicijom i dimenzijama
        newImage.push({
            imageUrl: imageSource,
            position: position,
            dimensions: dimensions
        });

        // Emitujemo sliku svim klijentima
        console.log('Emitovanje slike svim klijentima:', newImage);
        io.emit('display-image', {
            imageUrl: imageSource,
            position: position,
            dimensions: dimensions
        });
    });

   // Kada server primi 'update-image' događaj od klijenta
socket.on('update-image', (data) => {
    console.log('Primljeni podaci za update slike:', data);
    // Emituj promene svim ostalim klijentima
    socket.broadcast.emit('sync-image', data);
    console.log('Podaci emitovani drugim klijentima:', data); 
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
        console.log(`Zahtev za brisanje chata primljen od ${socket.id}`);
        io.emit('chat-cleared'); // Emituj svim korisnicima da je chat obrisan
    });
}

// Eksportovanje funkcija
module.exports = { setSocket, chatMessage, clearChat };

