let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    if (!isPrivateChatEnabled) {
        selectedGuest = null; // Resetujemo selektovanog gosta
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

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Ako je isti gost kliknut, ne prebacuje selekciju
            if (selectedGuest === event.target) return;

            // Postavljanje selektovanog gosta
            selectedGuest = event.target;
            document.querySelectorAll('.guest').forEach(guest => {
                guest.style.backgroundColor = ''; // Resetovanje boja svih gostiju
            });

            // Dodavanje vizualne indikacije za selektovanog gosta
            selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Providna žuta boja
            isPrivateChatEnabled = true;

            // Forma poruke za privatni chat
            chatInput.value = `---->>> ${selectedGuest.textContent} : `;
            console.log("Privatni chat sa: ", selectedGuest.textContent);
        }
    });

    // Kada korisnik pošalje poruku, ostaje u privatnom modu dok ne isključi privatni chat
    document.getElementById('privateMessage').addEventListener('click', () => {
        isPrivateChatEnabled = !isPrivateChatEnabled;
        const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

        if (!isPrivateChatEnabled) {
            selectedGuest = null; // Resetujemo selektovanog gosta
            document.querySelectorAll('.guest').forEach(guest => {
                guest.style.backgroundColor = ''; // Resetujemo stil gostiju
            });
            chatInput.value = ''; // Resetujemo input polje
        }

        console.log(statusText);
    });
});
