const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { setupSocketEvents } = require('./banmodul'); // Uvoz funkcije iz banmodula
const uuidRouter = require('./uuidmodul'); // Putanja do modula
const konobaricaModul = require('./konobaricamodul'); // Uvoz konobaricamodul.js
const slikemodul = require('./slikemodul');
const pingService = require('./ping');
const privateModule = require('./privatmodul'); // Podesi putanju ako je u drugom folderu
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const multer = require('multer');  // ZA STRIM
const path = require('path');   ///  ZA STRIM
const upload = multer({ dest: 'uploads/' });  // ZA STRIM

app.post('/upload', upload.single('song'), (req, res) => {
    const file = req.file;
    if (file) {
        const url = `/uploads/${file.filename}`;
        res.json({ url }); // Vrati ispravan JSON odgovor
    } else {
        res.status(400).json({ error: 'Upload failed' }); // Vrati JSON sa greškom
    }
});


connectDB(); // Povezivanje na bazu podataka
konobaricaModul(io);
slikemodul.setSocket(io);

// Middleware za parsiranje JSON podataka i serviranje statičkih fajlova
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/guests', uuidRouter); // Dodavanje ruta u aplikaciju
app.set('trust proxy', true);

// Rute za registraciju i prijavu
app.post('/register', (req, res) => register(req, res, io));
app.post('/login', (req, res) => login(req, res, io));

// Početna ruta
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Lista autorizovanih i banovanih korisnika
const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '__X__']);
const bannedUsers = new Set();

// Skladištenje informacija o gostima
const guests = {};
const assignedNumbers = new Set(); // Set za generisane brojeve

// Dodavanje socket događaja iz banmodula
setupSocketEvents(io, guests, bannedUsers); // Dodavanje guests i bannedUsers u banmodul
privateModule(io, guests);

// Socket.io događaji
io.on('connection', (socket) => {
    // Generisanje jedinstvenog broja za gosta
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`; // Nadimak korisnika
    guests[socket.id] = nickname; // Dodajemo korisnika u guest list
    socket.emit('setNickname', nickname);

  // Emitovanje događaja da bi ostali korisnici videli novog gosta
    socket.broadcast.emit('newGuest', nickname);
    io.emit('updateGuestList', Object.values(guests));

    // Obrada prijave korisnika
    socket.on('userLoggedIn', (username) => {
        if (authorizedUsers.has(username)) {
            guests[socket.id] = username;
            console.log(`${username} je autentifikovan kao admin.`);
        } else {
            guests[socket.id] = username;
            console.log(`${username} se prijavio kao gost.`);
        }
        io.emit('updateGuestList', Object.values(guests));
    });

 // Obrada slanja chat poruka
    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
             underline: msgData.underline,
            overline: msgData.overline,
            nickname: guests[socket.id],
            time: time,
        };
        io.emit('chatMessage', messageToSend);
    });

  // Obrada za čišćenje chata
    socket.on('clear-chat', () => {
        console.log('Chat cleared');
        io.emit('chat-cleared');
    });

// Mogućnost banovanja korisnika prema nickname-u
    socket.on('banUser', (nicknameToBan) => {
        const socketIdToBan = Object.keys(guests).find(key => guests[key] === nicknameToBan);

        if (socketIdToBan) {
            io.to(socketIdToBan).emit('banned');
            io.sockets.sockets[socketIdToBan].disconnect();
            console.log(`Korisnik ${nicknameToBan} (ID: ${socketIdToBan}) je banovan.`);
        } else {
            console.log(`Korisnik ${nicknameToBan} nije pronađen.`);
            socket.emit('userNotFound', nicknameToBan);
        }
    });

   // Funkcija za generisanje jedinstvenog broja
    function generateUniqueNumber() {
        let number;
        do {
            number = Math.floor(Math.random() * 8889) + 1111; // Brojevi između 1111 i 9999
        } while (assignedNumbers.has(number));
        assignedNumbers.add(number);
        return number;
    }
  // Kada klijent pošalje 'streamSong'
    socket.on('streamSong', (url) => {
        console.log('Primljen stream URL od klijenta:', url);
    });

   socket.on('stream', (data) => {
    console.log('Primljen stream za pesmu:', data.name);
    console.log('Buffer:', data.buffer);
    console.log('Tip buffer-a:', data.buffer.constructor.name);  // Da li je ArrayBuffer?
    
    if (data.buffer && data.buffer.byteLength > 0) {
        // Proveri da li server prima validan ArrayBuffer
        console.log('Stream podaci su validni.');
        // Emituj podatke svim povezanim korisnicima
        io.emit('stream', data);
    } else {
        console.error('Prazan buffer ili nevalidni podaci');
    }
});

 // Obrada diskonekcije korisnika
    socket.on('disconnect', () => {
        console.log(`${guests[socket.id]} se odjavio.`);
        delete guests[socket.id];
        io.emit('updateGuestList', Object.values(guests));
    });
     });
// Pokretanje servera na definisanom portu
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
