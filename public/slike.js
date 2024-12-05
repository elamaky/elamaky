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

document.getElementById('addImage').addEventListener('click', function () {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");

    if (imageSource) {
        const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageSource.split('.').pop().toLowerCase();

        if (validFormats.includes(fileExtension)) {
            // Emitujemo URL slike serveru pod imenom 'add-image'
            socket.emit('add-image', imageSource);

            // Osluškujemo 'display-image' događaj sa servera
            socket.on('display-image', (imageUrl) => {
                addImageToDOM(imageUrl);  // Prikaz nove slike koju je server poslao
            });

        } else {
            alert("Nepodržan format slike. Podržani formati su: JPG, PNG, GIF.");
        }
    } else {
        alert("Niste uneli URL slike.");
    }
});

// Prikaz svih prethodnih slika kad se poveže klijent
socket.on('initial-images', (images) => {
    images.forEach((image) => {
        addImageToDOM(image);
    });
});

function addImageToDOM(imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;

    img.onload = () => {
        console.log("Slika učitana: ", imageUrl);
    };

    img.onerror = () => {
        console.error("Greška pri učitavanju slike: ", imageUrl);
    };

    img.style.width = "200px";
    img.style.height = "200px";
    img.style.position = "absolute";
    img.style.zIndex = "1000"; 
    img.classList.add('draggable', 'resizable');
    img.style.border = "none";

    // Omogućavanje interakcije samo za prijavljene korisnike
    if (isLoggedIn) {
        img.style.pointerEvents = "auto"; 
        enableDragAndResize(img); 
    } else {
        img.style.pointerEvents = "none"; 
    }

    document.body.appendChild(img); // Učitaj sliku u DOM
}

function enableDragAndResize(img) {
    let isResizing = false;
    let resizeSide = null;

    img.addEventListener('mousedown', function (e) {
        // Zapocni povlačenje ili promenu veličine
        const rect = img.getBoundingClientRect();
        const borderSize = 10;

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
        } else {
            dragMouseDown(e);
        }

        // Previđanje pokreta
        document.onmousemove = function (e) {
            if (isResizing) {
                // Promena veličine slike
                const initialWidth = img.offsetWidth;
                const initialHeight = img.offsetHeight;

                if (resizeSide === 'right') {
                    img.style.width = initialWidth + (e.clientX - rect.right) + 'px';
                } else if (resizeSide === 'bottom') {
                    img.style.height = initialHeight + (e.clientY - rect.bottom) + 'px';
                } else if (resizeSide === 'left') {
                    const newWidth = initialWidth - (e.clientX - rect.left);
                    if (newWidth > 10) {
                        img.style.width = newWidth + 'px';
                        img.style.left = rect.left + (e.clientX - rect.left) + 'px';
                    }
                } else if (resizeSide === 'top') {
                    const newHeight = initialHeight - (e.clientY - rect.top);
                    if (newHeight > 10) {
                        img.style.height = newHeight + 'px';
                        img.style.top = rect.top + (e.clientY - rect.top) + 'px';
                    }
                }
                emitImageUpdate(img);
            }
        };

        document.onmouseup = function () {
            isResizing = false;
            resizeSide = null;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    });

    function dragMouseDown(e) {
        e.preventDefault();
        let pos3 = e.clientX;
        let pos4 = e.clientY;

        document.onmousemove = function (e) {
            img.style.top = (img.offsetTop - (pos4 - e.clientY)) + 'px';
            img.style.left = (img.offsetLeft - (pos3 - e.clientX)) + 'px';
            pos3 = e.clientX;
            pos4 = e.clientY;

            emitImageUpdate(img);
        };

        document.onmouseup = closeDragElement;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Emitovanje ažuriranih informacija o slici
function emitImageUpdate(img) {
    socket.emit('update-image', {
        imageUrl: img.src,
        position: { x: img.style.left, y: img.style.top },
        dimensions: { width: img.style.width, height: img.style.height }
    });
}

// Osluškujem promene slika sa servera
socket.on('sync-image', (data) => {
    const img = document.querySelector(`img[src="${data.imageUrl}"]`);
    if (img) {
        img.style.left = data.position.x;
        img.style.top = data.position.y;
        img.style.width = data.dimensions.width;
        img.style.height = data.dimensions.height;
    }
});
