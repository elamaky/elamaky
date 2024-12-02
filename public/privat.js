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
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");

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
            img.style.zIndex = "1000";  // Dodajemo z-index da bude ispred drugih elemenata
            img.classList.add('draggable');  // Dodajemo klasu za pomeranje
            img.classList.add('resizable');  // Dodajemo klasu za menjanje dimenzija
            document.getElementById('chatContainer').appendChild(img);
            enableDragAndResize(img); // Poziv funkcije za pomeranje i promenu dimenzija
            console.log("Slika je dodata preko URL-a.");
        } else {
            alert("Nepodržan format slike. Podržani formati su: JPG, PNG, GIF.");
        }
    } else {
        alert("Niste uneli URL slike.");
    }
});

function enableDragAndResize(img) {
    let isResizing = false;
    let resizeSide = null;

    // Podesi stilove slike da se ponaša kao pozadina
    img.style.position = "absolute";
    img.style.zIndex = "1"; // Postavlja sliku ispod glavnih elemenata
    img.style.opacity = "0.9"; // Lagana prozirnost za efekat pozadine

    // Omogući pomeranje slike
    img.onmousedown = function (e) {
        if (!isResizing) {
            e.preventDefault();
            let pos3 = e.clientX;
            let pos4 = e.clientY;

            document.onmousemove = function (e) {
                e.preventDefault();
                const pos1 = pos3 - e.clientX;
                const pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                img.style.top = (img.offsetTop - pos2) + "px";
                img.style.left = (img.offsetLeft - pos1) + "px";
            };

            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    };

    // Dodaj dugme za uklanjanje slike
    img.addEventListener('click', function (e) {
        e.stopPropagation();
        img.style.border = "2px dashed blue"; // Prikaz granica slike

        if (!img.querySelector('.close-button')) {
            const closeButton = document.createElement('div');
            closeButton.innerHTML = 'X';
            closeButton.classList.add('close-button');
            closeButton.style.position = 'absolute';
            closeButton.style.top = '-10px';
            closeButton.style.right = '-10px';
            closeButton.style.width = '20px';
            closeButton.style.height = '20px';
            closeButton.style.background = 'red';
            closeButton.style.color = 'white';
            closeButton.style.fontSize = '14px';
            closeButton.style.fontWeight = 'bold';
            closeButton.style.borderRadius = '50%';
            closeButton.style.textAlign = 'center';
            closeButton.style.lineHeight = '20px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.zIndex = '2000';

            closeButton.addEventListener('click', function () {
                img.remove();
            });

            img.appendChild(closeButton);
        }
    });

    // Omogući promenu dimenzija slike
    img.addEventListener('mousedown', function (e) {
        if (e.target.className.includes('close-button')) return;

        const initialWidth = img.offsetWidth;
        const initialHeight = img.offsetHeight;
        const startX = e.clientX;
        const startY = e.clientY;

        isResizing = true;

        document.onmousemove = function (e) {
            const newWidth = initialWidth + (e.clientX - startX);
            const newHeight = initialHeight + (e.clientY - startY);

            img.style.width = newWidth + 'px';
            img.style.height = newHeight + 'px';
        };

        document.onmouseup = function () {
            isResizing = false;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    });
}
