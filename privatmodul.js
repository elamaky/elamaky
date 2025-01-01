module.exports = function (io, guests) {
    let isPrivateChatEnabled = false; // Globalni status privatnog chata

    // Privatna poruka
    io.on('connection', (socket) => {
        // Slanje trenutnog statusa privatnog chata novom korisniku
        socket.emit('privateChatStatus', isPrivateChatEnabled);

        // Rukovanje događajem za promenu statusa privatnog chata
        socket.on('togglePrivateChat', (status) => {
            isPrivateChatEnabled = status;
            io.emit('privateChatStatus', isPrivateChatEnabled); // Emitovanje događaja svim korisnicima
        });

        socket.on('private_message', ({ to, message, time, bold, italic, color, underline, overline }) => {
            // Pronalazi socket.id primaoca na osnovu imena
            const recipientSocketId = Object.keys(guests).find(id => guests[id] === to);

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
