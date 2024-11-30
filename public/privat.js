document.addEventListener('DOMContentLoaded', () => {
    const massagerArea = document.getElementById('massagerArea'); // Pretpostavljam da imate ovaj div
    const modal = document.getElementById('privateChatModal');
    const span = document.getElementsByClassName('close')[0];
    const togglePrivateChatBtn = document.getElementById('togglePrivateChat');

    // Desni klik na massager area
    massagerArea.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Sprečava prikazivanje kontekstnog menija
        modal.style.display = 'block'; // Otvara modal
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
        // Logika za uključivanje ili isključivanje privatnog chata
        // Možda pozivanje socket emit funkcije ovde
        console.log("Toggle privatni chat");
        // Ovde dodajte svoju logiku, na primer emitovanje događaja socketu
    }
});
