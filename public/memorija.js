// Dugme za memoriju
document.getElementById('memorija').addEventListener('click', function() {
    const userId = 'user123';  // Ovdje trebaš koristiti stvarni korisnički ID
    const pageName = prompt("Unesite naziv stranice:");

    // Pošaljite podatke na server da sačuvate stranicu
    fetch('/save-page', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, name: pageName })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error("Greška pri čuvanju stranice:", error));
});

// Funkcija za učitavanje stranica
function loadPage(userId, pageName) {
    fetch(`/load-page/${userId}/${pageName}`)
    .then(response => response.json())
    .then(data => {
        alert("Stranica učitana: " + data.name);
        // Ovdje možete dodati kod za prikaz stranice (npr. postavljanje sadržaja)
    })
    .catch(error => console.error("Greška pri učitavanju stranice:", error));
}

// Funkcija za prikazivanje sačuvanih stranica
function showSavedPages(userId) {
    fetch(`/saved-pages/${userId}`)
    .then(response => response.json())
    .then(pages => {
        const menu = document.getElementById('savedPagesMenu');
        menu.innerHTML = '';  // Očisti prethodni meni
        pages.forEach(page => {
            const button = document.createElement('button');
            button.textContent = page.name;
            button.addEventListener('click', () => loadPage(userId, page.name));
            menu.appendChild(button);
        });
    })
    .catch(error => console.error("Greška pri učitavanju stranica:", error));
}
