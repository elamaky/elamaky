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

// Kada nov gost dođe
socket.on('newGuest', function (nickname) {
    if (typeof nickname !== 'string') {
        console.error('Invalid nickname:', nickname);
        return; // Osiguravamo da je nickname validan string
    }

    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');

    // Proveri da li gost već postoji
    if (document.getElementById(guestId)) {
        console.warn(`Guest ${nickname} is already in the list.`);
        return;
    }

    // Kreiraj DOM element za novog gosta
    const newGuest = document.createElement('div');
    newGuest.className = 'guest';
    newGuest.id = guestId;
    newGuest.textContent = nickname;

    // Dodaj gosta u guestsData ako ne postoji
    if (!guestsData[guestId]) {
        guestsData[guestId] = { nickname, color: '' };
    }

    // Podesi boju gosta
    newGuest.style.color = guestsData[guestId].color || 'black';

    // Dodaj gosta u DOM
    guestList.appendChild(newGuest);

    // Koristi postojeći colorPicker za ažuriranje boje
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) {
        colorPicker.value = guestsData[guestId].color || '#000000'; // Postavi trenutnu boju gosta

        // Dodaj listener za promenu boje
        colorPicker.addEventListener('input', function () {
            if (currentGuestId === guestId) { // Proveri da li menjamo boju trenutnog gosta
                guestsData[guestId].color = this.value; // Ažuriraj boju u guestsData
                newGuest.style.color = this.value; // Ažuriraj boju u DOM-u
            }
        });
    }
});

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
