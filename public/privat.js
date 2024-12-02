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
        const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageSource.split('.').pop().toLowerCase();

        if (validFormats.includes(fileExtension)) {
            const img = document.createElement('img');
            img.src = imageSource;
            img.style.width = "200px";
            img.style.height = "200px";
            img.style.position = "absolute";
            img.style.zIndex = "1000";
            img.classList.add('draggable');
            img.classList.add('resizable');

            document.body.appendChild(img);

          img.addEventListener('dblclick', function () {
    img.remove();

       });

            enableDragAndResize(img);
        } else {
            alert("Nepodržan format slike. Podržani formati su: JPG, PNG, GIF.");
        }
    } else {
        alert("Niste uneli URL slike.");
    }
});

function enableDragAndResize(img) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isResizing = false;
    let resizeSide = null;

    img.addEventListener('mousedown', function (e) {
        const rect = img.getBoundingClientRect();
        const borderSize = 10;

        if (e.clientX >= rect.right - borderSize && e.clientY >= rect.bottom - borderSize) {
            isResizing = true;
            const initialWidth = img.offsetWidth;
            const initialHeight = img.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            document.onmousemove = function (e) {
                if (isResizing) {
                    if (resizeSide === 'right') {
                        img.style.width = initialWidth + (e.clientX - startX) + 'px';
                    } else if (resizeSide === 'bottom') {
                        img.style.height = initialHeight + (e.clientY - startY) + 'px';
                    }
                }
            };

            document.onmouseup = function () {
                isResizing = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        } else {
            dragMouseDown(e);
        }
    });

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        img.style.top = (img.offsetTop - pos2) + 'px';
        img.style.left = (img.offsetLeft - pos1) + 'px';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
