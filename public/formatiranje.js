let nickname;
const guestsData = {};

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
        guestsData[guestId] = { nickname, color: '#FFFFFF' }; // Ako ne postoji, dodajemo ga sa podrazumevanom bojom
    }

    newGuest.style.color = guestsData[guestId].color;
    
    // Dodaj stilove za gosta
    addGuestStyles(newGuest, guestId);
    
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
            newGuest.textContent = nickname;
            newGuest.style.color = '#FFFFFF'; // Podrazumevana boja ako nije postavljena
            
                      guestsData[guestId] = { nickname, color: newGuest.style.color }; // Dodajemo boju
            addGuestStyles(newGuest, guestId); // Dodaj stilove
            guestList.appendChild(newGuest); // Dodaj novog gosta u listu
        }
    });
});  
