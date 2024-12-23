document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('memoryForm');
    const openModalButton = document.getElementById('memorija');
    const savePageButton = document.getElementById('savePageButton');
    const savedPagesMenu = document.getElementById('savedPagesMenu');

    let savedPages = [];

    openModalButton.addEventListener('click', () => {
        modal.style.display = 'block';
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
        modal.style.display = 'none';
        alert('Stranica je sačuvana.');
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

