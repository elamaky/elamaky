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

// Funkcija za ostale dugmadi
document.getElementById('privateChatBtn').onclick = function() {
    // Implementiraj privatnu chat funkciju
};

document.getElementById('openModal').onclick = openModal;

function deleteChat() {
    const messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = '';  // Očisti sve poruke
    alert('Chat je obrisan.');
}


let isPrivateChatActive = false; // Privatni chat status
let currentPrivateRecipient = null; // Trenutni privatni primalac

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

// Funkcija za aktiviranje privatnog chata
document.getElementById('privateChatBtn').onclick = function() {
    isPrivateChatActive = !isPrivateChatActive; // Prebaci privatni chat
    if (isPrivateChatActive) {
        alert('Privatni chat je uključen.');
    } else {
        alert('Privatni chat je isključen.');
        currentPrivateRecipient = null; // Očisti trenutnog primaoca
    }
};

// Funkcija za aktiviranje privatnog chata
document.getElementById('privateChatBtn').onclick = function() {
    isPrivateChatActive = !isPrivateChatActive; // Prebaci privatni chat
    if (isPrivateChatActive) {
        alert('Privatni chat je uključen za sve!');
    } else {
        alert('Privatni chat je isključen.');
        currentPrivateRecipient = null; // Očisti trenutnog primaoca
    }
};


