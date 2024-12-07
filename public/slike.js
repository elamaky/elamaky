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
            alert("Neispravan format slike! Molimo vas da unesete URL slike u JPG, PNG, ili GIF formatu.");
        }
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
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.width = "200px";
    img.style.height = "200px";
    img.style.position = "absolute";
    img.style.zIndex = "1000"; // Dodato za pravilno pozicioniranje slike
    img.classList.add('draggable', 'resizable');

    // Omogućavanje interakcije samo za prijavljene korisnike
    if (isLoggedIn) {
        img.style.pointerEvents = "auto"; // Omogućava klikove i interakciju
        enableDragAndResize(img); // Uključi funkcionalnost za povlačenje i promenu veličine
    } else {
        img.style.pointerEvents = "none"; // Onemogućava klikove
    }

    document.body.appendChild(img); // Učitaj sliku u DOM

    // Emitovanje ažuriranja slike
    socket.emit('update-image', {
        imageUrl: img.src,
        position: {
            x: parseFloat(img.style.left) || 0, // Ako nema stila, uzmi 0
            y: parseFloat(img.style.top) || 0
        },
        dimensions: {
            width: parseFloat(img.style.width) || img.width, // Možeš koristiti img.width ako nije eksplicitno postavljen stil
            height: parseFloat(img.style.height) || img.height // Isto za visinu
        }
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

// Sinhronizacija slike
socket.on('sync-image', (data) => {
    const img = document.querySelector(`img[src="${data.imageUrl}"]`);
    if (img) {
        img.style.left = `${data.position.x}px`;
        img.style.top = `${data.position.y}px`;
        img.style.width = `${data.dimensions.width}px`;
        img.style.height = `${data.dimensions.height}px`;
    }
});
