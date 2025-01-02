let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    if (isPrivateChatEnabled) {
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = ''; // Omogućavamo selekciju gostiju

            // Dodajemo event listener za svakog gosta kada je privatni chat uključen
            guest.addEventListener('click', (event) => {
                if (isPrivateChatEnabled) {
                    if (selectedGuest === event.target) {
                        selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
                        selectedGuest = null; // Resetuje selektovanog gosta
                        chatInput.value = ''; // Resetuje unos
                        console.log("Privatni chat isključen.");
                    } else {
                        if (selectedGuest) {
                            selectedGuest.style.backgroundColor = ''; // Resetuje prethodnog gosta
                        }

                        selectedGuest = event.target; // Postavlja novog gosta
                        selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Providna žuta traka
                        
                        // Forma poruke za privatni chat
                        chatInput.value = `---->>> ${selectedGuest.textContent} : `;
                        console.log("Privatni chat sa: ", selectedGuest.textContent);
                    }
                }
            });
        });
    } else {
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'none'; // Onemogućavamo selekciju gostiju
        });

        // Ukloni selekciju sa trenutnog gosta
        if (selectedGuest) {
            selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
            selectedGuest = null; // Resetuje selektovanog gosta
        }
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
});
