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

const basicColors = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', 
  '#000000', '#FFFFFF', '#C0C0C0', '#808080', '#800000', '#808000',
  '#008000', '#800080', '#008080', '#000080'
];

const colorSection1 = document.getElementById('colorSection1');

// Dinamičko dodavanje 16 osnovnih boja u prvi deo palete
basicColors.forEach(color => {
  const colorBox = document.createElement('div');
  colorBox.classList.add('color-box');
  colorBox.style.backgroundColor = color;
  colorBox.addEventListener('click', function() {
    selectedColor = color; // Postavljanje boje pri kliku
  });
  colorSection1.appendChild(colorBox);
});

let selectedColor = null;

// Kada klikneš na color picker
document.getElementById('colorPicker').addEventListener('input', function() {
  selectedColor = this.value; // Ažurira boju na selektovanu iz color pickera
});

// Kada klikneš na dugme "OK", boja se primenjuje
document.getElementById('applyColorBtn').addEventListener('click', function() {
  if (selectedColor) {
    // Primenjuje boju na telo stranice (ili na specifičan element)
    document.body.style.backgroundColor = selectedColor;
  }
});

