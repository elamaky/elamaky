document.getElementById('openModal').addEventListener('click', function() {
    const password = prompt("Unesite lozinku:");

    const allowedNicks = ["Radio Galaksija", "ZI ZU", "__X__", "___F117___"];
    const currentNick = "OVDE_UNESITE_NICK"; // Ovo treba da bude aktuelni korisnički nick.

    if (allowedNicks.includes(currentNick) || password === "galaksija123") {
        document.getElementById('functionModal').style.display = "block";
    } else {
        alert("Nemate dozvolu da otvorite ovaj panel.");
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

