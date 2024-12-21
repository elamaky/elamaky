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
        <button id="loadFileButtonTrigger" style="width: 100%; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff; cursor: pointer;">Učitaj stranicu iz fajla</button>
        <input type="file" id="loadFileButton" style="display:none;">
    `;
    document.body.appendChild(modal);

    const pageList = modal.querySelector('#pageList');

    // Otvori modal kada klikneš na dugme "Spremi Stranicu"
    const openModalButton = document.getElementById('openModalButton');
    if (openModalButton) {
        openModalButton.addEventListener('click', () => {
            modal.style.display = 'block';
            loadSavedPages();  // Učitaj sačuvane stranice
        });
    }

    // Zatvori modal
    document.getElementById('closeModalButton').addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Čuvanje stranice u localStorage ili kao lokalni fajl
    document.getElementById('saveNewPageButton').addEventListener('click', function () {
        const pageName = document.getElementById('newPageNameInput').value;
        if (!pageName) {
            alert('Morate uneti naziv stranice.');
            return;
        }

        const pageData = {
            name: pageName,
            content: 'Sadržaj stranice'  // Ovde dodaj sadržaj stranice
        };

        // Prikazivanje opcija za čuvanje
        const saveOption = confirm('Da li želite da sačuvate stranicu u Storage? (Cancel za čuvanje kao fajl)');

        if (saveOption) {
            // Čuvanje u localStorage
            let savedPages = JSON.parse(localStorage.getItem('pages')) || [];
            savedPages.push(pageData);
            localStorage.setItem('pages', JSON.stringify(savedPages));
            alert('Stranica je sačuvana u Storage!');
        } else {
            // Čuvanje kao lokalni JSON fajl
            const blob = new Blob([JSON.stringify(pageData)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${pageName}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            alert('Stranica je sačuvana kao fajl!');
        }

        // Očisti unos
        document.getElementById('newPageNameInput').value = '';
    });

    // Učitavanje sačuvanih stranica iz localStorage
    function loadSavedPages() {
        const savedPages = JSON.parse(localStorage.getItem('pages')) || [];
        pageList.innerHTML = '';  // Očisti pređašnju listu

        savedPages.forEach(page => {
            const li = document.createElement('li');
            li.textContent = page.name;
            li.style.cursor = 'pointer';
            li.style.padding = '10px';
            li.style.borderBottom = '1px solid #00ffff';

            li.addEventListener('click', function () {
                loadPageContent(page);  // Učitaj sadržaj stranice
            });

            pageList.appendChild(li);
        });
    }

    // Učitaj sadržaj stranice
    function loadPageContent(page) {
        console.log(`Stranica učitana: ${page.name}`);
        alert(`Stranica "${page.name}" je učitana!\n\nSadržaj: ${page.content}`);
    }

    // Učitavanje stranice iz lokalnog fajla
    document.getElementById('loadFileButtonTrigger').addEventListener('click', function() {
        document.getElementById('loadFileButton').click();
    });

    document.getElementById('loadFileButton').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const pageData = JSON.parse(e.target.result);
            loadPageContent(pageData);
        };
        reader.readAsText(file);
    });
});
