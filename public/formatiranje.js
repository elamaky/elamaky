let isBold = false;
let isItalic = false;
let currentColor = '#FFFFFF';
let isUnderline = false;  // Dodano za underline
let isOverline = false;   // Dodano za overline

// Objekat za čuvanje podataka o gostima
const guestsData = {};

// Funkcija za BOLD formatiranje
document.getElementById('boldBtn').addEventListener('click', function() {
    isBold = !isBold;
    updateInputStyle();
});

// Funkcija za ITALIC formatiranje
document.getElementById('italicBtn').addEventListener('click', function() {
    isItalic = !isItalic;
    updateInputStyle();
});

// Funkcija za biranje boje
document.getElementById('colorBtn').addEventListener('click', function() {
    createColorPicker(); // Kreiraj color picker dinamički
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

// Kreiraj color picker i dodaj ga na DOM
function createColorPicker() {
    const existingColorPicker = document.querySelector('.dynamic-color-picker');
    if (existingColorPicker) return; // Ako već postoji, ne kreiraj ponovo

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.classList.add('dynamic-color-picker'); // Dodajemo klasu da bi smo pratili
    colorPicker.value = currentColor; // Postavi trenutnu boju
    colorPicker.addEventListener('input', function() {
        currentColor = this.value;
        updateInputStyle();
        updateGuestColors(); // Ažuriraj boje svih gostiju u chat porukama
    });

    document.body.appendChild(colorPicker); // Dodaj color picker u telo stranice
}

// Ažuriraj boje svih gostiju u listi
function updateGuestColors() {
    const guestList = document.getElementById('guestList');
    const guests = guestList.getElementsByClassName('guest');

    for (let guest of guests) {
        guest.style.color = currentColor; // Ova boja se primenjuje na ime gosta u listi
    }
}

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

// Funkcija za dodavanje stilova gostima
function addGuestStyles(guestElement, guestId) {
    guestElement.style.color = guestsData[guestId]?.color || '#FFFFFF'; // Boja gosta
}

// Kada nov gost dođe
socket.on('newGuest', function(nickname) {
    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    newGuest.textContent = nickname;

    // Dodaj novog gosta u guestsData ako ne postoji
    if (!guestsData[guestId]) {
        guestsData[guestId] = { nickname, color: '#FFFFFF' }; // Ako ne postoji, dodajemo ga sa podrazumevanom bojom
    }

    newGuest.style.color = guestsData[guestId].color;
    
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
            delete guestsData[`guest-${nickname}`]; // Ukloni iz objekta
            
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
        if (!guestsData[guestId]) {
            const newGuest = document.createElement('div');
            newGuest.className = 'guest';
            newGuest.textContent = nickname;
            newGuest.style.color = '#FFFFFF'; // Podrazumevana boja ako nije postavljena
            
            guestsData[guestId] = { nickname, color: newGuest.style.color }; // Dodajemo boju
            addGuestStyles(newGuest, guestId); // Dodaj stilove
            guestList.appendChild(newGuest); // Dodaj novog gosta u listu
        }
    });
});
