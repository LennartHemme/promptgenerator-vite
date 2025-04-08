import './style.css';

document.getElementById('app').innerHTML = `
  <h1>Mittagsupdate-Promptgenerator</h1>
  <label>Name für Prompt:<br />
    <input type="text" id="autorName" placeholder="z. B. Annika Boenigk" />
  </label>
  <br /><br />
  <button id="generateBtn">Prompt generieren</button>
  <pre id="output" style="margin-top: 20px; background: #f0f0f0; padding: 10px;"></pre>
`;

document.getElementById('generateBtn').addEventListener('click', () => {
  const name = document.getElementById('autorName').value || 'Unbekannt';
  const prompt = `Datum: ${new Date().toLocaleDateString('de-DE')}
Name: ${name}

[Hier folgt dein Prompt...]`;
  document.getElementById('output').textContent = prompt;
});