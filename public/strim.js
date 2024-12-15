 const mixer = document.getElementById("mixer");
 const audioPlayer = document.getElementById('audioPlayer');
 const songList = document.getElementById('songList');
 const fileInput = document.getElementById('fileInput');
 const deleteSelectedButton = document.getElementById('deleteSelected');
 const playSelectedButton = document.getElementById('playSelected');
 const hideButton = document.getElementById('hideButton');
 const closeButton = document.getElementById('closeButton');
 let songs = [];
 let currentSongIndex = 0;

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
// Open modal on button click
document.getElementById("mixer").onclick = function() {
  document.getElementById("mixerModal").style.display = "block";
}

// Close modal when clicking the close button
document.getElementById("kosModal").addEventListener("click", function() {
  document.getElementById("mixerModal").style.display = "none";
});

  // ZA STRIMOVANJE
document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.querySelector('iframe'); // Selektuj iframe
    const audioPlayer = iframe.contentWindow.document.getElementById('audioPlayer'); // Pristupi audioPlayer-u unutar iframe-a

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
