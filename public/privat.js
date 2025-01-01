let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Admin uključuje/isključuje privatni chat
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;

    // Emituj status svim korisnicima
    socket.emit('toggle_private_chat', isPrivateChatEnabled);

    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;
    alert(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    // Prijem statusa privatnog čata od servera
    socket.on('private_chat_status', (status) => {
        isPrivateChatEnabled = status;
        const statusText = isPrivateChatEnabled ? "Privatni chat je uključen" : "Privatni chat je isključen";
        alert(statusText);
    });

    // Klik na gosta
    guestList.addEventListener('click', (event) => {
        if (!isPrivateChatEnabled || !event.target.classList.contains('guest')) {
            return;
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

    // Kada korisnik pritisne Enter
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            let message = chatInput.value;

            if (isPrivateChatEnabled && selectedGuest) {
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

                chatInput.value = `---->>> ${recipient} : `; // Ostavi formu
            } else {
                socket.emit('chatMessage', {
                    text: message,
                    bold: isBold,
                    italic: isItalic,
                    color: currentColor,
                    underline: isUnderline,
                    overline: isOverline
                });

                chatInput.value = ''; // Resetuj unos
            }
        }
    });
});

