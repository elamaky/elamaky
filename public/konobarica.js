// Kada se povežemo sa serverom, emitujemo događaj za novog gosta
socket.emit('new_guest');

// Slušamo za poruke od servera, u ovom slučaju pozdravnu poruku od Konobarice
socket.on('message', (data) => {
    const messageArea = document.getElementById('messageArea');
    
    // Kreiramo HTML element za poruku
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Dodajemo korisničko ime i poruku
    messageElement.innerHTML = `
        <strong>${data.username}:</strong> ${data.message}
    `;
    
    // Ako je sistemska poruka, dodajemo odgovarajući stil
    if (data.isSystemMessage) {
        messageElement.classList.add('system-message');
    }
    
    // Dodajemo poruku na vrh umesto na dno
    messageArea.insertBefore(messageElement, messageArea.firstChild);
});

// Dodavanje Konobarice u listu gostiju (ako je potrebno)
const guestList = document.getElementById('guestList');
const konobaricaItem = document.createElement('div');
konobaricaItem.classList.add('guest-konobarica');
konobaricaItem.innerHTML = 'Konobarica'; // Dodajemo samo tekst bez tagova
guestList.appendChild(konobaricaItem);


document.getElementById('mixer').addEventListener('click', () => {
    // Proveri da li je mixer već otvoren
    if (!document.getElementById('mixer-container')) {
        // Dodaj mixer u body
        const mixerHTML = `
            <div id="mixer-container">
                <div id="mixer">
                    <audio id="audioPlayer" controls style="position: absolute; top: 0px; left: 0;"></audio>
                    <h2 class="title" style="position: absolute; top: 60px; left: 0;">By *__X__*</h2>
                    <input type="file" id="fileInput" multiple style="position: absolute; top: 90px; left: 0; right: 0; margin-bottom: 10px;">
                    <ul id="songList"></ul>
                    <div id="mixer-buttons">
                        <button id="playSelected">Play</button>
                        <button id="deleteSelected">Obriši</button>
                        <button id="hideButton">Sakrij</button>
                        <button id="closeButton">Gasi</button>
                    </div>
                </div>
            </div>
        `;
        
        // Dodaj mixer u body
        document.body.insertAdjacentHTML('beforeend', mixerHTML);
    }
});

