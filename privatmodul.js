module.exports = function(io, guests) {
    io.on('connection', (socket) => {
        // Obrada privatnih poruka
        socket.on('private_message', ({ to, message, time, bold, italic, color, underline, overline }) => {
            const recipientSocketId = Object.keys(guests).find(id => guests[id] === to);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('private_message', { message, time, bold, italic, color, underline, overline });
            }
        });

        // Dodajemo ovde samo jedan } koji završava ovu funkciju
        socket.on('toggle_private_chat', (status) => {
            io.emit('update_private_chat_status', status); // Emituje svim klijentima
        });
    });  // Ova zagrada zatvara io.on('connection')
};  // Ova zagrada zatvara modul


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
