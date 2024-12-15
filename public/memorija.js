localStorage.setItem('userId', '123456');  
const userId = localStorage.getItem('userId');  

if (userId) {
  console.log(`Korisnik sa ID: ${userId}`);
} else {
  console.log('UserId nije sačuvan!');
}

const pageList = modal.querySelector('#pageList');
const openModalButton = document.getElementById('openModalButton');

if (openModalButton) {
    openModalButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });
}

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

    const saveButton = document.getElementById('saveNewPageButton');
    saveButton.addEventListener('click', function () {
        const pageName = document.getElementById('newPageNameInput').value;
        if (pageName) {
            const listItem = document.createElement('li');
            listItem.textContent = pageName;
            pageList.appendChild(listItem);

            // Očisti unos
            document.getElementById('newPageNameInput').value = '';

            // Čuvanje stranice na serveru
            const userId = localStorage.getItem('userId');
            if (userId) {
                const pageData = { userId, name: pageName };
                fetch('/api/savePage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pageData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Stranica je uspešno sačuvana!');
                    } else {
                        alert('Greška pri čuvanju stranice.');
                    }
                })
                .catch(error => {
                    console.error('Greška pri čuvanju stranice:', error);
                    alert('Došlo je do greške pri čuvanju stranice.');
                });
            }
        }
    });

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

    // Otvori modal kada klikneš na memoriju
    document.getElementById('memorija').addEventListener('click', function () {
        modal.style.display = 'block';
        loadSavedPages();
    });

    // Učitavanje sačuvanih stranica
    function loadSavedPages() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Nema korisničkog ID-a!');
            return;
        }

        fetch(`/api/getPages?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.pages) {
                    pageList.innerHTML = '';  // Očisti pre postojeće stranice
                    data.pages.forEach(page => {
                        const li = document.createElement('li');
                        li.textContent = page.name;
                        li.style.borderBottom = '1px solid #00ffff';
                        li.style.padding = '5px 0';
                        li.style.cursor = 'pointer';

                        const loadButton = document.createElement('button');
                        loadButton.textContent = 'Učitaj stranicu';
                        loadButton.style.backgroundColor = '#00ffff';
                        loadButton.style.border = 'none';
                        loadButton.style.padding = '5px';
                        loadButton.style.cursor = 'pointer';
                        
                        loadButton.addEventListener('click', function () {
                            loadPageContent(page.name);
                        });

                        li.appendChild(loadButton);
                        pageList.appendChild(li);
                    });
                } else {
                    alert('Nema stranica za ovog korisnika.');
                }
            })
            .catch(error => {
                console.error('Greška pri učitavanju stranica:', error);
                alert('Došlo je do greške pri učitavanju stranica.');
            });
    }

    function loadPageContent(pageName) {
        console.log(`Učitavam stranicu: ${pageName}`);
    }

    // Zatvori modal
    const closeButton = document.getElementById('closeModalButton');
    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });
});

window.onload = function() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        loadSavedPages();  
    }
};
