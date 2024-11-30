let isAccessGranted = false;
let activeUser = null;
const allowedUsers = ["__X__", "___F117___", "ZI ZU"];  // Izuzeti korisnici

// Funkcija za otvaranje modala
function openModal() {
    const modal = document.getElementById('optionsModal');
    if (isAccessGranted || allowedUsers.includes(activeUser)) {
        modal.style.display = 'block';  // Otvori modal ako je pristup dozvoljen
    } else {
        const password = prompt("Unesite lozinku:");
        if (password === "galaksija123") {
            isAccessGranted = true;
            modal.style.display = 'block';  // Otvori modal nakon validne lozinke
        } else {
            alert("Pogrešna lozinka!");
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

// Funkcija za ostale dugmadi
document.getElementById('privateChatBtn').onclick = function() {
    // Implementiraj privatnu chat funkciju
};

// Ostale funkcije za dugmadi...
document.getElementById('openModal').onclick = openModal;

function deleteChat() {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = '';  // Očisti sve poruke
    alert('Chat je obrisan.');
}

let isPrivateChatActive = false; // Privatni chat status
let currentPrivateRecipient = null; // Trenutni privatni primalac

// Modal i opcije
const modal = document.getElementById('optionsModal');
const privateChatBtn = document.getElementById('privateChatBtn');
const deleteChatBtn = document.getElementById('deleteChatBtn');

// Funkcija za otvaranje modala
function openModal() {
    modal.style.display = 'block';
}

// Funkcija za zatvaranje modala (ako klikneš van modala)
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Funkcija za brisanje chata
deleteChatBtn.onclick = function() {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = ''; // Očisti sve poruke
    alert('Chat je obrisan.');
};

// Funkcija za aktiviranje privatnog chata
privateChatBtn.onclick = function() {
    isPrivateChatActive = !isPrivateChatActive; // Prebaci privatni chat
    if (isPrivateChatActive) {
        alert('Privatni chat je uključen.');
    } else {
        alert('Privatni chat je isključen.');
        currentPrivateRecipient = null; // Očisti trenutnog primaoca
    }
};

// Funkcija za slanje poruka
document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let message = this.value;
        if (isPrivateChatActive && currentPrivateRecipient) {
            socket.emit('privateMessage', {
                recipient: currentPrivateRecipient,
                text: message
            });
        } else {
            socket.emit('chatMessage', { text: message });
        }
        this.value = ''; // Isprazni polje za unos
    }
});

// Kada korisnik klikne desnim klikom na nickname
document.getElementById('guestList').addEventListener('contextmenu', function(event) {
    const guestName = event.target.textContent; // Uzmi ime gosta sa kojeg je kliknuto
    if (guestName) {
        currentPrivateRecipient = guestName; // Postavi kao trenutnog primaoca
        alert(`Privatni chat sa ${guestName} je aktiviran.`);
    }
});

// Prikaz poruka
socket.on('chatMessage', function(data) {
    let messageArea = document.getElementById('messageArea');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.innerHTML = `<strong>${data.nickname}:</strong> ${data.text}`;
    messageArea.prepend(newMessage);
});

socket.on('privateMessage', function(data) {
    let messageArea = document.getElementById('messageArea');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.innerHTML = `<strong>${data.nickname} (Privat):</strong> ${data.text}`;
    messageArea.prepend(newMessage);
});



