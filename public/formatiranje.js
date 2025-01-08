let isBold = false;
let isItalic = false;
let currentColor = '#FFFFFF';
let newColor;
let isUnderline = false;
let isOverline = false;
const guestsData = {};
let guests = socketId; 

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

socket.on('newGuest', function(nickname) {
    const socketId = nickname; // Koristi socket.id kao identifikator
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    newGuest.textContent = nickname;

    // Ako gost još nije u podacima, dodaj ga
    if (!guestsData[socketId]) {
        guestsData[socketId] = { nickname, color: '#FFFFFF' };
    }

    newGuest.style.color = guestsData[socketId].color;
    addGuestStyles(newGuest, socketId); // Koristi socketId umesto guestId
    guestList.appendChild(newGuest);
});

socket.on('updateGuestList', function(users) {
    const guestList = document.getElementById('guestList');
    const currentGuests = Array.from(guestList.children).map(guest => guest.textContent);

    // Uklanjanje gostiju koji nisu više na listi
    currentGuests.forEach(nickname => {
        if (!users.includes(nickname)) {
            delete guestsData[nickname]; // Koristi nickname kao ključ jer je socketId zapravo nickname u ovom kontekstu
            const guestElement = Array.from(guestList.children).find(guest => guest.textContent === nickname);
            if (guestElement) {
                guestList.removeChild(guestElement);
            }
        }
    });
});

// Add new guests
guests.forEach(nickname => {
    const socketId = nickname; // Koristi socketId kao identifikator
    if (!guestsData[socketId]) {
        const newGuest = document.createElement('div');
        newGuest.className = 'guest';
        newGuest.id = socketId; // Postavljamo socketId kao ID za svakog gosta
        newGuest.textContent = nickname; // Prikazujemo ime gosta
        newGuest.style.color = '#FFFFFF'; // Podrazumevana boja

        guestsData[socketId] = { nickname, color: newGuest.style.color }; // Dodajemo podatke o gostu
        guestList.appendChild(newGuest); // Dodajemo novog gosta u listu

        // Dodavanje listenera za ažuriranje boje u realnom vremenu
        const colorPicker = document.getElementById('colorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('input', function updateColor() {
                // Proveravamo da li je trenutni korisnik onaj koji menja boju
                if (newGuest.id === socket.id) {  // Koristi socket.id direktno
                    updateGuestColor(socket.id, this.value); // Ažuriraj boju na osnovu socket.id
                }
            });
        }
    }
});

document.getElementById('colorPicker').addEventListener('input', function() {
    currentColor = this.value;
    updateInputStyle();
});

function setGuestColor(socketId, color) {
    const guestElement = document.getElementById(socketId);
    if (guestElement) {
        guestElement.style.color = color;
        guestsData[socketId].color = color;
    }
}

function updateGuestColor(socketId, newColor) {
    setGuestColor(socketId, newColor);
    socket.emit('updateGuestColor', { socketId, newColor });
    console.log('Color update broadcasted:', socketId, newColor);
}

socket.on('syncGuests', (data) => {
    Object.keys(data).forEach(socketId => {
        if (!guestsData[socketId]) {
            guestsData[socketId] = data[socketId];
            setGuestColor(socketId, data[socketId].color);
        }
    });
});
