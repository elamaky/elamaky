// Obrada događaja za dodavanje slike
document.getElementById('addImage').addEventListener('click', () => {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");

    // Proveravamo da li je unet URL slike
    if (imageSource) {
        const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageSource.split('.').pop().toLowerCase();

        // Validacija formata slike
        if (validFormats.includes(fileExtension)) {
            // Proveravamo da li slika već postoji da bismo izbegli dupliranje
            if (allImages.some(image => image.imageUrl === imageSource)) {
                alert("Ova slika je već dodata!");
                return; // Izlazimo bez dodavanja
            }

            const imageData = {
                imageUrl: imageSource,
                position: { x: '10px', y: '10px' }, // Početna pozicija
                dimensions: { width: 200, height: 200 } // Postavljamo dimenzije za inicijalnu sliku
            };

            // Emitujemo dodatak slike serveru
            socket.emit('add-image', imageData);
            
            // Dodajemo sliku u niz
            allImages.push(imageData);
        } else {
            alert("Neispravan format slike! Molimo vas da unesete URL slike u JPG, PNG, ili GIF formatu.");
        }
    } else {
        alert("Niste uneli URL slike.");
    }
});

// Prikaz nove slike kada server pošalje 'display-image' događaj
socket.on('display-image', (imageData) => {
    addImageToDOM(imageData); // Prikaz nove slike
});

// Prikaz svih prethodnih slika prilikom povezivanja klijenta
socket.on('initial-images', (images) => {
    images.forEach(image => {
        // Proverite da li slika već postoji pre nego što je dodate
        if (!allImages.some(existingImage => existingImage.imageUrl === image.imageUrl)) {
            allImages.push(image); // Dodajemo sliku u niz
            addImageToDOM(image); // Prikaz slike
        }
    });
});

// Funkcija za dodavanje slike u DOM
function addImageToDOM(imageData) {
    const img = document.createElement('img');
    img.src = imageData.imageUrl;
    img.style.width = `${imageData.dimensions.width}px`; // Postavljanje širine
    img.style.height = `${imageData.dimensions.height}px`; // Postavljanje visine
    img.style.position = "absolute";
    img.style.left = `${imageData.position.x}`; // Postavljanje horizontalne pozicije
    img.style.top = `${imageData.position.y}`; // Postavljanje vertikalne pozicije
    img.style.zIndex = "1000";
    img.classList.add('draggable', 'resizable');

    // Omogućavanje interakcije samo ako je korisnik prijavljen
    img.style.pointerEvents = isLoggedIn ? "auto" : "none"; 

    if (isLoggedIn) {
        enableDragAndResize(img); // Aktiviramo funkcionalnost za povlačenje i promenu veličine
    }

    document.body.appendChild(img); // Učitaj sliku u DOM

    // Emitovanje inicijalnih podataka slike
    emitImageUpdate(img);
}           

// Funkcija za emitovanje ažuriranja slike
function emitImageUpdate(img) {
    socket.emit('update-image', {
        imageUrl: img.src,
        position: {
            x: parseFloat(img.style.left) || 0,
            y: parseFloat(img.style.top) || 0
        },
        dimensions: {
            width: parseFloat(img.style.width) || img.width,
            height: parseFloat(img.style.height) || img.height
        }
    });
}

// Funkcija za omogućavanje povlačenja i promene veličine slike
function enableDragAndResize(img) {
    let isResizing = false;
    let resizeSide = null;

    // Promena stila kada se pokazivač miša pređe preko slike
    img.addEventListener('mouseenter', () => {
        img.style.border = "2px dashed red";
    });

    img.addEventListener('mouseleave', () => {
        img.style.border = "none";
    });

    img.addEventListener('mousedown', (e) => {
        const rect = img.getBoundingClientRect();
        const borderSize = 10; // Opcija za odredjivanje mesta za promenu veličine

        // Određivanje na kojoj strani se vrši promena veličine
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

            document.onmousemove = (e) => {
                if (isResizing) {
                    resizeImage(e, img, resizeSide, initialWidth, initialHeight, startX, startY);
                }
            };

            document.onmouseup = closeDragElement;
        } else {
            dragMouseDown(e);
        }
    });

    function dragMouseDown(e) {
        e.preventDefault();
        let pos3 = e.clientX;
        let pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = (e) => {
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

// Funkcija za promenu veličine slike
function resizeImage(e, img, resizeSide, initialWidth, initialHeight, startX, startY) {
    if (resizeSide === 'right') {
        img.style.width = initialWidth + (e.clientX - startX) + 'px';
    } else if (resizeSide === 'bottom') {
        img.style.height = initialHeight + (e.clientY - startY) + 'px';
    } else if (resizeSide === 'left') {
        const newWidth = initialWidth - (e.clientX - startX);
        if (newWidth > 10) {
            img.style.width = newWidth + 'px';
            img.style.left = img.offsetLeft + (e.clientX - startX) + 'px';
        }
    } else if (resizeSide === 'top') {
        const newHeight = initialHeight - (e.clientY - startY);
        if (newHeight > 10) {
            img.style.height = newHeight + 'px';
            img.style.top = img.offsetTop + (e.clientY - startY) + 'px';
        }
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
