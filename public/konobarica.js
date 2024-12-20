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

//PALETA ZA BOJE  
let selectedColor = null;

// Kada klikneš na color picker
document.getElementById('colorPicker').addEventListener('input', function() {
  selectedColor = this.value; // Ažurira boju na selektovanu iz color pickera
});

// Kada klikneš na dugme "OK", boja se primenjuje na odabranog gosta
document.getElementById('applyColorBtn').addEventListener('click', function() {
  if (selectedColor) {
    // Pronađi gosta koji je odabrao boju (koristi socketId ili neki drugi način identifikacije)
    let guestId = getCurrentGuestId(); // Funkcija koja vrati ID trenutnog gosta
    
    if (guestId) {
      // Ažuriraj boju imena gosta
      let guest = document.querySelector(`.guest[data-socket-id="${guestId}"]`);
      if (guest) {
        guest.style.color = selectedColor; // Promeni boju gosta
      }

      // Emituj boju serveru (ako je potrebno da svi vide promene)
      socket.emit('colorSelected', selectedColor);
    }
  }
});

// Ova funkcija treba da se implementira na osnovu trenutnog gosta
function getCurrentGuestId() {
  // Pretpostavimo da postoji neki način da se identifikuje trenutni gost
  // Na primer, koristi se socketId ili nickname trenutnog gosta
  // Ovdje vraćaš ID trenutnog gosta koji je odabrao boju
  return "someGuestId"; // Primer ID-a
}


document.getElementById('colorPalette').style.position = 'absolute';
document.getElementById('colorPalette').style.top = '20px'; // Možeš prilagoditi visinu
document.getElementById('colorPalette').style.left = '50%'; // Centriranje horizontalno
document.getElementById('colorPalette').style.transform = 'translateX(-50%)'; // Da bude centrirano


