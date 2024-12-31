let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    if (isPrivateChatEnabled) {
        // Logika za omogućavanje selekcije kada je privatni chat uključen
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'auto'; // Omogućavamo selekciju gostiju
        });
    } else {
        // Logika za onemogućavanje selekcije kada je privatni chat isključen
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'none'; // Onemogućavamo selekciju gostiju
        });
    }

    console.log(statusText);
    alert(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    isPrivateChatEnabled = false; // Privatni chat isključen na početku

    // Osiguravamo da su gosti inicijalno neaktivni
    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = 'none'; // Onemogućeno klikanje na goste dok se privat ne uključi
    });

    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = '';
                selectedGuest = null;
                isPrivateChatEnabled = false;
                chatInput.value = '';
                console.log("Privatni chat isključen.");
                return;
            }

            if (selectedGuest) {
                selectedGuest.style.backgroundColor = '';
            }

            selectedGuest = event.target;
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
            isPrivateChatEnabled = true;
            chatInput.value = `---->>> ${selectedGuest.textContent} : `;
            console.log("Privatni chat sa: ", selectedGuest.textContent);
        }
    });
});


// Kada korisnik pritisne Enter
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            let message = chatInput.value;

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
