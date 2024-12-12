document.getElementById('memorija').addEventListener('click', function() {
    // Prikazivanje forme za unos naziva nove stranice
    document.getElementById('memoryForm').style.display = 'block';  // Prikazivanje forme za unos naziva stranice
});

// Funkcija za snimanje trenutnog stanja stranice
document.getElementById('saveNewPageButton').addEventListener('click', function() {
    const pageName = document.getElementById('newPageNameInput').value;  // Unos naziva stranice

    if (!pageName) {
        alert("Morate uneti naziv stranice.");
        return;
    }

    // Uzimanje trenutnog HTML sadržaja stranice
    const pageContent = document.documentElement.outerHTML;

    // Pošaljite podatke na server da sačuvate stranicu
    fetch('/save-page', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: pageName, content: pageContent })  // Šaljemo naziv stranice i njen sadržaj
    })
    .then(response => response.json())
    .then(data => {
        alert("Stranica je uspešno sačuvana!");
        document.getElementById('memoryForm').style.display = 'none';  // Sakrivanje forme
    })
    .catch(error => {
        console.error("Greška pri čuvanju stranice:", error);
        alert("Došlo je do greške prilikom čuvanja stranice.");
    });
});
