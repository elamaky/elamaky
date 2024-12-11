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

guestList.addEventListener('click', (event) => {
    if (event.target.classList.contains('guest')) {
        selectedGuest = event.target;
        selectedGuest.style.backgroundColor = 'rgba(0, 0, 255, 0.1)';
        chatInput.value = `SALJE ----->>> ${selectedGuest.textContent} : `;
    }
});

function sendMessage() {
    const message = chatInput.value;
    const currentTime = new Date().toLocaleTimeString(); // Uzima trenutnu vremensku oznaku
    
    if (message && selectedGuest) {
        // Kreiramo div za poruku
        const messageElement = document.createElement('div');
        
        // Formatiramo poruku
        messageElement.textContent = `Salje: ${message} --->>> Prima: ${selectedGuest.textContent} | Vreme: ${currentTime}`;
        
        // Dodajemo poruku u messageArea
        messageArea.appendChild(messageElement);
        
        // Očistimo chatInput
        chatInput.value = '';
        
        console.log(`Poruka za ${selectedGuest.textContent}: ${message} u ${currentTime}`);
        
        // Dodajte logiku za slanje poruke na server, ako je potrebno
    }
}

