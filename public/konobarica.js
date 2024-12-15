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

let songs = [];

// Kada korisnik izabere muziku
document.getElementById('fileInput').addEventListener('change', (event) => {
    const files = event.target.files;
    for (const file of files) {
        if (file.type.startsWith('audio/')) {
            songs.push(file);

            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            listItem.dataset.index = songs.length - 1;

            listItem.addEventListener('click', () => {
                listItem.classList.toggle('selected');
            });

            document.getElementById('songList').appendChild(listItem);
        }
    }
});

// Osluškanje za dugme "Play"
document.getElementById('playSelected').addEventListener('click', () => {
    const selectedSongItem = document.getElementById('songList').querySelector('li.selected');
    if (selectedSongItem) {
        const index = selectedSongItem.dataset.index;
        const selectedSong = songs[index];
        const url = URL.createObjectURL(selectedSong);
        document.getElementById('audioPlayer').src = url;
        document.getElementById('audioPlayer').play();
    }
});

// Osluškanje za dugme "Obriši"
document.getElementById('deleteSelected').addEventListener('click', () => {
    const selectedSongItem = document.getElementById('songList').querySelector('li.selected');
    if (selectedSongItem) {
        const indexToDelete = selectedSongItem.dataset.index;
        songs.splice(indexToDelete, 1);
        selectedSongItem.remove();

        const allItems = document.getElementById('songList').querySelectorAll('li');
        allItems.forEach((item, index) => {
            item.dataset.index = index;
        });
    }
});
   
