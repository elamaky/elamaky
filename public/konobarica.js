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


// Funkcija za snimanje i slanje audio podataka
async function startAudioStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    const mediaRecorder = new MediaRecorder(stream);

    // Kada imamo audio podatke, šaljemo ih serveru
    mediaRecorder.ondataavailable = (event) => {
        socket.emit('audio-stream', event.data);
    };

    // Pokrećemo snimanje
    mediaRecorder.start(100); // Svakih 100ms

    // Kada primimo audio stream od drugih korisnika, prikazujemo ga
    socket.on('audio-stream', (data) => {
        const mixer = document.getElementById('mixer');
        const blob = new Blob([data], { type: 'audio/wav' });
        mixer.src = URL.createObjectURL(blob);
    });
}

// Ovaj kod poziva samo prvi klijent kada se poveže
startAudioStream();
socket.emit('audio-stream', audioData); // Samo korisnici sa pristupom šalju audio
