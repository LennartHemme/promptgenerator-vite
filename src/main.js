let daten = [];
let letzterPrompt = "";

export async function ladeArtikel() {
  const app = document.getElementById("app");
  app.innerHTML = "⏳ Lade Artikel...";
  try {
    const res = await fetch("/api/artikel");
    daten = await res.json();
    renderArtikel();
  } catch (err) {
    app.innerHTML = "❌ Fehler beim Laden der Artikel.";
  }
}

function renderArtikel() {
  const app = document.getElementById("app");
  if (!daten.length) {
    app.innerHTML = "<p>Keine Artikel gefunden.</p>";
    return;
  }

  app.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">' + daten.map((a, i) => \`
    <div style="background:#edeeef;padding:15px;border-radius:8px;">
      <strong>\${a.titel}</strong>
      <p>\${a.text.split("\n")[0]}</p>
      <a href="\${a.link}" target="_blank">Artikel ansehen</a>
      <select id="rolle-\${i}">
        <option value="">Nicht verwenden</option>
        <option value="1">1. Meldung</option>
        <option value="2">2. Meldung</option>
        <option value="3">3. Meldung</option>
        <option value="H">Hintergrundstück</option>
      </select>
      <textarea id="begruendung-\${i}" rows="2" placeholder="Begründung (optional)"></textarea>
    </div>
  \`).join('') + '</div>';
}

window.ladeArtikel = ladeArtikel;

window.generierePrompt = async function () {
  const name = document.getElementById("autorName").value || "Unbekannt";
  let rollen = [];
  daten.forEach((a, i) => {
    const rolle = document.getElementById("rolle-" + i).value;
    const begruendung = document.getElementById("begruendung-" + i).value;
    if (rolle) rollen.push({ ...a, rolle, begruendung });
  });

  let prompt = \`Datum: \${new Date().toLocaleDateString('de-DE')}
Name: \${name}

\`;

  ["1", "2", "3"].forEach(r => {
    const eintrag = rollen.find(e => e.rolle === r);
    if (eintrag) {
      prompt += \`# \${r}. Meldung: \${eintrag.titel}
\${eintrag.text}

\`;
    }
  });

  const h = rollen.find(e => e.rolle === "H");
  if (h) {
    prompt += \`# Hintergrund: \${h.titel}
\${h.text}
\`;
    if (h.begruendung) {
      prompt += \`Begründung: \${h.begruendung}
\`;
    }
    prompt += "\n";
  }

  prompt += "--- GPT-PROMPT ---\n\n";

  try {
    const res = await fetch("/api/vorlage");
    const vorlage = await res.text();
    prompt += vorlage;
  } catch {
    prompt += "⚠️ Vorlage konnte nicht geladen werden.";
  }

  letzterPrompt = prompt;

  document.getElementById("promptText").textContent = prompt;
  document.getElementById("promptDialog").showModal();
};

window.schließen = function () {
  document.getElementById("promptDialog").close();
}

window.copyPrompt = function () {
  navigator.clipboard.writeText(letzterPrompt)
    .then(() => alert("📋 Prompt wurde kopiert!"));
}

ladeArtikel();