document.addEventListener('DOMContentLoaded', () => {
    const messageArea = document.getElementById('messageArea');
    const contextMenu = document.getElementById('contextMenu');
    const togglePrivateChatBtn = document.getElementById('togglePrivateChat');
    
    // Spisak dozvoljenih nickova
    const allowedNicknames = ["Radio Galaksija", "ZI ZU", "__X__"];

    // Pretpostavljam da imaš način da dođeš do trenutnog korisnikovog nadimka
    let currentUserNickname = getCurrentUserNickname(); // Funkcija koja vraća trenutni korisnički nick
    let isPrivateChatEnabled = false; // Stanje privatnog chata

    // Desni klik na messageArea
    messageArea.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Sprečava prikazivanje kontekstnog menija
        if (allowedNicknames.includes(currentUserNickname)) {
            contextMenu.style.display = 'block'; // Prikazivanje kontekstnog menija
            contextMenu.style.left = `${event.pageX}px`; // Pozicija po X
            contextMenu.style.top = `${event.pageY}px`; // Pozicija po Y
        }
    });

    // Zatvori kontekstni meni kada se klikne bilo gde
    window.addEventListener('click', function(event) {
        if (event.target !== contextMenu && !contextMenu.contains(event.target)) {
            contextMenu.style.display = 'none'; // Kritična logika za zatvaranje menija
        }
    });

    // Uključivanje/isključivanje privatnog chata
    togglePrivateChatBtn.onclick = function() {
        isPrivateChatEnabled = !isPrivateChatEnabled; // Preokretanje stanja privatnog chata
        togglePrivateChatBtn.innerText = isPrivateChatEnabled ? "Isključi Privatni Chat" : "Uključi Privatni Chat";

        console.log(isPrivateChatEnabled ? "Privatni Chat Uključen" : "Privatni Chat Isključen");
        // Ovde možete dodati dodatnu logiku da obavestite server ili izmenite stanje
    });
});

// Dummy funkcija za dobijanje trenutnog korisničkog nadimka, promenite ovo prema vašim potrebama
function getCurrentUserNickname() {
    return "Radio Galaksija"; // Ovo je samo primer
}
