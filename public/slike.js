document.getElementById('addImage').addEventListener('click', function () {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");
    
    if (imageSource) { // Ako je URL slike unet
        const position = { x: 100, y: 300 }; // Primer pozicije
        const dimensions = { width: 200, height: 200 }; // Primer dimenzija

        updateImageOnServer(imageSource, position, dimensions); // Pozivamo funkciju za ažuriranje slike na serveru
    } else {
        alert('URL slike nije unet.');
    }
});

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
    // Omogućavamo Interact.js drag i resize funkcionalnost za sliku
    interact(img)
        .draggable({
            // Opcije za drag funkcionalnost
            onmove(event) {
                img.style.left = (img.offsetLeft + event.dx) + 'px';
                img.style.top = (img.offsetTop + event.dy) + 'px';

                // Emitovanje ažuriranih pozicija slike
                emitImageUpdate(img);
            }
        })
        .resizable({
            // Opcije za resize funkcionalnost
            edges: { left: true, right: true, top: true, bottom: true },
            onmove(event) {
                img.style.width = event.rect.width + 'px';
                img.style.height = event.rect.height + 'px';

                // Emitovanje ažuriranih dimenzija slike
                emitImageUpdate(img);
            }
        })
        .styleCursor(false); // Ovaj metod onemogućava promenu kursora prilikom pomeranja slike

    // Dodajemo border kada korisnik pređe mišem preko slike
    img.addEventListener('mouseenter', function () {
        img.style.border = "2px dashed red";
    });

    // Uklanjamo border kada korisnik skloni miša sa slike
    img.addEventListener('mouseleave', function () {
        img.style.border = "none";
    });
}

// Funkcija za slanje podataka o slici serveru
function updateImageOnServer(imageUrl, position, dimensions) {
    socket.emit('update-image', {
        imageUrl: imageUrl,
        position: position,
        dimensions: dimensions
    });
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
