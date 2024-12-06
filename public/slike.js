let isLoggedIn = false; // Status autentifikacije

document.getElementById('openModal').addEventListener('click', function() {
    if (!isLoggedIn) {
        const password = prompt("Unesite lozinku:");

        const allowedNicks = ["Radio Galaksija", "ZI ZU", "__X__", "___F117___"];
        const currentNick = "Radio Galaksija"; // Ovo treba da bude aktuelni korisnički nick.

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

    // Emituj događaj serveru za brisanje chata
    socket.emit('clear-chat'); 
});

// Slušanje na 'chat-cleared' događaj
socket.on('chat-cleared', function() {
    console.log('Chat je obrisan sa servera.');
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata
});


// Instanciranje socket konekcije
const socket = io('<your-server-url>');

// Prikaži samo trenutno stanje na klijentu
let currentImages = [];

// Dodavanje slike
document.getElementById('addImage').addEventListener('click', function () {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");

    if (imageSource) {
        const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageSource.split('.').pop().toLowerCase();

        if (validFormats.includes(fileExtension)) {
            // Emitovanje URL-a slike serveru
            socket.emit('add-image', imageSource);
            // Dodajte sliku lokalno u DOM
            addImageToDOM(imageSource);
        } else {
            alert("Nepodržan format slike. Podržani formati su: JPG, PNG, GIF.");
        }
    } else {
        alert("Niste uneli URL slike.");
    }
});

// Funkcija za dodavanje slike u DOM
function addImageToDOM(imageUrl, width = "200px", height = "200px", left = "0px", top = "0px") {
    const img = document.createElement('img');
    img.src = imageUrl;

    // Postavljanje osnovnih stilova
    img.style.width = width;
    img.style.height = height;
    img.style.position = "absolute";
    img.style.zIndex = "1000";
    img.style.border = "none";
    img.style.left = left;
    img.style.top = top;
    img.classList.add('draggable', 'resizable');

    // Omogućavanje interakcije samo za prijavljene korisnike
    img.style.pointerEvents = isLoggedIn ? "auto" : "none";
    if (isLoggedIn) {
        enableDragAndResize(img);
    }

    // Dodajte sliku u DOM
    document.body.appendChild(img);
    // Dodavanje slike u trenutne slike
    currentImages.push(img.src);
}

// Ažuriranje slika na klijentu
socket.on('update-image', (data) => {
    const img = document.querySelector(`img[src="${data.id}"]`);
    if (img) {
        img.style.left = data.position?.x || img.style.left;
        img.style.top = data.position?.y || img.style.top;
        img.style.width = data.width || img.style.width;
        img.style.height = data.height || img.style.height;
    }
});

// Ažuriranje klijentove liste slika sa novim podacima
socket.on('add-image', (imageSource) => {
    addImageToDOM(imageSource);
});

// Ažuriranje klijenta kada neko obriše sliku
socket.on('remove-image', (imageSource) => {
    const img = document.querySelector(`img[src="${imageSource}"]`);
    if (img) {
        document.body.removeChild(img);
        // Uklonite sliku iz trenutne liste slika
        currentImages = currentImages.filter(src => src !== imageSource);
    }
});

// Funkcija za omogućavanje povlačenja i promene veličine
function enableDragAndResize(img) {
    let isResizing = false;
    let resizeSide = null;

    img.addEventListener('mousedown', function (e) {
        const rect = img.getBoundingClientRect();
        const borderSize = 10;

        // Proverite koji deo slike se "hvata" za promena veličine
        if (e.clientX >= rect.left && e.clientX <= rect.left + borderSize) {
            resizeSide = 'left';
        } else if (e.clientX >= rect.right - borderSize && e.clientX <= rect.right) {
            resizeSide = 'right';
        } else if (e.clientY >= rect.top && e.clientY <= rect.top + borderSize) {
            resizeSide = 'top';
        } else if (e.clientY >= rect.bottom - borderSize && e.clientY <= rect.bottom) {
            resizeSide = 'bottom';
        }

        if (resizeSide) {
            isResizing = true;
            const initialWidth = img.offsetWidth;
            const initialHeight = img.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            document.onmousemove = function (e) {
                if (isResizing) {
                    // Ažurirate dimenzije slike na osnovu miša
                    if (resizeSide === 'right') {
                        img.style.width = initialWidth + (e.clientX - startX) + 'px';
                    } else if (resizeSide === 'bottom') {
                        img.style.height = initialHeight + (e.clientY - startY) + 'px';
                    } else if (resizeSide === 'left') {
                        const newWidth = initialWidth - (e.clientX - startX);
                        if (newWidth > 10) {
                            img.style.width = newWidth + 'px';
                            img.style.left = rect.left + (e.clientX - startX) + 'px';
                        }
                    } else if (resizeSide === 'top') {
                        const newHeight = initialHeight - (e.clientY - startY);
                        if (newHeight > 10) {
                            img.style.height = newHeight + 'px';
                            img.style.top = rect.top + (e.clientY - startY) + 'px';
                        }
                    }
                }
            };

            document.onmouseup = function () {
                isResizing = false;
                resizeSide = null;
                document.onmousemove = null;
                document.onmouseup = null;

                // Emitovanje promena serveru
                socket.emit('updateImage', {
                    id: img.src,
                    width: img.style.width,
                    height: img.style.height,
                    position: { x: img.style.left, y: img.style.top }
                });
            };
        } else {
            dragMouseDown(e);
        }
    });

    function dragMouseDown(e) {
        e.preventDefault();
        let pos3 = e.clientX;
        let pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = function (e) {
            img.style.top = (img.offsetTop - (pos4 - e.clientY)) + 'px';
            img.style.left = (img.offsetLeft - (pos3 - e.clientX)) + 'px';
            pos3 = e.clientX;
            pos4 = e.clientY;
        };
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
};
