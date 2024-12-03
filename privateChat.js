const privateChats = {}; // Čuva privatne chatove (socket.id => [socket.id])

// Kada korisnik pošalje URL slike
function sendImage(socket, io) {
    socket.on('send-image', (imageUrl) => {
        console.log(`Primljen URL slike od ${socket.id}: ${imageUrl}`);
        io.emit('receive-image', imageUrl); // Emitovanje slike svim korisnicima
    });
}

// Obrada slanja poruka u četu
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
// Kada korisnik pošalje zahtev za brisanje chata
function clearChat(socket, io) {
    socket.on('clear-chat', () => {
        console.log(`Zahtev za brisanje chata primljen od ${socket.id}`);
        io.emit('chat-cleared'); // Emituj svim korisnicima da je chat obrisan
    });
}

// Funkcija za pokretanje privatnog chata
function startPrivateChat(socket) {
    socket.on('start-private-chat', (receiverId) => {
        console.log(`Zahtev za privatni chat od ${socket.id} ka ${receiverId}`);
        privateChats[socket.id] = privateChats[socket.id] || [];
        privateChats[socket.id].push(receiverId);

        privateChats[receiverId] = privateChats[receiverId] || [];
        privateChats[receiverId].push(socket.id);

        console.log(`Privatni chat započet između ${socket.id} i ${receiverId}`);
        socket.emit('private_chat_started', receiverId);
        socket.to(receiverId).emit('private_chat_started', socket.id);
    });
}

// Funkcija za završavanje privatnog chata
function endPrivateChat(socket) {
    socket.on('end-private-chat', (receiverId) => {
        console.log(`Zahtev za završavanje privatnog chata između ${socket.id} i ${receiverId}`);
        privateChats[socket.id] = privateChats[socket.id].filter(id => id !== receiverId);
        privateChats[receiverId] = privateChats[receiverId].filter(id => id !== socket.id);

        console.log(`Privatni chat završio između ${socket.id} i ${receiverId}`);
        socket.emit('private_chat_ended', receiverId);
        socket.to(receiverId).emit('private_chat_ended', socket.id);
    });
}

// Funkcija za slanje privatne poruke
function sendPrivateMessage(socket) {
    socket.on('send-private-message', (data) => {
        const { receiverId, message } = data;
        console.log(`Primljena privatna poruka od ${socket.id} za ${receiverId}: ${message}`);

        if (privateChats[socket.id] && privateChats[socket.id].includes(receiverId)) {
            const time = new Date().toLocaleTimeString();
            const messageToSend = {
                text: message,
                nickname: socket.nickname || 'Nepoznato',
                time: time,
                private: true,
            };

            console.log(`Slanje privatne poruke od ${socket.id} ka ${receiverId}`);
            socket.to(receiverId).emit('private_message', messageToSend);
            socket.emit('private_message', messageToSend);
        } else {
            console.log(`Greška: ${socket.id} nije u privatnom razgovoru sa ${receiverId}`);
            socket.emit('error', 'Niste u privatnom razgovoru.');
        }
    });
}

module.exports = { sendImage, chatMessage, clearChat, startPrivateChat, endPrivateChat, sendPrivateMessage };
