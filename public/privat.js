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

// Dodavanje slike (URL ili PC)
document.getElementById('addImage').addEventListener('click', function() {
    const imageSource = prompt("Unesite URL slike ili ostavite prazno za upload sa računara:");

    let imgElement = null;

    if (imageSource) {
        // Dodavanje slike preko URL-a
        imgElement = document.createElement('img');
        imgElement.src = imageSource;
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
                    imgElement = document.createElement('img');
                    imgElement.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    }

    if (imgElement) {
        // Postavljanje početnih dimenzija slike na 200x200px
        imgElement.style.width = '200px';
        imgElement.style.height = '200px';
        imgElement.style.position = 'absolute'; // Omogućava pomeranje slike
        imgElement.style.cursor = 'move'; // Menjanje kursora prilikom pomeranja

        // Dodajemo sliku u chatContainer
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.appendChild(imgElement);

        // Omogućiti pomeranje slike
        enableImageDragging(imgElement);
        enableImageResizing(imgElement);
    }
});

// Funkcija za omogućavanje pomeranja slike
function enableImageDragging(img) {
    let offsetX, offsetY, startX, startY;

    img.onmousedown = function(e) {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;

        offsetX = img.offsetLeft;
        offsetY = img.offsetTop;

        document.onmousemove = function(e) {
            let newX = offsetX + (e.clientX - startX);
            let newY = offsetY + (e.clientY - startY);
            img.style.left = newX + "px";
            img.style.top = newY + "px";
        };

        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

// Funkcija za omogućavanje promene dimenzija slike
function enableImageResizing(img) {
    img.onmousedown = function(e) {
        if (e.offsetX >= img.clientWidth - 10 && e.offsetY >= img.clientHeight - 10) {
            let startX = e.clientX;
            let startY = e.clientY;
            let startWidth = img.clientWidth;
            let startHeight = img.clientHeight;

            document.onmousemove = function(e) {
                let newWidth = startWidth + (e.clientX - startX);
                let newHeight = startHeight + (e.clientY - startY);

                img.style.width = newWidth + 'px';
                img.style.height = newHeight + 'px';
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    };
}
