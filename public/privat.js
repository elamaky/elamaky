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

// Pomeranje modala
dragElement(document.getElementById("functionModal"));

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("closeModal")) {
        // Ako postoji dugme za zatvaranje, dodajmo njegovu funkcionalnost za pomeranje
        document.getElementById("closeModal").onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Pozicioniraj kursor u prvi quadrant
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Pozicioniraj element u odnosu na kursor
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Izračunaj nove pozicije na osnovu trenutnih pozicija
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Pomeraj element
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Kada se otpusti dugme miša, ukloni pokrete
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Dodavanje funkcionalnosti za dugmad u panelu
document.getElementById('clearChat').addEventListener('click', function() {
    console.log("Chat je obrisan.");
});

document.getElementById('privateMessage').addEventListener('click', function() {
    console.log("Privatna poruka je poslata.");
});

document.getElementById('addImage').addEventListener('click', function() {
    console.log("Slika je dodata.");
});

document.getElementById('addFcp').addEventListener('click', function() {
    console.log("FCP datoteka je dodata.");
});

document.getElementById('addVideo').addEventListener('click', function() {
    console.log("Video snimak je dodat.");
});

document.getElementById('enableCamera').addEventListener('click', function() {
    console.log("Kamera je uključena.");
});

