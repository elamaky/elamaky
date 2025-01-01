let isPrivateChatEnabled = false; // Status privatnog chata (kontroliše ga admin)
let selectedGuest = null; // Selekcija gosta

// Admin uključuje/isključuje privatni chat
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;

    // Obaveštavanje servera da je privatni chat uključen/isključen
    socket.emit('toggle_private_chat', isPrivateChatEnabled);

    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen za sve` : `Privatni chat je isključen`;
    alert(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    // Kada server pošalje status privatnog chata svim klijentima
    socket.on('private_chat_status', (status) => {
        isPrivateChatEnabled = status;

        const statusText = isPrivateChatEnabled ? "Privatni chat je sada aktivan" : "Privatni chat je deaktiviran";
        alert(statusText);

        // Resetovanje selekcije kada se privatni chat isključi
        if (!isPrivateChatEnabled && selectedGuest) {
            selectedGuest.style.backgroundColor = ''; // Ukloni selekciju
            selectedGuest = null;
        }
    });

    // Klik na gosta (selektovanje za privatni chat)
    guestList.addEventListener('click', (event) => {
        if (!isPrivateChatEnabled || !event.target.classList.contains('guest')) {
            return; // Ako privatni chat nije aktivan, selekcija nije moguća
        }

        if (selectedGuest === event.target) {
            selectedGuest.style.backgroundColor = ''; // Ukloni selekciju
            selectedGuest = null;
            chatInput.value = ''; // Resetuj unos
        } else {
            if (selectedGuest) {
                selectedGuest.style.backgroundColor = ''; // Reset prethodnog gosta
            }

            selectedGuest = event.target;
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Obeleži selektovanog gosta
            chatInput.value = `---->>> ${selectedGuest.textContent} : `; // Priprema unosa
        }
    });

    // Kada korisnik pritisne Enter (slanje poruke)
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const message = chatInput.value;

            if (isPrivateChatEnabled && selectedGuest) {
                socket.emit('private_message', {
                    to: selectedGuest.textContent,
                    message
                });
                chatInput.value = `---->>> ${selectedGuest.textContent} : `; // Ostavi formu
            } else {
                socket.emit('chatMessage', { text: message });
                chatInput.value = ''; // Resetuj unos
            }
        }
    });
});
