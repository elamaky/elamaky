let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuests = []; // Lista selektovanih gostiju

// Funkcija za ažuriranje stanja gostiju
function updateGuestSelection() {
    document.querySelectorAll('.guest').forEach(guest => {
        guest.style.pointerEvents = isPrivateChatEnabled ? 'auto' : 'none'; // Omogućavamo ili onemogućavamo selekciju
        guest.style.backgroundColor = ''; // Resetujemo stil gostiju
    });
}

// Event listener za dugme "Privatna poruka" (uključivanje i isključivanje privatnog chata)
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled; // Prebacujemo status privatnog chata

    // Kada omogućavamo privatni chat, resetujemo sve selekcije i omogućavamo selekciju svih gostiju
    if (isPrivateChatEnabled) {
        selectedGuests = []; // Resetujemo listu izabranih gostiju
        updateGuestSelection();
    } else {
        // Kad isključimo privatni chat, resetujemo selekciju
        selectedGuests = [];
        updateGuestSelection();
    }

    const statusText = isPrivateChatEnabled ? 'Privatni chat je uključen' : 'Privatni chat je isključen';
    alert(statusText);
});

// Event listener za goste (da se selektuje gost za privatni chat)
document.querySelectorAll('.guest').forEach(guest => {
    guest.addEventListener('click', () => {
        if (isPrivateChatEnabled) {
            // Dodajemo ili uklanjamo gosta iz liste selektovanih gostiju
            if (selectedGuests.includes(guest)) {
                selectedGuests = selectedGuests.filter(g => g !== guest); // Uklanjamo gosta
                guest.style.backgroundColor = ''; // Resetujemo stil
            } else {
                selectedGuests.push(guest); // Dodajemo gosta u listu
                guest.style.backgroundColor = 'lightblue'; // Mijenjamo stil izabranog gosta
            }
        }
    });
});

// Prvo pozivanje funkcije za inicijalno podešavanje
updateGuestSelection();
document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Ako je privatni chat isključen, onemogućiti selektovanje gostiju
            if (!isPrivateChatEnabled) {
                return;
            }

            // Ako je isti gost kliknut, poništava selekciju (isključuje privatni chat)
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
                selectedGuest = null; // Resetuje selektovanog gosta
                chatInput.value = ''; // Resetuje unos
                return;
            }

            // Postavljanje novog selektovanog gosta
            if (selectedGuest) {
                selectedGuest.style.backgroundColor = ''; // Resetuje prethodnog gosta
            }

            selectedGuest = event.target; // Postavlja novog gosta
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Providna žuta traka
            chatInput.value = `---->>> ${selectedGuest.textContent} : `; // Forma poruke za privatni chat
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
