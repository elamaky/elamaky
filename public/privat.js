let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;
    socket.emit('toggle_private_chat', isPrivateChatEnabled);

    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = isPrivateChatEnabled ? 'auto' : 'none'; // Omogućava ili onemogućava selekciju
    });

    console.log(statusText);
    alert(statusText);
});

socket.on('private_chat_status', (isPrivateChatEnabled) => {
    // Prilagodi selektovanje gostiju prema statusu privatnog chata
    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = isPrivateChatEnabled ? 'auto' : 'none';
    });

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    guestList.addEventListener('click', (event) => {
        if (isPrivateChatEnabled && event.target.classList.contains('guest')) {
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
                selectedGuest = null; // Resetuje selektovanog gosta
                isPrivateChatEnabled = false; // Isključuje privatni chat
                chatInput.value = ''; // Resetuje unos
                console.log("Privatni chat isključen.");
                return;
            }

            if (selectedGuest) {
                selectedGuest.style.backgroundColor = ''; // Ukloni stil sa prethodnog gosta
            }

            selectedGuest = event.target;
            selectedGuest.style.backgroundColor = 'lightblue'; // Obeleži novog gosta
            chatInput.value = `---->>> ${selectedGuest.textContent} : `;
            console.log("Privatni chat sa:", selectedGuest.textContent);
        }
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
