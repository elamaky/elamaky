let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled; // Prebacujemo stanje privatnog chata
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    // Ažuriranje stanja pointerEvents za sve goste
    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = isPrivateChatEnabled ? 'auto' : 'none'; // Omogućava ili onemogućava selekciju
    });

    // Ukloni selekciju sa trenutnog gosta kada je privatni chat isključen
    if (!isPrivateChatEnabled && selectedGuest) {
        selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
        selectedGuest = null; // Resetuje selektovanog gosta
    }

    console.log(statusText);
    alert(statusText);
});

// Event listener za selektovanje gostiju
document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList'); // Lista gostiju
    const chatInput = document.getElementById('chatInput'); // Polje za unos poruka

    guestList.addEventListener('click', (event) => {
        if (isPrivateChatEnabled && event.target.classList.contains('guest')) { // DOZVOLJENO SAMO KADA JE PRIVATNI CHAT UKLJUČEN
            // Ukloni ili dodaj traku selekcije samo ako je trenutni gost kliknut
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
                selectedGuest = null; // Resetuje selektovanog gosta
            } else {
                // Resetovanje prethodnog gosta
                if (selectedGuest) {
                    selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije sa prethodnog gosta
                }

                // Postavljanje novog selektovanog gosta
                selectedGuest = event.target; // Postavlja novog gosta
                selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Providna žuta traka

                // Forma poruke za privatni chat
                chatInput.value = `---->>> ${selectedGuest.textContent} : `;
                console.log("Privatni chat sa: ", selectedGuest.textContent);
            }
        } else if (!isPrivateChatEnabled) {
            // Ako je privatni chat isključen, ne uradi ništa
            console.log("Privatni chat nije uključen, selekcija gosta nije moguća.");
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
});
