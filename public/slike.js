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

    // Omogućavanje interakcije samo za prijavljene korisnike
    if (isLoggedIn) {
        img.style.pointerEvents = "auto";
    } else {
        img.style.pointerEvents = "none"; // Onemogućava klikove
    }

    // Funkcija za promenu dimenzija slike povlačenjem
    const makeResizable = (el) => {
        const resizeHandle = document.createElement('div');
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.bottom = '0';
        resizeHandle.style.right = '0';
        resizeHandle.style.width = '10px';
        resizeHandle.style.height = '10px';
        resizeHandle.style.backgroundColor = 'red';
        resizeHandle.style.cursor = 'se-resize';
        el.appendChild(resizeHandle);

        let isResizing = false;

        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isResizing = true;
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', () => {
                isResizing = false;
                document.removeEventListener('mousemove', handleResize);
            });
        });

        const handleResize = (e) => {
            if (isResizing) {
                const width = e.pageX - el.offsetLeft;
                const height = e.pageY - el.offsetTop;
                img.style.width = `${width}px`;
                img.style.height = `${height}px`;
                imageData.width = width;
                imageData.height = height;
                socket.emit('updateImage', { index, updatedData: imageData });
            }
        };
    };

    // Pozivanje funkcije za promenu dimenzija slike
    makeResizable(img);

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

    // Dodaj sliku u DOM
    imageContainer.appendChild(img);
}

