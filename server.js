const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { setupSocketEvents } = require('./banmodul'); // Uvoz funkcije iz banmodula
const { saveIpData, getIpData } = require('./ip'); // Uvozimo ip.js
const uuidRouter = require('./uuidmodul'); // Putanja do modula
const { ensureRadioGalaksijaAtTop } = require('./sitnice');
const konobaricaModul = require('./konobaricamodul');
const { setSocket, chatMessage, clearChat } = require('./poruke');
const pingService = require('./ping');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
        methods: ["GET", "POST"],
        credentials: true
    }
});

connectDB(); // Povezivanje na bazu podataka
konobaricaModul(io);

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

// Lista autorizovanih korisnika i banovanih korisnika
const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '__X__']);
const bannedUsers = new Set();

// Skladištenje informacija o gostima
const guests = {};
const assignedNumbers = new Set(); // Set za generisane brojeve

// Dodavanje socket događaja iz banmodula
setupSocketEvents(io, guests, bannedUsers); // Dodavanje guests i bannedUsers u banmodul

// Pretpostavljam da je `io` već definisan u prvom delu koda, pa ga ne treba ponovo dodeliti.

io.on('connection', (socket) => {
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`; // Nadimak korisnika
    guests[socket.id] = nickname; // Dodajemo korisnika u guest list
    console.log(`${nickname} se povezao.`);

    // Emitovanje događaja da bi ostali korisnici videli novog gosta
    const updatedGuests = ensureRadioGalaksijaAtTop(guests);
    socket.broadcast.emit('newGuest', nickname);
    io.emit('updateGuestList', Object.values(guests));

    // Obrada prijave korisnika
    socket.on('userLoggedIn', async (username) => {
        if (authorizedUsers.has(username)) {
            guests[socket.id] = username; // Admin
            console.log(`${username} je autentifikovan kao admin.`);
        } else {
            guests[socket.id] = username; // Običan gost
            console.log(`${username} se prijavio kao gost.`);
        }
        io.emit('updateGuestList', Object.values(guests));
    });

    // Kada klijent doda novu sliku
    socket.on('add-image', (imageSource) => {
        console.log("Primljen URL slike:", imageSource);
        // Emitujte sliku svim klijentima uključujući pošiljaoca
        io.emit('display-image', imageSource);
    });

    // Kada klijent ažurira poziciju ili dimenzije slike
    socket.on('updateImage', (data) => {
        console.log("Ažuriranje slike:", data);
        // Emitujte ažurirane podatke svim klijentima osim pošiljaoca
        socket.broadcast.emit('imageUpdated', data);
    });

    // Kada klijent ukloni sliku
    socket.on('remove-image', (imageId) => {
        console.log("Uklanjanje slike:", imageId);
        // Emitujte događaj svim klijentima
        io.emit('imageRemoved', imageId);
    });

    // Funkcije iz modula poruke.js
    setSocket(socket, io);  // Inicijalizacija socket-a i io objekta
    chatMessage(guests);     // Pokretanje funkcije za slanje poruka
    clearChat();            // Pokretanje funkcije za brisanje chata

    // Obrada diskonekcije korisnika
    socket.on('disconnect', () => {
        console.log(`${guests[socket.id]} se odjavio.`);
        delete guests[socket.id]; // Uklanjanje gosta iz liste
        io.emit('updateGuestList', Object.values(guests));
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

// Pokretanje servera na definisanom portu
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
