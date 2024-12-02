io.on('connection', (socket) => {
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`; 
    guests[socket.id] = nickname; 
    console.log(`${nickname} se povezao.`);

    const updatedGuests = ensureRadioGalaksijaAtTop(guests);
    socket.broadcast.emit('newGuest', nickname);
    io.emit('updateGuestList', Object.values(guests));

    socket.on('userLoggedIn', async (username) => {
        if (authorizedUsers.has(username)) {
            guests[socket.id] = username;
            console.log(`${username} je autentifikovan kao admin.`);
        } else {
            guests[socket.id] = username;
            console.log(`${username} se prijavio kao gost.`);
        }
        io.emit('updateGuestList', Object.values(guests));
    });

    // Poziv funkcija koje koriste socket i io
    sendImage(socket, io);
    chatMessage(socket, io, guests); 
    clearChat(socket, io);
    startPrivateChat(socket);
    endPrivateChat(socket);
    sendPrivateMessage(socket);

    socket.on('disconnect', () => {
        console.log(`${guests[socket.id]} se odjavio.`);
        delete guests[socket.id];
        io.emit('updateGuestList', Object.values(guests));
    });

    socket.on('banUser', (nicknameToBan) => {
        const socketIdToBan = Object.keys(guests).find(key => guests[key] === nicknameToBan);

        if (socketIdToBan) {
            io.to(socketIdToBan).emit('banned');
            io.sockets.sockets[socketIdToBan].disconnect();
            console.log(`Korisnik ${nicknameToBan} je banovan.`);
        } else {
            console.log(`Korisnik ${nicknameToBan} nije pronađen.`);
            socket.emit('userNotFound', nicknameToBan);
        }
    });
});  // OVDJE ZATVORI 'connection' EVENT

// Funkcija za generisanje jedinstvenog broja
function generateUniqueNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 8889) + 1111; 
    } while (assignedNumbers.has(number));
    assignedNumbers.add(number);
    return number;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
