let isLoggedIn = false; // Status autentifikacije

document.getElementById('openModal').addEventListener('click', function () {
    if (!isLoggedIn) {
        const password = prompt("Unesite lozinku:");

        // Ako unesena lozinka odgovara, otvara modal
        if (password === "123galaksija") {
            isLoggedIn = true; // Postavljamo status na login
            document.getElementById('functionModal').style.display = "block";
        } else {
            alert("Nemate dozvolu da otvorite ovaj panel.");
        }
    } else {
        // Ako je već prijavljen, samo otvara modal
        document.getElementById('functionModal').style.display = "block";
    }
});

// Zatvaranje modala
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('functionModal').style.display = "none";
});


// Brisanje sadržaja chata
document.getElementById('clearChat').addEventListener('click', function() {
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata
    console.log("Chat je obrisan.");

    // Emituj događaj serveru za brisanje chata
    socket.emit('clear-chat'); 
});

// Slušanje na 'chat-cleared' događaj
socket.on('chat-cleared', function() {
    console.log('Chat je obrisan sa servera.');
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata
});
//ICECAST SERVER
function playStream() {
            var audioPlayer = document.getElementById('audioPlayer');
            var playButton = document.getElementById('playButton');
            
            if (audioPlayer.paused) {
                audioPlayer.style.display = 'block';
                audioPlayer.play();
                playButton.textContent = 'Stop Stream';
            } else {
                audioPlayer.pause();
                audioPlayer.style.display = 'none';
                playButton.textContent = 'Start Stream';
            }
        }
//  ZENO PLAYER NA DUGME  
document.getElementById('sound').onclick = function() {
            var iframe = document.getElementById('radioIframe');
            // Kreiraj novi audio element
            var audio = new Audio(iframe.src + '?autoplay=true&muted=true');
            
            if (audio.paused) {
                // Pokreni strim
                audio.play();
                // Promeni tekst dugmeta
                this.textContent = 'Pause';
            } else {
                // Pauziraj strim
                audio.pause();
                // Promeni tekst dugmeta
                this.textContent = 'Play';
            }
        };
