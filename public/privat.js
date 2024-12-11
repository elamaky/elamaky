// Definisanje globalnih varijabli
let selectedUser = null; // Odabran korisnik za privatni chat
let isPrivateChatEnabled = false; // Status privatnog chata

// Event listener za dugme "Privatna poruka" (prvo što treba biti pozvano)
document.getElementById('privateMessage').addEventListener('click', () => {
    console.log("Kliknuto na dugme za privatnu poruku");
    
    isPrivateChatEnabled = !isPrivateChatEnabled; // Prebacuje stanje privatnog chata
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;
    
    console.log(statusText); // Logujemo status privatnog chata
    alert(statusText); // Prikazujemo status privatnog chata
});

// Funkcija za selektovanje korisnika (kada klikneš na korisnika u listi)
function selectUser(nickname) {
    console.log("selectUser pozvan sa nickname: ", nickname);
    
    selectedUser = nickname; // Skladištimo selektovanog korisnika
    console.log("Selektovan korisnik: ", selectedUser);

    // Obeleži selektovanog korisnika u listi
    document.querySelectorAll('#guestList li').forEach(li => {
        li.style.backgroundColor = ''; // Resetujemo boju
        console.log("Reseetujemo boju korisnika: ", li.textContent);
    });

    const userElement = Array.from(document.querySelectorAll('#guestList li')).find(li => li.textContent === nickname);
    if (userElement) {
        userElement.style.backgroundColor = 'rgba(0, 0, 255, 0.1)'; // Obeleži selektovanog korisnika
        console.log("Obeležen korisnik: ", userElement.textContent);
    }

    // Prikazivanje trake sa informacijom o privatnoj konverzaciji
    const privateChatInfo = document.getElementById('privateChatInfo');
    privateChatInfo.textContent = `Privatni chat sa ${nickname}`;
    privateChatInfo.style.display = 'block'; // Prikazivanje trake
    console.log("Prikazana providna traka sa informacijom o privatnoj konverzaciji");
}

// Dodaj event listener za desni klik na goste
document.getElementById('guestList').addEventListener('contextmenu', function(event) {
    console.log("Desni klik na element: ", event.target);

    // Prevent default right-click menu
    event.preventDefault();

    // Proveri da li je kliknut na <li> element u listi gostiju
    if (event.target && event.target.tagName === 'LI') {
        const nickname = event.target.textContent;
        console.log("Desni klik na korisnika: ", nickname);
        selectUser(nickname); // Pozivamo funkciju za selektovanje korisnika
    }
});

// Testiraj ovaj deo sa dummy listom
document.getElementById('guestList').innerHTML = `
    <li>Gost-1234</li>
    <li>Gost-5678</li>
    <li>Gost-9012</li>
`;

// Test: Dodavanje providne trake u HTML-u
document.body.innerHTML += `
    <div id="privateChatInfo" style="display:none; padding: 5px; background-color: rgba(0, 0, 255, 0.1); margin-top: 10px;">
        <!-- Ovdje će se prikazivati info o privatnom chatu -->
    </div>
    <ul id="guestList"></ul>
    <button id="privateMessage">Privatna poruka</button>
`;
