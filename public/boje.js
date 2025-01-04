let isBold = false;
let isItalic = false;
let currentColor = '#FFFFFF';
let isUnderline = false;  // Dodano za underline
let isOverline = false;   // Dodano za overline

// Funkcija za BOLD formatiranje
document.getElementById('boldBtn').addEventListener('click', function() {
    isBold = !isBold;
    updateInputStyle();
});

// Funkcija za ITALIC formatiranje
document.getElementById('italicBtn').addEventListener('click', function() {
    isItalic = !isItalic;
    updateInputStyle();
});

// Funkcija za UNDERLINE formatiranje
document.getElementById('linijadoleBtn').addEventListener('click', function() {
    isUnderline = !isUnderline;
    updateInputStyle();
});

// Funkcija za OVERLINE formatiranje
document.getElementById('linijagoreBtn').addEventListener('click', function() {
    isOverline = !isOverline;
    updateInputStyle();
});

// Primena stilova na polju za unos
function updateInputStyle() {
    let inputField = document.getElementById('chatInput');
    inputField.style.fontWeight = isBold ? 'bold' : 'normal';
    inputField.style.fontStyle = isItalic ? 'italic' : 'normal';
    inputField.style.color = currentColor;
    inputField.style.textDecoration = (isUnderline ? 'underline ' : '') + (isOverline ? 'overline' : '');
}

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
