let isLoggedIn = false; // Status autentifikacije

document.getElementById('openModal').addEventListener('click', function() {
    if (!isLoggedIn) {
        const password = prompt("Unesite lozinku:");

        const allowedNicks = ["Radio Galaksija", "ZI ZU", "__X__", "___F117___"];
        const currentNick = "OVDE_UNESITE_NICK"; // Ovo treba da bude aktuelni korisnički nick.

        if (allowedNicks.includes(currentNick) || password === "galaksija123") {
            isLoggedIn = true; // Postavljamo status na login
            document.getElementById('functionModal').style.display = "block";
        } else {
            alert("Nemate dozvolu da otvorite ovaj panel.");
        }
    } else {
        document.getElementById('functionModal').style.display = "block"; // Otvaramo modal ako je korisnik već prijavljen
    }
});

// Dodaj funkcionalnost za zatvaranje prozora kada se klikne na "X"
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('functionModal').style.display = "none";
});

// Zatvori prozor kada se klikne van njega
window.onclick = function(event) {
    const modal = document.getElementById('functionModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Brisanje sadržaja chata
document.getElementById('clearChat').addEventListener('click', function() {
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata
    console.log("Chat je obrisan.");
});

document.getElementById('addImage').addEventListener('click', function() {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF) ili ostavite prazno za upload sa računara:");

    if (imageSource) {
        // Provera da li je URL slike u validnom formatu (JPG, PNG, GIF)
        const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageSource.split('.').pop().toLowerCase();
        
        if (validFormats.includes(fileExtension)) {
            // Dodavanje slike preko URL-a
            const img = document.createElement('img');
            img.src = imageSource;  // Podesi 'src' na URL slike
            img.style.maxWidth = "200px";  // Postavljanje početne širine
            img.style.maxHeight = "200px"; // Postavljanje početne visine
            img.style.position = "absolute";  // Omogućava pomeranje slike unutar chat-a
            document.getElementById('chatContainer').appendChild(img);
            console.log("Slika je dodata preko URL-a.");
        } else {
            alert("Nepodržan format slike. Podržani formati su: JPG, PNG, GIF.");
        }
    } else {
        // Dodavanje slike sa lokalnog računara
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg, image/png, image/gif';  // Filtriraj samo slike JPG, PNG, GIF
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                // Provera tipa fajla
                const validFormats = ['image/jpeg', 'image/png', 'image/gif'];
                if (validFormats.includes(file.type)) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;  // Podesi 'src' na Base64 sadržaj
                        img.style.maxWidth = "200px";  // Postavljanje početne širine
                        img.style.maxHeight = "200px"; // Postavljanje početne visine
                        img.style.position = "absolute";  // Omogućava pomeranje slike unutar chat-a
                        document.getElementById('chatContainer').appendChild(img);
                        console.log("Slika je dodata sa računara.");
                    };
                    reader.readAsDataURL(file);  // Konvertuje sliku u Base64 format
                } else {
                    alert("Nepodržan format fajla. Podržani formati su: JPG, PNG, GIF.");
                }
            }
        };
        fileInput.click();
    }
});

