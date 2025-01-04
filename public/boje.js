// Pronađi dugme i div za `color picker`
const colorBtn = document.getElementById('colorBtn');
const colorPickerDiv = document.getElementById('color-picker');

// Generiši Pickr bez unapred definisanih boja
const pickr = Pickr.create({
    el: '#color-picker',
    theme: 'nano',
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            input: true,
            save: true
        }
    }
});

// Prikaži/skrivaj `color picker` kada se klikne na dugme
colorBtn.addEventListener('click', () => {
    const isHidden = colorPickerDiv.style.display === 'none';
    colorPickerDiv.style.display = isHidden ? 'block' : 'none';
});

// Pošalji izabranu boju serveru kada korisnik klikne na "Save"
pickr.on('save', (color) => {
    const chosenColor = color.toHEXA().toString(); // Konvertuj boju u HEX
    socket.emit("setColor", { guestId: socket.id, color: chosenColor });
    colorPickerDiv.style.display = 'none'; // Sakrij picker nakon izbora
});

// Ažuriraj listu gostiju
socket.on("updateGuestList", (guests) => {
    const guestList = document.getElementById("guestList");
    guestList.innerHTML = ""; // Očisti trenutnu listu

    Object.entries(guests).forEach(([guestId, color]) => {
        const div = document.createElement("div");
        div.textContent = guestId;
        div.style.color = color; // Postavi boju teksta
        guestList.appendChild(div);
    });
});
