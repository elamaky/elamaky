const ButtClient = require('buttjs');

// Funkcija za startovanje strima
function startStream(username) {
  if (username === 'Radio Galaksija') {
    console.log(`Pokrećem strim za: ${username}`);  // Dodaj log za proveru da li je funkcija pozvana

    // Postavi IP adresu i port (ako je potrebno promeniti)
    let host = "127.0.0.1";
    let port = 1256;
    let client = new ButtClient(host, port);

    // Pokreći strim
    client.startStreaming((err, _) => {
      if (err) {
        console.error("Greška pri pokretanju strima: ", err);
        return;
      }
      console.log("Strim je uspešno pokrenut.");
    });
  }
}

// Funkcija koja osluškuje konekciju korisnika
function listenForUserLogin(io) {
  io.on('connection', (socket) => {
    console.log('Novi korisnik je povezan');

    socket.on('userLoggedIn', (username) => {
      console.log(`${username} se ulogovao`);

      // Pokreni stream ako je korisnik Radio Galaksija
      startStream(username);
    });
  });
}

module.exports = {
  listenForUserLogin
};
