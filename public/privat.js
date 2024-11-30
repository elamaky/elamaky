// privat.js - Kod za browser

const contextMenu = document.getElementById('contextMenu');
const messageArea = document.getElementById('messageArea');
const chatInput = document.getElementById('chatInput');

let isPrivateChatEnabled = false;
let privateChatReceiver = null;
const allowedUsers = ['Radio Galaksija', 'ZI ZU', '__X__'];

// Funkcija za prikazivanje/skrivanje kontekstnog menija
messageArea.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
});

// Funkcija za uključivanje/isključivanje privatnog chata
function togglePrivateChat() {
    const username = prompt('Unesite svoje ime korisnika:', 'Gost');
    if (allowedUsers.includes(username)) {
        isPrivateChatEnabled = !isPrivateChatEnabled;
        alert(`Privatni chat ${isPrivateChatEnabled ? 'uključen' : 'isključen'}`);
        privateChatReceiver = null;
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
            socket.emit('privateMessage', {
                message: messageText,
                receiver: privateChatReceiver,
            });
            chatInput.value = '';
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
