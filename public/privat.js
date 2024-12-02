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

document.getElementById('addImage').addEventListener('click', function () {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");

    if (imageSource) {
        // Provera da li je URL slike u validnom formatu (JPG, PNG, GIF)
        const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageSource.split('.').pop().toLowerCase();

        if (validFormats.includes(fileExtension)) {
            addImageWithControls(imageSource); // Dodavanje slike sa kontrolama
            console.log("Slika je dodata preko URL-a.");
        } else {
            alert("Nepodržan format slike. Podržani formati su: JPG, PNG, GIF.");
        }
    } else {
        alert("Niste uneli URL slike.");
    }
});

function addImageWithControls(url) {
    const img = document.createElement('img');
    img.src = url;
    img.style.position = 'absolute';
    img.style.width = '200px';
    img.style.height = '200px';
    img.style.zIndex = '1'; // Manji z-index da bude ispod poruka i gostiju
    img.style.top = '50px';
    img.style.left = '50px';
    img.style.border = '1px solid #000'; // Jasne granice slike
    img.style.backgroundColor = 'white'; // Da slika ima jasnu pozadinu

    // Dodavanje "X" za uklanjanje slike
    const closeButton = document.createElement('div');
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '0';
    closeButton.style.right = '0';
    closeButton.style.width = '20px';
    closeButton.style.height = '20px';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.style.textAlign = 'center';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '2'; // Iznad slike

    closeButton.onclick = function () {
        img.remove();
    };

    img.appendChild(closeButton);
    document.getElementById('chatContainer').appendChild(img);

    enableDragAndResize(img);
}

// Funkcija za pomeranje i menjanje dimenzija slike
function enableDragAndResize(img) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isResizing = false;

    // Omogućavanje pomeranja slike
    img.onmousedown = function (e) {
        if (e.target !== img) return; // Ignoriši klikove na "X" ili druge elemente unutar slike

        isResizing = false; // Resetuj stanje
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = dragElement;
    };

    function dragElement(e) {
        if (isResizing) return; // Ako se menja dimenzija, ignoriši pomeranje

        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        img.style.top = (img.offsetTop - pos2) + "px";
        img.style.left = (img.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    // Promena dimenzija slike
    img.addEventListener('mousedown', function (e) {
        if (e.target === img) {
            isResizing = true; // Aktiviraj režim promene dimenzija
            const initialWidth = img.offsetWidth;
            const initialHeight = img.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            document.onmousemove = function (e) {
                if (!isResizing) return; // Ignoriši ako nije aktivno menjanje dimenzija

                const newWidth = initialWidth + (e.clientX - startX);
                const newHeight = initialHeight + (e.clientY - startY);

                img.style.width = newWidth + 'px';
                img.style.height = newHeight + 'px';
            };

            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                isResizing = false;
            };
        }
    });
}
