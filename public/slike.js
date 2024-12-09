document.getElementById('addImage').addEventListener('click', function () {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");

    if (imageSource) { // Ako je URL slike unet
        const position = { x: 100, y: 300 }; // Primer pozicije
        const dimensions = { width: 200, height: 200 }; // Primer dimenzija

        // Provera formata slike
        const fileExtension = imageSource.split('.').pop().toLowerCase(); // Uzima ekstenziju fajla
        const validFormats = ['jpg', 'png', 'gif'];

        if (validFormats.includes(fileExtension)) {
            // Emitujemo URL slike sa pozicijom i dimenzijama serveru pod imenom 'add-image'
            socket.emit('add-image', imageSource, position, dimensions);
        } else {
            alert('Format slike nije podržan. Podržani formati su: JPG, PNG, GIF.');
        }
    } else {
        alert('URL slike nije unet.');
    }
});


// Osluškujemo 'display-image' događaj sa servera
socket.on('display-image', (data) => {
    // Slika sada uključuje URL sa parametrima za poziciju i dimenzije
    addImageToDOM(data.imageUrl, data.position, data.dimensions);
});

// Prikaz svih prethodnih slika kad se poveže klijent
socket.on('initial-images', (images) => {
    images.forEach((imageData) => {
        addImageToDOM(imageData.imageUrl, imageData.position, imageData.dimensions);
    });
});

let selectedImage = null; // Globalna promenljiva za selektovanu sliku
function addImageToDOM(imageUrl, position, dimensions) {
    const newImage = document.createElement('img');
    newImage.src = imageUrl;
    newImage.style.width = dimensions.width + 'px';
    newImage.style.height = dimensions.height + 'px';
    newImage.style.position = "absolute";
    newImage.style.left = position.x + 'px';
    newImage.style.top = position.y + 'px';
    newImage.style.zIndex = "1000";
    newImage.classList.add('draggable', 'resizable');
    newImage.style.border = "none";

    // Selektovanje slike
    function selectImage(image) {
        if (selectedImage && selectedImage !== image) {
            selectedImage.style.border = "none"; // Ukloni indikator sa prethodne selekcije
        }
        selectedImage = image;
        selectedImage.style.border = "2px solid red"; // Dodaj indikator selekcije
    }

    // Desni klik za selekciju slike
    newImage.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        selectImage(newImage);
    });

    // Održavanje selekcije (indikator ostaje bez obzira na interakciju miša)
    document.addEventListener('click', function (event) {
        if (!event.target.classList.contains('draggable') && selectedImage) {
            selectedImage.style.border = "2px solid red"; // Održavaj okvir
        }
    });

    // Dugme za brisanje slike
    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Ukloni Sliku";
    deleteButton.style.position = "fixed";
    deleteButton.style.bottom = "10px";
    deleteButton.style.right = "10px";
    deleteButton.style.zIndex = "1001";

    deleteButton.addEventListener('click', function () {
        if (selectedImage) {
            selectedImage.remove(); // Ukloni selektovanu sliku
            socket.emit('remove-image', selectedImage.src); // Emituj događaj za server
            selectedImage = null; // Očisti selekciju
        } else {
            alert("Nijedna slika nije selektovana!");
        }
    });
 // Omogućavanje interakcije samo za prijavljene korisnike
    if (isLoggedIn) {
        newImage.style.pointerEvents = "auto"; // Omogućava klikove i interakciju
        enableDragAndResize(newImage); // Uključi funkcionalnost za povlačenje i promenu veličine
    } else {
        newImage.style.pointerEvents = "none"; // Onemogućava klikove
    }
     document.body.appendChild(deleteButton);
    document.body.appendChild(newImage);

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

    // Emitovanje ažuriranih dimenzija slike
    function emitImageUpdate(img) {
        const position = { x: img.offsetLeft, y: img.offsetTop };
        const dimensions = { width: img.offsetWidth, height: img.offsetHeight };
        const imageUrl = img.src;

        console.log(`Emituju se podaci slike: URL: ${imageUrl}, pozicija: (${position.x}, ${position.y}), dimenzije: (${dimensions.width}, ${dimensions.height})`);

        // Pozivamo funkciju koja emituje podatke serveru
        updateImageOnServer(imageUrl, position, dimensions);
    }

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

    // Emitovanje ažuriranih pozicija slike
    emitImageUpdate(img);

    // Onemogućava promenu kursora prilikom pomeranja slike
    img.style.cursor = 'default'; 

    // Dodavanje border-a kada korisnik pređe mišem preko slike
    img.addEventListener('mouseenter', function () {
        img.style.border = "2px dashed red";
        console.log("Miš prešao preko slike, border postavljen.");
    });

    // Uklanjanje border-a kada korisnik skloni miša sa slike
    img.addEventListener('mouseleave', function () {
        img.style.border = "none";
        console.log("Miš sklonjen sa slike, border uklonjen.");
    });

    // Funkcija za emitovanje podataka o slici (pozicija i dimenzije)
    function emitImageUpdate(img) {
        const position = { x: img.offsetLeft, y: img.offsetTop }; // Pozicija slike
        const dimensions = { width: img.offsetWidth, height: img.offsetHeight }; // Dimenzije slike
        const imageUrl = img.src; // URL slike
        console.log(`Emituju se podaci slike: URL: ${imageUrl}, pozicija: (${position.x}, ${position.y}), dimenzije: (${dimensions.width}, ${dimensions.height})`);

        // Pozivamo funkciju koja emituje podatke serveru
        updateImageOnServer(imageUrl, position, dimensions);
    }

   // Funkcija za slanje podataka o slici serveru
function updateImageOnServer(imageUrl, position, dimensions) {
    console.log(`Slanje podataka serveru: URL: ${imageUrl}, pozicija: (${position.x}, ${position.y}), dimenzije: (${dimensions.width}, ${dimensions.height})`);
    socket.emit('update-image', {
        imageUrl: imageUrl,
        position: position,
        dimensions: dimensions
    });
}

// Funkcija za sinhronizaciju slike sa servera
socket.on('sync-image', (data) => {
    console.log(`Prijem sinhronizovanih podataka: URL: ${data.imageUrl}, pozicija: (${data.position.x}, ${data.position.y}), dimenzije: (${data.dimensions.width}, ${data.dimensions.height})`);
    const syncedImage = document.querySelector(`img[src="${data.imageUrl}"]`); // Selektujemo sliku po URL-u
    if (syncedImage) {
        syncedImage.style.left = data.position.x + 'px';
        syncedImage.style.top = data.position.y + 'px';
        syncedImage.style.width = data.dimensions.width + 'px';
        syncedImage.style.height = data.dimensions.height + 'px';
        console.log(`Slika sinhronizovana: X: ${data.position.x}, Y: ${data.position.y}, širina: ${data.dimensions.width}, visina: ${data.dimensions.height}`);
    
});
