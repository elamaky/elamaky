let isBold = false;
let isItalic = false;
let currentColor = '#FFFFFF';
let newColor;
let isUnderline = false;
let isOverline = false;
const guestsData = {};
const colorPrefs = {};

document.getElementById('boldBtn').addEventListener('click', function() {
    isBold = !isBold;
    updateInputStyle();
});

document.getElementById('italicBtn').addEventListener('click', function() {
    isItalic = !isItalic;
    updateInputStyle();
});

document.getElementById('linijadoleBtn').addEventListener('click', function() {
    isUnderline = !isUnderline;
    updateInputStyle();
});

document.getElementById('linijagoreBtn').addEventListener('click', function() {
    isOverline = !isOverline;
    updateInputStyle();
});

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
        socket.emit('chatMessage', {
            text: message,
            bold: isBold,
            italic: isItalic,
            color: currentColor,
            underline: isUnderline,
            overline: isOverline,
      });
        this.value = '';
    }
});

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
    messageArea.scrollTop = 0;
});

socket.on('private_message', function(data) {
    let messageArea = document.getElementById('messageArea');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.color = data.color;
    newMessage.style.textDecoration = (data.underline ? 'underline ' : '') + (data.overline ? 'overline' : '');
    newMessage.innerHTML = `<strong>${data.from} (Privatno):</strong> ${data.message} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    messageArea.prepend(newMessage);
    messageArea.scrollTop = 0;
});

function addGuestStyles(guestElement, guestId) {
    const colorPickerButton = document.createElement('input');
    colorPickerButton.type = 'color';
    colorPickerButton.classList.add('colorPicker');
    colorPickerButton.value = guestsData[guestId]?.color || '#FFFFFF';

    colorPickerButton.addEventListener('input', function () {
        guestElement.style.color = this.value;
        guestsData[guestId].color = this.value;
        
    });
colorPickerButton.style.display = 'none';
    guestElement.appendChild(colorPickerButton);
}
socket.on('newGuest', function(nickname) {
    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    newGuest.textContent = nickname;

    if (!guestsData[guestId]) {
        guestsData[guestId] = { nickname, color: '#FFFFFF' };
    }

    newGuest.style.color = guestsData[guestId].color;
    addGuestStyles(newGuest, guestId);
    guestList.appendChild(newGuest);
});

socket.on('updateGuestList', function(users) {
    const guestList = document.getElementById('guestList');
    const currentGuests = Array.from(guestList.children).map(guest => guest.textContent);

    currentGuests.forEach(nickname => {
        if (!users.includes(nickname)) {
            delete guestsData[`guest-${nickname}`];
            const guestElement = Array.from(guestList.children).find(guest => guest.textContent === nickname);
            if (guestElement) {
                guestList.removeChild(guestElement);
            }
        }
    });

// Prati dodavanje novih gostiju
function addNewGuests(users) {
    users.forEach(nickname => {
        const guestId = `guest-${nickname}`;
        if (!guestsData[guestId]) {
            const newGuest = document.createElement('div');
            newGuest.className = 'guest';
            newGuest.id = guestId; // Postavljanje ID-a za svakog gosta
            newGuest.textContent = nickname;
            newGuest.style.color = '#FFFFFF'; // Podrazumevana boja ako nije postavljena

            guestsData[guestId] = { nickname, color: newGuest.style.color }; // Dodaj podatke o gostu
            guestList.appendChild(newGuest); // Dodaj novog gosta u listu

            // Inicijalizuj boju za novog gosta
            initializeColorPicker(guestId); // Pozivanje funkcije za inicijalizaciju
        }
    });
}

// Funkcija za inicijalizaciju palete boja za svakog gosta
function initializeColorPicker(guestId) {
    const colorPicker = document.getElementById('colorPicker');
    const applyColorBtn = document.getElementById('applyColorBtn');
    const guestElement = document.getElementById(guestId); // Uzimanje odgovarajućeg gosta

    let currentColor = '#FFFFFF'; // Podrazumevana boja

    // Prati promene na paleti boja
    colorPicker.addEventListener('input', function() {
        currentColor = this.value;
        updateInputStyle(guestId, currentColor); // Ažuriraj boju za ovog gosta
    });

    // Ažuriraj stilove za boje
    function updateInputStyle(guestId, color) {
        const chatInput = document.getElementById('chatInput'); // Prilagodi ID
        chatInput.style.backgroundColor = color; // Postavljanje boje pozadine na chat input
        guestElement.style.color = color; // Postavljanje boje teksta za gosta
        guestsData[guestId].color = color; // Čuvanje boje u guestsData
    }

    // Kada klikneš na "OK" dugme, boja se primenjuje na elemente
    applyColorBtn.addEventListener('click', () => {
        guestElement.style.color = currentColor; // Primeni boju teksta
        guestsData[guestId].color = currentColor; // Spremi boju u objekat gosta
        updateGuestColor(guestId, currentColor); // Ažuriraj boju na serveru
    });
}

// Funkcija za postavljanje boje gosta
function setGuestColor(guestId, color) {
    const guestElement = document.getElementById(guestId);
    if (guestElement) {
        guestElement.style.color = color; // Postavi boju teksta
        guestsData[guestId].color = color; // Ažuriraj podatke o boji gosta
    }
}

// Funkcija za ažuriranje boje gosta i emitovanje na server
function updateGuestColor(guestId, newColor) {
    setGuestColor(guestId, newColor);
    socket.emit('updateGuestColor', { guestId, newColor }); // Emitovanje promene boje na server
}

// Osluškuje promenu boje sa servera
socket.on('updateGuestColor', ({ guestId, newColor }) => {
    console.log('Color update broadcasted:', guestId, newColor);
    setGuestColor(guestId, newColor); // Ažuriraj boju na svim klijentima
});
