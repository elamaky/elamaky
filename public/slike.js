const imageContainer = document.createElement('div');
imageContainer.id = 'imageContainer';
document.body.appendChild(imageContainer);

// Inicijalno učitavanje slika
socket.on('initialImages', (images) => {
    imageContainer.innerHTML = '';
    images.forEach((img, index) => addImageToDOM(img, index));
});

// Ažuriranje slika u realnom vremenu
socket.on('updateImages', (images) => {
    imageContainer.innerHTML = '';
    images.forEach((img, index) => addImageToDOM(img, index));
});

// Dodavanje slike
document.getElementById('addImage').addEventListener('click', () => {
    const imageUrl = prompt('Unesite URL slike:');
    const width = prompt('Širina slike (px):', '100');
    const height = prompt('Visina slike (px):', '100');
    const x = prompt('X pozicija (px):', '0');
    const y = prompt('Y pozicija (px):', '0');

    const imageData = { url: imageUrl, width, height, x, y };
    socket.emit('addImage', imageData);
});

// Uklanjanje slike
function removeImage(index) {
    socket.emit('removeImage', index);
}

// Dodavanje slike u DOM
function addImageToDOM(imageData, index) {
    const img = document.createElement('img');
    img.src = imageData.url;
    img.style.width = `${imageData.width}px`;
    img.style.height = `${imageData.height}px`;
    img.style.position = 'absolute';
    img.style.zIndex = "1000"; // Dodato za pravilno pozicioniranje slike
    img.style.left = `${imageData.x}px`;
    img.style.top = `${imageData.y}px`;

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';

    // Dodavanje skrivenog dugmeta za uklanjanje
    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'Ukloni';
    removeBtn.style.display = 'none'; // Skriveno dugme za uklanjanje
    removeBtn.onclick = () => removeImage(index);
    wrapper.appendChild(removeBtn);

    // Pokazivanje dugmeta za uklanjanje kada se slika klikne
    img.addEventListener('click', () => {
        removeBtn.style.display = removeBtn.style.display === 'none' ? 'block' : 'none'; // Toggles visibility
    });

    // Funkcija za promenu dimenzija povlačenjem ivica
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

    makeResizable(wrapper); // Aktiviraj povlačenje za promenu dimenzija

    // Funkcija za promenu pozicije slike povlačenjem
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

    imageContainer.appendChild(wrapper);
}



