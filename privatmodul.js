module.exports = function (io, guests) {
    // Privatna poruka
    io.on('connection', (socket) => {
        socket.on('private_message', ({ to, message, time, bold, italic, color, underline, overline }) => {
            // Pronalazi socket.id primaoca na osnovu imena
            const recipientSocketId = Object.keys(guests).find(id => guests[id] === to);

              // Kada korisnik uključi ili isključi privatni chat
        socket.on('toggle_private_chat', (isPrivateChatEnabled) => {
            console.log('Privatni chat:', isPrivateChatEnabled ? 'Uključen' : 'Isključen');
            
            // Emituj svim povezanim korisnicima, uključujući i trenutnog korisnika
            io.emit('private_chat_status', isPrivateChatEnabled);
        });

            if (recipientSocketId) {
                // Slanje privatne poruke primaocu
                io.to(recipientSocketId).emit('private_message', {
                    from: guests[socket.id],  // Pošiljalac
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
                    from: guests[socket.id],  // Pošiljalac (u odgovoru)
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
    });
};
