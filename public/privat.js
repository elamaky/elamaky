let selectedUser = null; // Odabran korisnik za privatni chat
let isPrivateChatEnabled = false; // Status privatnog chata

// Funkcija za selektovanje korisnika
function selectUser(nickname) {
    selectedUser = nickname;

    // Obeleži selektovanog korisnika u listi
    document.querySelectorAll('#guestList li').forEach(li => li.style.backgroundColor = '');
    const userElement = Array.from(document.querySelectorAll('#guestList li')).find(li => li.textContent === nickname);
    
    if (userElement) {
        userElement.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'; // Obeleži selektovanog korisnika
    }

    // Prikazivanje trake sa informacijom o privatnoj konverzaciji
    const privateChatInfo = document.getElementById('privateChatInfo');
    privateChatInfo.textContent = `Privatni chat sa ${nickname}`;
    privateChatInfo.style.display = 'block'; // Prikazivanje trake
}

// Dodaj event listener za desni klik na goste
document.getElementById('guestList').addEventListener('contextmenu', function(event) {
    // Prevent default right-click menu
    event.preventDefault();

    // Proveri da li je kliknut na <li> element u listi gostiju
    if (event.target && event.target.tagName === 'LI') {
        const nickname = event.target.textContent;
        selectUser(nickname); // Pozivamo funkciju za selektovanje korisnika
    }
});

// Aktivacija privatnog chata
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled; // Prebacuje stanje privatnog chata
    const statusText = isPrivateChatEnabled ? 'Privatni chat je uključen' : 'Privatni chat je isključen';
    alert(statusText);
});

// Event za unos poruke
document.getElementById('chatInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        const message = document.getElementById('chatInput').value;
        const time = new Date().toLocaleTimeString();

        if (isPrivateChatEnabled && selectedUser) {
            // Emituj privatnu poruku prema selektovanom korisniku
            socket.emit('private_message', { to: selectedUser, message, time });

            // Dodaj privatnu poruku u messageArea
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `Privatno (Za ${selectedUser}): ${message} --- ${time}`;
            document.getElementById('messageArea').appendChild(messageDiv);
        } else {
            // Emituj javnu poruku
            socket.emit('chatMessage', { text: message });

            // Dodaj javnu poruku u messageArea
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `Javno: ${message} --- ${time}`;
            document.getElementById('messageArea').appendChild(messageDiv);
        }

        document.getElementById('chatInput').value = ''; // Očisti polje za unos
    }
});

// Prikazivanje privatnih poruka
socket.on('private_message', ({ from, message, time }) => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `Privatno od ${from}: ${message} --- ${time}`;
    document.getElementById('messageArea').appendChild(messageDiv);
});

