let selectedGuest = null; // Selekcija gosta
let privateChatRequest = false; // Status zahteva za privatni chat

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Ako je isti gost kliknut, poništava selekciju
            if (selectedGuest === event.target) {
                selectedGuest.style.backgroundColor = ''; // Uklanja traku selekcije
                selectedGuest = null; // Resetuje selektovanog gosta
                privateChatRequest = false; // Resetuje status privatnog chata
                chatInput.value = ''; // Resetuje unos
                console.log("Privatni chat isključen.");
                return;
            }

            // Postavljanje novog selektovanog gosta
            if (selectedGuest) {
                selectedGuest.style.backgroundColor = ''; // Resetuje prethodnog gosta
            }

            selectedGuest = event.target; // Postavlja novog gosta
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Providna žuta traka
            privateChatRequest = true; // Uključuje zahtev za privatni chat

            // Prikazivanje opcije za prihvatanje ili odbijanje privatnog chata
            const username = event.target.textContent;
            const confirmation = confirm(`${username} je pozvan na privatni chat. Da li želiš da prihvatiš?`);

            if (confirmation) {
                chatInput.value = `---->>> ${username} : `;
                console.log("Privatni chat sa: ", username);
            } else {
                selectedGuest.style.backgroundColor = ''; // Uklanja selekciju ako je odbijen privatni chat
                selectedGuest = null; // Resetuje selektovanog gosta
                privateChatRequest = false; // Odbija privatni chat
                console.log("Privatni chat odbijen.");
            }
        }
    });

    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            let message = chatInput.value;

            if (privateChatRequest && selectedGuest) {
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

