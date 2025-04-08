
function updateArticles() {
  const app = document.getElementById("app");
  app.innerHTML = "Lade Artikel...";

  const url = encodeURIComponent("https://script.google.com/macros/s/AKfycbx3hfePMrOb_XUArEGdG-_8XVqicJxMu5mmUyzNvcApEbnO2rgK0DQdFzWID9yugYGH/exec?action=getArtikelListe");

  fetch(`/api/proxy?url=${url}`)
    .then(res => res.json())
    .then(data => renderArticles(data))
    .catch(err => {
      app.innerHTML = "Fehler beim Laden der Artikel.";
      console.error(err);
    });
}

function renderArticles(articles) {
  const app = document.getElementById("app");
  app.innerHTML = '<div class="artikel-grid">' +
    articles.map(a => `
      <div class="card">
        <strong>${a.titel}</strong>
        <div class="artikel-teaser">${a.text.split("\n")[0]}</div>
        <a href="${a.link}" target="_blank">Artikel ansehen</a>
      </div>
    `).join('') +
    '</div>';
}

function generatePrompt() {
  const name = document.getElementById("autorName").value || "Unbekannt";
  const datum = new Date().toLocaleDateString('de-DE');
  const text = `Datum: ${datum}\nName: ${name}\n\n--- GPT-PROMPT ---\n\nBeispielinhalt`;
  document.getElementById("promptText").textContent = text;
  document.getElementById("promptDialog").showModal();
}

function copyPrompt() {
  const text = document.getElementById("promptText").textContent;
  navigator.clipboard.writeText(text)
    .then(() => alert("📋 Prompt wurde in die Zwischenablage kopiert!"))
    .catch(() => alert("❌ Kopieren fehlgeschlagen."));
}

function closeDialog() {
  document.getElementById("promptDialog").close();
}
