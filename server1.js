const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);  // Povezivanje Socket.io sa serverom

// Tvoje rute ili logika
app.get('/', (req, res) => {
  res.send('Ovo je drugi server!');
});

// Socket.io konekcija
io.on('connection', (socket) => {
  console.log('Korisnik je povezan');

  // Prilagoditi kod za strimovanje muzike ovde
  socket.on('playMusic', (musicData) => {
    // Ovde šalješ muziku klijentima
    io.emit('musicStream', musicData);
  });

  socket.on('disconnect', () => {
    console.log('Korisnik je isključen');
  });
});

// Drugi server na portu 3001
server.listen(3001, '0.0.0.0', () => {
  console.log('Drugi server je pokrenut na portu 3001');
});
