let isPrivateChatEnabled = false; // Status privatnog chata (globalno za sve)

// Admin uključuje/isključuje privatni chat
document.getElementById('adminTogglePrivate').addEventListener('click', () => {
    isPrivateChatEnabled = !isPrivateChatEnabled;
    socket.emit('toggle_private_chat', isPrivateChatEnabled); // Emit statusa svim klijentima

    const statusText = isPrivateChatEnabled ? "Privatni chat je uključen" : "Privatni chat je isključen";
    alert(statusText);
});

document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const chatInput = document.getElementById('chatInput');
    let selectedGuest = null;

    // Kada admin promeni status privatnog čata
    socket.on('private_chat_status', (status) => {
        isPrivateChatEnabled = status;
        alert(isPrivateChatEnabled ? "Privatni chat je uključen" : "Privatni chat je isključen");
    });

    // Selektovanje gosta
    guestList.addEventListener('click', (event) => {
        if (!isPrivateChatEnabled || !event.target.classList.contains('guest')) {
            return;
        }

        if (selectedGuest) {
            selectedGuest.style.backgroundColor = ''; // Reset prethodnog gosta
        }

        selectedGuest = event.target;
        selectedGuest.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Obeleži selekciju
    });

    // Slanje poruke
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const message = chatInput.value;

            if (isPrivateChatEnabled && selectedGuest) {
                socket.emit('private_message', {
                    to: selectedGuest.textContent,
                    message
                });
                chatInput.value = '';
            } else {
                socket.emit('chatMessage', { text: message });
                chatInput.value = '';
            }
        }
    });
});
