let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Event listener za dugme "Privatna poruka" (uključivanje i isključivanje privatnog chata)
document.getElementById('privateMessage').addEventListener('click', () => {
    // Emitujemo promenu statusa privatnog chata svim korisnicima
    socket.emit('toggle_private_chat', !isPrivateChatEnabled);
});

// Dodajemo socket listener za sinhronizaciju statusa privatnog chata
socket.on('private_chat_status', (status) => {
    isPrivateChatEnabled = status;
    selectedGuest = null; // Resetujemo selektovanog gosta
    
    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.backgroundColor = ''; // Resetujemo stil gostiju
        guest.style.pointerEvents = status ? 'auto' : 'none'; // Kontrolišemo mogućnost selekcije
    });

    const statusText = status ? `Privatni chat je uključen` : `Privatni chat je isključen`;
    // Možete koristiti neki bolji način notifikacije umesto alert-a
    displayNotification(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            if (!isPrivateChatEnabled) {
                return;
            }

            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = '';
                selectedGuest = null;
                chatInput.value = '';
                return;
            }

            if (selectedGuest) {
                selectedGuest.style.backgroundColor = '';
            }

            selectedGuest = event.target;
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
            chatInput.value = `---->>> ${selectedGuest.textContent} : `;
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

// Helper funkcija za prikazivanje notifikacija
function displayNotification(message) {
    // Implementirajte bolji način prikazivanja notifikacija
    // Ovo je samo primer, možete koristiti toast, custom div, itd.
    alert(message);
}
