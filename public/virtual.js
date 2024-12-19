const virtualGuests = [
    { nickname: '-Robert-', messages: ['Pozdrav svima, stigao sam! Idemooooooooooooooooooooo!'], color: 'white' },
    { nickname: '_Mr Glück_', messages: ['Hej druže! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'blue' },
    { nickname: '°Sladja°', messages: ['Hej hej, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'magenta' },
     { nickname: 'Gost-6353', messages: ['Ćao svima, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'green' },
    { nickname: '**Sanella**', messages: ['Pozz ekipa! Jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'red' },
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
