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

//GLAVNI MODAL DRAGOBILE
const button = document.getElementById('openModal');

let isDragging = false;
let offsetX, offsetY;

// Kada počneš da prevlačiš
button.addEventListener('mousedown', (e) => {
  isDragging = true;

  // Računaj razliku između pozicije kursora i početne pozicije dugmeta
  offsetX = e.clientX - button.offsetLeft;
  offsetY = e.clientY - button.offsetTop;

  button.style.cursor = 'grabbing'; // Promeni kursor dok se dugme prevlači

  // Dodaj događaj za pomeranje
  document.addEventListener('mousemove', moveButton);
  document.addEventListener('mouseup', stopDragging);
});

// Funkcija koja pomera dugme
function moveButton(e) {
  if (isDragging) {
    // Postavi novu poziciju dugmeta na osnovu pozicije kursora
    button.style.left = `${e.clientX - offsetX}px`;
    button.style.top = `${e.clientY - offsetY}px`;
  }
}

// Kada prestaneš sa prevlačenjem
function stopDragging() {
  isDragging = false;
  button.style.cursor = 'grab'; // Vrati kursor na originalnu poziciju
  document.removeEventListener('mousemove', moveButton);
  document.removeEventListener('mouseup', stopDragging);
}
