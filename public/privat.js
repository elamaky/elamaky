// client.js - Kod za klijent-side (Može biti HTML/JS)

const socket = io(); // Inicijalizacija soketa

socket.on('private_chat_started', (receiverId) => {
    console.log(`Privatni chat započet sa ${receiverId}`);
});

socket.on('private_chat_ended', (senderId) => {
    console.log(`Privatni chat završen sa ${senderId}`);
});

socket.on('private_message', (message) => {
    console.log(`Poruka primljena: ${message.text} od ${message.nickname} u ${message.time}`);
});

socket.on('error', (errorMessage) => {
    console.log(`Greška: ${errorMessage}`);
});

// Funkcija za započinjanje privatnog chata
function togglePrivateChat(receiverId) {
    // Proverite da li ste već u privatnom chatu
    socket.emit('start_private_chat', receiverId);
}

// Funkcija za slanje privatne poruke
function sendPrivateMessage(receiverId, message) {
    if (message.trim() === '') {
        console.log('Poruka ne može biti prazna.');
        return;
    }

    socket.emit('send_private_message', { receiverId, message });
}
