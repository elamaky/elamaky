const socket = io();

// Promenljive za privatni chat
let privateChatActive = false;
let privateChatReceiver = null;

// Funkcija za prikazivanje kontekstnog menija (desni klik na message area)
function showContextMenu(event) {
    event.preventDefault();
    
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.top = `${event.clientY}px`;
    contextMenu.style.left = `${event.clientX}px`;
}

// Funkcija za sakrivanje kontekstnog menija
function hideContextMenu() {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'none';
}

// Funkcija za aktiviranje/deaktiviranje privatnog chata
function togglePrivateChat() {
    if (!privateChatReceiver) {
        alert("Morate odabrati korisnika za privatni chat.");
        return;
    }
    
    privateChatActive = !privateChatActive;
    socket.emit(privateChatActive ? 'startPrivateChat' : 'endPrivateChat', privateChatReceiver);
    updateChatArea();
}

// Funkcija za odabir korisnika za privatni chat
function selectReceiver(receiverId) {
    privateChatReceiver = receiverId;
    updateChatArea();
}

// Funkcija za slanje privatne poruke
function sendPrivateMessage(message) {
    if (privateChatActive && privateChatReceiver) {
        const msgData = {
            receiverId: privateChatReceiver,
            message: message
        };
        socket.emit('privateMessage', msgData);
    } else {
        alert('Privatni chat nije aktivan ili niste odabrali korisnika.');
    }
}

// Funkcija za ažuriranje chat area sa informacijama o privatnom chatu
function updateChatArea() {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = privateChatActive ? 
        `Privatni chat sa korisnikom ${privateChatReceiver}` : 
        'Čavrljajte sa svima!';

    // Dodavanje vizualnog indikatora za aktivni privatni chat
    if (privateChatActive) {
        messageArea.classList.add('private-chat-active');
    } else {
        messageArea.classList.remove('private-chat-active');
    }
}

// Funkcija koja osluškuje privatne poruke sa servera
socket.on('private_message', (message) => {
    const messageArea = document.getElementById('messageArea');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.nickname}: ${message.text}`;
    messageArea.appendChild(messageElement);
});

// Funkcija koja osluškuje kada je privatni chat započet
socket.on('private_chat_started', (receiverId) => {
    privateChatReceiver = receiverId;
    privateChatActive = true;
    updateChatArea();
});

// Funkcija koja osluškuje kada je privatni chat završen
socket.on('private_chat_ended', (receiverId) => {
    if (privateChatReceiver === receiverId) {
        privateChatActive = false;
        privateChatReceiver = null;
        updateChatArea();
    }
});

// Dodavanje event listener-a za desni klik na message area
const messageArea = document.getElementById('messageArea');
messageArea.addEventListener('contextmenu', showContextMenu);

// Dodavanje event listener-a za klik na dugme za privatni chat
const contextMenu = document.getElementById('contextMenu');
contextMenu.addEventListener('click', togglePrivateChat);

// Funkcija koja prikazuje listu korisnika
function updateGuestList(guestList) {
    const guestListContainer = document.getElementById('guestList');
    guestListContainer.innerHTML = ''; // Očistiti prethodnu listu

    guestList.forEach((guest) => {
        const guestItem = document.createElement('div');
        guestItem.textContent = guest;
        guestItem.addEventListener('click', () => selectReceiver(guest));
        guestListContainer.appendChild(guestItem);
    });
}

// Osluškivanje događaja za ažuriranje liste gostiju
socket.on('updateGuestList', (guestList) => {
    updateGuestList(guestList);
});

