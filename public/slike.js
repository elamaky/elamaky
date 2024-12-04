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


document.getElementById('addImage').addEventListener('click', function () {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");

    if (imageSource) {
        const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageSource.split('.').pop().toLowerCase();

        if (validFormats.includes(fileExtension)) {
            // Kreiraj sliku
            const img = createImageElement(imageSource);
            document.body.appendChild(img);
            enableDragAndResize(img);
            console.log("Slika je dodata preko URL-a.");

            // Ovde prosledi informaciju o slici na server
            // sendToServer(imageSource);
            // Na serveru se može odešaljati objekat koji sadrži URL slike i druge relevantne informacije
        } else {
            alert("Nepodržan format slike. Podržani formati su: JPG, PNG, GIF.");
        }
    } else {
        alert("Niste uneli URL slike.");
    }
});

function createImageElement(src) {
    const img = document.createElement('img');
    img.src = src;
    img.style.width = "200px";  
    img.style.height = "200px"; 
    img.style.position = "absolute"; 
    img.style.zIndex = "1000";  
    img.classList.add('draggable', 'resizable');  
    img.style.border = "none"; // Ukloni border po defaultu
    return img;
}

function enableDragAndResize(img) {
    let isResizing = false;
    let resizeSide = null;

    img.addEventListener('mouseenter', function () {
        img.style.border = "2px dashed red"; // Prikazi granicu kada je kursor iznad slike
    });

    img.addEventListener('mouseleave', function () {
        img.style.border = "none"; // Sakrij granicu kada kursor nije iznad slike
    });

    img.addEventListener('click', function () {
        if (!img.querySelector('.close-button')) {
            img.style.border = "2px dashed red"; // Prikazi granicu kada klikneš na sliku
            
            // Dodaj close button
            const closeButton = document.createElement('span');
            closeButton.textContent = 'X';
            closeButton.className = 'close-button';
            closeButton.style.position = 'absolute';
            closeButton.style.color = 'red';
            closeButton.style.cursor = 'pointer';
            closeButton.style.zIndex = '1001'; // Iznad slike
            img.appendChild(closeButton);
            closeButton.addEventListener('click', function (e) {
                e.stopPropagation(); // Sprečite da se klik na dugme pokrene click događaj za sliku
                img.remove(); // Uklonite sliku kada se klikne na dugme
                // Ovde možete poslati informaciju na server da se slika obriše
                // sendRemoveImageToServer(img.src);
            });
        }

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
    });
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

// Ovde bi trebalo dodati funkcije za komuniciranje sa serverom
// function sendToServer(imageSource) {
//     // Implementacija slanja podataka na server
// }

// function sendRemoveImageToServer(imageSrc) {
//     // Implementacija slanja podataka o uklanjanju slike sa servera
// }
