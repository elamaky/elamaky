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

document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audioPlayer');
    const socket = io(); // Priključivanje na socket server

    // Proveri da li je audioPlayer pronađen
    if (!audioPlayer) {
        console.error('audioPlayer nije pronađen!');
        return;
    }

    // Emituje audio podatke kada pesma počne da se pušta
    audioPlayer.addEventListener('play', () => {
        const currentSong = songs[currentSongIndex]; // Podesi trenutno igranu pesmu
        if (currentSong) {
            fetch(currentSong.url) // Uzimamo URL pesme koju puštamo
                .then(response => response.arrayBuffer()) // Uzimamo binarni sadržaj pesme
                .then(buffer => {
                    // Emitujemo podatke sa audio fajla
                    socket.emit('stream', {
                        buffer: buffer,   // Pošaljemo audio podatke
                        name: currentSong.name, // Pošaljemo ime pesme
                    });
                })
                .catch(err => console.error('Greška pri čitanju audio fajla:', err));
        }
    });

    // Početno pokretanje pesme čim korisnik uđe na stranicu
    if (songs.length > 0) {
        playSong(0); // Automatski pustimo prvu pesmu
    }

    // Funkcija za pokretanje pesme na osnovu indeksa
    function playSong(index) {
        if (index >= 0 && index < songs.length) {
            currentSongIndex = index;
            audioPlayer.src = songs[index].url; // Postavljamo URL pesme
            audioPlayer.play(); // Pokrećemo reprodukciju pesme
        }
    }

});

