document.addEventListener('DOMContentLoaded', function () {
    // Otvoriti modal kada se klikne na dugme "memorija"
    document.getElementById('memorija').addEventListener('click', function() {
        // Prikazuje modal
        document.getElementById('memoryModal').style.display = 'block';
        loadSavedPages();  // Učitaj memorisane stranice (ako je potrebno)
    });

    // Zatvori modal kada se klikne na dugme "Zatvori"
    document.getElementById('closeModalButton').addEventListener('click', function() {
        document.getElementById('memoryModal').style.display = 'none';
    });

    // Funkcija za snimanje nove stranice
    document.getElementById('saveNewPageButton').addEventListener('click', function() {
        const pageName = document.getElementById('newPageNameInput').value; // Unos naziva stranice

        if (!pageName) {
            setMessage("Morate uneti naziv stranice.", true);
            return;
        }

        const pageContent = document.documentElement.outerHTML; // Sadržaj stranice

        fetch('/save-page', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: pageName, content: pageContent })
        })
        .then(response => response.json())
        .then(data => {
            setMessage("Stranica je uspešno sačuvana!", false);
            document.getElementById('memoryModal').style.display = 'none'; // Zatvori modal nakon snimanja
        })
        .catch(error => {
            console.error("Greška pri čuvanju stranice:", error);
            setMessage("Došlo je do greške prilikom čuvanja stranice.", true);
        });
    });

    // Funkcija za učitavanje memorisanih stranica
    function loadSavedPages() {
        // Ovde možete dodati kod za učitavanje sa servera ili iz lokalnog skladišta
        const pages = [
            { name: "Stranica 1" },
            { name: "Stranica 2" }
        ];

        const pageList = document.getElementById('pageList');
        pageList.innerHTML = '';  // Očisti prethodne stavke

        pages.forEach(page => {
            const li = document.createElement('li');
            li.textContent = page.name;
            li.style.borderBottom = '1px solid #fff';
            pageList.appendChild(li);
        });
    }

    // Funkcija za postavljanje poruke
    function setMessage(message, isError) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.style.color = isError ? '#ff3333' : '#00ff00';  // Crvena za greške, zelena za uspeh
    }
});
