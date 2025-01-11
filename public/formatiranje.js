let isBold = false;
let isItalic = false;
let currentColor = '';
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

// Funkcija za kreiranje DOM elementa za gosta
function createGuestElement(nickname) {
    const guestId = `guest-${nickname}`;
    const newGuest = document.createElement('div');
    newGuest.className = 'guest';
    newGuest.id = guestId;
    newGuest.textContent = nickname;

    // Postavljanje boje ako postoji u guestsData
    if (guestsData[guestId]) {
        newGuest.style.color = guestsData[guestId].color;
    } else {
        // Dodaj gosta u guestsData sa podrazumevanim vrednostima
        guestsData[guestId] = { nickname, color: '' };
    }

    return newGuest;
}

// Funkcija za dodavanje gosta u listu
function addGuestToList(nickname) {
    const guestList = document.getElementById('guestList');
    const newGuest = createGuestElement(nickname);
    guestList.appendChild(newGuest);
}

// Funkcija za uklanjanje gosta iz liste
function removeGuestFromList(nickname) {
    const guestId = `guest-${nickname}`;
    const guestElement = document.getElementById(guestId);
    if (guestElement) {
        guestElement.remove(); // Ukloni iz DOM-a
    }
    delete guestsData[guestId]; // Ukloni iz guestsData
}

// Kada nov gost dođe
socket.on('newGuest', function (nickname) {
    if (!guestsData[`guest-${nickname}`]) {
        addGuestToList(nickname);
    }
});

// Ažuriranje liste gostiju
socket.on('updateGuestList', function (users) {
    const guestList = document.getElementById('guestList');
    const currentGuests = Array.from(guestList.children).map(guest => guest.textContent);

    // Ukloni goste koji više nisu u listi
    currentGuests.forEach(nickname => {
        if (!users.includes(nickname)) {
            removeGuestFromList(nickname);
        }
    });

    // Dodaj nove goste
    users.forEach(nickname => {
        if (!guestsData[`guest-${nickname}`]) {
            addGuestToList(nickname);
                     }
    });
});
  currentGuestId = guestId;
// Dodaj listener za ažuriranje boje u realnom vremenu
const colorPicker = document.getElementById('colorPicker');
if (colorPicker) {
    colorPicker.addEventListener('input', function () {
        if (currentGuestId === guestId) {
            updateGuestColor(guestId, this.value);
         

        }
    });
}

function setGuestColor(guestId, color) {
    const guestElement = document.getElementById(guestId);
    if (guestElement) {
        guestElement.style.color = color;
        guestsData[guestId].color = color;
    }
}

function updateGuestColor(guestId, newColor) {
    setGuestColor(guestId, newColor);
    socket.emit('updateGuestColor', { guestId, newColor }); // Emituje sa "newColor"
}

socket.on('updateGuestColor', ({ guestId, newColor }) => {
    setGuestColor(guestId, newColor);
});
socket.on('currentGuests', (guests) => {
    console.log('Received guests:', guests);  // Proveri šta stiže
    if (Array.isArray(guests)) {
        guests.forEach(({ guestId, color }) => {
            setGuestColor(guestId, color);
        });
    } else {
        console.error('Expected an array, but got:', guests);
    }
});
