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

    let isDragging = false;
    let offsetX, offsetY;

    modal.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - modal.offsetLeft;
        offsetY = e.clientY - modal.offsetTop;
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            modal.style.left = e.clientX - offsetX + 'px';
            modal.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

    document.getElementById('memorija').addEventListener('click', function () {
        modal.style.display = 'block';
        loadSavedPages();
    });

    document.getElementById('closeModalButton').addEventListener('click', function () {
        modal.style.display = 'none';
    });

    document.getElementById('saveNewPageButton').addEventListener('click', function () {
        const pageName = document.getElementById('newPageNameInput').value;

        if (!pageName) {
            alert('Morate uneti naziv stranice.');
            return;
        }

        const pageData = { name: pageName };

        fetch('/api/savePage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pageData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Stranica je uspešno sačuvana!');
                modal.style.display = 'none';
                loadSavedPages();
            } else {
                alert('Greška pri čuvanju stranice.');
            }
        })
        .catch(error => {
            console.error('Greška pri čuvanju stranice:', error);
            alert('Došlo je do greške pri čuvanju stranice.');
        });
    });

    function loadSavedPages() {
        fetch('/api/getPages')
        .then(response => {
            console.log('Odgovor od servera:', response);
            if (!response.ok) {
                throw new Error('Greška u odgovoru servera.');
            }
            return response.json();
        })
        .then(data => {
            const pageList = document.getElementById('pageList');
            pageList.innerHTML = '';

            data.pages.forEach(page => {
                const li = document.createElement('li');
                li.textContent = page.name;
                li.style.borderBottom = '1px solid #00ffff';
                li.style.padding = '5px 0';
                li.style.cursor = 'pointer';

                li.addEventListener('click', function () {
                    loadPageContent(page.name);
                });

                pageList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Greška pri učitavanju stranica:', error);
            alert('Došlo je do greške pri učitavanju stranica.');
        });
    }

    function loadPageContent(pageName) {
        alert(`Učitavam sadržaj stranice: ${pageName}`);

        fetch(`/api/getPage?name=${encodeURIComponent(pageName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Greška u odgovoru servera.');
            }
            return response.json();
        })
        .then(data => {
            if (data.page) {
                console.log(`Sadržaj stranice ${pageName} je:`, data.page);
                // Ovde se može učitati chat ili drugi sadržaj u realnom vremenu.
            } else {
                alert('Stranica nije pronađena.');
            }
        })
        .catch(error => {
            console.error('Greška pri učitavanju stranice:', error);
            alert('Došlo je do greške pri učitavanju stranice.');
        });
    }

    const userId = localStorage.getItem('userId');

    if (userId) {
        document.getElementById('memorija').addEventListener('click', function () {
            modal.style.display = 'block';
            loadSavedPages(userId);
        });
    }
});

