let isPrivateChatEnabled = false; // Privatni chat je inicijalno isključen
let selectedGuest = null;

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    // Onemogućavanje selekte predmeta
    const enableGuestSelection = () => {
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'auto'; // Omogućava selekciju
        });
    };

    const disableGuestSelection = () => {
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.pointerEvents = 'none'; // Onemogućava selekciju
        });
    };

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Ako privatni chat nije uključen, ne dozvoliti selekciju
            if (!isPrivateChatEnabled) {
                alert("Morate aktivirati privatni chat da biste selektovali gosta.");
                return;
            }

            // Ako je isti gost kliknut, samo poništi selekciju
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
            chatInput.value = `---->>> ${selectedGuest.textContent} : `;
        }
    });

    // Dugme za aktiviranje privatnog chata
    document.getElementById('privateMessage').addEventListener('click', () => {
        isPrivateChatEnabled = !isPrivateChatEnabled;

        // Kada je privatni chat uključen, dozvola svim gostima da pišu
        if (isPrivateChatEnabled) {
            enableGuestSelection();

            // Emituj svim povezanim klijentima da je privatni chat aktiviran
            socket.emit('private_chat_enabled', { status: true });
        } else {
            disableGuestSelection();
            // Ukloni selekciju sa trenutnog gosta
            if (selectedGuest) {
                selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
                selectedGuest = null; // Resetuje selektovanog gosta
            }
        }

        alert(isPrivateChatEnabled ? "Privatni chat je uključen" : "Privatni chat je isključen");
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

    // Kada se stranica učita, proveri status privatnog chata i omogući selekciju
    if (isPrivateChatEnabled) {
        enableGuestSelection();
    } else {
        disableGuestSelection();
    }

    // Kada server emitira da je privatni chat uključen, omogući selekciju svima
    socket.on('private_chat_enabled', (data) => {
        if (data.status) {
            isPrivateChatEnabled = true;
            enableGuestSelection();
        }
    });
});
