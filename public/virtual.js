const virtualGuests = [
    { nickname: '-Tigar-', messages: ['Pozdrav svima, stigao sam! Idemooooooooooooooooooooo!'], color: 'orange' },
    { nickname: '_Car_', messages: ['Hej druže! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'blue' },
    { nickname: '--Ganija--', messages: ['Selam svima! Jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'green' },
    { nickname: 'Selver', messages: ['Zdravo ekipo! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'brown' },
    { nickname: 'Mustafa', messages: ['Veliki pozdrav! Idemooooooooooooooooooooo!'], color: 'red' },
    { nickname: 'Jeniffer', messages: ['Hello, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'pink' },
    { nickname: 'Angelina', messages: ['Hi everyone! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'purple' },
    { nickname: 'Sanja', messages: ['Ćao svima, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'violet' },
    { nickname: 'Bojan', messages: ['Pozdrav društvo! Idemooooooooooooooooooooo!'], color: 'lime' },
    { nickname: 'Hasan', messages: ['Evo mene! Jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'teal' },
    { nickname: '-Jusuf-', messages: ['Selam ljudi! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'cyan' },
    { nickname: 'Mehmet', messages: ['Merhaba svima! Idemooooooooooooooooooooo!'], color: 'gold' },
    { nickname: '°Sladja°', messages: ['Hej hej, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'magenta' },
    { nickname: '**Jeka**', messages: ['Pozz ekipa! Jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'silver' },
    { nickname: 'Mija_°', messages: ['Ćao društvo! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'yellow' },
    { nickname: 'Lepa', messages: ['Veliki pozdrav, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'pink' },
    { nickname: '#Dijana#', messages: ['Ćao, društvo! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'turquoise' },
    { nickname: '<<Kristina>>', messages: ['Hello, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'blue' },
    { nickname: 'Hanuma°°°', messages: ['Zdravo svima! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'purple' },
    { nickname: "''Holofira``", messages: ['Hi all! Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'orange' },
    { nickname: '(((Luludi)))', messages: ['Merhaba! Idemooooooooooooooooooooo!'], color: 'lime' },
    { nickname: '&Titanik&', messages: ['Pozdrav za sve! Jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'red' },
    { nickname: 'Ip_Man', messages: ['Zdravo društvo! Opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'brown' },
    { nickname: '/Sanella/', messages: ['Hej ekipo, Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'cyan' },
    { nickname: '°_Ana_°', messages: ['Pozdrav svima! Idemooooooooooooooooooooo!'], color: 'gold' },
    { nickname: '=Tanja=', messages: ['Ćao ljudi! Romalen jasaaaaaaaaaaaaaaaaaaaaaaaaaaa!'], color: 'silver' },
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
