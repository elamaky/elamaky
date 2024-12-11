let isPrivateChatEnabled = false; // Status privatnog chata
let senderNickname = "Gost-1234"; // Primer imena korisnika
let selectedGuest = null;

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    if (!isPrivateChatEnabled) {
        selectedGuest = null; // Resetujemo selektovanog gosta
        document.getElementById('chatInput').value = ""; // Čistimo chat input
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.backgroundColor = ''; // Resetujemo stil gostiju
        });
    }

    console.log(statusText);
    alert(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');
    const messageArea = document.getElementById('messageArea');

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Prebacivanje stanja za privatni chat
            selectedGuest = event.target;
            document.querySelectorAll('.guest').forEach(guest => {
                guest.style.backgroundColor = ''; // Resetujemo boje
            });

            selectedGuest.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'; // Isticanje selektovanog gosta
            isPrivateChatEnabled = true;
            chatInput.value = `---->>> ${selectedGuest.textContent} : `;
            console.log("Privatni chat sa: ", selectedGuest.textContent);
        }
    });

        if (message && isPrivateChatEnabled && selectedGuest) {
                // Proveravamo da li je poruka već dodata (sprečavanje dupliranja)
                const existingMessages = Array.from(messageArea.children);
                const isDuplicate = existingMessages.some(msg => msg.textContent.includes(message));

                if (!isDuplicate) {
                    // Kreiramo div za poruku
                    const messageElement = document.createElement('div');
                    messageElement.textContent = `${message} --->>> Prima: ${selectedGuest.textContent}`;

                // Ovde dodaj logiku za slanje na server
            } else {
                console.log("Poruka nije validna ili gost nije selektovan.");
            }
        }
    });
});


