let pages = [];

// Funkcija za otvaranje modala
document.getElementById('stranica').onclick = function() {
    document.getElementById('modal').style.display = 'block';
};

// Funkcija za zatvaranje modala
document.getElementById('closeModalButton').onclick = function() {
    document.getElementById('modal').style.display = 'none';
};

// Funkcija za čuvanje stranice
document.getElementById('savePageButton').onclick = function() {
    const pageName = document.getElementById('pageNameInput').value;
    if (!pageName) {
        alert('Morate uneti naziv stranice.');
        return;
    }

    const imagesData = Array.from(document.querySelectorAll('.page-image')).map(img => ({
        src: img.src,
        top: img.style.top,
        left: img.style.left,
    }));

    const pageData = {
        name: pageName,
        images: imagesData,
    };

    pages.push(pageData);
    document.getElementById('pageNameInput').value = ''; // Očisti input
    document.getElementById('modal').style.display = 'none'; // Zatvori modal
    renderSavedPages(); // Ažuriraj listu sačuvanih stranica
};

// Funkcija za prikaz sačuvanih stranica
function renderSavedPages() {
    const savedPagesMenu = document.getElementById('savedPagesMenu');
    savedPagesMenu.innerHTML = ''; // Očisti postojeće stavke
    pages.forEach((page, index) => {
        const li = document.createElement('li');
        li.textContent = page.name;
        li.style.cursor = 'pointer';
        li.onclick = () => loadPage(index); // Učitaj stranicu po kliku
        savedPagesMenu.appendChild(li);
    });
}

// Funkcija za učitavanje stranice
function loadPage(index) {
    const page = pages[index];
    
    // Očisti trenutne slike
    document.querySelectorAll('.page-image').forEach(img => img.remove());

    // Učitaj slike iz sačuvane stranice
    page.images.forEach(image => {
        const img = document.createElement('img');
        img.className = 'page-image';
        img.src = image.src;
        img.style.position = 'absolute';
        img.style.top = image.top;
        img.style.left = image.left;

        document.getElementById('imageContainer').appendChild(img);
    });

    alert(`Stranica "${page.name}" je učitana.`);
}
