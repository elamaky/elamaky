let isPrivateChatEnabled = false;  // Zastavica za privatni chat
let privateChatReceiver = null;    // Ko je trenutno izabran za privatni chat
const allowedUsers = ['Radio Galaksija', 'ZI ZU', '__X__'];  // Dozvoljeni korisnici

// Elementi za interakciju
const contextMenu = document.getElementById('contextMenu');
const messageArea = document.getElementById('messageArea');
const chatInput = document.getElementById('chatInput');

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

// Event za pokretanje privatnog chata sa gostima
function addGuestToPrivateChat(guestName) {
    const guestDiv = document.createElement('div');
    guestDiv.textContent = guestName;
    guestDiv.className = 'guestItem';
    guestDiv.addEventListener('click', () => startPrivateChat(guestName));
    document.getElementById('guestList').appendChild(guestDiv);
}
