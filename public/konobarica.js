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

//  ZA MIXER DODATAK
// Open modal on button click
document.getElementById("mixer").onclick = function() {
  document.getElementById("mixerModal").style.display = "block";
}

// Close modal when clicking the close button
document.getElementById("kosModal").addEventListener("click", function() {
  document.getElementById("mixerModal").style.display = "none";
});


// GOSTI MODAL 
var modal = document.getElementById("gostimodal");
var btn = document.getElementById("GBtn");
var span = document.getElementsByClassName("close")[0];

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

let isUnderline = false;
let isOverline = false;

// Funkcija za primenu underline stila
function toggleUnderline() {
    isUnderline = !isUnderline; // Prebaci stanje
    updateMessageStyles(); // Ažuriraj stilove
}

// Funkcija za primenu overline stila
function toggleOverline() {
    isOverline = !isOverline; // Prebaci stanje
    updateMessageStyles(); // Ažuriraj stilove
}

// Funkcija koja primenjuje stilove na chat input i message area
function updateMessageStyles() {
    const chatInput = document.getElementById('chatInput');
    const messageArea = document.getElementById('messageArea');
    
    // Ažuriraj chat input
    if (isUnderline) {
        chatInput.style.textDecoration = 'underline';
    } else if (isOverline) {
        chatInput.style.textDecoration = 'overline';
    } else {
        chatInput.style.textDecoration = 'none';
    }

    // Ažuriraj message area (ako želimo da poruke budu u istom stilu)
    const messages = messageArea.querySelectorAll('.message');
    messages.forEach(message => {
        if (isUnderline) {
            message.style.textDecoration = 'underline';
        } else if (isOverline) {
            message.style.textDecoration = 'overline';
        } else {
            message.style.textDecoration = 'none';
        }
    });
}

// Funkcija koja se poziva pri slanju poruke
function applyStylesToMessage(message) {
    let styledMessage = message;
    
    if (isUnderline) {
        styledMessage = `<u>${styledMessage}</u>`;
    }
    if (isOverline) {
        styledMessage = `<span style="text-decoration: overline;">${styledMessage}</span>`;
    }

    return styledMessage;
}

// Funkcija za dodavanje poruke u message area
function addMessageToArea(message) {
    const messageArea = document.getElementById('messageArea');
    const styledMessage = applyStylesToMessage(message);
    
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.innerHTML = styledMessage;
    
    messageArea.appendChild(newMessage);
}

// Event listener za dugme DOLE i GORE
document.getElementById("linijadoleBtn").addEventListener("click", toggleUnderline);
document.getElementById("linijagoreBtn").addEventListener("click", toggleOverline);

// Primer kako možete poslati poruku (npr. kada korisnik klikne na dugme za slanje)
document.getElementById('sendMessageButton').addEventListener('click', function() {
    const messageInput = document.getElementById('chatInput');
    const message = messageInput.value;
    addMessageToArea(message); // Dodajte poruku u message area
    messageInput.value = ''; // Očistite input polje nakon slanja
});
