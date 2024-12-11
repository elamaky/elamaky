let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    // Resetovanje stanja ako isključimo privatni chat
    if (!isPrivateChatEnabled) {
        selectedGuest = null; // Resetujemo selektovanog gosta
        document.querySelectorAll('.guest').forEach(guest => {
            guest.style.backgroundColor = ''; // Resetujemo stil gostiju
        });
        document.getElementById('chatInput').value = ''; // Očistimo input polje
    }

    console.log(statusText);
    alert(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Prebacivanje stanja za privatni chat
            selectedGuest = event.target;
            document.querySelectorAll('.guest').forEach(guest => {
                guest.style.backgroundColor = ''; // Resetujemo boje
            });

            selectedGuest.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'; // Isticanje selektovanog gosta
            isPrivateChatEnabled = true;
            chatInput.value = `---->>> ${selectedGuest.textContent} : `; // Forma poruke za privatni chat
            console.log("Privatni chat sa: ", selectedGuest.textContent);
        }
    });

    // Ovaj deo ne menja ništa vezano za slanje poruka
});

