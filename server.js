const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { setupSocketEvents } = require('./banmodul'); 
const uuidRouter = require('./uuidmodul'); 
const { saveIpData, getIpData } = require('./ip'); 
const konobaricaModul = require('./konobaricamodul'); 
const slikemodul = require('./slikemodul'); 
const pingService = require('./ping');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB(); 
konobaricaModul(io);
slikemodul.setSocket(io);

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/guests', uuidRouter); 
app.set('trust proxy', true);

// Lista autorizovanih korisnika
const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '__X__']);
const guests = {};
const assignedNumbers = new Set(); 

setupSocketEvents(io, guests); 

io.on('connection', (socket) => {
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`;
    guests[socket.id] = nickname;
    console.log(`${nickname} se povezao.`);

    socket.broadcast.emit('newGuest', nickname);
    io.emit('updateGuestList', Object.values(guests));

    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const userNickname = guests[socket.id] || 'Nepoznat korisnik'; 

        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: userNickname,
            time: time,
        };

        saveIpData(socket.handshake.address, msgData.text, userNickname);
        io.emit('chatMessage', messageToSend);
    });

    socket.on('clear-chat', () => {
        io.emit('chat-cleared');
    });

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
});

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
