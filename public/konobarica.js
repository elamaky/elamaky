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
const konobaricaItem = document.createElement('div');
konobaricaItem.classList.add('guest-konobarica');
konobaricaItem.innerHTML = 'Konobarica'; // Dodajemo samo tekst bez tagova
guestList.appendChild(konobaricaItem);


// GOSTI MODAL
var modal = document.getElementById("gostimodal");
var btn = document.getElementById("GBtn");
var span = document.getElementsByClassName("close")[0];
var draggable = document.getElementById("draggable");

// Otvori modal kada klikneš na dugme GBtn
btn.onclick = function() {
    modal.style.display = "block";
}

// Zatvori modal kada klikneš na X
span.onclick = function() {
    modal.style.display = "none";
}

// Zatvori modal klikom izvan njega
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Funkcija za uvećanje fonta
function increaseFontSize() {
    var messageArea = document.getElementById("messageArea");
    var currentSize = window.getComputedStyle(messageArea, null).getPropertyValue('font-size');
    var newSize = parseInt(currentSize) + 2; // Povećaj veličinu fonta za 2px
    messageArea.style.fontSize = newSize + "px";
}

// Funkcija za smanjenje fonta
function decreaseFontSize() {
    var messageArea = document.getElementById("messageArea");
    var currentSize = window.getComputedStyle(messageArea, null).getPropertyValue('font-size');
    var newSize = parseInt(currentSize) - 2; // Smanji veličinu fonta za 2px
    messageArea.style.fontSize = newSize + "px";
} 

//   MIXER SCRIPT IZ MIXER HTML DODAT OVDE
const mixerButton = document.getElementById('pesme');
const mixer = document.getElementById('mixer');
        const audioPlayer = document.getElementById('audioPlayer');
        const songList = document.getElementById('songList');
        const fileInput = document.getElementById('fileInput');
        const deleteSelectedButton = document.getElementById('deleteSelected');
        const playSelectedButton = document.getElementById('playSelected');
        const hideButton = document.getElementById('hideButton');
        const closeButton = document.getElementById('closeButton');
        let songs = [];
        let currentSongIndex = 0;

mixerButton.addEventListener('click', function() {
    // Ako je mixer skriven, prikaži ga, inače sakrij
    if (mixer.style.display === 'none' || mixer.style.display === '') {
        mixer.style.display = 'block';  // Prikazuje mixer
    } else {
        mixer.style.display = 'none';   // Sakriva mixer
    }
});


        let isDragging = false;
let offsetX, offsetY;

mixer.addEventListener('mousedown', (e) => {
    if (e.target === mixer || e.target.tagName === 'H2') {
        isDragging = true;
        offsetX = e.clientX - mixer.offsetLeft;
        offsetY = e.clientY - mixer.offsetTop;
        e.stopPropagation();  // Sprečava širenje događaja na druge elemente
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        mixer.style.left = `${e.clientX - offsetX}px`;
        mixer.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

        fileInput.addEventListener('change', (event) => {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const url = URL.createObjectURL(files[i]);
                addSong(url, files[i].name);
            }
            fileInput.value = '';
        });

function uploadSong(file) {
    const formData = new FormData();
    formData.append('song', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.url) {
                socket.emit('startStream', data.url);
            }
        })
        .catch(err => console.error('Greška pri uploadu pesme:', err));
}

function addSong(file, name) {
    songs.push({ url: file.name, name });
    const li = document.createElement('li');
    li.textContent = name;

    uploadSong(file);

    li.setAttribute('draggable', 'true');
    li.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey) {
            li.classList.toggle('selected');
        } else {
            const selectedSongs = document.querySelectorAll('.selected');
            selectedSongs.forEach(song => song.classList.remove('selected'));
            li.classList.add('selected');
        }
    });

    songList.appendChild(li);

    deleteSelectedButton.addEventListener('click', () => {
        const selectedSongs = document.querySelectorAll('.selected');
        selectedSongs.forEach(songElement => {
            const index = Array.from(songList.children).indexOf(songElement);
            if (index > -1) {
                songs.splice(index, 1);
                songList.removeChild(songElement);
            }
        });
    });

    playSelectedButton.addEventListener('click', () => {
        const selectedSongs = document.querySelectorAll('.selected');
        if (selectedSongs.length === 1) {
            const index = Array.from(songList.children).indexOf(selectedSongs[0]);
            if (index > -1) {
                playSong(index);
            }
        }
    });
}

function playSong(index) {
    if (index >= 0 && index < songs.length) {
        currentSongIndex = index;
        audioPlayer.src = songs[index].url;
        audioPlayer.style.display = 'block';
        audioPlayer.play();
    }

    audioPlayer.addEventListener('ended', () => {
        songs.splice(currentSongIndex, 1);
        songList.removeChild(songList.children[currentSongIndex]);

        if (currentSongIndex < songs.length) {
            playSong(currentSongIndex);
        } else {
            currentSongIndex = 0;
        }
    });
}

songList.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.add('dragging');
    }
});

songList.addEventListener('dragend', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.remove('dragging');
        updateSongsOrder();
    }
});

songList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...songList.children].filter(item => item !== draggingItem);
    const nextSibling = siblings.find(sibling => {
        const rect = sibling.getBoundingClientRect();
        return e.clientY < rect.top + rect.height / 2;
    });
    songList.insertBefore(draggingItem, nextSibling);
});

function updateSongsOrder() {
    const updatedOrder = [];
    const listItems = [...songList.children];

    listItems.forEach((item) => {
        const songName = item.textContent.trim();
        const song = songs.find((s) => s.name === songName);
        if (song) {
            updatedOrder.push(song);
        }
    });

    songs = updatedOrder;
}

function startStreaming(currentSongUrl) {
    socket.emit('startStream', currentSongUrl);
}

audioPlayer.addEventListener('play', () => {
    const currentSong = songs[currentSongIndex];
    if (currentSong) {
        startStreaming(currentSong.url);
    }
});

socket.on('playStream', (url) => {
    if (url) {
        audioPlayer.src = url;
        audioPlayer.play().catch(error => console.error('Greška pri puštanju pesme:', error));
    } else {
        console.error('Nema URL-a za pesmu');
    }
});
