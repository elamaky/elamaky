document.getElementById('openModal').addEventListener('click', function() {
    const password = prompt("Unesite lozinku:");

    const allowedNicks = ["Radio Galaksija", "ZI ZU", "__X__", "___F117___"];
    const currentNick = "OVDE_UNESITE_NICK"; // Ovo treba da bude aktuelni korisnički nick.

    if (allowedNicks.includes(currentNick) || password === "galaksija123") {
        const functionPanel = document.getElementById('functionPanel');
        functionPanel.style.display = functionPanel.style.display === "none" ? "block" : "none";
    } else {
        alert("Nemate dozvolu da otvorite ovaj panel.");
    }
});

// Dodavanje funkcionalnosti za dugmad u panelu
document.getElementById('clearChat').addEventListener('click', function() {
    // Logika za brisanje chata
    console.log("Chat je obrisan.");
});

document.getElementById('privateMessage').addEventListener('click', function() {
    // Logika za slanje privatne poruke
    console.log("Privatna poruka je poslata.");
});

document.getElementById('addImage').addEventListener('click', function() {
    // Logika za dodavanje slike
    console.log("Slika je dodata.");
});

document.getElementById('addFcp').addEventListener('click', function() {
    // Logika za dodavanje FCP datoteke
    console.log("FCP datoteka je dodata.");
});

document.getElementById('addVideo').addEventListener('click', function() {
    // Logika za dodavanje video snimka
    console.log("Video snimak je dodat.");
});

document.getElementById('enableCamera').addEventListener('click', function() {
    // Logika za uključivanje kamere
    console.log("Kamera je uključena.");
});

