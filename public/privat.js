let selectedUser = null; // Odabran korisnik za privatni chat

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
    <div id="privateChatInfo" style="display: none; background-color: rgba(0, 0, 255, 0.1); padding: 5px; margin-top: 10px;"></div>
    <ul id="guestList"></ul>
`;

// Početni log: Učitavanje stranice
console.log("Stranica učitana. Priprema za selektovanje gostiju.");

