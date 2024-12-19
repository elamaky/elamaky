const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Serviraj statičke fajlove (npr. mixer.html)

io.on('connection', (socket) => {
    console.log('Korisnik povezan: ' + socket.id);

    socket.on('audio-stream', (chunk) => {
        // Emituj audio svim povezanim korisnicima osim onog koji šalje
        socket.broadcast.emit('audio-stream', chunk);
    });
});

server.listen(3000, () => {
    console.log('Server pokrenut na http://localhost:3000');
});

