document.addEventListener('DOMContentLoaded', function () {
    const modal = document.createElement('div');
    modal.id = 'memorija';
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

     const pageList = modal.querySelector('#pageList');
    const openModalButton = document.getElementById('openModalButton');
    const pages = [];

    openModalButton.addEventListener('click', () => {
        modal.style.display = 'block';
        renderPageList();
    });

    document.getElementById('closeModalButton').addEventListener('click', function () {
        modal.style.display = 'none';
    });

    document.getElementById('saveToFileButton').addEventListener('click', function () {
        const pageName = document.getElementById('newPageNameInput').value;
        if (!pageName) {
            alert('Morate uneti naziv verzije.');
            return;
        }

        const pageData = {
            name: pageName,
            content: document.body.innerHTML, // Ovo hvata celokupni sadržaj stranice
        };

        pages.push(pageData);

        const blob = new Blob([JSON.stringify(pages, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'verzije_stranica.json';
        a.click();

        alert('Verzija stranice je sačuvana u JSON fajl.');
    });

    document.getElementById('loadFromFileButton').addEventListener('click', function () {
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
                pages.length = 0;
                pages.push(...loadedPages);
                renderPageList();
                alert('Fajl učitan uspešno.');
            } catch (error) {
                alert('Greška prilikom učitavanja fajla.');
            }
        };
        reader.readAsText(file);
    });

    function renderPageList() {
        pageList.innerHTML = '';
        pages.forEach((page, index) => {
            const li = document.createElement('li');
            li.textContent = page.name;
            li.style.cursor = 'pointer';
            li.style.padding = '10px';
            li.style.borderBottom = '1px solid #00ffff';

            li.addEventListener('click', function () {
                document.body.innerHTML = page.content;
                alert(`Verzija "${page.name}" je učitana.`);
            });

            pageList.appendChild(li);
        });
    }
});
