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
        } else {
            alert("Nepodržan format slike. Podržani formati su: JPG, PNG, GIF.");
        }
    } else {
        alert("Niste uneli URL slike.");
    }
});

// Osluškujemo 'display-image' događaj sa servera
socket.on('display-image', (imageData) => {
    addImageToDOM(imageData.imageUrl, imageData.width, imageData.height, imageData.left, imageData.top);
});

function addImageToDOM(imageUrl, width = 200, height = 200, left = 0, top = 0) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = width + "px";
    img.style.height = height + "px";
    img.style.left = left + "px";
    img.style.top = top + "px";
    img.style.position = "absolute";
    img.style.zIndex = "1000";
    img.classList.add('draggable', 'resizable');
    img.style.border = "none";
    
    // Omogućavanje interakcije samo za prijavljene korisnike
    if (isLoggedIn) {
        img.style.pointerEvents = "auto";
        enableDragAndResize(img);
    } else {
        img.style.pointerEvents = "none"; // Onemogućava klikove
    }
    
    document.body.appendChild(img); // Učitaj sliku u DOM
}

// Osluškujem promene slika sa servera
socket.on('update-image', ({ imageUrl, newWidth, newHeight, newPosition }) => {
    const imageElement = document.querySelector(`img[src="${imageUrl}"]`);
    if (imageElement) {
        // Ažuriraj slike
        imageElement.style.width = newWidth + "px";
        imageElement.style.height = newHeight + "px";
        imageElement.style.left = newPosition.left + "px";
        imageElement.style.top = newPosition.top + "px";
    }
});

// Osluškujemo učitavanje svih slika
socket.on('initial-images', (images) => {
    images.forEach(({ imageUrl, width, height, left, top }) => {
        addImageToDOM(imageUrl, width, height, left, top);
    });
});

function enableDragAndResize(img) {
    let isResizing = false;
    let resizeSide = null;

    img.addEventListener('mouseenter', () => {
        img.style.border = "2px dashed red";
    });

    img.addEventListener('mouseleave', () => {
        img.style.border = "none";
    });

    img.addEventListener('mousedown', function (e) {
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
            const initialWidth = img.offsetWidth;
            const initialHeight = img.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            document.onmousemove = function (e) {
                if (isResizing) {
                    if (resizeSide === 'right') {
                        img.style.width = (initialWidth + (e.clientX - startX)) + 'px';
                    } else if (resizeSide === 'bottom') {
                        img.style.height = (initialHeight + (e.clientY - startY)) + 'px';
                    } else if (resizeSide === 'left') {
                        const newWidth = initialWidth - (e.clientX - startX);
                        if (newWidth > 10) {
                            img.style.width = newWidth + 'px';
                            img.style.left = (rect.left + (e.clientX - startX)) + 'px';
                        }
                    } else if (resizeSide === 'top') {
                        const newHeight = initialHeight - (e.clientY - startY);
                        if (newHeight > 10) {
                            img.style.height = newHeight + 'px';
                            img.style.top = (rect.top + (e.clientY - startY)) + 'px';
                        }
                    }
                }
            };

            document.onmouseup = function () {
                isResizing = false;
                resizeSide = null;
                // Emitujemo nove dimenzije i poziciju
                socket.emit('update-image', {
                    imageUrl: img.src,
                    newWidth: img.offsetWidth,
                    newHeight: img.offsetHeight,
                    newPosition: { left: img.offsetLeft, top: img.offsetTop }
                });
                document.onmousemove = null;
                document.onmouseup = null;
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

        // Emitujemo novu poziciju
        socket.emit('update-image-position', {
            imageUrl: img.src,
            newPosition: { left: img.offsetLeft, top: img.offsetTop }
        });
    }
}

// Osluškujem promene sinhronizacije slike
socket.on('sync-image', (data) => {
    const img = document.querySelector(`img[src="${data.imageUrl}"]`);
    if (img) {
        img.style.left = data.position.x;
        img.style.top = data.position.y;
        img.style.width = data.dimensions.width;
        img.style.height = data.dimensions.height;
    }
});
