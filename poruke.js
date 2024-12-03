let io; // Inicijalizujemo io
let socket; // Inicijalizujemo socket

// Funkcija za setovanje socket-a i io objekta
function setSocket(serverSocket, serverIo) {
    socket = serverSocket;
    io = serverIo;
    console.log(`Socket i IO objekti su inicijalizovani za korisnika ${socket.id}`);
}

// Funkcija za obradu slanja poruka u četu
function chatMessage(guests) {
    socket.on('chatMessage', (msgData) => {
        try {
            console.log(`Primljena poruka od ${socket.id}: ${JSON.stringify(msgData)}`);
            
            // Provera da li su podaci validni
            if (!msgData || typeof msgData.text === 'undefined') {
                console.error(`Nevažeća poruka primljena od ${socket.id}: ${JSON.stringify(msgData)}`);
                return;
            }
            
            const time = new Date().toLocaleTimeString();
            const messageToSend = {
                text: msgData.text || "",
                bold: !!msgData.bold,
                italic: !!msgData.italic,
                color: msgData.color || "#000000",
                nickname: guests[socket.id] || "Gost",
                time: time
            };
            
            console.log(`Poruka koja će biti emitovana: ${JSON.stringify(messageToSend)}`);
            io.emit('chatMessage', messageToSend); // Emitovanje poruke svim korisnicima
            console.log(`Poruka emitovana svim korisnicima: ${messageToSend.text}`);
        } catch (error) {
            console.error(`Greška prilikom obrade poruke od ${socket.id}:`, error);
        }
    });
}

// Funkcija za brisanje chata
function clearChat() {
    socket.on('clear-chat', () => {
        try {
            console.log(`Zahtev za brisanje chata primljen od ${socket.id}`);
            io.emit('chat-cleared'); // Emituj svim korisnicima da je chat obrisan
            console.log(`Emitovan događaj 'chat-cleared' svim korisnicima`);
        } catch (error) {
            console.error(`Greška prilikom emitovanja 'chat-cleared' događaja:`, error);
        }
    });
}

// Eksportovanje funkcija iz poruke.js
module.exports = { 
    setSocket, 
    chatMessage, 
    clearChat 
};


