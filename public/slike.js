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
    img.style.left = `${imageData.x}px`;
    img.style.top = `${imageData.y}px`;

    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'Ukloni';
    removeBtn.onclick = () => removeImage(index);

    const wrapper = document.createElement('div');
    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);

    imageContainer.appendChild(wrapper);
}


function addImageToDOM(imageData, index) {
    const img = document.createElement('img');
    img.src = imageData.url;
    img.style.width = `${imageData.width}px`;
    img.style.height = `${imageData.height}px`;
    img.style.position = 'absolute';
    img.style.left = `${imageData.x}px`;
    img.style.top = `${imageData.y}px`;

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';

    // Kontrola dimenzija
    const resizeBtn = document.createElement('button');
    resizeBtn.innerText = 'Promeni dimenzije';
    resizeBtn.onclick = () => {
        const newWidth = prompt('Nova širina (px):', imageData.width);
        const newHeight = prompt('Nova visina (px):', imageData.height);
        const updatedData = {
            ...imageData,
            width: newWidth,
            height: newHeight,
        };
        socket.emit('updateImage', { index, updatedData });
    };

    // Kontrola pozicije
    const moveBtn = document.createElement('button');
    moveBtn.innerText = 'Promeni poziciju';
    moveBtn.onclick = () => {
        const newX = prompt('Nova X pozicija (px):', imageData.x);
        const newY = prompt('Nova Y pozicija (px):', imageData.y);
        const updatedData = {
            ...imageData,
            x: newX,
            y: newY,
        };
        socket.emit('updateImage', { index, updatedData });
    };

    // Dugme za uklanjanje slike
    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'Ukloni';
    removeBtn.onclick = () => removeImage(index);

    wrapper.appendChild(img);
    wrapper.appendChild(resizeBtn);
    wrapper.appendChild(moveBtn);
    wrapper.appendChild(removeBtn);

    imageContainer.appendChild(wrapper);
}

