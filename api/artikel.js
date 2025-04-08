export default async function handler(req, res) {
  const url = "https://script.google.com/macros/s/AKfycbx3hfePMrOb_XUArEGdG-_8XVqicJxMu5mmUyzNvcApEbnO2rgK0DQdFzWID9yugYGH/exec?action=getArtikelListe";
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Artikel" });
  }
}