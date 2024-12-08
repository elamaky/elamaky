// Globalne promenljive
let currentImage; // Promenljiva za trenutnu sliku
let allImages = []; // Niz za sve slike

document.getElementById('addImage').addEventListener('click', function () {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");
    const position = { x: 100, y: 300 }; // Primer pozicije
    const dimensions = { width: 200, height: 200 }; // Primer dimenzija

    if (imageSource) {
        const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageSource.split('.').pop().toLowerCase();

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

// Funkcija za dodavanje slike u DOM
function addImageToDOM(imageUrl, position, dimensions) {
    const newImage = document.createElement('img');
    newImage.src = imageUrl; // Postavi izvor slike
    newImage.style.width = dimensions.width + 'px'; // Koristi dimenzije iz parametara
    newImage.style.height = dimensions.height + 'px'; // Koristi dimenzije iz parametara
    newImage.style.position = "absolute";
    newImage.style.left = position.x + 'px'; // Pozicija slika iz parametara
    newImage.style.top = position.y + 'px'; // Pozicija slika iz parametara
    newImage.style.zIndex = "1000"; // Dodaj z-index za pozicioniranje slike
    newImage.classList.add('draggable', 'resizable');
    newImage.style.border = "none";

    // Dugme za brisanje koje se pojavljuje kad klikneš na sliku
    const deleteButton = document.createElement('button');
    deleteButton.innerText = "Ukloni";
    deleteButton.style.position = "absolute";
    deleteButton.style.top = "5px"; // Malo iznad slike
    deleteButton.style.left = "5px"; // Malo sa leve strane slike
    deleteButton.style.zIndex = "1001"; // Osiguraj da dugme bude iznad slike
    deleteButton.style.display = "none"; // Početno sakrivanje dugmeta

    // Kada se klikne na sliku, dugme se pojavljuje
    newImage.addEventListener('click', function () {
        deleteButton.style.display = "block"; // Pokaži dugme
    });

    // Kada se klikne na dugme, slika se uklanja
    deleteButton.addEventListener('click', function () {
        newImage.remove(); // Ukloni sliku sa DOM-a
        deleteButton.remove(); // Ukloni dugme iz DOM-a
        socket.emit('remove-image', imageUrl); // Emituj događaj za uklanjanje slike sa servera
    });

   // Omogućavanje interakcije samo za prijavljene korisnike
    if (isLoggedIn) {
        newImage.style.pointerEvents = "auto"; // Omogućava klikove i interakciju
        enableDragAndResize(newImage); // Uključi funkcionalnost za povlačenje i promenu veličine
    } else {
        newImage.style.pointerEvents = "none"; // Onemogućava klikove
    }

    document.body.appendChild(newImage); // Učitaj sliku u DOM
    document.body.appendChild(deleteButton); // Učitaj dugme u DOM
    
    // Emitovanje ažuriranja slike posle dodavanja
    emitImageUpdate(newImage);
}

function emitImageUpdate(img) {
    const params = {
        width: img.offsetWidth,
        height: img.offsetHeight,
        x: img.offsetLeft,
        y: img.offsetTop
    };
    
    // Emitovanje parametara slike, uključujući URL sa parametrima
    socket.emit('update-image', {
        imageUrl: img.src,
        position: { x: img.offsetLeft, y: img.offsetTop },
        dimensions: { width: img.offsetWidth, height: img.offsetHeight }
    });
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
 socket.on('sync-image', (data) => {
    const syncedImage = document.querySelector(`img[src="${data.imageUrl}"]`); // Izvor slike
    if (syncedImage) {
        syncedImage.style.left = data.position.x;
        syncedImage.style.top = data.position.y;
        syncedImage.style.width = data.dimensions.width;
        syncedImage.style.height = data.dimensions.height;
    }
});
