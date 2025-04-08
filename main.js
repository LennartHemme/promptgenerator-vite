
function generatePrompt() {
  const name = document.getElementById("autorName").value || "Unbekannt";
  const preview = document.getElementById("preview");
  preview.textContent = "Prompt für " + name + ":\n\nHier steht dein Text.";
}
function copyPrompt() {
  const text = document.getElementById("preview").textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("📋 Prompt kopiert!");
  });
}
