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

// Add new guests
users.forEach(nickname => {
    const socketId = `guest-${nickname}`;
    if (!guestsData[socketId]) {
        const newGuest = document.createElement('div');
        newGuest.className = 'guest';
        newGuest.id = socketId;
        newGuest.textContent = nickname;
        newGuest.style.color = '#FFFFFF';

        guestsData[socketId] = { nickname, color: newGuest.style.color };
        guestList.appendChild(newGuest);

        // Add listener for real-time color update
        const colorPicker = document.getElementById('colorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('input', function updateColor() {
                if (currentGuestId === socketId) {
                    updateGuestColor(socketId, this.value);
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

