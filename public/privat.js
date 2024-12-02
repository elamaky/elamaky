let isLoggedIn = false; // Status autentifikacije

document.getElementById('openModal').addEventListener('click', function() {
    if (!isLoggedIn) {
        const password = prompt("Unesite lozinku:");

        const allowedNicks = ["Radio Galaksija", "ZI ZU", "__X__", "___F117___"];
        const currentNick = "OVDE_UNESITE_NICK"; // Ovo treba da bude aktuelni korisnički nick.

        if (allowedNicks.includes(currentNick) || password === "galaksija123") {
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
});

// Dodajemo događaj za dodavanje slike
document.getElementById('addImage').addEventListener('click', function() {
    const imageSource = prompt("Unesite URL slike ili ostavite prazno za upload sa računara:");

    if (imageSource) {
        // Dodavanje slike preko URL-a
        createImage(imageSource);
    } else {
        // Dodavanje slike sa lokalnog računara
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    createImage(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    }
});

function createImage(src) {
    const imgContainer = document.createElement('div');
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('draggable');
    
    const removeBtn = document.createElement('button');
    removeBtn.innerText = "X";
    removeBtn.classList.add('closeButton');
    removeBtn.onclick = function() {
        imgContainer.remove();
    };

    // Dodajemo dugme za uklanjanje i sliku u kontejner
    imgContainer.appendChild(img);
    imgContainer.appendChild(removeBtn);
    
    // Dodajemo kontejner slike u chat
    document.getElementById('messageArea').appendChild(imgContainer);
    
    // Funkcija za pomeranje slike
    let offsetX = 0, offsetY = 0;

    img.addEventListener('mousedown', function(e) {
        e.preventDefault();
        offsetX = e.clientX - img.getBoundingClientRect().left;
        offsetY = e.clientY - img.getBoundingClientRect().top;

        document.onmousemove = moveImage;
        document.onmouseup = stopDragging;
    });

    function moveImage(e) {
        img.style.left = e.clientX - offsetX + 'px';
        img.style.top = e.clientY - offsetY + 'px';
    }

    function stopDragging() {
        document.onmousemove = null;
        document.onmouseup = null;
    }

    // Funkcija za menjanje dimenzija slike
    img.addEventListener('mousedown', function(e) {
        if (e.target === img) {
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = img.offsetWidth;
            const startHeight = img.offsetHeight;

            document.onmousemove = function(e) {
                const newWidth = startWidth + (e.clientX - startX);
                const newHeight = startHeight + (e.clientY - startY);
                img.style.width = newWidth + 'px';
                img.style.height = newHeight + 'px';
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    });
}
