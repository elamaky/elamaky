let selectedUser = null;
let isPrivateChatEnabled = false; // Status privatnog chata

function selectUser(username) {
    selectedUser = username;

    // Obeleži izabrani korisnik u listi gostiju
    document.querySelectorAll('#guestList li').forEach(li => li.style.backgroundColor = '');
    const userElement = Array.from(document.querySelectorAll('#guestList li')).find(li => li.textContent === username);
    
    if (userElement) {
        userElement.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'; // Obeleži odabranog korisnika
    }
}

document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled; // Prebacuje stanje privatnog chata
    const statusText = isPrivateChatEnabled ? 'Privatni chat je uključen' : 'Privatni chat je isključen';
    alert(statusText);
});

document.getElementById('chatInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Pritisnuto ENTER, bez SHIFT
        const message = document.getElementById('chatInput').value; 
        const time = new Date().toLocaleTimeString();

        if (isPrivateChatEnabled && selectedUser) {
            // Emituj privatnu poruku prema selektovanom korisniku
            socket.emit('private_message', { to: selectedUser, message, time });

            // Dodaj poruku u messageArea
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `SALJE (PRIVATNO) ---> ${selectedUser} ---> ${message} ---> ${time}`;
            document.getElementById('messageArea').appendChild(messageDiv);
        } else {
            // Emituj javnu poruku
            socket.emit('public_message', { message, time });

            // Dodaj javnu poruku u messageArea
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `SALJE (JAVNO) ---> TI ---> ${message} ---> ${time}`;
            document.getElementById('messageArea').appendChild(messageDiv);
        }

        document.getElementById('chatInput').value = ''; // Očisti polje za unos
        event.preventDefault(); // Sprečava unos novog reda prilikom pritiska ENTER
    }
});

// Prijem privatnih poruka
socket.on('private_message', ({ from, message, time }) => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `PRIMA (PRIVATNO) ---> ${from} ---> ${message} ---> ${time}`;
    document.getElementById('messageArea').appendChild(messageDiv);
});

// Prijem javnih poruka
socket.on('public_message', ({ from, message, time }) => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `PRIMA (JAVNO) ---> ${from} ---> ${message} ---> ${time}`;
    document.getElementById('messageArea').appendChild(messageDiv);
});
