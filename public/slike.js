// Globalne promenljive
let currentImage; // Promenljiva za trenutnu sliku
let allImages = []; // Niz za sve slike

document.getElementById('addImage').addEventListener('click', function () {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");

    if (imageSource) {
        const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageSource.split('.').pop().toLowerCase();

        if (validFormats.includes(fileExtension)) {
            // Emitujemo URL slike serveru pod imenom 'add-image'
            socket.emit('add-image', imageSource);
        } else {
            alert('Format slike nije podržan. Podržani formati su: JPG, PNG, GIF.');
        }
    } else {
        alert('URL slike nije unet.');
    }
});

// Osluškujemo 'display-image' događaj sa servera
socket.on('display-image', (imageUrl) => {
    addImageToDOM(imageUrl); // Prikaz nove slike koju je server poslao
});

// Prikaz svih prethodnih slika kad se poveže klijent
socket.on('initial-images', (images) => {
    images.forEach(addImageToDOM); // Dodaj sve slike koje su već dodate
});

// Funkcija za dodavanje slike u DOM
function addImageToDOM(imageUrl) {
    const newImage = document.createElement('img');
    newImage.src = imageUrl;
    newImage.style.width = "200px"; // Dodato 'px'
    newImage.style.height = "200px"; // Dodato 'px'
    newImage.style.position = "absolute";
    newImage.style.bottom = "50px"; // Dodato 'px'
    newImage.style.left = "50px"; // Dodato 'px'
    newImage.style.zIndex = "1000"; // Dodato za pravilno pozicioniranje slike
    newImage.classList.add('draggable', 'resizable');
    newImage.style.border = "none";

    // Omogućavanje interakcije samo za prijavljene korisnike
    if (isLoggedIn) {
        newImage.style.pointerEvents = "auto"; // Omogućava klikove i interakciju
        enableDragAndResize(newImage); // Uključi funkcionalnost za povlačenje i promenu veličine
    } else {
        newImage.style.pointerEvents = "none"; // Onemogućava klikove
    }

    document.body.appendChild(newImage); // Učitaj sliku u DOM
    
    // Emitovanje ažuriranja slike posle dodavanja
    emitImageUpdate(newImage);
}

function emitImageUpdate(img) {
    socket.emit('update-image', {
        imageUrl: img.src,
        position: { x: img.style.left, y: img.style.top },
        dimensions: { width: img.style.width, height: img.style.height }
    });
}

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
            initiateResize(e, img, resizeSide);
        } else {
            initiateDrag(e, img);
        }
    });

    function initiateResize(e, img, side) {
        isResizing = true;
        const initialWidth = img.offsetWidth;
        const initialHeight = img.offsetHeight;
        const startX = e.clientX;
        const startY = e.clientY;

        document.onmousemove = function (e) {
            if (isResizing) {
                const rect = img.getBoundingClientRect();
                if (side === 'right') {
                    img.style.width = initialWidth + (e.clientX - startX) + 'px';
                } else if (side === 'bottom') {
                    img.style.height = initialHeight + (e.clientY - startY) + 'px';
                } else if (side === 'left') {
                    const newWidth = initialWidth - (e.clientX - startX);
                    if (newWidth > 10) {
                        img.style.width = newWidth + 'px';
                        img.style.left = rect.left + (e.clientX - startX) + 'px';
                    }
                } else if (side === 'top') {
                    const newHeight = initialHeight - (e.clientY - startY);
                    if (newHeight > 10) {
                        img.style.height = newHeight + 'px';
                        img.style.top = rect.top + (e.clientY - startY) + 'px';
                    }
                }
                emitImageUpdate(img); // Emitovanje ažuriranja svaki put kad se slika promeni
            }
        };

        document.onmouseup = function () {
            isResizing = false;
            resizeSide = null;
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }

    function initiateDrag(e, img) {
        e.preventDefault();
        let pos3 = e.clientX;
        let pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = function (e) {
            img.style.top = (img.offsetTop - (pos4 - e.clientY)) + 'px';
            img.style.left = (img.offsetLeft - (pos3 - e.clientX)) + 'px';
            pos3 = e.clientX;
            pos4 = e.clientY;
            emitImageUpdate(img); // Emitovanje ažuriranja svaki put kad se slika pomeri
        };
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

socket.on('sync-image', (data) => {
    const syncedImage = document.querySelector(`img[src="${data.imageUrl}"]`); // Izvor slike
    if (syncedImage) {
        syncedImage.style.left = data.position.x;
        syncedImage.style.top = data.position.y;
        syncedImage.style.width = data.dimensions.width;
        syncedImage.style.height = data.dimensions.height;
    }
});
