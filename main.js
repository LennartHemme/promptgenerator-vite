document.addEventListener("DOMContentLoaded", () => {
  loadArticles();
});

let daten = [];
let letzterPrompt = "";

async function loadArticles() {
  const res = await fetch("https://script.google.com/macros/s/AKfycbx3hfePMrOb_XUArEGdG-_8XVqicJxMu5mmUyzNvcApEbnO2rgK0DQdFzWID9yugYGH/exec?action=getArtikelListe");
  const articles = await res.json();
  daten = articles;

  const app = document.getElementById("app");
  if (!articles.length) {
    app.innerHTML = "<p>Keine Artikel gefunden.</p>";
    return;
  }

  app.innerHTML = '<div class="artikel-grid">' + articles.map((a, i) => `
    <div class="card">
      <strong>${a.titel}</strong>
      <div class="artikel-teaser">${a.text.split("\n")[0]}</div>
      <a href="${a.link}" target="_blank">Artikel ansehen</a>
    </div>
  `).join('') + '</div>';
}

async function generatePrompt() {
  const name = document.getElementById("autorName").value || "Unbekannt";
  const datum = new Date().toLocaleDateString('de-DE');
  let prompt = `Datum: ${datum}\nName: ${name}\n\n`;

  daten.slice(0, 3).forEach((a, i) => {
    prompt += `# ${i+1}. Meldung: ${a.titel}\n${a.text}\n\n`;
  });

  const vorlageRes = await fetch("https://script.google.com/macros/s/AKfycbx3hfePMrOb_XUArEGdG-_8XVqicJxMu5mmUyzNvcApEbnO2rgK0DQdFzWID9yugYGH/exec?action=getVorlagePrompt");
  const vorlage = await vorlageRes.text();
  prompt += "--- GPT-PROMPT ---\n\n" + vorlage;

  letzterPrompt = prompt;
  document.getElementById("promptText").textContent = prompt;
  document.getElementById("promptDialog").showModal();
}

function copyPrompt() {
  navigator.clipboard.writeText(letzterPrompt)
    .then(() => alert("📋 Prompt wurde in die Zwischenablage kopiert!"))
    .catch(() => alert("❌ Kopieren fehlgeschlagen. Bitte manuell kopieren."));
}

function closeDialog() {
  document.getElementById("promptDialog").close();
}

function updateArticles() {
  loadArticles();
}
