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

// Globalne promenljive koje prate stanje stilova
let isUnderlineActive = false;
let isOverlineActive = false;

// Dodavanje event listener-a na dugmadi
document.getElementById("linijadoleBtn").addEventListener("click", toggleUnderline);
document.getElementById("linijagoreBtn").addEventListener("click", toggleOverline);

// Funkcija koja menja stanje za underline
function toggleUnderline() {
    isUnderlineActive = !isUnderlineActive;
    updateStyles();
}

// Funkcija koja menja stanje za overline
function toggleOverline() {
    isOverlineActive = !isOverlineActive;
    updateStyles();
}

// Funkcija koja ažurira stilove u chatInput i messageArea
function updateStyles() {
    const chatInput = document.getElementById("chatInput");
    
    // Ako je underline aktivan, primenjujemo stil na chatInput
    if (isUnderlineActive) {
        chatInput.style.textDecoration = 'underline';
    } else {
        chatInput.style.textDecoration = 'none';
    }
    
    // Ako je overline aktivan, primenjujemo stil na chatInput
    if (isOverlineActive) {
        chatInput.style.textDecoration = 'overline';
    } else {
        chatInput.style.textDecoration = 'none';
    }
}

// Funkcija za slanje poruke
function sendMessage() {
    const chatInput = document.getElementById("chatInput");
    const message = chatInput.value;
    
    // Dodavanje stila na poruku pre nego što je pošaljemo
    const styledMessage = applyStylesToMessage(message);
    
    // Dodavanje poruke u messageArea
    const messageArea = document.getElementById("messageArea");
    const newMessage = document.createElement('div');
    newMessage.innerHTML = styledMessage;  // Prikazujemo stilizovanu poruku koristeći innerHTML
    messageArea.appendChild(newMessage);
    
    // Resetovanje inputa
    chatInput.value = '';
}

// Funkcija koja primenjuje stilove na poruku pre slanja
function applyStylesToMessage(message) {
    // Ako je underline aktivan, dodajemo HTML tag <u> (podvlačenje)
    if (isUnderlineActive) {
        message = `<u>${message}</u>`;
    }
    
    // Ako je overline aktivan, dodajemo HTML tag <span> sa stilom za crtu na vrhu
    if (isOverlineActive) {
        message = `<span style="text-decoration: overline;">${message}</span>`;
    }
    
    return message;
}


