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

let selectedColor = null;

// Prikazivanje ili sakrivanje palete kada se klikne na dugme 'Color'
document.getElementById('colorBtn').addEventListener('click', function() {
  const colorPalette = document.getElementById('colorPalette');
  colorPalette.style.display = (colorPalette.style.display === 'none' || colorPalette.style.display === '') ? 'flex' : 'none';
});

// Kada klikneš na neku boju, postavlja se kao selektovana boja
const colorBoxes = document.querySelectorAll('.color-box');
colorBoxes.forEach(function(box) {
  box.addEventListener('click', function() {
    selectedColor = box.style.backgroundColor; // Postavi selektovanu boju
  });
});

// Kada klikneš na dugme "OK", boja se primenjuje na odabranog gosta
document.getElementById('applyColorBtn').addEventListener('click', function() {
  if (selectedColor) {
    let guestId = getCurrentGuestId(); // Funkcija koja vraća ID trenutnog gosta
    
    if (guestId) {
      let guest = document.querySelector(`.guest[data-socket-id="${guestId}"]`);
      if (guest) {
        guest.style.color = selectedColor; // Promeni boju gosta
      }

      socket.emit('colorSelected', selectedColor); // Emituj boju serveru (ako treba)
    }
  }

  // Sakrij paletu i dugme 'OK'
  document.getElementById('colorPalette').style.display = 'none';
  document.getElementById('applyColorBtn').style.display = 'none';
});

// Ova funkcija treba da se implementira na osnovu trenutnog gosta
function getCurrentGuestId() {
  // Pretpostavljamo da postoji neki način da se identifikuje trenutni gost
  return "someGuestId"; // Primer ID-a trenutnog gosta
}

// Ažuriranje boje imena gosta na osnovu servera
socket.on('updatenicknameColor', function(socketId, color) {
  let guest = document.querySelector(`.guest[data-socket-id="${socketId}"]`);
  if (guest) {
    guest.style.color = color;
  }
});

