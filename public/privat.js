let selectedUser = null; // Odabran korisnik za privatni chat
let isPrivateChatEnabled = false; // Status privatnog chata

// Event listener za dugme "Privatna poruka"
document.getElementById('privateMessage').addEventListener('click', () => {
    console.log("Kliknuto na dugme za privatnu poruku");

    // Prebacivanje stanja privatnog chata
    isPrivateChatEnabled = !isPrivateChatEnabled;
    const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;

    console.log(statusText); // Logujemo status privatnog chata
    alert(statusText); // Prikazujemo status privatnog chata
});

// Funkcija za selektovanje korisnika za privatnu konverzaciju
function selectUser(nickname) {
    console.log("selectUser pozvan sa nickname: ", nickname);

    selectedUser = nickname; // Skladištimo selektovanog korisnika
    console.log("Selektovan korisnik: ", selectedUser);

    // Obeleži selektovanog korisnika u listi
    document.querySelectorAll('#guestList li').forEach(li => {
        li.style.backgroundColor = ''; // Resetujemo boju
        console.log("Resetovanje boje korisnika: ", li.textContent);
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

// Event listener za desni klik na goste (samo za odabir korisnika)
document.getElementById('guestList').addEventListener('contextmenu', function (event) {
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

// Prikazivanje gostiju koji se dinamički dodaju sa servera
// Ova funkcija bi zapravo trebalo da dođe sa servera i u tom slučaju se učitava dinamički
function populateGuestList(guests) {
    const guestListElement = document.getElementById('guestList');
    guestListElement.innerHTML = ''; // Očisti prethodnu listu

    guests.forEach(guest => {
        const guestItem = document.createElement('li');
        guestItem.textContent = guest.nickname;
        guestListElement.appendChild(guestItem);
    });
}

// HTML za privatnu traku i listu gostiju
document.body.innerHTML += `
    <ul id="guestList"></ul>
    <button id="privateMessage">Privatna poruka</button>
    <div id="privateChatInfo" style="display:none; padding: 5px; background-color: rgba(0, 0, 255, 0.1); margin-top: 10px;">
        <!-- Ovdje će se prikazivati info o privatnom chatu -->
    </div>
`;
