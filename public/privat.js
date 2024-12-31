let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Inicijalizacija stanja pri učitavanju stranice
document.addEventListener('DOMContentLoaded', () => {
    // Postavljanje inicijalnog stanja za goste
    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = 'none'; // Onemogućeno klikanje na goste
        guest.style.backgroundColor = ''; // Resetovanje stilova
    });

    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    // Event za klikanje na goste
    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest') && isPrivateChatEnabled) {
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = ''; // Ukloni selekciju
                selectedGuest = null;
                chatInput.value = ''; // Resetuje unos
                console.log("Privatni chat isključen za ovog gosta.");
                return;
            }

            if (selectedGuest) {
                selectedGuest.style.backgroundColor = ''; // Resetuje prethodnog gosta
            }

            selectedGuest = event.target; // Novi selektovani gost
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Stil za selekciju
            chatInput.value = `---->>> ${selectedGuest.textContent} : `; // Forma poruke
            console.log("Privatni chat uključen za: ", selectedGuest.textContent);
        }
    });
});

// Event za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled; // Preklopni status
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = isPrivateChatEnabled ? 'auto' : 'none'; // Omogućiti/Onemogućiti klikanje
        if (!isPrivateChatEnabled) {
            guest.style.backgroundColor = ''; // Reset stilova kada je chat isključen
        }
    });

    if (!isPrivateChatEnabled) {
        selectedGuest = null; // Resetovati selektovanog gosta
        document.getElementById('chatInput').value = ''; // Resetovati unos
    }

    console.log(statusText);
    alert(statusText);
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
