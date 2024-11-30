document.addEventListener('DOMContentLoaded', () => {
    const messageArea = document.getElementById('messageArea');
    const modal = document.getElementById('privateChatModal');
    const span = document.getElementsByClassName('close')[0];
    const togglePrivateChatBtn = document.getElementById('togglePrivateChat');

    // Spisak dozvoljenih nickova
    const allowedNicknames = ["Radio Galaksija", "ZI ZU", "__X__"];

    // Pretpostavljam da imaš način da dođeš do trenutnog korisnikovog nadimka
    let currentUserNickname = getCurrentUserNickname(); // Ovde treba implementirati funkciju za dobijanje korisničkog nadimka

    // Desni klik na messageArea
    messageArea.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Sprečava prikazivanje kontekstnog menija
        if (allowedNicknames.includes(currentUserNickname)) {
            modal.style.display = 'block'; // Otvara modal
        }
    });

    // Zatvori modal kada se klikne na X
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Zatvori modal kada se klikne van njega
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Uključivanje/isključivanje privatnog chata
    togglePrivateChatBtn.onclick = function() {
        console.log("Toggle privatni chat");
        // Ovde dodajte vašu logiku za uključivanje ili isključivanje privatnog chata, kao što je emitovanje preko socket-a
    }
});

// Dummy funkcija za dobijanje trenutnog korisničkog nadimka, promenite ovo prema vašim potrebama
function getCurrentUserNickname() {
    // Ovdje treba implementirati stvarni način da dobijete trenutni nadimak korisnika
    return "Radio Galaksija"; // Ovo je samo primer
}
