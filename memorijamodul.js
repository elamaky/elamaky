const pageSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // ID korisnika
  name: { type: String, required: true },    // Naziv stranice
});

const Page = mongoose.model('Page', pageSchema);
const Page = require('./models/Page');

// Ruta za spremanje stranice
app.post('/save-page', async (req, res) => {
  const { userId, name } = req.body;

  try {
    const newPage = new Page({ userId, name });
    await newPage.save();
    res.status(200).json({ message: "Stranica je sačuvana!" });
  } catch (error) {
    res.status(500).json({ message: "Greška pri čuvanju stranice.", error });
  }
});

// Ruta za učitavanje stranice
app.get('/load-page/:userId/:name', async (req, res) => {
  const { userId, name } = req.params;

  try {
    const page = await Page.findOne({ userId, name });
    if (page) {
      res.status(200).json(page); // Vraćamo podatke stranice
    } else {
      res.status(404).json({ message: "Stranica nije pronađena." });
    }
  } catch (error) {
    res.status(500).json({ message: "Greška pri učitavanju stranice.", error });
  }
});

// Ruta za dobijanje svih sačuvanih stranica za korisnika
app.get('/saved-pages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const pages = await Page.find({ userId });
    res.status(200).json(pages);  // Vraćamo listu svih stranica korisnika
  } catch (error) {
    res.status(500).json({ message: "Greška pri dobijanju stranica.", error });
  }
});
