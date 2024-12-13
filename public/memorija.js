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

       // Event listener za otvaranje modala
document.getElementById('memorija').addEventListener('click', function() {
    document.getElementById('memoryModal').style.display = 'block';
    loadPagesFromStorage();
});


     // Zatvoriti modal
    const closeButton = document.getElementById('closeModalButton');
    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });
});

    let isDragging = false;
    let offsetX, offsetY;

    memoryModal.addEventListener('mousedown', function (e) {
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



    const pageList = modal.querySelector('#pageList');
    const savedPages = JSON.parse(localStorage.getItem('pages')) || [];

    // Učitavanje stranica iz localStorage
    savedPages.forEach(page => {
        const listItem = document.createElement('li');
        listItem.textContent = page.name;
        pageList.appendChild(listItem);
    });


   // Spremanje nove stranice
    const saveButton = document.getElementById('saveNewPageButton');
    saveButton.addEventListener('click', function () {
        const pageName = document.getElementById('newPageNameInput').value;
        if (pageName) {
            const newPage = { name: pageName };
            savedPages.push(newPage);

            // Ažuriraj localStorage
            localStorage.setItem('pages', JSON.stringify(savedPages));

            // Dodaj novu stranicu u listu
            const listItem = document.createElement('li');
            listItem.textContent = pageName;
            pageList.appendChild(listItem);

            // Očisti unos
            document.getElementById('newPageNameInput').value = '';
        }
    });

   
    document.getElementById('memorija').addEventListener('click', function () {
        modal.style.display = 'block';
        loadSavedPages();
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pageData)
        })
        .then(response => {
            if (!response.ok) {
                console.error('Odgovor nije validan:', response.status, response.statusText);
                throw new Error('Greška pri slanju zahteva serveru.');
            }
            return response.json();
        })
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
    const userId = localStorage.getItem('userId');  // Proveri da li postoji userId u localStorage
    if (!userId) {
        alert('Nema korisničkog ID-a.');
        return;
    }

    fetch(`/api/getPages?userId=${userId}`)  // Poslati userId kao query parametar
    .then(response => {
        console.log('Odgovor od servera:', response);
        if (!response.ok) {
            throw new Error('Greška u odgovoru servera.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success && data.pages) {
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
        } else {
            alert('Nema stranica za ovog korisnika.');
        }
    })
    .catch(error => {
        console.error('Greška pri učitavanju stranica:', error);
        alert('Došlo je do greške pri učitavanju stranica.');
    });
}

// Funkcija za čitanje kolačića
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Dohvatanje userId iz kolačića
const userId = getCookie('user_id');  // Proveravaš kolačić 'user_id'

// Ako korisnik nije prijavljen, tretiramo ga kao gosta
if (!userId) {
  console.log('Korisnik je gost');  // Ne prikazuj obavestenje, samo loguj
  // Ovdje možeš omogućiti pristup samo onim funkcijama koje ne zahtevaju prijavu
} else {
  // Ako je korisnik prijavljen, šaljemo zahtev za stranice
  fetch(`/api/getPages?userId=${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Greška pri učitavanju stranica.');
      }
      return response.json();
    })
    .then(data => {
      // Obrada podataka
      console.log(data);
    })
    .catch(error => {
      console.error('Greška:', error);
    });

  // Dodavanje event listenera za otvaranje modala
  document.getElementById('memorija').addEventListener('click', function () {
    modal.style.display = 'block';
    loadSavedPages(userId);
  });
}

// Funkcija za učitavanje stranica iz localStorage
function loadPagesFromStorage() {
  const pages = JSON.parse(localStorage.getItem('pages')); // Pretpostavljamo da su stranice sačuvane u 'pages'
  if (pages) {
    // Ako stranice postoje u localStorage, prikaži ih u modalnom prozoru
    console.log('Stranice učitane iz localStorage:', pages);
    displayPagesInModal(pages); // Funkcija koja prikazuje stranice u modalnom prozoru
  } else {
    console.log('Nema stranica u localStorage.');
  }
}

// Funkcija za prikazivanje stranica u modalnom prozoru
function displayPagesInModal(pages) {
  const modal = document.getElementById('modal'); // ID tvog modala
  const modalContent = modal.querySelector('.modal-content'); // Unutar modala pronađi element za sadržaj

  // Očisti prethodni sadržaj
  modalContent.innerHTML = '';

  // Prikazivanje stranica u modalnom prozoru
  pages.forEach(page => {
    const pageElement = document.createElement('div');
    pageElement.classList.add('page-item');
    pageElement.textContent = `Stranica: ${page.name}`;  // Pretpostavljamo da je 'name' ime stranice
    modalContent.appendChild(pageElement);
  });

  // Prikazivanje modala
  modal.style.display = 'block';  // Pretpostavljamo da koristiš 'display: block' da prikažeš modal
}

// Funkcija za učitavanje stranica sa servera (ako je korisnik prijavljen)
function loadSavedPages(userId) {
  fetch(`/api/getPages?userId=${userId}`)  // Poslati userId kao query parametar
  .then(response => {
    if (!response.ok) {
      throw new Error('Greška pri učitavanju stranica.');
    }
    return response.json();
  })
  .then(data => {
    if (data.success && data.pages) {
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
    } else {
      alert('Nema stranica za ovog korisnika.');
    }
  })
  .catch(error => {
    console.error('Greška pri učitavanju stranica:', error);
    alert('Došlo je do greške pri učitavanju stranica.');
  });
}

// Pozivanje funkcije za učitavanje stranica pri učitavanju stranice
window.onload = function() {
  loadPagesFromStorage();
}
