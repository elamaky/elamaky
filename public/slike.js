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
    
// Funkcija za omogućavanje drag i resize funkcionalnosti
function enableDragAndResize(img) {
    let isDragging = false;
    let isResizingWidth = false;
    let isResizingHeight = false;
    let offsetX, offsetY, startX, startY, startWidth, startHeight;

    // Kreiramo elemente za prikaz dimenzija
    const widthDisplay = document.createElement('div');
    const heightDisplay = document.createElement('div');

    widthDisplay.style.position = 'absolute';
    heightDisplay.style.position = 'absolute';
    widthDisplay.style.color = 'green';
    heightDisplay.style.color = 'blue';
    widthDisplay.style.fontSize = '14px';
    heightDisplay.style.fontSize = '14px';
    widthDisplay.style.zIndex = '10';
    heightDisplay.style.zIndex = '10';
    document.body.appendChild(widthDisplay);
    document.body.appendChild(heightDisplay);

    // Pomeranje slike (drag)
    img.addEventListener('mousedown', function (e) {
        if (e.target === img) {  // Aktivira se samo kada klikneš direktno na sliku
            isDragging = true;
            offsetX = e.clientX - img.offsetLeft;
            offsetY = e.clientY - img.offsetTop;
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', stopDrag);
        }
    });

    function dragMove(e) {
        if (isDragging) {
            img.style.left = e.clientX - offsetX + 'px';
            img.style.top = e.clientY - offsetY + 'px';
            emitImageUpdate(img);
        }
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', stopDrag);
    }

    // Resize funkcionalnost sa četiri strane (u ovom slučaju samo za širinu i visinu)
    img.addEventListener('mousedown', function(e) {
        const rect = img.getBoundingClientRect();
        const distanceToRightEdge = e.clientX - rect.right;
        const distanceToBottomEdge = e.clientY - rect.bottom;

        // Detektuje da li je klik na desnoj ivici (za širenje)
        if (Math.abs(distanceToRightEdge) < 5) {
            isResizingWidth = true;
            startX = e.clientX;
            startWidth = img.offsetWidth;
            document.addEventListener('mousemove', resizeWidthMove);
            document.addEventListener('mouseup', stopResize);
        }

        // Detektuje da li je klik na donjoj ivici (za visinu)
        if (Math.abs(distanceToBottomEdge) < 5) {
            isResizingHeight = true;
            startY = e.clientY;
            startHeight = img.offsetHeight;
            document.addEventListener('mousemove', resizeHeightMove);
            document.addEventListener('mouseup', stopResize);
        }
    });

    // Funkcija za menjanje širine
    function resizeWidthMove(e) {
        if (isResizingWidth) {
            const newWidth = startWidth + (e.clientX - startX);
            img.style.width = newWidth + 'px';
            emitImageUpdate(img);
            updateWidthDisplay(img);
        }
    }

    // Funkcija za menjanje visine
    function resizeHeightMove(e) {
        if (isResizingHeight) {
            const newHeight = startHeight + (e.clientY - startY);
            img.style.height = newHeight + 'px';
            emitImageUpdate(img);
            updateHeightDisplay(img);
        }
    }

    // Funkcija za prekidanje resize operacije
    function stopResize() {
        isResizingWidth = false;
        isResizingHeight = false;
        document.removeEventListener('mousemove', resizeWidthMove);
        document.removeEventListener('mousemove', resizeHeightMove);
        document.removeEventListener('mouseup', stopResize);
    }

    // Emitovanje podataka o slici (pozicija i dimenzije)
    function emitImageUpdate(img) {
        const position = { x: img.offsetLeft, y: img.offsetTop }; // Pozicija slike
        const dimensions = { width: img.offsetWidth, height: img.offsetHeight }; // Dimenzije slike
        const imageUrl = img.src; // URL slike
        console.log(`Emituju se podaci slike: URL: ${imageUrl}, pozicija: (${position.x}, ${position.y}), dimenzije: (${dimensions.width}, ${dimensions.height})`);
        
        // Pozivamo funkciju koja emituje podatke serveru (via socket ili bilo šta drugo)
        updateImageOnServer(imageUrl, position, dimensions);
    }

    // Funkcija za ažuriranje prikaza širine
    function updateWidthDisplay(img) {
        const width = img.offsetWidth;
        widthDisplay.textContent = `Širina: ${width}px`;
        widthDisplay.style.left = (img.offsetLeft + img.offsetWidth / 2) + 'px';  // Pozicija je centrirana
        widthDisplay.style.top = (img.offsetTop - 20) + 'px';  // Iznad slike
    }

    // Funkcija za ažuriranje prikaza visine
    function updateHeightDisplay(img) {
        const height = img.offsetHeight;
        heightDisplay.textContent = `Visina: ${height}px`;
        heightDisplay.style.left = (img.offsetLeft + img.offsetWidth + 10) + 'px';  // Desno od slike
        heightDisplay.style.top = (img.offsetTop + img.offsetHeight / 2) + 'px';  // Centrirano vertikalno
    }

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
    }
});
