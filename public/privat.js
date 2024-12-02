let isLoggedIn = false; // Status autentifikacije

document.getElementById('openModal').addEventListener('click', function() {
    if (!isLoggedIn) {
        const password = prompt("Unesite lozinku:");

        const allowedNicks = ["Radio Galaksija", "ZI ZU", "__X__", "___F117___"];
        const currentNick = "OVDE_UNESITE_NICK"; // Ovo treba da bude aktuelni korisnički nick.

        if (allowedNicks.includes(currentNick) || password === "123galaksija") {
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
            img.style.width = "200px";  // Postavljanje početne širine
            img.style.height = "200px"; // Postavljanje početne visine
            img.style.position = "absolute";  // Omogućava pomeranje slike unutar chat-a
            img.classList.add('draggable');  // Dodajemo klasu za pomeranje
            img.classList.add('resizable');  // Dodajemo klasu za menjanje dimenzija
            document.getElementById('chatContainer').appendChild(img);
            enableDragAndResize(img); // Poziv funkcije za pomeranje i promenu dimenzija
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
                        img.style.width = "200px";  // Postavljanje početne širine
                        img.style.height = "200px"; // Postavljanje početne visine
                        img.style.position = "absolute";  // Omogućava pomeranje slike unutar chat-a
                        img.classList.add('draggable');  // Dodajemo klasu za pomeranje
                        img.classList.add('resizable');  // Dodajemo klasu za menjanje dimenzija
                        document.getElementById('chatContainer').appendChild(img);
                        enableDragAndResize(img); // Poziv funkcije za pomeranje i promenu dimenzija
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

// Funkcija za omogućavanje pomeranja i menjanje dimenzija slika
function enableDragAndResize(img) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isResizing = false;

    // Omogućavanje pomeranja slike
    img.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Pozicioniraj kursor u prvi quadrant
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Pomeraj element
        img.style.top = (img.offsetTop - pos2) + "px";
        img.style.left = (img.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
    // Funkcija za promenu dimenzija slike
    img.addEventListener('mousedown', function(e) {
        e.preventDefault();

        const initialWidth = img.offsetWidth;
        const initialHeight = img.offsetHeight;
        const startX = e.clientX;
        const startY = e.clientY;

        document.onmousemove = function(e) {
            const newWidth = initialWidth + (e.clientX - startX);
            const newHeight = initialHeight + (e.clientY - startY);

            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
        };

        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    });
}
