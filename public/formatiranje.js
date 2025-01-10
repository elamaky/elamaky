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

document.getElementById('colorBtn').addEventListener('click', function() {
    document.getElementById('colorPicker').click();
});

document.getElementById('colorPicker').addEventListener('input', function() {
    currentColor = this.value;
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
            nickname: nickname,
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

// Globalno definiši color picker jednom
const colorPicker = document.getElementById('colorPicker');
if (colorPicker) {
    // Dodaj listener za ažuriranje boje
    colorPicker.addEventListener('input', function () {
        if (currentGuestId) {
            updateGuestColor(currentGuestId, this.value);
            socket.emit('updateGuestColor', { guestId: currentGuestId, newColor: this.value });
        }
    });
}

// Funkcija za ažuriranje boje gosta
function updateGuestColor(guestId, newColor) {
    const guestElement = document.querySelector(`#guestList .guest[data-id="${guestId}"]`);
    if (guestElement) {
        guestElement.style.color = newColor; // Ažuriraj boju na ekranu
        guestsData[guestId].color = newColor; // Ažuriraj podatke gosta
    }
}

// Kada nov gost dođe
socket.on('newGuest', function (nickname) {
    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    newGuest.setAttribute('data-id', guestId); // Dodaj jedinstveni ID za element
    newGuest.textContent = nickname;

    // Dodaj novog gosta u guestsData ako ne postoji
    if (!guestsData[guestId]) {
        guestsData[guestId] = { nickname, color: '#FFFFFF' }; // Ako ne postoji, dodajemo ga sa podrazumevanom bojom
    }

    newGuest.style.color = guestsData[guestId].color;

    // Dodaj event listener za odabir trenutnog gosta
    newGuest.addEventListener('click', function () {
        currentGuestId = guestId; // Postavi trenutnog gosta
        if (colorPicker) {
            colorPicker.value = guestsData[guestId].color || '#FFFFFF'; // Postavi boju u picker
        }
    });

    guestList.appendChild(newGuest); // Dodaj novog gosta u listu
});

// Ažuriranje liste gostiju bez resetovanja stilova
socket.on('updateGuestList', function (users) {
    const guestList = document.getElementById('guestList');
    const currentGuests = Array.from(guestList.children).map(guest => guest.textContent);

    // Ukloni goste koji više nisu u listi
    currentGuests.forEach(nickname => {
        if (!users.includes(nickname)) {
            const guestId = `guest-${nickname}`;
            delete guestsData[guestId]; // Ukloni iz objekta

            // Ukloni iz DOM-a
            const guestElement = document.querySelector(`#guestList .guest[data-id="${guestId}"]`);
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
            newGuest.setAttribute('data-id', guestId); // Dodaj jedinstveni ID
            newGuest.textContent = nickname;
            newGuest.style.color = '#FFFFFF'; // Podrazumevana boja ako nije postavljena

            guestsData[guestId] = { nickname, color: newGuest.style.color }; // Dodajemo boju

            // Dodaj event listener za odabir trenutnog gosta
            newGuest.addEventListener('click', function () {
                currentGuestId = guestId;
                if (colorPicker) {
                    colorPicker.value = guestsData[guestId].color || '#FFFFFF';
                }
            });

            guestList.appendChild(newGuest); // Dodaj novog gosta u listu
        }
    });
});

// Sinhronizacija boje sa servera
socket.on('updateGuestColor', function ({ guestId, newColor }) {
    updateGuestColor(guestId, newColor);
});

