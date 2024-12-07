let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
let currentImages = []; // Čuva samo trenutne slike
const imageList = []; // Skladištenje URL-ova slika

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

    // Emitujemo inicijalne slike prilikom povezivanja
    socket.emit('initial-images', imageList); 
    console.log('Inicijalne slike poslate:', imageList);

    // Osluškujemo kad klijent doda novu sliku
    socket.on('add-image', (imageSource, position, dimensions) => {
        if (!imageSource || !position || !dimensions) {
            socket.emit('error', 'Invalid image data');
            console.error('Greška: Nevalidni podaci za sliku.');
            return;
        }

        console.log('Primljen URL slike:', imageSource);

        // Dodajemo sliku u liste
        imageList.push(imageSource);
        currentImages.push({ imageUrl: imageSource, position, dimensions });

        // Emitujemo sliku svim klijentima
        io.emit('display-image', { imageUrl: imageSource, position, dimensions });
        console.log('Slika emitovana svim klijentima:', imageSource);
    });

    // Osluškujemo promene slike (pomeranje, dimenzije)
    socket.on('update-image', (data) => {
        if (!data || !data.imageUrl || !data.position || !data.dimensions) {
            socket.emit('error', 'Invalid update data');
            console.error('Greška: Nedostaju podaci za update slike.');
            return;
        }

        console.log('Primljen zahtev za update slike:', data);

        // Emitovanje promjena svim klijentima
        io.emit('sync-image', data);
        console.log('Promene slike emitovane svim klijentima:', data);
    });

    // Osluškujemo zahtev za brisanje chata
    socket.on('clear-chat', () => {
        console.log(`Zahtev za brisanje chata primljen od ${socket.id}`);
        io.emit('chat-cleared'); // Emituj svim korisnicima da je chat obrisan
    });

    // Osluškujemo poruke u četu
    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const nickname = guests?.[socket.id] || 'Nepoznati korisnik';

        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: nickname,
            time: time,
        };

        io.emit('chatMessage', messageToSend);
    });
}

// Eksportovanje funkcija
module.exports = { setSocket };

