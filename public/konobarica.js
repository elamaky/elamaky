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
const guestList = document.getElementById('guestList');
const konobaricaItem = document.createElement('div');
konobaricaItem.classList.add('guest-konobarica');
konobaricaItem.innerHTML = 'Konobarica'; // Dodajemo samo tekst bez tagova
guestList.appendChild(konobaricaItem);

//  ZA MIXER DODATAK
// Open modal on button click
document.getElementById("mixer").onclick = function() {
  document.getElementById("mixerModal").style.display = "block";
}

// Close modal if clicked outside of it
window.onclick = function(event) {
  if (event.target == document.getElementById("mixerModal")) {
    document.getElementById("mixerModal").style.display = "none";
  }
}

// Make modal content draggable
let modalContent = document.getElementById("modalContent");

modalContent.onmousedown = function(e) {
  let offsetX = e.clientX - modalContent.getBoundingClientRect().left;
  let offsetY = e.clientY - modalContent.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    modalContent.style.left = pageX - offsetX + 'px';
    modalContent.style.top = pageY - offsetY + 'px';
  }

  moveAt(e.pageX, e.pageY);

  function onMouseMove(e) {
    moveAt(e.pageX, e.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);

  modalContent.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    modalContent.onmouseup = null;
  };
};

modalContent.ondragstart = function() {
  return false; // Prevent default dragging behavior
};


