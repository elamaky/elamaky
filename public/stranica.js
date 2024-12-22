document.addEventListener('DOMContentLoaded', function () {
    // Kreiraj modal
    const modal = document.createElement('div');
    modal.id = 'memoryModal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.width = '400px';
    modal.style.height = '400px';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'black';
    modal.style.border = '2px solid #00ffff';
    modal.style.boxShadow = '0 0 20px #00ffff';
    modal.style.zIndex = '1000';
    modal.style.padding = '20px';
    modal.style.overflow = 'auto';
    modal.style.cursor = 'move';

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="color: #00ffff;">Unesite naziv stranice</h3>
            <button id="closeModalButton" style="color: #00ffff; background: none; border: 1px solid #00ffff; padding: 5px; cursor: pointer;">Zatvori</button>
        </div>
        <input type="text" id="newPageNameInput" placeholder="Naziv stranice" style="width: 100%; margin: 10px 0; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff;"/>
        <button id="saveNewPageButton" style="width: 100%; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff; cursor: pointer;">Spremi stranicu</button>
        <ul id="pageList" style="margin-top: 20px; color: #00ffff; padding: 0; list-style: none;"></ul>
    `;
    document.body.appendChild(modal);

    const pageList = modal.querySelector('#pageList');

    // Dugme za otvaranje modala
    const openModalButton = document.getElementById('openModalButton');
    openModalButton.addEventListener('click', () => {
        modal.style.display = 'block';
        loadSavedPages(); // Učitaj sačuvane stranice
    });

    // Zatvori modal
    document.getElementById('closeModalButton').addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Čuvanje stranice u JSON (ili u localStorage)
    document.getElementById('saveNewPageButton').addEventListener('click', function () {
        const pageName = document.getElementById('newPageNameInput').value;
        if (!pageName) {
            alert('Morate uneti naziv stranice.');
            return;
        }

        const pageData = {
            name: pageName,
            images: [] // Dodaj slike i njihove pozicije/dimenzije ovde
        };

        let savedPages = JSON.parse(localStorage.getItem('pages')) || [];
        savedPages.push(pageData);
        localStorage.setItem('pages', JSON.stringify(savedPages));
        alert('Stranica je sačuvana!');
        document.getElementById('newPageNameInput').value = '';
    });

    // Učitavanje sačuvanih stranica iz localStorage
    function loadSavedPages() {
        const savedPages = JSON.parse(localStorage.getItem('pages')) || [];
        pageList.innerHTML = ''; // Očisti pređašnju listu

        savedPages.forEach(page => {
            const li = document.createElement('li');
            li.textContent = page.name;
            li.style.cursor = 'pointer';
            li.style.padding = '10px';
            li.style.borderBottom = '1px solid #00ffff';

            li.addEventListener('click', function () {
                loadPageContent(page); // Učitaj sadržaj stranice
                modal.style.display = 'none'; // Zatvori modal
            });

            pageList.appendChild(li);
        });
    }

    // Dinamičko učitavanje sadržaja na postojeću stranicu
    function loadPageContent(page) {
        const body = document.body;

        // Očisti trenutnu stranicu (izbriši sve slike)
        const existingImages = document.querySelectorAll('img');
        existingImages.forEach(img => img.remove());

        // Dodaj slike iz sačuvane verzije
        page.images.forEach(data => {
            const img = document.createElement('img');
            img.src = data.src;
            img.style.position = 'absolute';
            img.style.top = data.top;
            img.style.left = data.left;
            img.style.width = data.width;
            img.style.height = data.height;
            body.appendChild(img);
        });
    }

    // Funkcija za preuzimanje i čuvanje fajla sa stranicom u JSON formatu
    document.getElementById('saveFileButton').addEventListener('click', function () {
        const savedPages = JSON.parse(localStorage.getItem('pages')) || [];
        const pageData = JSON.stringify(savedPages, null, 2); // Formatiran JSON

        const blob = new Blob([pageData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pages.json';
        a.click();
    });

    // Učitavanje fajla sa računara
    document.getElementById('loadFileButton').addEventListener('click', function () {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (!file) {
            alert('Morate odabrati fajl!');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const pagesData = JSON.parse(event.target.result);
            localStorage.setItem('pages', JSON.stringify(pagesData));
            loadSavedPages(); // Ponovno učitaj stranice nakon učitavanja fajla
            alert('Fajl učitan!');
        };
        reader.readAsText(file);
    });
});
