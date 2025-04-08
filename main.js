let letzterPrompt = "";

function generatePrompt() {
  const name = document.getElementById("autorName").value || "Unbekannt";
  const prompt = `Datum: ${new Date().toLocaleDateString('de-DE')}
Name: ${name}

--- GPT-PROMPT ---

[Prompt-Inhalt hier]`;
  document.getElementById("promptText").textContent = prompt;
  letzterPrompt = prompt;
  document.getElementById("promptDialog").showModal();
}

function copyPrompt() {
  navigator.clipboard.writeText(letzterPrompt)
    .then(() => alert("📋 Prompt wurde in die Zwischenablage kopiert!"))
    .catch(() => alert("❌ Kopieren fehlgeschlagen."));
}

function closeDialog() {
  document.getElementById("promptDialog").close();
}

function updateArticles() {
  alert("Artikel aktualisieren ist in dieser Version noch nicht aktiv.");
}