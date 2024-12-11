let selectedUser = null; // Odabran korisnik za privatni chat
let isPrivateChatEnabled = false; // Status privatnog chata

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    console.log("Kliknuto na dugme za privatnu poruku");

    // Prebacivanje stanja privatnog chata
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    console.log(statusText); // Logujemo status privatnog chata
    alert(statusText); // Prikazujemo status privatnog chata
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Uklanjamo prethodno obeležavanje
            document.querySelectorAll('.guest').forEach(guest => {
                guest.style.backgroundColor = ''; // Resetujemo boju
            });

            // Obeležavamo kliknutog gosta
            const selectedGuest = event.target;
            selectedGuest.style.backgroundColor = 'rgba(0, 0, 255, 0.1)';

            console.log(`Odabran gost: ${selectedGuest.textContent}`);
        }
    });
});


