import fetch from 'node-fetch';
export default async function handler(req, res) {
  const url = "https://script.google.com/macros/s/AKfycbx3hfePMrOb_XUArEGdG-_8XVqicJxMu5mmUyzNvcApEbnO2rgK0DQdFzWID9yugYGH/exec?action=getVorlagePrompt";
  try {
    const response = await fetch(url);
    const data = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("Fehler beim Abruf der Vorlage");
  }
}