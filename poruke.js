// Inicijalizacija 'socket' i 'io' objekata
let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket
let currentImages = []; // Čuva samo trenutne slike
const imageList = []; // Skladištenje URL-ova slika

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;

// Emitujemo sve slike svim korisnicima prilikom povezivanja
    socket.emit('initial-images', imageList);  // Pošaljite sve slike korisniku

    // Osluškujemo kad klijent doda novu sliku
    socket.on('add-image', (imageSource) => {
        console.log("Primljen URL slike:", imageSource);
        
        if (!imageSource) {
            console.error('Greška: Nevalidan URL slike');
            return;
        }

        // Dodajemo URL slike u listu
        imageList.push(imageSource);

        // Emitujemo sliku svim klijentima (ne samo onom koji je dodao)
        io.emit('display-image', imageSource); 
    });

    // Osluškujemo promene slike (pomeranje, dimenzije)
    socket.on('update-image', (data) => {
        if (!data || !data.imageUrl || !data.position || !data.dimensions) {
            console.error('Greška: Nedostaju podaci za promene slike.');
            return;
        }

        // Emitujemo ažurirane informacije svim klijentima
        io.emit('sync-image', data);
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

