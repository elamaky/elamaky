document.addEventListener('DOMContentLoaded', function () {
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

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="color: #00ffff;">Memoriši ili Učitaj Stranicu</h3>
            <button id="closeModalButton" style="color: #00ffff; background: none; border: 1px solid #00ffff; padding: 5px; cursor: pointer;">Zatvori</button>
        </div>
        <input type="text" id="newPageNameInput" placeholder="Naziv verzije" style="width: 100%; margin: 10px 0; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff;" />
        <button id="saveToFileButton" style="width: 100%; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff; cursor: pointer;">Sačuvaj kao JSON</button>
        <input type="file" id="loadFromFileInput" style="margin-top: 10px; width: 100%; color: #00ffff;" />
        <button id="loadFromFileButton" style="width: 100%; padding: 10px; background: black; color: #00ffff; border: 1px solid #00ffff; cursor: pointer;">Učitaj JSON fajl</button>
        <ul id="pageList" style="margin-top: 20px; color: #00ffff; padding: 0; list-style: none;"></ul>
    `;
    document.body.appendChild(modal);

    const modalForm = document.getElementById('memoryForm');
    const openModalButton = document.getElementById('memorija');
    const savePageButton = document.getElementById('savePageButton');
    const savedPagesMenu = document.getElementById('savedPagesMenu');

    let savedPages = [];

    openModalButton.addEventListener('click', () => {
        modalForm.style.display = 'block';
    });

    savePageButton.addEventListener('click', () => {
        const pageNameInput = document.getElementById('pageNameInput');
        const pageName = pageNameInput.value.trim();

        if (!pageName) {
            alert('Unesite naziv stranice.');
            return;
        }

        const images = Array.from(document.querySelectorAll('img')).map(img => {
            const rect = img.getBoundingClientRect();
            return {
                src: img.src,
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            };
        });

        savedPages.push({ name: pageName, images });
        updateSavedPagesMenu();
        pageNameInput.value = '';
        modalForm.style.display = 'none';
        alert('Stranica je sačuvana.');
    });

    document.getElementById('saveToFileButton').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(savedPages, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'saved_pages.json';
        a.click();
        alert('Podaci su sačuvani u JSON fajl.');
    });

    document.getElementById('loadFromFileButton').addEventListener('click', () => {
        const fileInput = document.getElementById('loadFromFileInput');
        const file = fileInput.files[0];

        if (!file) {
            alert('Morate izabrati JSON fajl.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const loadedPages = JSON.parse(event.target.result);
                savedPages = loadedPages;
                updateSavedPagesMenu();
                alert('Podaci su učitani iz JSON fajla.');
            } catch (error) {
                alert('Greška prilikom učitavanja JSON fajla.');
            }
        };
        reader.readAsText(file);
    });

    function updateSavedPagesMenu() {
        savedPagesMenu.innerHTML = '';

        savedPages.forEach((page, index) => {
            const pageButton = document.createElement('button');
            pageButton.textContent = page.name;
            pageButton.style.display = 'block';
            pageButton.style.margin = '5px 0';

            pageButton.addEventListener('click', () => {
                loadPage(index);
            });

            savedPagesMenu.appendChild(pageButton);
        });
    }

    function loadPage(index) {
        const page = savedPages[index];

        document.querySelectorAll('img.saved-image').forEach(img => img.remove());

        page.images.forEach(imageData => {
            const img = document.createElement('img');
            img.src = imageData.src;
            img.style.position = 'absolute';
            img.style.top = `${imageData.top}px`;
            img.style.left = `${imageData.left}px`;
            img.style.width = `${imageData.width}px`;
            img.style.height = `${imageData.height}px`;
            img.classList.add('saved-image');

            document.body.appendChild(img);
        });

        alert(`Stranica "${page.name}" je učitana.`);
    }
});


