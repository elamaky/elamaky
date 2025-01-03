// Ovaj deo ostaje isti
let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    // Emitovanje događaja za server
    socket.emit('toggle_private_chat', isPrivateChatEnabled);
    console.log('Emitovanje događaja na server sa statusom privatnog chata:', isPrivateChatEnabled);

    // Omogućavanje ili onemogućavanje selekcije gostiju
    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = isPrivateChatEnabled ? 'auto' : 'none';
        console.log(`Selekcija gosta ${guest.textContent} ${isPrivateChatEnabled ? 'dozvoljena' : 'onemogućena'}`);
    });

    if (!isPrivateChatEnabled) {
    // Ako se isključi privatni chat, ukloni selektovanog gosta i traku
    if (selectedGuest) {
        selectedGuest.style.backgroundColor = ''; // Resetuj boju pozadine
        selectedGuest = null; // Resetuj selektovanog gosta
    }

    // Resetuj unos u chat inputu
    chatInput.value = '';
}

 console.log(statusText);
    alert(statusText);
});

// Prilagodba selekcije gostiju kada server šalje status privatnog chata
socket.on('private_chat_status', (status) => {
    isPrivateChatEnabled = status; // Ažuriraj status privatnog chata
    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = status ? 'auto' : 'none'; // Omogući ili onemogući selekciju
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');
    
    guestList.addEventListener('click', (event) => {
        if (isPrivateChatEnabled && event.target.classList.contains('guest')) {
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
                selectedGuest = null; // Resetuje selektovanog gosta
                chatInput.value = ''; // Resetuje unos
                
                // Emitovanje uklanjanja selekcije na server
                socket.emit('update_guest_selection', { guestId: null });
                return;
            }

            if (selectedGuest) {
                selectedGuest.style.backgroundColor = ''; // Ukloni stil sa prethodnog gosta
            }

            selectedGuest = event.target;
            selectedGuest.style.backgroundColor = 'lightblue'; // Obeleži novog gosta
            chatInput.value = `---->>> ${selectedGuest.textContent} : `;

            // Emitovanje nove selekcije gosta na server
            socket.emit('update_guest_selection', { guestId: selectedGuest.id });
        }
    });

    chatInput.addEventListener('input', () => {
        // Emitovanje promene u chat input polju na server
        socket.emit('update_chat_input', { value: chatInput.value });
    });
});

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
socket.on('sync_guest_selection', (data) => {
    if (data.guestId) {
        const guest = document.getElementById(data.guestId);
        if (guest) {
            if (selectedGuest) selectedGuest.style.backgroundColor = ''; // Ukloni selekciju sa starog gosta
            selectedGuest = guest;
            selectedGuest.style.backgroundColor = 'lightblue'; // Obeleži novog gosta
        }
    } else {
        if (selectedGuest) selectedGuest.style.backgroundColor = ''; // Ukloni selekciju
        selectedGuest = null;
    }
});

socket.on('sync_chat_input', (data) => {
    chatInput.value = data.value; // Sinhronizuj unos u chat input polju
});

