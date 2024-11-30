// server.js - Kod za server-side (Node.js)

const privateChats = {}; // Čuva privatne chatove (socket.id => [socket.id])

function startPrivateChat(socket, receiverId) {
    privateChats[socket.id] = privateChats[socket.id] || [];
    privateChats[socket.id].push(receiverId);

    privateChats[receiverId] = privateChats[receiverId] || [];
    privateChats[receiverId].push(socket.id);

    socket.emit('private_chat_started', receiverId);
    socket.to(receiverId).emit('private_chat_started', socket.id);
}

function endPrivateChat(socket, receiverId) {
    privateChats[socket.id] = privateChats[socket.id].filter(id => id !== receiverId);
    privateChats[receiverId] = privateChats[receiverId].filter(id => id !== socket.id);

    socket.emit('private_chat_ended', receiverId);
    socket.to(receiverId).emit('private_chat_ended', socket.id);
}

function sendPrivateMessage(socket, data) {
    const { receiverId, message } = data;

    if (privateChats[socket.id] && privateChats[socket.id].includes(receiverId)) {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: message,
            nickname: socket.nickname,
            time: time,
            private: true,
        };

        socket.to(receiverId).emit('private_message', messageToSend);
        socket.emit('private_message', messageToSend);
    } else {
        socket.emit('error', 'Niste u privatnom razgovoru.');
    }
}

module.exports = { startPrivateChat, endPrivateChat, sendPrivateMessage };
