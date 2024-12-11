let selectedUser = null;

function selectUser(username) {
    selectedUser = username;

    // Obeleži izabrani korisnik u listi gostiju
    document.querySelectorAll('#guestList li').forEach(li => li.style.backgroundColor = '');
    document.querySelector(`#guestList li:contains('${username}')`).style.backgroundColor = 'rgba(0, 0, 255, 0.1)';
}

document.getElementById('chatInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {  // Pritisnuto ENTER, bez SHIFT (koji služi za novi red)
        const message = document.getElementById('chatInput').value;
        const time = new Date().toLocaleTimeString();

        if (selectedUser) {
            // Emituj privatnu poruku prema selektovanom korisniku
            socket.emit('private_message', { to: selectedUser, message, time });

            // Dodaj poruku u messageArea
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `SALJE ---> ${selectedUser} ---> ${message} ---> ${time}`;
            document.getElementById('messageArea').appendChild(messageDiv);

            document.getElementById('chatInput').value = '';  // Očisti polje za unos
        } else {
            alert('Odaberite korisnika!');
        }

        event.preventDefault();  // Sprečava unos novog reda prilikom pritiska ENTER
    }
});
