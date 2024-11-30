let isAccessGranted = false;
let activeUser = null;
const allowedUsers = ["__X__", "___F117___", "ZI ZU"];  // Izuzeti korisnici

// Funkcija za otvaranje modala
function openModal() {
    const modal = document.getElementById('optionsModal');
    if (allowedUsers.includes(activeUser)) {
        modal.style.display = 'block';  // Otvori modal bez lozinke za određene korisnike
    } else {
        if (!isAccessGranted) {
            const password = prompt("Unesite lozinku:");
            if (password === "galaksija123") {
                isAccessGranted = true;
                modal.style.display = 'block';  // Otvori modal nakon validne lozinke
            } else {
                alert("Pogrešna lozinka!");
            }
        } else {
            modal.style.display = 'block';  // Otvori modal ako je pristup dozvoljen
        }
    }

    window.onclick = function(event) {
        const modal = document.getElementById('optionsModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Funkcija za postavljanje korisnika
function setActiveUser(username) {
    activeUser = username;
}

// Funkcija za brisanje chata
document.getElementById('deleteChatBtn').onclick = function() {
    deleteChat();
};

// Funkcija za aktiviranje privatnog chata
let isPrivateChatActive = false; // Privatni chat status
let currentPrivateRecipient = null; // Trenutni privatni primalac

document.getElementById('privateChatBtn').onclick = function() {
    isPrivateChatActive = !isPrivateChatActive; // Prebaci privatni chat
    if (isPrivateChatActive) {
        alert('Privatni chat je uključen za sve!');
    } else {
        alert('Privatni chat je isključen.');
        currentPrivateRecipient = null; // Očisti trenutnog primaoca
    }
};

// Funkcija za otvaranje modala
document.getElementById('openModal').onclick = openModal;

// Funkcija za brisanje chata
function deleteChat() {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = '';  // Očisti sve poruke
    alert('Chat je obrisan.');
}

// Kada korisnik klikne na gosta
document.getElementById('guestList').addEventListener('click', function(event) {
    const guestName = event.target.textContent; // Uzmi ime gosta na kojeg je kliknuto
    if (guestName) {
        currentPrivateRecipient = guestName; // Postavi trenutnog primaoca

        // Prikazivanje vizuelne trake
        const guestElements = document.querySelectorAll('#guestList .guest');
        guestElements.forEach(guest => guest.classList.remove('selected')); // Ukloni prethodne selekcije
        event.target.classList.add('selected'); // Dodaj selektovani stil

        // Postavi formu za privatnu poruku
        document.getElementById('chatInput').placeholder = `Poruka za ${guestName}...`;
    }
});

// Funkcija za slanje poruke
document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let message = this.value;
        
        // Ako je privatni chat aktivan i postoji primalac
        if (isPrivateChatActive && currentPrivateRecipient) {
            socket.emit('privateMessage', {
                recipient: currentPrivateRecipient,
                text: message
            });
        } else {
            // Normalna poruka koja ide svim korisnicima
            socket.emit('chatMessage', { text: message });
        }

        this.value = ''; // Isprazni polje za unos
    }
});

// Prikazivanje privatnih poruka u message area
socket.on('privateMessage', function(data) {
    let messageArea = document.getElementById('messageArea');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.innerHTML = `<strong>${data.nickname}:</strong> ${data.text} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    messageArea.prepend(newMessage);
});




