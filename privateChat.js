// privat.js - Modul za upravljanje privatnim chatom

let isPrivateChatEnabled = false;  // Zastavica za privatni chat
let privateChatReceiver = null;    // Ko je trenutno izabran za privatni chat
const allowedUsers = ['Radio Galaksija', 'ZI ZU', '__X__'];  // Dozvoljeni korisnici

// Funkcija za prikazivanje/skrivanje kontekstnog menija
messageArea.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Sprečava prikazivanje default menija
    contextMenu.style.display = 'block'; // Prikazuje naš meni
    contextMenu.style.left = `${e.pageX}px`; // Pozicija menija
    contextMenu.style.top = `${e.pageY}px`;  // Pozicija menija
});

// Funkcija za uključivanje/isključivanje privatnog chata
function togglePrivateChat() {
    const username = prompt('Unesite svoje ime korisnika:', 'Gost'); // Da bi proverili korisnika
    if (allowedUsers.includes(username)) {
        isPrivateChatEnabled = !isPrivateChatEnabled;
        alert(`Privatni chat ${isPrivateChatEnabled ? 'uključen' : 'isključen'}`);
        privateChatReceiver = null;  // Resetujemo trenutnog primaoca

        // Prikazivanje obaveštenja u message area
        const statusMessage = document.createElement('div');
        statusMessage.textContent = isPrivateChatEnabled ? `Privatni chat je sada aktivan. Izaberite korisnika.` : `Privatni chat je isključen.`;
        statusMessage.className = 'statusMessage';
        messageArea.appendChild(statusMessage);
    } else {
        alert('Nemaš dozvolu za aktiviranje privatnog chata.');
    }
}

// Funkcija za odabir korisnika za privatni chat
function startPrivateChat(user) {
    if (!isPrivateChatEnabled) {
        alert('Privatni chat nije aktivan.');
        return;
    }

    if (allowedUsers.includes(user)) {
        privateChatReceiver = user;
        const privateMessage = document.createElement('div');
        privateMessage.textContent = `Privatan chat sa: ${user}`;
        privateMessage.className = 'privateMessageIndicator';
        messageArea.appendChild(privateMessage);

        // Dodajemo mogućnost slanja privatnih poruka u chat input
        chatInput.placeholder = `Pišite poruku za ${user}`;
        chatInput.focus();
    } else {
        alert('Ovaj korisnik nije dozvoljen za privatni chat.');
    }
}

// Event za slanje privatnih poruka
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && privateChatReceiver) {
        const messageText = chatInput.value;
        if (messageText.trim()) {
            // Emitovanje privatne poruke na server
            socket.emit('privateMessage', {
                message: messageText,
                receiver: privateChatReceiver,
            });
            chatInput.value = '';  // Resetovanje inputa nakon slanja
        }
    }
});

// Skriva meni nakon korišćenja
document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
});

// Funkcija za dodavanje korisnika u privatni chat
function addGuestToPrivateChat(guestName) {
    const guestDiv = document.createElement('div');
    guestDiv.textContent = guestName;
    guestDiv.className = 'guestItem';
    guestDiv.addEventListener('click', () => startPrivateChat(guestName));
    document.getElementById('guestList').appendChild(guestDiv);
}

const privateChats = {};  // Čuva privatne chatove (socket.id => [socket.id])

// Funkcija za početak privatnog chata
function startPrivateChat(socket, receiverId) {
    privateChats[socket.id] = privateChats[socket.id] || [];
    privateChats[socket.id].push(receiverId);

    privateChats[receiverId] = privateChats[receiverId] || [];
    privateChats[receiverId].push(socket.id);

    socket.emit('private_chat_started', receiverId);
    socket.to(receiverId).emit('private_chat_started', socket.id);
}

// Funkcija za završavanje privatnog chata
function endPrivateChat(socket, receiverId) {
    privateChats[socket.id] = privateChats[socket.id].filter(id => id !== receiverId);
    privateChats[receiverId] = privateChats[receiverId].filter(id => id !== socket.id);

    socket.emit('private_chat_ended', receiverId);
    socket.to(receiverId).emit('private_chat_ended', socket.id);
}

// Funkcija za slanje privatne poruke
function sendPrivateMessage(socket, data) {
    const { receiverId, message } = data;

    if (privateChats[socket.id] && privateChats[socket.id].includes(receiverId)) {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: message,
            nickname: socket.nickname,
            time: time,
            private: true,
        };

        socket.to(receiverId).emit('private_message', messageToSend);
        socket.emit('private_message', messageToSend);
    } else {
        socket.emit('error', 'Niste u privatnom razgovoru.');
    }
}

// Funkcija za proveru korisnika za administraciju
function isAuthorizedUser(username) {
    const authorizedUsers = ['Radio Galaksija', 'ZI ZU', '__X__'];
    return authorizedUsers.includes(username);
}

module.exports = { startPrivateChat, endPrivateChat, sendPrivateMessage, isAuthorizedUser };
