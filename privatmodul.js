module.exports = function (io, guests) {
    // Privatna poruka
    io.on('connection', (socket) => {
        socket.on('private_message', (data) => {
            const { to, message, time, bold, italic, color, underline, overline } = data;

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
            }
        });
    });
};

