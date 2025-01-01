let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    // Umesto direktne promene stanja, emitujemo događaj serveru
    socket.emit('toggle_private_chat', !isPrivateChatEnabled);
});

// Socket listener za promenu statusa privatnog chata
socket.on('private_chat_status', (enabled) => {
    isPrivateChatEnabled = enabled;
    const statusText = enabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    if (enabled) {
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'auto'; // Omogućavamo selekciju gostiju
        });
        document.getElementById('privateMessage').classList.add('active');
    } else {
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'none'; // Onemogućavamo selekciju gostiju
        });

        // Ukloni selekciju sa trenutnog gosta
        if (selectedGuest) {
            selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
            selectedGuest = null; // Resetuje selektovanog gosta
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value = ''; // Resetuje input polje
            }
        }
        document.getElementById('privateMessage').classList.remove('active');
    }

    console.log(statusText);
    alert(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    // Inicijalno postavi sve goste kao nedostupne
    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = 'none';
    });

    guestList.addEventListener('click', (event) => {
        if (!isPrivateChatEnabled) return; // Prekini ako privatni chat nije uključen

        if (event.target.classList.contains('guest')) {
            // Ako je isti gost kliknut, poništava selekciju
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = '';
                selectedGuest = null;
                chatInput.value = '';
                console.log("Selekcija gosta poništena");
                return;
            }

            // Postavljanje novog selektovanog gosta
            if (selectedGuest) {
                selectedGuest.style.backgroundColor = '';
            }

            selectedGuest = event.target;
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
            chatInput.value = `---->>> ${selectedGuest.textContent} : `;
            console.log("Privatni chat sa: ", selectedGuest.textContent);
        }
    });

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

                chatInput.value = `---->>> ${recipient} : `;
            } else {
                socket.emit('chatMessage', {
                    text: message,
                    bold: isBold,
                    italic: isItalic,
                    color: currentColor,
                    underline: isUnderline,
                    overline: isOverline
                });

                chatInput.value = '';
            }
        }
    });
});
