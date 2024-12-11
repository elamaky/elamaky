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
    let selectedGuest = null; // Varijabla za trenutnog selektovanog gosta

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Ako je gost već selektovan, uklanjamo obeležavanje
            if (selectedGuest === event.target) {
                selectedGuest.classList.remove('selected');
                selectedGuest = null; // Resetujemo selektovanog gosta
                chatInput.placeholder = ''; // Resetujemo placeholder za poruku
                console.log('Selektovanje gosta uklonjeno.');
            } else {
                // Ako nije selektovan, obeležavamo novog gosta
                if (selectedGuest) {
                    selectedGuest.classList.remove('selected'); // Uklanjamo prethodno selektovanog
                }

                selectedGuest = event.target;
                selectedGuest.classList.add('selected'); // Dodajemo obeležavanje
                chatInput.placeholder = `Poruka za ${selectedGuest.textContent}...`; // Ažurira placeholder
                console.log(`Odabran gost: ${selectedGuest.textContent}`);
            }
        }
    });
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

