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

// Pronađite dugme za otvaranje mixera
const openMixerButton = document.getElementById('openMixerButton');
const mixerModal = document.getElementById('mixerModal');
const closeMixerModal = document.getElementById('closeMixerModal');

document.getElementById('openMixerButton').addEventListener('click', function() {
    fetch('mixer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('mixerContent').innerHTML = data;
            document.getElementById('functionModal').style.display = 'block'; // Otvori modal
        })
        .catch(error => console.error('Greška:', error));
});


