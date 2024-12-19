const virtualGuests = [
   
    { nickname: 'Sanja', messages: ['Ćao svima, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'violet' },
    { nickname: 'Bojan', messages: ['Pozdrav društvo! Idemooooooooooooooooooooo!'], color: 'lime' },
    { nickname: 'Gost-7721', messages: ['Evo mene! Jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'white' },
    { nickname: '°Sladja°', messages: ['Hej hej, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'magenta' },
   { nickname: 'Gost-5582', messages: ['Ćao društvo! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'white' },
    { nickname: 'Boxer', messages: ['Veliki pozdrav, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'braun' },
    { nickname: 'Gost-8644', messages: ['Ćao, društvo! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'white' },
    { nickname: '<<Kristina>>', messages: ['Hello, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'pink' },
    { nickname: '/Sanella/', messages: ['Hej ekipo, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'red' },
    
];

function sendMessageToChat(guest, message) {
    const messageArea = document.getElementById('messageArea');

    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<span style="color: ${guest.color}; font-weight: bold; font-style: italic;">${guest.nickname}: ${message}</span>`;
    
    messageArea.insertBefore(messageElement, messageArea.firstChild);

    const spacingElement = document.createElement('div');
    spacingElement.style.height = '10px';
    messageArea.insertBefore(spacingElement, messageArea.firstChild.nextSibling);

    messageArea.scrollTop = 0;
}

function addGuestsToList() {
    const guestList = document.getElementById('guestList');
    
    virtualGuests.forEach(guest => {
        if (!Array.from(guestList.children).some(el => el.textContent === guest.nickname)) {
            const guestElement = document.createElement('div');
            guestElement.classList.add('guest');
            guestElement.textContent = guest.nickname;
            guestElement.style.color = guest.color;
            guestElement.style.fontWeight = 'bold';
            guestElement.style.fontStyle = 'italic';

            guestList.appendChild(guestElement);
        }
    });
}

function startVirtualGuests() {
    virtualGuests.forEach((guest, index) => {
        setTimeout(() => {
            guest.messages.forEach((message, msgIndex) => {
                setTimeout(() => {
                    sendMessageToChat(guest, message);
                }, msgIndex * 300000); // 5 minuta razmaka između poruka
            });
        }, index * 300000); // 5 minuta razmaka između gostiju
    });

    setTimeout(startVirtualGuests, virtualGuests.length * 300000);
}

window.onload = () => {
    addGuestsToList();
    startVirtualGuests();
};
