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

        function addSong(url, name) {
            songs.push({ url, name });
            const li = document.createElement('li');
            li.textContent = name;
            // Emitovanje URL-a pesme kad je pesma dodata u mixer
socket.emit('streamSong', url); // url je putanja do pesme


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

            songList.appendChild(li); // Dodajemo pesmu u listu
        }

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

        function playSong(index) {
            if (index >= 0 && index < songs.length) {
                currentSongIndex = index;
                audioPlayer.src = songs[index].url;
                audioPlayer.style.display = 'block';
                audioPlayer.play();
                // Emitovanje URL-a pesme kada se pesma pusti
socket.emit('streamSong', songs[index].url);

            }
        }

     audioPlayer.addEventListener('ended', () => {
    // Izbriši trenutnu pesmu
    songs.splice(currentSongIndex, 1);
    songList.removeChild(songList.children[currentSongIndex]);

    // Igraj sledeću pesmu
    if (currentSongIndex < songs.length) {
        playSong(currentSongIndex); // Igraj pesmu sa trenutnim indeksom
    } else {
        currentSongIndex = 0; // Resetuj na početak ako su sve pesme odsvirane
    }
});

songList.addEventListener('dragstart', (e) => {
    e.target.classList.add('dragging');
});

songList.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
});

songList.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.add('dragging');
    }
});

songList.addEventListener('dragend', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.remove('dragging');
        updateSongsOrder(); // Ažuriraj niz pesama nakon prevlačenja
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
        const songName = item.textContent.trim(); // Uzmi ime pesme iz <li>
        const song = songs.find((s) => s.name === songName); // Pronađi pesmu po imenu
        if (song) {
            updatedOrder.push(song); // Dodaj pesmu u novi redosled
        }
    });

    songs = updatedOrder; // Ažuriraj globalni niz pesama
}

audioPlayer.addEventListener('play', () => {
    console.log('Pesma se pušta.');
    const currentSong = songs[currentSongIndex]; 

  let socket = io({
    transports: ['websocket'], // Koristi samo WebSocket protokol
    upgrade: false // Onemogući fallback na HTTP
});

      socket.on('connect', () => {
        console.log('Povezan na server preko socket.io');

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                let audioChunks = [];

                // Prikupljanje audio podataka
                mediaRecorder.addEventListener("dataavailable", (event) => {
                    audioChunks.push(event.data);
                });

                // Kada snimanje završi, kreiranje Blob i slanje na server
                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/ogg' });
                    audioChunks = []; // Resetovanje za sledeći segment

                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(audioBlob);

                    fileReader.onloadend = () => {
                        const base64String = fileReader.result;
                        console.log('Šaljem audio stream serveru...');
                        socket.emit("audioStream", base64String);
                    };
                });

                // Start snimanja
                mediaRecorder.start();
                setTimeout(() => {
                    mediaRecorder.stop(); // Zaustavi snimanje nakon 1 sekunde
                }, 1000);
            })
            .catch((error) => {
                console.error('Greška prilikom pristupa mikrofonu:', error);
            });
    });

    // Prijem audio stream-a od servera
    socket.on('audioStream', (audioData) => {
        console.log('Primljen audio stream od servera.');

        // Priprema audio podataka za reprodukciju
        const newData = audioData.replace('data:audio/wav;', 'data:audio/ogg;');
        const audio = new Audio(newData);

        if (audio && !document.hidden) {
            audio.play();
        } else {
            console.warn('Audio nije reprodukovan jer je tab sakriven.');
        }
    });
});

