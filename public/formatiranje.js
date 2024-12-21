let isBold = false;
let isItalic = false;
let isUnderline = false;  
let isOverline = false;   
let guest = {};  
let currentColor;
let guestNickname;
let guestColors = {};
const guestList = document.getElementById('guestlist');

const newGuest = (nickname) => {
  const guestDiv = document.createElement('div');
  guestDiv.textContent = nickname;
  return guestDiv;
};

const addGuestStyles = (guestDiv, color) => {
  guestDiv.style.color = color;  // Dinamičko postavljanje boje
   guestDiv.style.textDecoration = isUnderline ? 'underline' : isOverline ? 'overline' : 'none';  // Underline/Overline
};

document.getElementById('boldBtn').addEventListener('click', function() {
    isBold = !isBold;
    updateInputStyle();
});

document.getElementById('italicBtn').addEventListener('click', function() {
    isItalic = !isItalic;
    updateInputStyle();
});

// Funkcija za biranje boje
document.getElementById('colorBtn').addEventListener('click', function() {
    document.getElementById('colorPicker').click();
});

document.getElementById('colorPicker').addEventListener('change', function() {
    currentColor = this.value;
    console.log('Izabrana boja:', currentColor);  // Log za izabranu boju
    updateInputStyle();
    changeColor(currentColor);  // Po izboru boje, šaljemo boju serveru
});

function changeColor(color) {
    console.log('Šaljem boju na server:', color);  // Log za slanje boje serveru
    // Dodajemo socket.id koji označava koji korisnik šalje boju
    socket.emit('colorChange', { color: color, socketId: socket.id }); 
}

socket.on('colorChange', (data) => {
    console.log('Primio boju od servera:', data);  // Log za primanje boje sa servera
    if (data.socketId === socket.id) {
        const nicknameDiv = document.getElementById('nickname'); // Pronađi element sa ID-om "nickname"
        if (nicknameDiv) {
            nicknameDiv.style.color = data.color; // Primenjujemo boju na nadimak
            console.log('Boja promenjena na:', data.color);  // Log za primenjenu boju
        }
    }
});

// Funkcija za UNDERLINE formatiranje
document.getElementById('linijadoleBtn').addEventListener('click', function() {
    isUnderline = !isUnderline;
    updateInputStyle();
});

// Funkcija za OVERLINE formatiranje
document.getElementById('linijagoreBtn').addEventListener('click', function() {
    isOverline = !isOverline;
    updateInputStyle();
});


// Primena stilova na polju za unos
function updateInputStyle() {
    let inputField = document.getElementById('chatInput');
    inputField.style.fontWeight = isBold ? 'bold' : 'normal';
    inputField.style.fontStyle = isItalic ? 'italic' : 'normal';
    inputField.style.color = currentColor;
    inputField.style.textDecoration = (isUnderline ? 'underline ' : '') + (isOverline ? 'overline' : '');
}


document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let message = this.value;

        // Ako je aktiviran privatni chat
        if (isPrivateChatEnabled && selectedGuest) {
            let time = new Date().toLocaleTimeString();
            // Emituj privatnu poruku na server
            socket.emit('private_message', {
                to: selectedGuest.textContent,  // Ime gosta kojem šalješ
                message: message,
                time: time
            });
        } else {
            // Emituj standardnu chat poruku
            socket.emit('chatMessage', {
                text: message,
                bold: isBold,
                italic: isItalic,
                color: currentColor,
                underline: isUnderline,
                overline: isOverline
            });
        }
        this.value = ''; // Isprazni polje za unos
    }
});



// Kada server pošalje poruku
socket.on('chatMessage', function(data) {
    let messageArea = document.getElementById('messageArea');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.color = data.color;
    newMessage.style.textDecoration = (data.underline ? 'underline ' : '') + (data.overline ? 'overline' : '');
    newMessage.innerHTML = `<strong>${data.nickname}:</strong> ${data.text} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    messageArea.prepend(newMessage);
    messageArea.scrollTop = 0; // Automatsko skrolovanje
});

// Kada server pošalje privatnu poruku
socket.on('private_message', function(data) {
    let messageArea = document.getElementById('messageArea');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');

    // Formatiranje privatne poruke
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.color = data.color;
    newMessage.style.textDecoration = (data.underline ? 'underline ' : '') + (data.overline ? 'overline' : '');
    
    newMessage.innerHTML = `<strong>${data.from} (Privatno):</strong> ${data.message} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    
    // Prikazuje privatnu poruku
    messageArea.prepend(newMessage);
    messageArea.scrollTop = 0; // Automatsko skrolovanje
});

// Kada nov gost dođe
socket.on('newGuest', function(nickname) {
    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    newGuest.textContent = nickname;

    // Dodaj novog gosta u guestsData ako ne postoji
    if (!guestList[guestId]) {
        guestList[guestId] = { nickname, color: '#FFFFFF' }; // Ako ne postoji, dodajemo ga sa podrazumevanom bojom
    }

    newGuest.style.color = guestList[guestId].color;
    
    // Dodaj stilove za gosta
    addGuestStyles(newGuest, guestId);
    
    guestList.appendChild(newGuest); // Dodaj novog gosta u listu
});

// Ažuriranje liste gostiju bez resetovanja stilova
socket.on('updateGuestList', function(users) {
    const guestList = document.getElementById('guestList');
    const currentGuests = Array.from(guestList.children).map(guest => guest.textContent);

    // Ukloni goste koji više nisu u listi
    currentGuests.forEach(nickname => {
        if (!users.includes(nickname)) {
            delete guest[`guest-${nickname}`]; // Ukloni iz objekta
            
            // Ukloni iz DOM-a
            const guestElement = Array.from(guestList.children).find(guest => guest.textContent === nickname);
            if (guestElement) {
                guestList.removeChild(guestElement);
            }
        }
    });

    // Dodaj nove goste
    users.forEach(nickname => {
        const guestId = `guest-${nickname}`;
        if (!guestList[guestId]) {
            const newGuest = document.createElement('div');
            newGuest.className = 'guest';
            newGuest.textContent = nickname;
            newGuest.style.color = '#FFFFFF'; // Podrazumevana boja ako nije postavljena
            
                      guestList[guestId] = { nickname, color: newGuest.style.color }; // Dodajemo boju
            addGuestStyles(newGuest, guestId); // Dodaj stilove
            guestList.appendChild(newGuest); // Dodaj novog gosta u listu
        }
    });
});  
