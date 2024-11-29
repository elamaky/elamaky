const { exec } = require('child_process');

// Funkcija za startovanje strima
function startStream(username) {
  if (username === 'Radio Galaksija') {
    console.log(`Pokrećem strim za: ${username}`);  // Dodaj log za proveru da li je funkcija pozvana

    // Pokreće BUTT u pozadini, bez GUI
    exec('butt --nogui --stream-url=http://link.zeno.fm:80/krdfduyswxhtv --stream-name="Radio Galaksija" --user-name=source --password=hoRXuevt', (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error: ${error}`);
        return;
      }
      console.log(`Strim za Radio Galaksija je započet: ${stdout}`);
      console.error(`stderr: ${stderr}`);
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
