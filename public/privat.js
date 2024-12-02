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

// Dodavanje slike sa URL-a ili lokalnog računara
document.getElementById('addImage').addEventListener('click', function() {
    const imageSource = prompt("Unesite URL slike ili ostavite prazno za upload sa računara:");

    if (imageSource) {
        // Dodavanje slike preko URL-a
        addImage(imageSource);
    } else {
        // Dodavanje slike sa lokalnog računara
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    addImage(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    }
});

// Funkcija za dodavanje slike
function addImage(imageSource) {
    const img = document.createElement('img');
    img.src = imageSource;
    img.style.width = '200px'; // Početne dimenzije
    img.style.height = '200px'; // Početne dimenzije
    img.classList.add('draggable'); // Dodajemo klasu za pomeranje
    img.classList.add('resizable'); // Dodajemo klasu za promenu dimenzija
    img.style.position = 'absolute'; // Postavljanje slike na apsolutnu poziciju

    // Dodajemo dugme za uklanjanje slike, nevidljivo na početku
    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.classList.add('closeButton');
    closeButton.style.display = 'none'; // Početno je nevidljivo
    img.appendChild(closeButton);

    document.getElementById('chatContainer').appendChild(img);

    // Pomeranje slike
    makeImageDraggable(img);
    
    // Promena dimenzija slike
    makeImageResizable(img);

    // Prikazivanje dugmeta za uklanjanje kada se kursor postavi na sliku
    img.addEventListener('mouseenter', function() {
        closeButton.style.display = 'block';
    });
    img.addEventListener('mouseleave', function() {
        closeButton.style.display = 'none';
    });

    // Uklanjanje slike
    closeButton.addEventListener('click', function() {
        img.remove();
    });
}
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
function makeImageResizable(img) {
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
