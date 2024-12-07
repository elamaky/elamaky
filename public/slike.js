const imageContainer = document.createElement('div');
imageContainer.id = 'imageContainer';
document.body.appendChild(imageContainer);

// Inicijalno učitavanje slika
socket.on('initialImages', (images) => {
    imageContainer.innerHTML = ''; // Čisti prethodne slike
    images.forEach((img, index) => addImageToDOM(img, index)); // Prikazuje sve slike
});

// Ažuriranje slika u realnom vremenu
socket.on('updateImages', (images) => {
    imageContainer.innerHTML = ''; // Čisti prethodne slike
    images.forEach((img, index) => addImageToDOM(img, index)); // Prikazuje sve slike
});

// Funkcija za dodavanje slike u DOM
function addImageToDOM(imageData, index) {
    const img = document.createElement('img');
    img.src = imageData.url;
    img.style.width = `${imageData.width}px`;
    img.style.height = `${imageData.height}px`;
    img.style.position = 'absolute';
    img.style.left = `${imageData.x}px`;
    img.style.top = `${imageData.y}px`;
    img.style.zIndex = '1000';

    // Postavljanje početne pozicije slike
    img.style.left = `${Math.random() * window.innerWidth * 0.5 + 100}px`;  // Početna pozicija na random mestu unutar 50% širine
    img.style.top = `${Math.random() * window.innerHeight * 0.5 + 100}px`;  // Početna pozicija na random mestu unutar 50% visine

    // Omogućavanje interakcije samo za prijavljene korisnike
    if (isLoggedIn) {
        img.style.pointerEvents = "auto";
    } else {
        img.style.pointerEvents = "none"; // Onemogućava klikove
    }

    // Omogućavanje resize funkcionalnosti
    const hammer = new Hammer(img);

    hammer.get('pinch').set({ enable: true });  // Omogućavanje "pinch" gesta za resize
    hammer.on('pinch', (e) => {
        img.style.width = `${imageData.width * e.scale}px`;  // Menjanje širine
        img.style.height = `${imageData.height * e.scale}px`;  // Menjanje visine
    });

    // Funkcija za premestanje slike (drag)
    let isDragging = false;
    let offsetX, offsetY;

    img.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - img.offsetLeft;
        offsetY = e.clientY - img.offsetTop;
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.removeEventListener('mousemove', handleDrag);
        });
    });

    const handleDrag = (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            img.style.left = `${x}px`;
            img.style.top = `${y}px`;
            imageData.x = x;
            imageData.y = y;
            socket.emit('updateImage', { index, updatedData: imageData });
        }
    };

    // Funkcija za uklanjanje slike
    img.addEventListener('dblclick', () => {
        imageContainer.removeChild(img);
        socket.emit('removeImage', index);  // Emituj događaj za uklanjanje slike sa servera
    });

    // Dodaj sliku u DOM
    imageContainer.appendChild(img);
}
