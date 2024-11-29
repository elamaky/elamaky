const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { setupSocketEvents } = require('./banmodul'); // Uvoz funkcije iz banmodula
const uuidRouter = require('./uuidmodul'); // Putanja do modula
const { saveIpData, getIpData } = require('./ip'); // Uvozimo ip.js
const pingService = require('./ping');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB(); // Povezivanje na bazu podataka

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

// Skladištenje informacija o gostima
const guests = {};
const assignedNumbers = new Set(); // Set za generisane brojeve
const bannedUsers = new Set(); // Set za banovane korisnike

// Dodavanje socket događaja iz banmodula
setupSocketEvents(io, guests, bannedUsers); // Prosleđujemo bannedUsers

// Socket.io događaji
io.on('connection', (socket) => {
    // Generisanje jedinstvenog broja za gosta
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`; // Nadimak korisnika
    guests[socket.id] = nickname; // Dodajemo korisnika u guest list
    console.log(`${nickname} se povezao.`);

    // Emitovanje događaja da bi ostali korisnici videli novog gosta
    socket.broadcast.emit('newGuest', nickname);
    io.emit('updateGuestList', Object.values(guests));

    // Obrada prijave korisnika
    socket.on('userLoggedIn', async (username) => {
        if (authorizedUsers.has(username)) {
            guests[socket.id] = `${username} (Admin)`; // Ako je admin
            console.log(`${username} je autentifikovan kao admin.`);
        } else {
            guests[socket.id] = username; // Ako je običan gost
            console.log(`${username} se prijavio kao gost.`);
        }
        io.emit('updateGuestList', Object.values(guests));
    });

    // Obrada slanja poruka u četu
    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[socket.id], // Korišćenje nadimka za slanje poruke
            time: time
        };

        // Spremi IP, poruku i nickname u fajl
        saveIpData(socket.handshake.address, msgData.text, guests[socket.id]);
        
        io.emit('chatMessage', messageToSend);
    });

    // Obrada diskonekcije korisnika
    socket.on('disconnect', () => {
        console.log(`${guests[socket.id]} se odjavio.`);
        delete guests[socket.id]; // Uklanjanje gosta iz liste
        io.emit('updateGuestList', Object.values(guests));
    });

    // Mogućnost banovanja korisnika prema socket.id
    socket.on('banUser', (socketIdToBan) => {
        if (bannedUsers.has(socketIdToBan)) {
            io.to(socketIdToBan).emit('banned');
            io.sockets.sockets[socketIdToBan].disconnect();
            console.log(`Korisnik sa ID ${socketIdToBan} je banovan.`);
        } else {
            console.log(`Korisnik sa ID ${socketIdToBan} nije pronađen.`);
            socket.emit('userNotFound', socketIdToBan);
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
});

// Pokretanje servera na definisanom portu
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
