let isPrivateChatEnabled = false;

io.on('connection', (socket) => {
    // Kada admin uključi/isključi privatni chat
    socket.on('toggle_private_chat', (status) => {
        isPrivateChatEnabled = status;

        // Emituj status svim klijentima
        io.emit('private_chat_status', isPrivateChatEnabled);
    });

    // Obrada privatnih poruka
    socket.on('private_message', ({ to, message }) => {
        const recipientSocket = findSocketByUsername(to); // Funkcija za pronalaženje korisnika po imenu
        if (recipientSocket && isPrivateChatEnabled) {
            recipientSocket.emit('private_message', {
                from: socket.username,
                message
            });
        }
    });

    // Obrada običnih poruka
    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', data);
    });
});
