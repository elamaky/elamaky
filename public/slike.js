let isLoggedIn = false; // Status autentifikacije

document.getElementById('openModal').addEventListener('click', function() {
    if (!isLoggedIn) {
        const password = prompt("Unesite lozinku:");

        const allowedNicks = ["Radio Galaksija", "ZI ZU", "__X__", "___F117___"];
        const currentNick = "Radio Galaksija"; // Ovo treba da bude aktuelni korisnički nick.

        if (allowedNicks.includes(currentNick) || password === "123galaksija") {
            isLoggedIn = true; // Postavljamo status na login
            document.getElementById('functionModal').style.display = "block";
        } else {
            alert("Nemate dozvolu da otvorite ovaj panel.");
        }
    } else {
        document.getElementById('functionModal').style.display = "block"; // Otvaramo modal ako je korisnik već prijavljen
    }
});

// Dodaj funkcionalnost za zatvaranje prozora kada se klikne na "X"
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('functionModal').style.display = "none";
});

// Zatvori prozor kada se klikne van njega
window.onclick = function(event) {
    const modal = document.getElementById('functionModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Brisanje sadržaja chata
document.getElementById('clearChat').addEventListener('click', function() {
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata
    console.log("Chat je obrisan.");

    // Emituj događaj serveru za brisanje chata
    socket.emit('clear-chat'); 
});

// Slušanje na 'chat-cleared' događaj
socket.on('chat-cleared', function() {
    console.log('Chat je obrisan sa servera.');
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata
});


 // Dodavanje slike preko URL-a
        document.getElementById('addImage').addEventListener('click', function () {
            const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");

            if (imageSource) {
                const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
                const fileExtension = imageSource.split('.').pop().toLowerCase();

                if (validFormats.includes(fileExtension)) {
                    // Emituj serveru sliku
                    socket.emit('add-image', {
                        src: imageSource,
                        width: "200px",
                        height: "200px",
                        top: "50px",
                        left: "50px",
                        editable: true // Samo tebi omogućeno uređivanje
                    });
                } else {
                    alert("Nepodržan format slike. Podržani formati su: JPG, PNG, GIF.");
                }
            } else {
                alert("Niste uneli URL slike.");
            }
        });

        // Kada server pošalje sliku svim klijentima
        socket.on('receive-image', (image) => {
            const img = document.createElement('img');
            img.src = image.src;
            img.style.width = image.width;
            img.style.height = image.height;
            img.style.top = image.top;
            img.style.left = image.left;
            img.setAttribute('data-editable', image.editable ? 'true' : 'false');
            document.body.appendChild(img);

            // Omogućavanje uređivanja samo za tebe
            if (image.editable) {
                enableDragAndResize(img);
            }
        });

        // Funkcija za pomeranje i promenu veličine slike
        function enableDragAndResize(img) {
            let isDragging = false;
            let isResizing = false;
            let resizeSide = null;

            img.addEventListener('mousedown', function (e) {
                const rect = img.getBoundingClientRect();
                const borderSize = 10;

                if (img.getAttribute('data-editable') !== 'true') return;

                // Provera da li se klik desio na granici slike (za resize)
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
                } else {
                    isDragging = true;
                }

                const startX = e.clientX;
                const startY = e.clientY;
                const initialWidth = img.offsetWidth;
                const initialHeight = img.offsetHeight;
                const initialLeft = img.offsetLeft;
                const initialTop = img.offsetTop;

                document.onmousemove = function (e) {
                    if (isDragging) {
                        img.style.left = initialLeft + (e.clientX - startX) + "px";
                        img.style.top = initialTop + (e.clientY - startY) + "px";
                    }

                    if (isResizing) {
                        if (resizeSide === 'right') {
                            img.style.width = initialWidth + (e.clientX - startX) + "px";
                        } else if (resizeSide === 'bottom') {
                            img.style.height = initialHeight + (e.clientY - startY) + "px";
                        } else if (resizeSide === 'left') {
                            const newWidth = initialWidth - (e.clientX - startX);
                            if (newWidth > 10) {
                                img.style.width = newWidth + "px";
                                img.style.left = initialLeft + (e.clientX - startX) + "px";
                            }
                        } else if (resizeSide === 'top') {
                            const newHeight = initialHeight - (e.clientY - startY);
                            if (newHeight > 10) {
                                img.style.height = newHeight + "px";
                                img.style.top = initialTop + (e.clientY - startY) + "px";
                            }
                        }
                    }
                };

                document.onmouseup = function () {
                    isDragging = false;
                    isResizing = false;
                    resizeSide = null;
                    document.onmousemove = null;
                    document.onmouseup = null;

                    // Emituj novu poziciju i dimenzije serveru (opciono, ako treba sinhronizacija)
                    socket.emit('update-image', {
                        src: img.src,
                        width: img.style.width,
                        height: img.style.height,
                        top: img.style.top,
                        left: img.style.left
                    });
                };
            });
        }
