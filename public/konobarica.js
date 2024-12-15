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

//  ZA MIXER DODATAK
// Open modal on button click
document.getElementById("mixer").onclick = function() {
  document.getElementById("mixerModal").style.display = "block";
}

// Close modal when clicking the close button
document.getElementById("kosModal").addEventListener("click", function() {
  document.getElementById("mixerModal").style.display = "none";
});

// Referenca na audio plejer
const audioPlayer = document.getElementById('audioPlayer');

// Funkcija za slanje muzike serveru
function streamMusic(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const audioData = event.target.result;
        // Emituj muziku serveru
        socket.emit('stream', audioData);
    };
    reader.readAsArrayBuffer(file);
}

// Očekuje se da je 'fileInput' i 'audioPlayer' već u DOM-u
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const audioPlayer = document.getElementById('audioPlayer');

    // Kada korisnik izabere muziku
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length) {
            streamMusic(files[0]); // Uzmi samo prvu izabranu pesmu
        }
    });

    // Osluškuj događaj 'play' sa servera
    socket.on('play', (audioData) => {
        const blob = new Blob([audioData]); // Proveri da li je audioData tipa koji se može konvertovati u Blob
        const url = URL.createObjectURL(blob);
        audioPlayer.src = url;
        audioPlayer.play();
    });

    // Osluškuj događaj 'ended' da bi znao kada da pauziraš
    socket.on('ended', () => {
        audioPlayer.pause();
    });
});

   
