let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Emituj status privatnog chata ka serveru kada admin aktivira/isključi
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    // Emituj status privatnog chata ka serveru
    socket.emit('toggle_private_chat', isPrivateChatEnabled);

    console.log(statusText);
    alert(statusText);
});

// Primi status privatnog chata od servera
socket.on('update_private_chat_status', (status) => {
    isPrivateChatEnabled = status;
    if (isPrivateChatEnabled) {
        // Omogućiti selektovanje gostiju
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'auto'; // Omogućavamo selekciju gostiju
        });
    } else {
        // Onemogućiti selektovanje gostiju
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'none'; // Onemogućavamo selekciju gostiju
        });
    }
});

// Event listener za selektovanje gosta
document.getElementById('guestList').addEventListener('click', (event) => {
    if (!isPrivateChatEnabled) {
        console.log("Privatni chat nije uključen. Selektovanje gostiju nije moguće.");
        return; // Onemogućava selekciju ako privatni chat nije uključen
    }

    if (event.target.classList.contains('guest')) {
        // Ako je isti gost kliknut, poništava selekciju
        if (selectedGuest === event.target) {
            selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
            selectedGuest = null; // Resetuje selektovanog gosta
            isPrivateChatEnabled = false; // Isključuje privatni chat
            document.getElementById('chatInput').value = ''; // Resetuje unos
            console.log("Privatni chat isključen.");
            return;
        }

        // Postavljanje novog selektovanog gosta
        if (selectedGuest) {
            selectedGuest.style.backgroundColor = ''; // Resetuje prethodnog gosta
        }

        selectedGuest = event.target; // Postavlja novog gosta
        selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Providna žuta traka

        // Forma poruke za privatni chat
        document.getElementById('chatInput').value = `---->>> ${selectedGuest.textContent} : `;
        console.log("Privatni chat sa: ", selectedGuest.textContent);
    }
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
