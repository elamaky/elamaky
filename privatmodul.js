module.exports = function (io, guests) {
    // Privatna poruka
    io.on('connection', (socket) => {
        // Postojeći handler za privatne poruke
        socket.on('private_message', ({ to, message, time, bold, italic, color, underline, overline }) => {
            const recipientSocketId = Object.keys(guests).find(id => guests[id] === to);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('private_message', { message, time, bold, italic, color, underline, overline });
            }
        });

        // Novi handler za promenu statusa privatnog chata
        socket.on('toggle_private_chat', (status) => {
            // Emituje svim klijentima informaciju o statusu privatnog chata
            io.emit('update_private_chat_status', status);
        });
    });
};


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
