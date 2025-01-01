let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

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
        });

        // Ukloni selekciju sa trenutnog gosta kada se isključi privatni chat
        if (selectedGuest) {
            selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
            selectedGuest = null; // Resetuje selektovanog gosta
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value = ''; // Resetuje input polje
            }
        }
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
        // Proveri da li je privatni chat uključen pre bilo kakve akcije
        if (!isPrivateChatEnabled) {
            return; // Prekini ako privatni chat nije uključen
        }

        if (event.target.classList.contains('guest')) {
            // Ako je isti gost kliknut, poništava selekciju
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
                selectedGuest = null; // Resetuje selektovanog gosta
                chatInput.value = ''; // Resetuje unos
                console.log("Selekcija gosta poništena");
                return;
            }

            // Postavljanje novog selektovanog gosta
            if (selectedGuest) {
                selectedGuest.style.backgroundColor = ''; // Resetuje prethodnog gosta
            }

            selectedGuest = event.target; // Postavlja novog gosta
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Providna žuta traka
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
                // Emisija privatne poruke
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

                // Forma ostaje netaknuta za privatni chat
                chatInput.value = `---->>> ${recipient} : `;
            } else {
                // Emisija obične poruke
                socket.emit('chatMessage', {
                    text: message,
                    bold: isBold,
                    italic: isItalic,
                    color: currentColor,
                    underline: isUnderline,
                    overline: isOverline
                });

                chatInput.value = ''; // Resetuje unos samo za obične poruke
            }
        }
    });
});
