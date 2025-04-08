
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  // Placeholder cards (kann ersetzt werden mit echtem fetch)
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
  alert("Prompt wird für " + name + " generiert.");
}
