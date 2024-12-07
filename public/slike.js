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

            // Osluškujemo 'display-image' događaj sa servera
            socket.on('display-image', (imageUrl) => {
                addImageToDOM(imageUrl);  // Prikaz nove slike koju je server poslao
            });

            // Osluškujemo kada server pošalje sinhronizovane promene slike
            socket.on('sync-image', (data) => {
                const img = document.querySelector(`img[data-id="${data.id}"]`);
                if (img) {
                    img.style.left = data.position.x;
                    img.style.top = data.position.y;
                    img.style.width = data.dimensions.width;
                    img.style.height = data.dimensions.height;
                }
            });

            function addImageToDOM(imageUrl) {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.style.width = "200px";
                img.style.height = "200px";
                img.style.position = "absolute";
                img.style.left = "300px"; // Default pozicija
                img.style.top = "300px";  // Default pozicija
                img.style.zIndex = "1000"; // Ispravno pozicioniranje
                img.classList.add('draggable', 'resizable');
                img.style.border = "none";
                img.setAttribute('data-id', Date.now()); // Generišemo jedinstveni ID za sliku
                document.body.appendChild(img);

                // Emitovanje podataka o slici odmah nakon što je dodata u DOM
                socket.emit('update-image', {
                    imageUrl: img.src,
                    position: {
                        x: img.style.left || '200px',
                        y: img.style.top || '200px'
                    },
                    dimensions: {
                        width: img.style.width || '200px',
                        height: img.style.height || '200px'
                    }
                });

                // Dodaj event listener za ažuriranje pozicije i dimenzija slike
                img.addEventListener('mouseup', () => {
                    socket.emit('update-image', {
                        id: img.getAttribute('data-id'), // Identifikator slike
                        imageUrl: img.src,
                        position: { x: img.style.left, y: img.style.top },
                        dimensions: { width: img.style.width, height: img.style.height }
                    });
                });

                // Omogućavamo interakciju ako je korisnik prijavljen
                if (isLoggedIn) {
                    enableDragAndResize(img); // Uključi povlačenje i promenu veličine
                } else {
                    img.style.pointerEvents = "none"; // Onemogućavamo interakciju
                }
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
                                        img.style.left = (rect.left + (e.clientX - startX)) + 'px';
                                    }
                                } else if (resizeSide === 'top') {
                                    const newHeight = initialHeight - (e.clientY - startY);
                                    if (newHeight > 10) {
                                        img.style.height = newHeight + 'px';
                                        img.style.top = (rect.top + (e.clientY - startY)) + 'px';
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

                    document.onmousemove = function (e) {
                        img.style.top = (img.offsetTop - (pos4 - e.clientY)) + 'px';
                        img.style.left = (img.offsetLeft - (pos3 - e.clientX)) + 'px';
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                    };

                    document.onmouseup = function () {
                        document.onmouseup = null;
                        document.onmousemove = null;
                    };
                }
            }
        } // Ova zagrada zatvara if (validFormats.includes(fileExtension))
    } // Ova zagrada zatvara if (imageSource)
}); // Ova zagrada zatvara addEventListener
