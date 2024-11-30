// Funkcija za slanje poruka sa komandama
function sendMessageWithCommands(message) {
    // Obrada komandi kao #l, #u, #n, #g
    if (message.trim().toLowerCase() === '#l') {
        socket.emit('chatMessage', { text: '#l' });
        return;
    }

    if (message.trim().toLowerCase() === '#u') {
        socket.emit('chatMessage', { text: '#u' });
        return;
    }

    if (message.includes('#n')) {
        socket.emit('chatMessage', { text: '#n' });
        return;
    }

    if (message.trim() === '#g') {
        socket.emit('chatMessage', { text: '#g' });
        return;
    }

    // Inače, šaljemo običnu poruku
    socket.emit('chatMessage', { text: message });
}

// Slušanje ažuriranja liste gostiju
socket.on('updateGuestList', function(users) {
    // Ažuriraj DOM sa novim gostima
    console.log(`Ažurirana lista gostiju: ${users}`);
});

// Slušanje dolaska novog gosta
socket.on('newGuest', function(nickname) {
    console.log(`Nov gost: ${nickname}`);
});
