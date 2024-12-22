document.addEventListener('DOMContentLoaded', function () {
    // Kreiraj modal
    const modal = document.createElement('div');
    modal.id = 'memoryModal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.width = '400px';
    modal.style.height = 'auto';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'black';
    modal.style.border = '2px solid #00ffff';
    modal.style.boxShadow = '0 0 20px #00ffff';
    modal.style.zIndex = '1000';
    modal.style.padding = '20px';
    modal.style.overflow = 'auto';
    modal.style.borderRadius = '8px';

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="color: #00ffff; margin: 0;">Upravljanje verzijama</h3>
            <button id="closeModalButton" style="color: #00ffff; background: none; border: 1px solid #00ffff; padding: 5px; cursor: pointer;">Zatvori</button>
        </div>
        <input type="text" id="pageNameInput" placeholder="Naziv stranice" style="width: 100%; margin: 10px 0; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff; border-radius: 4px;"/>
        <button id="savePageButton" style="width: 100%; padding: 10px; margin-bottom: 10px; background: black; color: #00ffff; border: 1px solid #00ffff; cursor: pointer; border-radius: 4px;">Memoriši stranicu</button>
        <input type="file" id="loadFileInput" accept="application/json" style="width: 100%; margin-bottom: 10px; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff; border-radius: 4px;"/>
        <ul id="pageList" style="margin-top: 10px; color: #00ffff; padding: 0; list-style: none; max-height: 200px; overflow-y: auto; border-top: 1px solid #00ffff; padding-top: 10px;"></ul>
    `;
    document.body.appendChild(modal);

    const pageList = modal.querySelector('#pageList');
    const openModalButton = document.getElementById('openModalButton');
    let currentPageContent = '';

    // Dugme za otvaranje modala
    openModalButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Dugme za zatvaranje modala
    document.getElementById('closeModalButton').addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Dugme za memorisanje stranice
    document.getElementById('savePageButton').addEventListener('click', function () {
        const pageName = document.getElementById('pageNameInput').value;
        const mainContent = document.getElementById('mainContent');

        if (!pageName) {
            alert('Unesite naziv stranice pre memorisanja.');
            return;
        }

        if (!mainContent) {
            alert('Glavni sadržaj nije pronađen.');
            return;
        }

        const pageData = {
            name: pageName,
            content: mainContent.innerHTML
        };

        const blob = new Blob([JSON.stringify(pageData)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${pageName}.json`;
        link.click();
        alert('Stranica je memorisana!');
    });

    // Učitavanje JSON fajla
    document.getElementById('loadFileInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    addVersionToList(jsonData);
                } catch (error) {
                    alert('Greška prilikom učitavanja fajla. Proverite format.');
                }
            };
            reader.readAsText(file);
        }
    });

    // Dodavanje verzije u listu
    function addVersionToList(data) {
        const li = document.createElement('li');
        li.textContent = data.name || 'Nepoznata verzija';
        li.style.cursor = 'pointer';
        li.style.padding = '10px';
        li.style.borderBottom = '1px solid #00ffff';

        li.addEventListener('click', function () {
            loadPageContent(data); // Učitaj sadržaj verzije
            modal.style.display = 'none'; // Zatvori modal
        });

        pageList.appendChild(li);
    }

    // Dinamičko učitavanje sadržaja na postojeću stranicu
    function loadPageContent(data) {
        const mainContent = document.getElementById('mainContent'); // Glavni kontejner
        if (mainContent) {
            mainContent.innerHTML = data.content || '<p style="color: #00ffff;">Sadržaj nije pronađen.</p>';

            // Omogući izmene učitane verzije
            enableEditing(mainContent);
        } else {
            console.error('Element sa ID-jem "mainContent" nije pronađen.');
        }
    }

    // Omogućavanje uređivanja učitane verzije
    function enableEditing(container) {
        container.contentEditable = true;
        container.style.border = '1px dashed #00ffff';
        container.style.padding = '10px';
        alert('Sada možete uređivati učitanu verziju direktno na stranici.');
    }
});
