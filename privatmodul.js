module.exports = function (io, guests) {
    let isPrivateChatEnabled = false; // Status privatnog chata

    io.on('connection', (socket) => {
        // Pošaljite trenutni status privatnog chata
        socket.emit('private_chat_status', isPrivateChatEnabled);

        // Kada korisnik uključi ili isključi privatni chat
        socket.on('toggle_private_chat', (status) => {
            isPrivateChatEnabled = status; // Ažuriraj status privatnog chata
            console.log('Privatni chat:', isPrivateChatEnabled ? 'Uključen' : 'Isključen');

            // Emituj svim povezanim korisnicima
            io.emit('private_chat_status', isPrivateChatEnabled);
            console.log('Emitovanje statusa privatnog chata svim korisnicima:', isPrivateChatEnabled ? 'Uključen' : 'Isključen');
        });

        // Osluškuje privatne poruke
        socket.on('private_message', ({ to, message, time, bold, italic, color, underline, overline }) => {
            if (!isPrivateChatEnabled) {
                return console.log('Privatni chat nije uključen');
            }

            // Pronalazi socket.id primaoca na osnovu imena
            const recipientSocketId = Object.keys(guests).find(id => guests[id] === to);

            if (recipientSocketId) {
                // Slanje privatne poruke primaocu
                io.to(recipientSocketId).emit('private_message', {
                    from: guests[socket.id], // Pošiljalac
                    message,
                    time,
                    bold,
                    italic,
                    color,
                    underline,
                    overline
                });

                // Slanje privatne poruke pošiljaocu (opciono)
                socket.emit('private_message', {
                    from: guests[socket.id], // Pošiljalac (u odgovoru)
                    message,
                    time,
                    bold,
                    italic,
                    color,
                    underline,
                    overline
                });
            }
        });

        // Osluškuje ažuriranje selekcije gosta
        socket.on('update_guest_selection', (data) => {
            console.log('Ažuriranje selekcije gosta:', data);
            socket.broadcast.emit('sync_guest_selection', data);
        });

        // Osluškuje ažuriranje chat inputa
        socket.on('update_chat_input', (data) => {
            console.log('Ažuriranje unosa u chat:', data);
            socket.broadcast.emit('sync_chat_input', data);
        });
    });
};
