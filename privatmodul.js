module.exports = function (io, guests) {
    // Privatna poruka
    io.on('connection', (socket) => {
        // Kreiraj varijablu za status privatnog chata
        let isPrivateChatEnabled = false; // Na početku privatni chat je isključen

        // Kada korisnik uključi ili isključi privatni chat
        socket.on('toggle_private_chat', (status) => {
            isPrivateChatEnabled = status; // Ažuriraj status privatnog chata
            console.log('Privatni chat:', isPrivateChatEnabled ? 'Uključen' : 'Isključen');
            
            // Emituj svim povezanim korisnicima
            io.emit('private_chat_status', isPrivateChatEnabled);
            console.log('Emitovanje statusa privatnog chata svim korisnicima:', isPrivateChatEnabled ? 'Uključen' : 'Isključen');
        });

        // Privatna poruka
        socket.on('private_message', ({ to, message, time, bold, italic, color, underline, overline }) => {
            // Proveri da li je privatni chat uključen pre slanja poruke
            if (!isPrivateChatEnabled) {
                return console.log('Privatni chat nije uključen');
            }

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
