let isBold = false;
let isItalic = false;
let currentColor = '#FFFFFF';
let isUnderline = false;  
let isOverline = false;   

// Objekat za čuvanje podataka o gostima
const guestsData = {};

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

// Funkcija za biranje boje
document.getElementById('colorBtn').addEventListener('click', function() {
    document.getElementById('colorPicker').click();
});

// Kada korisnik izabere boju iz palete
document.getElementById('colorPicker').addEventListener('input', function() {
    currentColor = this.value;
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

// Funkcija za dodavanje stilova gostima sa jednim color picker-om
function addGuestStyles(guestElement, guestId) {
    const colorPickerButton = document.createElement('input');
    colorPickerButton.type = 'color';
    colorPickerButton.classList.add('colorPicker');
    colorPickerButton.value = guestsData[guestId]?.color || '#FFFFFF'; // Podrazumevana boja

    colorPickerButton.addEventListener('input', function() {
        guestElement.style.color = this.value;
        guestsData[guestId].color = this.value; // Ažuriraj boju u objektu
    });

    guestElement.appendChild(colorPickerButton);
}

