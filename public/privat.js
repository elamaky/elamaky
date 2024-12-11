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
    const chatInput = document.getElementById('chatInput');
    const messageArea = document.getElementById('messageArea');
    let selectedGuest = null;
    let senderNickname = "Gost-4444"; // Ovaj nadimak treba da bude dinamički dodeljen

    guestList.addEventListener('click', (event) => {
        if (event.target.classList.contains('guest')) {
            // Ako je već selektovan gost, uklonimo obeležavanje
            if (selectedGuest === event.target) {
                event.target.style.backgroundColor = '';  // Uklanjamo providnu traku
                selectedGuest = null;
                chatInput.value = ''; // Očistimo formu za unos kada je kliknut isti gost
            } else {
                // Uklanjamo prethodno obeležavanje
                document.querySelectorAll('.guest').forEach(guest => {
                    guest.style.backgroundColor = ''; // Resetujemo boju
                });

                // Obeležavamo kliknutog gosta
                selectedGuest = event.target;
                selectedGuest.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'; // Providna traka preko odabranog gosta

                // Prikazujemo format poruke u chat inputu
                chatInput.value = `${senderNickname} ---->>> ${selectedGuest.textContent} : `;
            }
        }
    });
});

 // Funkcija za slanje poruke
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

    // Povezivanje dugmeta za slanje poruke (ako postoji)
    const sendButton = document.getElementById('sendMessage');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
});

