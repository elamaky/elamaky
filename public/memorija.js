// Dugme za memoriju
document.getElementById('memorija').addEventListener('click', function() {
    const username = 'korisnicko_ime';  // Ovdje unesite stvarno korisničko ime (može biti dinamički dobijeno)
    const pageName = prompt("Unesite naziv stranice:");

    if (!pageName) {
        alert("Morate uneti naziv stranice.");
        return;
    }

    // Pošaljite podatke na server da sačuvate stranicu
    fetch('/save-page', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, name: pageName })  // Koristi username
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => {
        console.error("Greška pri čuvanju stranice:", error);
        alert("Došlo je do greške prilikom čuvanja stranice.");
    });
});

// Funkcija za učitavanje stranica
function loadPage(username, pageName) {
    fetch(`/load-page/${username}/${pageName}`)
    .then(response => response.json())
    .then(data => {
        alert("Stranica učitana: " + data.name);
        // Ovdje možete dodati kod za prikaz stranice
    })
    .catch(error => {
        console.error("Greška pri učitavanju stranice:", error);
        alert("Došlo je do greške prilikom učitavanja stranice.");
    });
}

// Funkcija za prikazivanje sačuvanih stranica
function showSavedPages(username) {
    fetch(`/saved-pages/${username}`)
    .then(response => response.json())
    .then(pages => {
        const menu = document.getElementById('savedPagesMenu');
        menu.innerHTML = '';  // Očisti prethodni meni
        pages.forEach(page => {
            const button = document.createElement('button');
            button.textContent = page.name;
            button.addEventListener('click', () => loadPage(username, page.name));
            menu.appendChild(button);
        });
    })
    .catch(error => {
        console.error("Greška pri učitavanju stranica:", error);
        alert("Došlo je do greške prilikom učitavanja stranica.");
    });
}
