<!-- Dugme za otvaranje modala -->
<button id="memorija">Otvori memoriju</button>

<!-- Modal struktura -->
<div id="memoryModal" style="display:none; position: fixed; top: 400; left: 400; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 999;">
    <div style="position: relative; margin: auto; background-color: white; padding: 20px; max-width: 500px; top: 50%; transform: translateY(-50%);">
        <h2>Memorisane stranice</h2>
        <ul id="pageList">
            <!-- Lista memorisanih stranica -->
        </ul>
        <h3>Unesite naziv nove stranice:</h3>
        <input type="text" id="newPageNameInput" placeholder="Naziv stranice">
        <button id="saveNewPageButton">Spasi stranicu</button>
        <button id="closeModalButton">Zatvori</button>
    </div>
</div>

<script>
    // Otvoriti modal kada se klikne na dugme
    document.getElementById('memorija').addEventListener('click', function() {
        document.getElementById('memoryModal').style.display = 'block';  // Otvoriti modal
        loadSavedPages();  // Učitati memorisane stranice
    });

    // Zatvoriti modal
    document.getElementById('closeModalButton').addEventListener('click', function() {
        document.getElementById('memoryModal').style.display = 'none';  // Zatvoriti modal
    });

    // Funkcija za snimanje nove stranice
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
            document.getElementById('memoryModal').style.display = 'none';  // Zatvori modal nakon snimanja
        })
        .catch(error => {
            console.error("Greška pri čuvanju stranice:", error);
            alert("Došlo je do greške prilikom čuvanja stranice.");
        });
    });

    // Funkcija za učitavanje memorisanih stranica
    function loadSavedPages() {
        // Ovdje možete dodati kod za učitavanje sa servera ili iz lokalnog skladišta
        // Za primer, samo ćemo dodati nekoliko stranica ručno
        const pages = [
            { name: "Stranica 1" },
            { name: "Stranica 2" }
        ];

        const pageList = document.getElementById('pageList');
        pageList.innerHTML = '';  // Očisti prethodne stavke

        pages.forEach(page => {
            const li = document.createElement('li');
            li.textContent = page.name;
            pageList.appendChild(li);
        });
    }
</script>

