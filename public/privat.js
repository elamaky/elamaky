let isPrivateChatEnabled = false;
let selectedGuest = null;

// Dodajemo proveru da li je dugme uspešno pronađeno
const privateMessageButton = document.getElementById('privateMessage');
if (!privateMessageButton) {
    console.error('Dugme za privatne poruke nije pronađeno! Proverite ID "privateMessage" u HTML-u.');
} else {
    // Event listener za dugme
    privateMessageButton.addEventListener('click', function() {
        console.log('Dugme je kliknuto'); // Debug log
        
        try {
            // Promena statusa
            const newStatus = !isPrivateChatEnabled;
            
            // Provera da li socket postoji
            if (typeof socket === 'undefined') {
                console.error('Socket nije inicijalizovan!');
                return;
            }

            // Emitovanje promene statusa
            socket.emit('toggle_private_chat', newStatus);
            console.log('Emitovan toggle_private_chat event:', newStatus); // Debug log
        } catch (error) {
            console.error('Greška prilikom rukovanja klikom:', error);
        }
    });
}

// Socket event listeneri
if (typeof socket !== 'undefined') {
    socket.on('connect', () => {
        console.log('Socket povezan'); // Debug log
    });

    socket.on('private_chat_status', (status) => {
        console.log('Primljen private_chat_status:', status); // Debug log
        
        try {
            isPrivateChatEnabled = status;
            selectedGuest = null;

            // Ažuriranje UI-a
            document.querySelectorAll('.guest').forEach(guest => {
                guest.style.backgroundColor = '';
                guest.style.pointerEvents = status ? 'auto' : 'none';
            });

            // Prikazivanje statusa
            const statusText = status ? 'Privatni chat je uključen' : 'Privatni chat je isključen';
            displayNotification(statusText);
            
            // Ažuriranje vizuelnog stanja dugmeta
            if (privateMessageButton) {
                privateMessageButton.classList.toggle('active', status);
            }
        } catch (error) {
            console.error('Greška prilikom ažuriranja statusa:', error);
        }
    });
}

// Pomoćna funkcija za notifikacije
function displayNotification(message) {
    console.log('Notifikacija:', message); // Debug log
    alert(message); // Možete zameniti sa boljim UI notifikacijama
}

// Ostatak vašeg postojećeg koda za chat...
document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    if (!guestList || !chatInput) {
        console.error('Nisu pronađeni potrebni elementi!');
        return;
    }

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            if (!isPrivateChatEnabled) {
                console.log('Privatni chat nije omogućen'); // Debug log
                return;
            }

            handleGuestSelection(event.target, chatInput);
        }
    });

    chatInput.addEventListener('keydown', handleChatInput);
});

// Izdvojena funkcija za selekciju gosta
function handleGuestSelection(guest, chatInput) {
    if (selectedGuest === guest) {
        selectedGuest.style.backgroundColor = '';
        selectedGuest = null;
        chatInput.value = '';
    } else {
        if (selectedGuest) {
            selectedGuest.style.backgroundColor = '';
        }
        selectedGuest = guest;
        selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
        chatInput.value = `---->>> ${selectedGuest.textContent} : `;
    }
}

// Izdvojena funkcija za rukovanje chat inputom
function handleChatInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const message = event.target.value;

        if (!socket) {
            console.error('Socket nije dostupan!');
            return;
        }

        if (isPrivateChatEnabled && selectedGuest) {
            sendPrivateMessage(message);
        } else {
            sendPublicMessage(message);
        }
    }
}

// Funkcije za slanje poruka
function sendPrivateMessage(message) {
    const recipient = selectedGuest.textContent;
    const time = new Date().toLocaleTimeString();

    socket.emit('private_message', {
        to: recipient,
        message,
        time,
        bold: isBold,
        italic: isItalic,
        color: currentColor,
        underline: isUnderline,
        overline: isOverline
    });

    document.getElementById('chatInput').value = `---->>> ${recipient} : `;
}

function sendPublicMessage(message) {
    socket.emit('chatMessage', {
        text: message,
        bold: isBold,
        italic: isItalic,
        color: currentColor,
        underline: isUnderline,
        overline: isOverline
    });

    document.getElementById('chatInput').value = '';
}
