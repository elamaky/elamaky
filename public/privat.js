let selectedUser = null;
let isPrivateChatEnabled = false;

// Funkcija za selektovanje korisnika
function selectUser(username) {
    selectedUser = username;

    document.querySelectorAll('#guestList li').forEach(li => li.style.backgroundColor = '');
    const userElement = Array.from(document.querySelectorAll('#guestList li')).find(li => li.textContent === username);

    if (userElement) {
        userElement.style.backgroundColor = 'rgba(0, 0, 255, 0.1)';
    }

    const privateChatInfo = document.getElementById('privateChatInfo');
    if (!privateChatInfo) {
        const newDiv = document.createElement('div');
        newDiv.id = 'privateChatInfo';
        newDiv.style.padding = '5px';
        newDiv.style.backgroundColor = 'rgba(0, 0, 255, 0.1)';
        newDiv.textContent = `Privatni chat sa ${username}`;
        document.getElementById('messageArea').insertBefore(newDiv, document.getElementById('messageArea').firstChild);
    } else {
        privateChatInfo.textContent = `Privatni chat sa ${username}`;
    }
}

// Event za unos poruke
document.getElementById('chatInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        const message = document.getElementById('chatInput').value;
        const time = new Date().toLocaleTimeString();

        if (selectedUser) {
            socket.emit('private_message', { to: selectedUser, message, time });

            const messageDiv = document.createElement('div');
            messageDiv.textContent = `--->>> PRIMA --->>> ${message} --->>> ${time}`;
            document.getElementById('messageArea').appendChild(messageDiv);
        } else {
            socket.emit('public_message', { message, time });

            const messageDiv = document.createElement('div');
            messageDiv.textContent = `${message} --->>> ${time}`;
            document.getElementById('messageArea').appendChild(messageDiv);
        }

        document.getElementById('chatInput').value = '';
    }
});

// Prijem privatnih poruka
socket.on('private_message', ({ from, message, time }) => {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `---->>> ${from} : ${message} --->>> ${time}`;
    document.getElementById('messageArea').appendChild(messageDiv);
});
