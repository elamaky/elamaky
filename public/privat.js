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
    isPrivateChatEnabled = !isPrivateChatEnabled;
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

guestList.addEventListener('click', (event) => {
    if (event.target.classList.contains('guest')) {
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
            // Ova linija je uklonjena jer ne želimo da automatski uključujemo privatni chat
            // isPrivateChatEnabled = true; 
            // Forma poruke za privatni chat
            if (isPrivateChatEnabled) {
                chatInput.value = `---->>> ${selectedGuest.textContent} : `;
                console.log("Privatni chat sa: ", selectedGuest.textContent);
            }
        }
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
