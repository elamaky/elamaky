const virtualGuests = [
    { nickname: '-Tigar-', messages: ['Pozdrav svima, stigao sam! Idemooooooooooooooooooooo!'], color: 'orange' },
    { nickname: '_Car_', messages: ['Hej druže! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'blue' },
    { nickname: '°Sladja°', messages: ['Hej hej, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'magenta' },
     { nickname: 'Gost-6353', messages: ['Ćao svima, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'black' },
    { nickname: '**Jeka**', messages: ['Pozz ekipa! Jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'silver' },
    { nickname: 'Gost-4545', messages: ['Zdravo ekipo! Idemooooooooooooooooooooo!'], color: 'gray' },
];

// Kombinuj normalne goste i virtuelne goste
const allGuests = [...normalGuests, ...virtualGuests];

// Funkcija za nasumično mešanje gostiju
function shuffleGuests(guests) {
    for (let i = guests.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [guests[i], guests[j]] = [guests[j], guests[i]]; // Swap
    }
}

// Mešaj sve goste
shuffleGuests(allGuests);

// Prikazivanje pomešanih gostiju na stranici
function addGuestsToList() {
    const guestList = document.getElementById('guestList');
    guestList.innerHTML = ''; // Očisti listu pre nego što dodaš nove

    allGuests.forEach(guest => {
        const guestElement = document.createElement('div');
        guestElement.classList.add('guest');
        guestElement.textContent = guest.nickname;
        guestElement.style.color = guest.color;
        guestElement.style.fontWeight = 'bold';
        guestElement.style.fontStyle = 'italic';

        guestList.appendChild(guestElement);
    });
}

window.onload = () => {
    addGuestsToList();
};
