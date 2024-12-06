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

// path: public/js/images.js

const socket = io(); // Socket.io inicijalizacija

// Dodavanje slike u DOM
function addImageToDOM(imageUrl, position = { x: 0, y: 0 }, dimensions = { width: "200px", height: "200px" }) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.position = "absolute";
    img.style.left = position.x + "px";
    img.style.top = position.y + "px";
    img.style.width = dimensions.width;
    img.style.height = dimensions.height;
    img.classList.add('draggable', 'resizable');
    document.body.appendChild(img);

    // Omogući drag & resize funkcionalnosti
    enableDragAndResize(img);

    return img;
}

// Omogući povlačenje i promenu dimenzija
function enableDragAndResize(img) {
    interact(img)
        .draggable({
            listeners: {
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    // Emituj nove pozicije serveru
                    socket.emit('update-image', {
                        imageUrl: target.src,
                        position: { x, y },
                        dimensions: { width: target.style.width, height: target.style.height }
                    });
                }
            }
        })
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move(event) {
                    const target = event.target;
                    let { width, height } = event.rect;

                    target.style.width = width + 'px';
                    target.style.height = height + 'px';

                    // Emituj nove dimenzije serveru
                    socket.emit('update-image', {
                        imageUrl: target.src,
                        position: {
                            x: parseFloat(target.getAttribute('data-x')) || 0,
                            y: parseFloat(target.getAttribute('data-y')) || 0
                        },
                        dimensions: { width: target.style.width, height: target.style.height }
                    });
                }
            }
        });
}

// Dodavanje slike putem URL-a
document.getElementById('addImage').addEventListener('click', () => {
    const imageSource = prompt("Unesite URL slike (JPG, PNG, GIF):");

    if (imageSource) {
        const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = imageSource.split('.').pop().toLowerCase();

        if (validFormats.includes(fileExtension)) {
            const img = addImageToDOM(imageSource);

            // Emituj serveru novu sliku
            socket.emit('add-image', {
                imageUrl: img.src,
                position: { x: 0, y: 0 },
                dimensions: { width: img.style.width, height: img.style.height }
            });
        } else {
            alert("Nepodržan format slike. Podržani formati su: JPG, PNG, GIF.");
        }
    } else {
        alert("Niste uneli URL slike.");
    }
});

// Sinhronizacija sa servera: dodavanje novih slika
socket.on('display-image', (data) => {
    addImageToDOM(data.imageUrl, data.position, data.dimensions);
});

// Sinhronizacija sa servera: ažuriranje pozicija i dimenzija
socket.on('sync-image', (data) => {
    const img = document.querySelector(`img[src="${data.imageUrl}"]`);
    if (img) {
        img.style.transform = `translate(${data.position.x}px, ${data.position.y}px)`;
        img.style.width = data.dimensions.width;
        img.style.height = data.dimensions.height;
        img.setAttribute('data-x', data.position.x);
        img.setAttribute('data-y', data.position.y);
    }
});
