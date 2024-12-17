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

function toggleUnderline() {
    isUnderline = !isUnderline; 
    console.log("Underline stil:", isUnderline ? "UKLJUČEN" : "ISKLJUČEN");
}

function toggleOverline() {
    isOverline = !isOverline;
    console.log("Overline stil:", isOverline ? "UKLJUČEN" : "ISKLJUČEN");
}

function applyStylesToLastMessage() {
    console.log("Pokušavam da primenim stilove na poslednju poruku...");
    const messageArea = document.getElementById('messageArea');
    const messages = messageArea.children;
    if (messages.length === 0) {
        console.log("Nema poruka u messageArea.");
        return; 
    }

    const lastMessage = messages[messages.length - 1];
    let decorations = [];
    if (isUnderline) decorations.push('underline');
    if (isOverline) decorations.push('overline');

    lastMessage.style.textDecoration = decorations.join(' ');
    console.log("Primijenjeni stil:", decorations.join(' '));
}

// Dugmad za menjanje stilova
document.getElementById('linijadoleBtn').addEventListener('click', () => {
    console.log("Kliknuto na dugme DOLE (underline)");
    toggleUnderline();
});

document.getElementById('linijagoreBtn').addEventListener('click', () => {
    console.log("Kliknuto na dugme GORE (overline)");
    toggleOverline();
});

// Prati dodavanje novih poruka u messageArea
const observer = new MutationObserver(() => {
    console.log("Promena detektovana u messageArea. Dodajem stil...");
    applyStylesToLastMessage();
});
observer.observe(document.getElementById('messageArea'), { childList: true });

console.log("Kod je učitan i spreman.");
