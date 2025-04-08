const API_BASE = "https://script.google.com/macros/s/AKfycbx3hfePMrOb_XUArEGdG-_8XVqicJxMu5mmUyzNvcApEbnO2rgK0DQdFzWID9yugYGH/exec";

let daten = [];
let letzterPrompt = "";
let vergebeneRollen = {};

document.title = "Mittagsupdate-Promptgenerator";

document.addEventListener("DOMContentLoaded", () => {
  ladeArtikel();
  document.getElementById("aktualisierenBtn").onclick = aktualisiereArtikel;
  document.getElementById("aktualisierenBtnBottom").onclick = aktualisiereArtikel;
  document.getElementById("generierenBtn").onclick = absenden;
  document.getElementById("generierenBtnBottom").onclick = absenden;
  document.getElementById("dialogClose").onclick = () => dialog().close();
  document.getElementById("dialogCloseBottom").onclick = () => dialog().close();
  document.getElementById("copyBtn").onclick = copyPrompt;
});

function dialog() {
  return document.getElementById("promptDialog");
}

async function ladeArtikel() {
  const app = document.getElementById("app");
  try {
    const res = await fetch(API_BASE + "?action=getArtikelListe");
    daten = await res.json();
    if (!daten.length) {
      app.innerHTML = "<p>Keine Artikel gefunden.</p>";
      return;
    }

    app.innerHTML = '<div class="artikel-grid">' + daten.map((a, i) => `
      <div class="card">
        <strong>${a.titel}</strong>
        <div class="artikel-teaser">${a.text.split("\n")[0]}</div>
        <a href="${a.link}" target="_blank">Artikel ansehen</a>
      </div>
      <div class="card">
        <label>Einordnen als:
          <select id="rolle-${i}" onchange="rolleGeändert(${i})">
            <option value="">Nicht verwenden</option>
            <option value="1">1. Meldung</option>
            <option value="2">2. Meldung</option>
            <option value="3">3. Meldung</option>
            <option value="H">Hintergrundstück</option>
          </select>
        </label>
        <div id="warnung-${i}" style="color: red; font-size: 13px; display: none;"></div>
        <label>Begründung (optional):
          <textarea id="begruendung-${i}" rows="2"></textarea>
        </label>
      </div>`).join('') + '</div>';
  } catch {
    app.innerHTML = "<p>Fehler beim Laden der Artikel.</p>";
  }
}

function rolleGeändert(index) {
  vergebeneRollen = {};
  daten.forEach((a, i) => {
    const rolle = document.getElementById(`rolle-${i}`).value;
    if (rolle) {
      if (!vergebeneRollen[rolle]) vergebeneRollen[rolle] = [];
      vergebeneRollen[rolle].push(i);
    }
  });
  daten.forEach((a, i) => {
    const rolle = document.getElementById(`rolle-${i}`).value;
    const warnung = document.getElementById(`warnung-${i}`);
    if (rolle && vergebeneRollen[rolle].length > 1) {
      warnung.innerText = `⚠️ Diese Einordnung wurde mehrfach vergeben.`;
      warnung.style.display = "block";
    } else {
      warnung.innerText = "";
      warnung.style.display = "none";
    }
  });
}

function absenden() {
  const rollenMap = {};
  const auswahl = daten.map((a, i) => {
    const rolle = document.getElementById(`rolle-${i}`).value;
    const begruendung = document.getElementById(`begruendung-${i}`).value;
    if (rolle) {
      if (rolle !== "H" && rollenMap[rolle]) return null;
      if (rolle === "H" && rollenMap["H"]) return null;
      rollenMap[rolle] = true;
    }
    return { zeile: a.id, rolle, begruendung };
  });
  if (auswahl.includes(null)) return;
  zeigePromptvorschau(auswahl.filter(e => e.rolle));
}

async function zeigePromptvorschau(rollen) {
  const name = document.getElementById("autorName").value || "Unbekannt";
  const datum = new Date().toLocaleDateString("de-DE");

  let prompt = `Datum: ${datum}
Name: ${name}

`;
  const artikelMap = {};
  daten.forEach((a, i) => artikelMap[a.id] = a);

  ["1", "2", "3"].forEach(r => {
    const entry = rollen.find(e => e.rolle === r);
    if (entry) prompt += `# ${r}. Meldung: ${artikelMap[entry.zeile].titel}
${artikelMap[entry.zeile].text}

`;
  });

  const h = rollen.find(e => e.rolle === "H");
  if (h) {
    prompt += `# Hintergrund: ${artikelMap[h.zeile].titel}
${artikelMap[h.zeile].text}
`;
    if (h.begruendung) prompt += `Begründung: ${h.begruendung}
`;
  }

  prompt += `\n--- GPT-PROMPT ---\n\n`;

  try {
    const res = await fetch(API_BASE + "?action=getVorlagePrompt");
    const vorlage = await res.text();
    prompt += vorlage;
  } catch {
    prompt += "⚠️ Vorlage konnte nicht geladen werden.";
  }

  letzterPrompt = prompt;
  document.getElementById("promptText").textContent = prompt;
  dialog().showModal();
}

function copyPrompt() {
  navigator.clipboard.writeText(letzterPrompt).then(() => {
    alert("📋 Prompt wurde in die Zwischenablage kopiert!");
  });
}

async function aktualisiereArtikel() {
  document.getElementById("app").innerHTML = "⏳ Lade aktuelle Artikel...";
  await fetch(API_BASE + "?action=feedNachArtikelUebertragen");
  ladeArtikel();
}
