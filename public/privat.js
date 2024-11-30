let isAccessGranted = false;
let activeUser = null;
let isPrivateChatActive = false;
let currentPrivateRecipient = null;
const allowedUsers = ["__X__", "___F117___", "ZI ZU"]; // Izuzeti korisnici

// Funkcija za otvaranje modala
function openModal() {
    const modal = document.getElementById('optionsModal');
    if (allowedUsers.includes(activeUser)) {
        modal.style.display = 'block'; // Otvori modal bez lozinke za određene korisnike
    } else if (!isAccessGranted) {
        const password = prompt("Unesite lozinku:");
        if (password === "galaksija123") {
            isAccessGranted = true;
            modal.style.display = 'block'; // Otvori modal nakon validne lozinke
        } else {
            alert("Pogrešna lozinka!");
        }
    } else {
        modal.style.display = 'block'; // Otvori modal ako je pristup već odobren
    }

    // Otvaranje modala na pritisak tastera "D"
document.addEventListener('keydown', function(event) {
    if (event.key === 'D' || event.key === 'd') {
        openModal(); // Poziva funkciju za otvaranje modala
    }
});


    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Funkcija za postavljanje aktivnog korisnika
function setActiveUser(username) {
    activeUser = username;
}

// Funkcija za brisanje chata
document.getElementById('deleteChatBtn').onclick = function() {
    alert("Funkcija za brisanje chata nije implementirana!"); // Placeholder
};

// Kada korisnik klikne na gosta
document.getElementById('guestList').addEventListener('click', function(event) {
    const guestName = event.target.textContent; // Uzmi ime gosta
    if (guestName) {
        currentPrivateRecipient = guestName; // Postavi trenutnog primaoca

        // Prikazivanje vizuelne trake
        document.querySelectorAll('#guestList .guest').forEach(guest => guest.classList.remove('selected')); // Ukloni selekcije
        event.target.classList.add('selected'); // Dodaj selektovani stil

        // Postavi formu za privatnu poruku
        document.getElementById('chatInput').placeholder = `Poruka za ${guestName}...`;
    }
});

// Funkcija za slanje poruke
document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const message = this.value.trim();

        if (message === "") return; // Ne šaljemo prazne poruke

        if (isPrivateChatActive && currentPrivateRecipient) {
            // Slanje privatne poruke
            socket.emit('privateMessage', {
                recipient: currentPrivateRecipient,
                sender: activeUser,
                text: message
            });
        } else {
            // Slanje normalne poruke svim korisnicima
            socket.emit('chatMessage', {
                sender: activeUser,
                text: message
            });
        }

        this.value = ''; // Isprazni chat input
    }
});

// Prikazivanje privatnih poruka u message area
socket.on('privateMessage', function(data) {
    const messageArea = document.getElementById('messageArea');
    if (data.recipient === activeUser || data.sender === activeUser) {
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        newMessage.innerHTML = `<strong>${data.sender} ---> ${data.recipient}:</strong> ${data.text} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
        messageArea.prepend(newMessage);
    }
});

// Prikazivanje normalnih poruka u message area
socket.on('chatMessage', function(data) {
    const messageArea = document.getElementById('messageArea');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.innerHTML = `<strong>${data.sender}:</strong> ${data.text} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    messageArea.prepend(newMessage);
});

// Funkcija za aktiviranje privatnog chata
document.getElementById('privateChatBtn').onclick = function() {
    if (currentPrivateRecipient) {
        isPrivateChatActive = !isPrivateChatActive; // Prebaci status privatnog chata
        if (isPrivateChatActive) {
            alert(`Privatni chat je uključen za ${currentPrivateRecipient}`);
        } else {
            alert("Privatni chat je isključen.");
            currentPrivateRecipient = null; // Očisti trenutnog primaoca
        }
    } else {
        alert("Greška: Niste izabrali gosta za privatni chat!");
    }
};
