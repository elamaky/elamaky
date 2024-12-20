let isBold = false;
let isItalic = false;
let currentColor = '#FFFFFF';
let isUnderline = false;  // Dodano za underline
let isOverline = false;   // Dodano za overline

// Objekat za čuvanje podataka o gostima
const guestsData = {};
let nickname = null; // Dodano za praćenje nadimka

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
    document.getElementById('colorPicker').click();
});

// Kada korisnik izabere boju iz palete
document.getElementById('colorPicker').addEventListener('input', function() {
    currentColor = this.value;
    updateInputStyle();  // Ažuriraj stil inputa

    // Ažuriraj boju samo za trenutnog korisnika
    if (nickname) {
        if (!guestsData[nickname]) {
            guestsData[nickname] = { nickname, color: currentColor };
        } else {
            guestsData[nickname].color = currentColor;
        }
        const guestElement = document.querySelector(`#guestList .guest[data-nickname='${nickname}']`);
        if (guestElement) {
            guestElement.style.color = currentColor;
        }
        console.log(`Boja za ${nickname} promenjena na ${currentColor}`); // Log
        socket.emit('colorSelected', { nickname, color: currentColor }); // Emituj odabranu boju serveru
    } else {
        console.error('Nickname nije definisan tokom biranja boje');
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

// Kada korisnik pritisne Enter
document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let message = this.value;
        socket.emit('chatMessage', {
            text: message,
            bold: isBold,
            italic: isItalic,
            color: currentColor,
            nickname: nickname // Pošalji ime gosta
        });
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
socket.on('newGuest', function(nicknameFromServer) {
    if (!nickname) {
        nickname = nicknameFromServer; // Postavi lokalni nickname samo jednom
    }
    if (!guestsData[nicknameFromServer]) {
        guestsData[nicknameFromServer] = { nickname: nicknameFromServer, color: currentColor };
    }
    const guestId = nicknameFromServer;
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    newGuest.setAttribute('data-nickname', nicknameFromServer);
    newGuest.textContent = nicknameFromServer;

    // Postavi boju iz guestsData ako postoji
    if (guestsData[guestId]) {
        newGuest.style.color = guestsData[guestId].color;
    }

    guestList.appendChild(newGuest); // Dodaj novog gosta u listu
});

// Ažuriranje liste gostiju bez resetovanja stilova
socket.on('updateGuestList', function(users) {
    const guestList = document.getElementById('guestList');
    const currentGuests = Array.from(guestList.children).map(guest => guest.textContent);

    // Ukloni goste koji više nisu u listi
    currentGuests.forEach(nickname => {
        if (!users.includes(nickname)) {
            delete guestsData[nickname]; // Ukloni iz objekta
            
            // Ukloni iz DOM-a
            const guestElement = Array.from(guestList.children).find(guest => guest.textContent === nickname);
            if (guestElement) {
                guestList.removeChild(guestElement);
            }
        }
    });

    // Dodaj nove goste
    users.forEach(nickname => {
        if (!guestsData[nickname]) {
            guestsData[nickname] = { nickname, color: currentColor }; // Dodaj gosta u objekat
        }

        let guestElement = document.querySelector(`#guestList .guest[data-nickname='${nickname}']`);
        if (!guestElement) {
            guestElement = document.createElement('div');
            guestElement.className = 'guest';
            guestElement.setAttribute('data-nickname', nickname);
            guestElement.textContent = nickname;
            guestList.appendChild(guestElement);
        }

        // Postavi boju iz guestsData
        if (guestsData[nickname].color) {
            guestElement.style.color = guestsData[nickname].color;
        }
    });
});
