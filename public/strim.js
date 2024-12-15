const socket = io();

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
