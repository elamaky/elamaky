let isPrivateChatEnabled = false; // Status privatnog chata
let selectedGuest = null; // Selekcija gosta

// Menjanje statusa privatnog chata
    document.getElementById('privateMessage').addEventListener('click', () => {
      socket.emit('togglePrivateChat');
    });

// Ažuriranje statusa privatnog chata
    socket.on('privateChatStatus', (status) => {
      isPrivateChatEnabled = status;
      const statusText = isPrivateChatEnabled ? `Privatni chat je uključen` : `Privatni chat je isključen`;
      console.log(statusText);
      alert(statusText);
    });

    // Selekcija gosta
    function selectGuest(guest) {
      if (!isPrivateChatEnabled) return; // Ignoriše klikove ako privatni chat nije uključen

      if (selectedGuest && selectedGuest.name === guest.name) {
        selectedGuest = null; // Resetuje selekciju ako je isti gost kliknut
      } else {
        selectedGuest = guest; // Postavlja novog selektovanog gosta
      }

      updateChatInput();
    }

    // Ažuriranje input forme za chat
    function updateChatInput() {
      const chatInput = document.getElementById('chatInput');
      if (selectedGuest) {
        chatInput.value = `---->>> ${selectedGuest.name} : `;
      } else {
        chatInput.value = '';
      }
    }

    // Kada korisnik pritisne Enter
    document.getElementById('chatInput').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        let message = event.target.value;

        if (isPrivateChatEnabled && selectedGuest) {
          // Emisija privatne poruke
          const recipient = selectedGuest.name;
          const time = new Date().toLocaleTimeString();

          socket.emit('private_message', {
            to: recipient,
            message,
            time
          });

          event.target.value = `---->>> ${recipient} : `;
        } else {
          // Emisija obične poruke
          socket.emit('chatMessage', {
            text: message
          });

          event.target.value = ''; // Resetuje unos samo za obične poruke
        }
      }
    });
