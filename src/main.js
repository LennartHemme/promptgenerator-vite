let letzterPrompt = "";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="artikel-grid">
      <div class="card">
        <strong>Beispielartikel: Gladbeck</strong>
        <p class="artikel-teaser">Beispielformat für den Artikelteaser</p>
        <a href="#">Artikel ansehen</a>
      </div>
      <div class="card">
        <strong>Beispielartikel: Bottrop</strong>
        <p class="artikel-teaser">Noch ein Beispielartikel</p>
        <a href="#">Artikel ansehen</a>
      </div>
    </div>
  `;
});

function generatePrompt() {
  const name = document.getElementById("autorName").value || "Unbekannt";
  const prompt = `Datum: ${new Date().toLocaleDateString('de-DE')}
Name: ${name}

--- GPT-PROMPT ---

[Prompt-Text hier]`;
  zeigePromptvorschau(prompt);
}

function zeigePromptvorschau(prompt) {
  letzterPrompt = prompt;
  document.getElementById("promptText").textContent = prompt;
  document.getElementById("promptDialog").showModal();
}

function schließen() {
  document.getElementById("promptDialog").close();
}

function copyPrompt() {
  navigator.clipboard.writeText(letzterPrompt)
    .then(() => alert("📋 Prompt wurde in die Zwischenablage kopiert!"))
    .catch(() => alert("❌ Kopieren fehlgeschlagen."));
}

window.generatePrompt = generatePrompt;
window.copyPrompt = copyPrompt;
window.schließen = schließen;