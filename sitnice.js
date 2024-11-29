function ensureRadioGalaksijaAtTop(guests) {
    const guestList = Object.values(guests);
    if (guestList.includes('Radio Galaksija')) {
        const index = guestList.indexOf('Radio Galaksija');
        guestList.splice(index, 1); // Ukloni ga iz trenutnog mesta
        guestList.unshift('Radio Galaksija'); // Dodaj ga na vrh
    }
    return guestList;
}

module.exports = {
    ensureRadioGalaksijaAtTop
};
