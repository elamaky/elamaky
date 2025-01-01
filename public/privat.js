let isPrivateChatEnabled = false;
let selectedGuest = null;

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    if (isPrivateChatEnabled) {
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'auto'; // Omogućavamo selekciju gostiju
        });
    } else {
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'none'; // Onemogućavamo selekciju gostiju
            guest.style.backgroundColor = ''; // Resetujemo boju pozadine
        });

        // Reset privatnog chata
        if (selectedGuest) {
            selectedGuest.style.backgroundColor = '';
            selectedGuest = null;
        }
        // Resetuj input polje ako je bio privatni chat
        const chatInput = document.getElementById('chatInput');
        if (chatInput && chatInput.value.startsWith('---->>>')) {
            chatInput.value = '';
        }
    }

    console.log(statusText);
    alert(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    // Inicijalno onemogući klik na goste
    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = 'none';
    });

    guestList.addEventListener('click', (event) => {
        if (!isPrivateChatEnabled) return; // Odmah izađi ako privatni chat nije uključen

        if (event.target.classList.contains('guest')) {
            // Ako je isti gost kliknut
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

            // Proveri da li je privatni chat uključen i da li je gost selektovan
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

                // Zadrži format za privatnu poruku
                chatInput.value = `---->>> ${recipient} : `;
            } else {
                // Ako privatni chat nije uključen ili nema selektovanog gosta,
                // šalji kao normalnu poruku
                socket.emit('chatMessage', {
                    text: message,
                    bold: isBold,
                    italic: isItalic,
                    color: currentColor,
                    underline: isUnderline,
                    overline: isOverline
                });

                chatInput.value = ''; // Resetuj input
            }
        }
    });
});
