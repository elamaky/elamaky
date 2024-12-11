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
document.getElementById('guestList').addEventListener('contextmenu', function(event) {
    // Prevent default right-click menu
    event.preventDefault();

    // Proveri da li je kliknut na <li> element u listi gostiju
    if (event.target && event.target.tagName === 'LI') {
        const nickname = event.target.textContent;
        selectUser(nickname); // Pozivamo funkciju za selektovanje korisnika
    }
});
if (isPrivateChatEnabled && selectedUser) {
    // Emituj privatnu poruku prema selektovanom korisniku
    socket.emit('private_message', { to: selectedUser, message, time });

    // Dodaj privatnu poruku u messageArea
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `SALJE --->>> PRIMA --->>> ${message} --->>> ${time}`;
    document.getElementById('messageArea').appendChild(messageDiv);
} else {
    // Emituj javnu poruku
    socket.emit('chatMessage', { text: message, bold: isBold, italic: isItalic, color: currentColor });

    // Dodaj javnu poruku u messageArea
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `SALJE --->>> PRIMA --->>> ${message} --->>> ${time}`;
    document.getElementById('messageArea').appendChild(messageDiv);
}
