<!-- Modal struktura -->
<div id="memoryModal" style="display:none; position: fixed; top: 50%; left: 50%; max-width: 90%; max-height: 90%; background-color: rgba(0, 0, 0, 0.8); z-index: 999; overflow: auto; transform: translate(-50%, -50%); border: 2px solid #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);">
    <div id="modalContent" style="padding: 20px; color: #00f;">
        <h2 style="border-bottom: 2px solid #fff; padding-bottom: 10px;">Memorisane stranice</h2>
        <ul id="pageList" style="list-style-type: none; padding-left: 0; border-bottom: 2px solid #fff;">
            <!-- Lista memorisanih stranica -->
        </ul>
        <h3>Unesite naziv nove stranice:</h3>
        <input type="text" id="newPageNameInput" placeholder="Naziv stranice" style="width: 100%; padding: 5px; margin-bottom: 10px;">
        <button id="saveNewPageButton" style="width: 100%; padding: 5px; margin-bottom: 10px; background-color: #333; color: #fff; border: none;">Spasi stranicu</button>
        <button id="closeModalButton" style="width: 100%; padding: 5px; background-color: #ff3333; color: #fff; border: none;">Zatvori</button>

        <!-- Placeholder za poruke -->
        <div id="message" style="color: #fff; margin-top: 10px;"></div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Otvoriti modal kada se klikne na dugme
        document.getElementById('memorija').addEventListener('click', function() {
            document.getElementById('memoryModal').style.display = 'block';  // Otvoriti modal
            loadSavedPages();  // Učitati memorisane stranice
        });

        // Zatvoriti modal
        document.getElementById('closeModalButton').addEventListener('click', function() {
            document.getElementById('memoryModal').style.display = 'none';  // Zatvoriti modal
        });

        // Funkcija za snimanje nove stranice
        document.getElementById('saveNewPageButton').addEventListener('click', function() {
            const pageName = document.getElementById('newPageNameInput').value;  // Unos naziva stranice

            if (!pageName) {
                setMessage("Morate uneti naziv stranice.", true);
                return;
            }

            const pageContent = document.documentElement.outerHTML;

            fetch('/save-page', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: pageName, content: pageContent })
            })
            .then(response => response.json())
            .then(data => {
                setMessage("Stranica je uspešno sačuvana!", false);
                document.getElementById('memoryModal').style.display = 'none';  // Zatvori modal nakon snimanja
            })
            .catch(error => {
                console.error("Greška pri čuvanju stranice:", error);
                setMessage("Došlo je do greške prilikom čuvanja stranice.", true);
            });
        });

        // Funkcija za učitavanje memorisanih stranica
        function loadSavedPages() {
            // Ovdje možete dodati kod za učitavanje sa servera ili iz lokalnog skladišta
            const pages = [
                { name: "Stranica 1" },
                { name: "Stranica 2" }
            ];

            const pageList = document.getElementById('pageList');
            pageList.innerHTML = '';  // Očisti prethodne stavke

            pages.forEach(page => {
                const li = document.createElement('li');
                li.textContent = page.name;
                li.style.borderBottom = '1px solid #fff';
                pageList.appendChild(li);
            });
        }

        // Funkcija za postavljanje poruke
        function setMessage(message, isError) {
            const messageElement = document.getElementById('message');
            messageElement.textContent = message;
            messageElement.style.color = isError ? '#ff3333' : '#00ff00';  // Crvena za greške, zelena za uspeh
        }
    });
</script>
