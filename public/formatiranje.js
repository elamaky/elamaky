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
function addNewGuest(nickname) {
    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');

    if (!guestsData[guestId]) {
        const newGuest = document.createElement('div');
        newGuest.className = 'guest';
        newGuest.id = guestId;
        newGuest.textContent = nickname;
        newGuest.style.color = guestsData[guestId]?.color || '#FFFFFF'; // Default color

        guestsData[guestId] = { nickname, color: newGuest.style.color }; // Save guest data
        guestList.appendChild(newGuest);

        // Add color picker listener
        const colorPicker = document.getElementById('colorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('input', function updateColor() {
                if (guestId === newGuest.id) {
                    updateGuestColor(guestId, this.value); // Update color
                }
            });
        }
    }
}

// Handle new guest
socket.on('newGuest', function (nickname) {
    addNewGuest(nickname);
});

// Sync guest list
socket.on('updateGuestList', function (users) {
    const guestList = document.getElementById('guestList');
    const currentGuests = Array.from(guestList.children).map(guest => guest.textContent);

    // Remove guests not in the updated list
    currentGuests.forEach((nickname) => {
        if (!users.includes(nickname)) {
            const guestId = `guest-${nickname}`;
            delete guestsData[guestId];
            const guestElement = document.getElementById(guestId);
            if (guestElement) {
                guestList.removeChild(guestElement);
            }
        }
    });

    // Add new guests
    users.forEach((nickname) => {
        addNewGuest(nickname);
    });
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

// Osluškuje promenu boje sa servera
socket.on('updateGuestColor', ({ guestId, newColor }) => { // Usaglašeno sa "newColor"
    console.log('Color update broadcasted:', guestId, newColor);
    setGuestColor(guestId, newColor);
});
