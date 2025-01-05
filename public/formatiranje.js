let isBold = false;
let isItalic = false;
let currentColor = '#FFFFFF';
let isUnderline = false; 
let isOverline = false; 
let currentGuestId = null;

// Objekat za čuvanje podataka o gostima
const guestsData = {};
const colorPrefs = {};

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
    updateInputStyle();
});

// Funkcija za ažuriranje boje teksta određenog gosta
function updateGuestColor(guestId, color) {
    const guestElement = document.getElementById(guestId);
    if (guestElement) {
        guestElement.style.color = color;
        guestsData[guestId].color = color;
    }
}

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
socket.on('newGuest', function(nickname) {
    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    newGuest.textContent = nickname;

    // Dodaj novog gosta u guestsData ako ne postoji
    if (!guestsData[guestId]) {
        guestsData[guestId] = {
            nickname,
            color: '#FFFFFF'
        }; // Ako ne postoji, dodajemo ga sa podrazumevanom bojom
    }

    newGuest.style.color = guestsData[guestId].color;
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
                            newGuest.id = guestId; // Set the id for each guest
                            newGuest.textContent = nickname;
                            newGuest.style.color = '#FFFFFF'; // Default color if not set

                            guestsData[guestId] = {
                                nickname,
                                color: newGuest.style.color
                            }; // Add guest data
                            guestList.appendChild(newGuest); // Add new guest to the list

                            // Postavi trenutnog gosta za bojenje
                            currentGuestId = guestId;
                            console.log("Trenutni gost postavljen:", currentGuestId);

                            // Dodaj listener za ažuriranje boje u realnom vremenu
                            const colorPicker = document.getElementById('colorPicker');
                            if (colorPicker) {
                                console.log("Color picker pronađen:", colorPicker);

                                colorPicker.addEventListener('input', function updateColor() {
                                    console.log("Promena boje detektovana. Nova vrednost:", this.value);

                                    if (currentGuestId === guestId) {
                                        console.log("Gost ID odgovara. Ažuriranje boje...");
                                        updateGuestColor(guestId, this.value);
                                    } else {
                                        console.log("Gost ID ne odgovara. Boja neće biti ažurirana.");
                                    }
                                });

                                colorPicker.click();
                                console.log("Color picker kliknut. Trenutna vrednost:", colorPicker.value);

                                // Emituj događaj serveru
                                socket.emit('updateColor', {
                                    guestId,
                                    color: colorPicker.value
                                });
                                console.log("Podaci poslati serveru:", {
                                    guestId,
                                    color: colorPicker.value
                                });
                            }

                            // Osluškuj promene boje od servera
                            socket.on('colorUpdated', function(data) {
                                console.log("Boja ažurirana od strane servera:", data);

                                // Ažuriraj boju gosta na osnovu podataka od servera
                                updateGuestColor(data.guestId, data.color);
                            }
                             }
});
