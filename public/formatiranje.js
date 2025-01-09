let isBold = false;
let isItalic = false;
let currentColor = '#FFFFFF';
let newColor;
let isUnderline = false;
let isOverline = false;
const guestsData = {};

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

const guestsData = {};
const guestList = document.getElementById('guestList');
let currentGuestId = null;

// Funkcija za dodavanje gosta u listu
function addGuestToList(nickname) {
    const guestId = `guest-${nickname}`;

    // Proveri da li gost već postoji u `guestsData`
    if (!guestsData[guestId]) {
        const newGuest = document.createElement('div');
        newGuest.className = 'guest';
        newGuest.id = guestId; // Setuj ID za gosta
        newGuest.textContent = nickname;
        newGuest.style.color = '#FFFFFF'; // Podrazumevana boja

        // Dodaj u lokalni `guestsData`
        guestsData[guestId] = { nickname, color: newGuest.style.color };

        // Dodaj gosta u DOM
        guestList.appendChild(newGuest);

        // Postavi trenutnog gosta za bojenje
        currentGuestId = guestId;

        // Dodaj listener za bojenje
        const colorPicker = document.getElementById('colorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('input', function updateColor() {
                if (currentGuestId === guestId) {
                    updateGuestColor(guestId, this.value);
                }
            });
        }
    }
}

// Funkcija za uklanjanje gosta iz liste
function removeGuestFromList(nickname) {
    const guestId = `guest-${nickname}`;
    delete guestsData[guestId];
    const guestElement = document.getElementById(guestId);
    if (guestElement) {
        guestList.removeChild(guestElement);
    }
}

// Socket događaji
socket.on('newGuest', function (nickname) {
    // Dodavanje novog gosta
    addGuestToList(nickname);
});

socket.on('updateGuestList', function (users) {
    // Sinhronizacija liste gostiju
    const currentGuests = Array.from(guestList.children).map(guest => guest.textContent);

    // Ukloni goste koji više nisu na serveru
    currentGuests.forEach(nickname => {
        if (!users.includes(nickname)) {
            removeGuestFromList(nickname);
        }
    });

    // Dodaj nove goste
    users.forEach(nickname => addGuestToList(nickname));
});

// Funkcija za ažuriranje boje gosta
function updateGuestColor(guestId, color) {
    if (guestsData[guestId]) {
        guestsData[guestId].color = color;
        const guestElement = document.getElementById(guestId);
        if (guestElement) {
            guestElement.style.color = color;
        }
    }
}
