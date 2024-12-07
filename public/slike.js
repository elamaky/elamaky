// Globalne promenljive
let currentImage; // Promenljiva za trenutnu sliku
let allImages = []; // Niz za sve slike

// Prikazivanje slika kada se poveže sa serverom
socket.on('initial-images', (currentImages) => {
    currentImages.forEach(image => {
        addImageToDOM(image.imageUrl, image.position, image.dimensions);
    });
});

// Prikazivanje novih slika
socket.on('display-image', (imageData) => {
    addImageToDOM(imageData.imageUrl, imageData.position, imageData.dimensions);
});

// Sinhronizacija promena slike
socket.on('sync-image', (data) => {
    updateImageInDOM(data);
});

// Funkcija za dodavanje slike u DOM
function addImageToDOM(imageUrl, position = { x: 50, y: 50 }, dimensions = { width: 200, height: 200 }) {
    currentImage = document.createElement('img');
    currentImage.src = imageUrl;

    // Postavljanje dimenzija slike
    currentImage.style.width = `${dimensions.width}px`;
    currentImage.style.height = `${dimensions.height}px`;

    // Pozicioniranje slike u centar ekrana (početne pozicije)
    currentImage.style.position = "absolute";
    currentImage.style.left = `${position.x}%`;
    currentImage.style.top = `${position.y}%`;
    currentImage.style.transform = "translate(-50%, -50%)"; // Centriranje slike

    currentImage.style.zIndex = "1000"; // Pravilno pozicioniranje slike
    currentImage.classList.add('draggable', 'resizable');
    currentImage.style.border = "none";

    // Omogućavanje interakcije za prijavljene korisnike
    if (isLoggedIn) {
        currentImage.style.pointerEvents = "auto"; // Omogućava klikove i interakciju
        enableDragAndResize(currentImage); // Omogućava drag i resize
    } else {
        currentImage.style.pointerEvents = "none"; // Onemogućava klikove
    }

    // Dodajemo sliku u DOM
    document.body.appendChild(currentImage);

    // Emitovanje ažuriranja slike posle dodavanja
    socket.emit('update-image', {
        imageUrl: currentImage.src,
        position: { x: parseFloat(currentImage.style.left), y: parseFloat(currentImage.style.top) },
        dimensions: { width: parseFloat(currentImage.style.width), height: parseFloat(currentImage.style.height) }
    });
}

// Funkcija za omogućavanje drag i resize funkcionalnosti
function enableDragAndResize(img) {
    let isResizing = false;
    let resizeSide = null;

    img.addEventListener('mouseenter', function () {
        img.style.border = "2px dashed red";
    });

    img.addEventListener('mouseleave', function () {
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
}

// Funkcija koja omogućava pomeranje ili promenu dimenzija slike
function onImageMoveOrResize(image) {
    const newPosition = { x: image.style.left, y: image.style.top };
    const newDimensions = { width: image.style.width, height: image.style.height };
    
    // Pozivamo funkciju da pošalje promene serveru
    updateImagePositionAndSize(image, newPosition, newDimensions);
}

// Kada se promeni dimenzija ili pozicija slike, pozivamo funkciju
currentImage.addEventListener('dragend', function () {
    onImageMoveOrResize(currentImage);
});

socket.on('sync-image', (data) => {
    const syncedImage = document.querySelector(`img[src="${data.imageUrl}"]`); // Izvor slike
    if (syncedImage) {
        syncedImage.style.left = data.position.x;
        syncedImage.style.top = data.position.y;
        syncedImage.style.width = data.dimensions.width;
        syncedImage.style.height = data.dimensions.height;
    }
});
