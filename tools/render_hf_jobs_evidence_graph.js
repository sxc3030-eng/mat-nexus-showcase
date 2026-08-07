const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const data = JSON.parse(
  fs.readFileSync(path.join(root, "results", "hf-jobs-granite-two-stage-summary.json"), "utf8"),
);
const outDir = path.join(root, "docs", "assets");
fs.mkdirSync(outDir, { recursive: true });

const COLORS = {
  bg: "#061813",
  panel: "#0b2a21",
  panel2: "#0f352a",
  rule: "#215846",
  text: "#f4fff9",
  muted: "#abd0c1",
  direct: "#9bb2aa",
  layer: "#43e2a3",
  amber: "#ffc967",
  blue: "#70b9ff",
};

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const pct = (value) => `${Math.round(value * 100)}%`;
const pp = (value) => `${value > 0 ? "+" : ""}${value.toFixed(0)} pp`;

function baseSvg(width, height, title, description, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(title)}</title>
  <desc id="description">${escapeXml(description)}</desc>
  <rect width="${width}" height="${height}" fill="${COLORS.bg}"/>
  <style>
    text { font-family: Inter, Segoe UI, Arial, sans-serif; fill: ${COLORS.text}; }
    .label { font-size: 18px; font-weight: 500; letter-spacing: 2.2px; }
    .title { font-size: 58px; font-weight: 500; }
    .subtitle { font-size: 23px; fill: ${COLORS.muted}; }
    .section { font-size: 24px; font-weight: 500; }
    .bar-label { font-size: 21px; }
    .bar-value { font-size: 22px; font-weight: 500; }
    .metric { font-size: 38px; font-weight: 500; }
    .detail { font-size: 18px; fill: ${COLORS.muted}; }
    .tiny { font-size: 15px; fill: ${COLORS.muted}; }
  </style>
  ${content}
</svg>`;
}

function roundedRect(x, y, width, height, fill = COLORS.panel, stroke = COLORS.rule, radius = 24) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
}

function bar(x, y, width, value, color, label, valueLabel) {
  const fillWidth = Math.max(2, width * value);
  return `<text class="bar-label" x="${x}" y="${y - 10}">${escapeXml(label)}</text>
  <rect x="${x}" y="${y}" width="${width}" height="28" rx="14" fill="#173c31"/>
  <rect x="${x}" y="${y}" width="${fillWidth}" height="28" rx="14" fill="${color}"/>
  <text class="bar-value" x="${x + width + 18}" y="${y + 22}">${escapeXml(valueLabel)}</text>`;
}

function domainRow(x, y, width, task, translatedName, deltaX = null) {
  const directWidth = width * task.direct_accuracy;
  const layerWidth = width * task.layer_accuracy;
  const resolvedDeltaX = deltaX ?? x + 325 + width + 95;
  const deltaAnchor = deltaX === null ? "start" : "end";
  return `<text class="bar-label" x="${x}" y="${y}">${escapeXml(translatedName)}</text>
  <text class="tiny" x="${x}" y="${y + 25}">n=${task.n}</text>
  <rect x="${x + 325}" y="${y - 18}" width="${width}" height="18" rx="9" fill="#173c31"/>
  <rect x="${x + 325}" y="${y - 18}" width="${Math.max(2, directWidth)}" height="18" rx="9" fill="${COLORS.direct}"/>
  <rect x="${x + 325}" y="${y + 12}" width="${width}" height="18" rx="9" fill="#173c31"/>
  <rect x="${x + 325}" y="${y + 12}" width="${Math.max(2, layerWidth)}" height="18" rx="9" fill="${COLORS.layer}"/>
  <text class="tiny" x="${x + 325 + width + 14}" y="${y - 4}">${pct(task.direct_accuracy)}</text>
  <text class="tiny" x="${x + 325 + width + 14}" y="${y + 27}">${pct(task.layer_accuracy)}</text>
  <text class="bar-value" x="${resolvedDeltaX}" y="${y + 13}" text-anchor="${deltaAnchor}" fill="${task.delta_percentage_points > 0 ? COLORS.layer : COLORS.muted}">${pp(task.delta_percentage_points)}</text>`;
}

function linkedinSvg(language) {
  const fr = language === "fr";
  const pilot = data.pilot;
  const confirm = data.confirmation;
  const names = fr
    ? ["BBH arithmétique multiétape", "BBH compréhension de dates", "GSM8K", "TriviaQA"]
    : confirm.tasks.map((task) => task.name);
  const title = fr
    ? "Du signal pilote à la confirmation sur 100 questions"
    : "From pilot signal to 100-question confirmation";
  const description = fr
    ? "Granite 3.3 2B passe de 22 % à 51 % avec une couche d'experts déterministes vérifiés sur 100 questions officielles."
    : "Granite 3.3 2B moves from 22% to 51% with a verified deterministic expert layer on 100 official questions.";

  const content = `
  <text class="label" x="64" y="68" fill="${COLORS.layer}">MAT NEXUS · ${fr ? "MISE À JOUR DES PREUVES" : "EVIDENCE UPDATE"}</text>
  <g transform="translate(978 34)">
    <rect width="158" height="58" rx="16" fill="${COLORS.panel2}" stroke="${COLORS.rule}"/>
    <text x="79" y="24" text-anchor="middle" font-size="15" font-weight="500">GPT-5 CODEX</text>
    <text x="79" y="44" text-anchor="middle" class="tiny">${fr ? "SYNTHÈSE" : "SYNTHESIS"}</text>
  </g>
  <text class="title" x="64" y="142">${fr ? "Du signal pilote" : "From pilot signal"}</text>
  <text class="title" x="64" y="207">${fr ? "à la confirmation sur 100 questions" : "to 100-question confirmation"}</text>
  <text class="subtitle" x="64" y="250">Granite 3.3 2B · Hugging Face Jobs · ${fr ? "tâches officielles lm-eval" : "official lm-eval tasks"}</text>

  ${roundedRect(64, 290, 1072, 240)}
  <text class="label" x="94" y="330" fill="${COLORS.amber}">${fr ? "TEST 1 · PILOTE" : "TEST 1 · PILOT"} · n=${pilot.n}</text>
  ${bar(94, 380, 650, pilot.direct_accuracy, COLORS.direct, fr ? "LLM seul" : "LLM alone", pct(pilot.direct_accuracy))}
  ${bar(94, 448, 650, pilot.layer_accuracy, COLORS.layer, fr ? "Couche d'experts vérifiés" : "Verified expert layer", pct(pilot.layer_accuracy))}
  <text class="metric" x="925" y="405" text-anchor="middle" fill="${COLORS.layer}">${pp(pilot.delta_percentage_points)}</text>
  <text class="detail" x="925" y="440" text-anchor="middle">${pilot.paired_wins} ${fr ? "gains" : "wins"} · ${pilot.paired_losses} ${fr ? "perte" : "losses"}</text>
  <text class="detail" x="925" y="470" text-anchor="middle">p = ${pilot.mcnemar_exact_p}</text>
  <text x="925" y="504" text-anchor="middle" font-size="18" fill="${COLORS.amber}">${fr ? "signal, échantillon insuffisant" : "signal, sample too small"}</text>

  <path d="M600 548 v38" stroke="${COLORS.layer}" stroke-width="4" stroke-linecap="round"/>
  <path d="M588 576 l12 14 12-14" fill="none" stroke="${COLORS.layer}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

  ${roundedRect(64, 610, 1072, 250, COLORS.panel2, COLORS.layer)}
  <text class="label" x="94" y="650" fill="${COLORS.layer}">${fr ? "TEST 2 · CONFIRMATION" : "TEST 2 · CONFIRMATION"} · n=${confirm.n}</text>
  ${bar(94, 700, 650, confirm.direct_accuracy, COLORS.direct, fr ? "LLM seul" : "LLM alone", pct(confirm.direct_accuracy))}
  ${bar(94, 768, 650, confirm.layer_accuracy, COLORS.layer, fr ? "Couche d'experts vérifiés" : "Verified expert layer", pct(confirm.layer_accuracy))}
  <text class="metric" x="925" y="715" text-anchor="middle" fill="${COLORS.layer}">${pp(confirm.delta_percentage_points)}</text>
  <text class="detail" x="925" y="750" text-anchor="middle">${confirm.paired_wins} ${fr ? "gains" : "wins"} · ${confirm.paired_losses} ${fr ? "perte" : "losses"}</text>
  <text class="detail" x="925" y="780" text-anchor="middle">${confirm.paired_ties} ${fr ? "égalités" : "ties"}</text>
  <text x="925" y="812" text-anchor="middle" font-size="17" fill="${COLORS.layer}">p = 3.7 × 10⁻⁹ · ${fr ? "gain sur ce jeu" : "gain on this set"}</text>

  <text class="section" x="64" y="920">${fr ? "Où le gain apparaît" : "Where the gain appears"}</text>
  <rect x="690" y="895" width="14" height="14" rx="7" fill="${COLORS.direct}"/><text class="tiny" x="714" y="908">${fr ? "LLM seul" : "LLM alone"}</text>
  <rect x="830" y="895" width="14" height="14" rx="7" fill="${COLORS.layer}"/><text class="tiny" x="854" y="908">${fr ? "avec couche" : "with layer"}</text>
  ${domainRow(64, 975, 390, confirm.tasks[0], names[0])}
  ${domainRow(64, 1050, 390, confirm.tasks[1], names[1])}
  ${domainRow(64, 1125, 390, confirm.tasks[2], names[2])}
  ${domainRow(64, 1200, 390, confirm.tasks[3], names[3])}

  <line x1="64" y1="1260" x2="1136" y2="1260" stroke="${COLORS.rule}" stroke-width="2"/>
  <text class="tiny" x="64" y="1290">${fr ? "Établi : couche d'experts déterministes vérifiés, +29 pp et zéro régression appariée." : "Supported: verified deterministic expert layer, +29 pp and zero paired regressions."}</text>
  <text class="tiny" x="64" y="1318">${fr ? "Non établi : gain séparé de l'orchestration Nexus = 0 pp; MATmem non exercé. Questions fraîches, sans accès aux cibles." : "Not established: separate Nexus gain = 0 pp; MATmem not exercised. Fresh, target-blind questions."}</text>
  <text x="1136" y="1318" text-anchor="end" font-size="14" fill="${COLORS.blue}">github.com/sxc3030-eng/mat-nexus-showcase</text>`;

  return baseSvg(1200, 1350, title, description, content);
}

function githubSvg() {
  const pilot = data.pilot;
  const confirm = data.confirmation;
  const content = `
  <text class="label" x="58" y="58" fill="${COLORS.layer}">MAT NEXUS · HUGGING FACE JOBS EVIDENCE</text>
  <g transform="translate(1378 26)"><rect width="164" height="54" rx="15" fill="${COLORS.panel2}" stroke="${COLORS.rule}"/><text x="82" y="23" text-anchor="middle" font-size="15" font-weight="500">GPT-5 CODEX</text><text x="82" y="42" text-anchor="middle" class="tiny">SYNTHESIS</text></g>
  <text class="title" x="58" y="130">A pilot found the signal.</text>
  <text class="title" x="58" y="194">100 questions confirmed it.</text>
  <text class="subtitle" x="58" y="233">Granite 3.3 2B · official lm-eval tasks · fresh target-blind samples</text>

  ${roundedRect(58, 278, 700, 250)}
  <text class="label" x="88" y="318" fill="${COLORS.amber}">TEST 1 · PILOT · n=${pilot.n}</text>
  ${bar(88, 370, 390, pilot.direct_accuracy, COLORS.direct, "LLM alone", pct(pilot.direct_accuracy))}
  ${bar(88, 438, 390, pilot.layer_accuracy, COLORS.layer, "Verified expert layer", pct(pilot.layer_accuracy))}
  <text class="metric" x="650" y="392" text-anchor="middle" fill="${COLORS.layer}">${pp(pilot.delta_percentage_points)}</text>
  <text class="detail" x="650" y="432" text-anchor="middle">4 wins · 0 losses</text>
  <text x="650" y="472" text-anchor="middle" font-size="17" fill="${COLORS.amber}">p=.125 · inconclusive</text>

  ${roundedRect(58, 558, 700, 260, COLORS.panel2, COLORS.layer)}
  <text class="label" x="88" y="598" fill="${COLORS.layer}">TEST 2 · CONFIRMATION · n=${confirm.n}</text>
  ${bar(88, 650, 390, confirm.direct_accuracy, COLORS.direct, "LLM alone", pct(confirm.direct_accuracy))}
  ${bar(88, 718, 390, confirm.layer_accuracy, COLORS.layer, "Verified expert layer", pct(confirm.layer_accuracy))}
  <text class="metric" x="650" y="672" text-anchor="middle" fill="${COLORS.layer}">${pp(confirm.delta_percentage_points)}</text>
  <text class="detail" x="650" y="712" text-anchor="middle">29 wins · 0 losses</text>
  <text x="635" y="752" text-anchor="middle" font-size="15" fill="${COLORS.layer}">p=3.7×10⁻⁹ · paired gain</text>

  <text class="section" x="825" y="310">Confirmation by task</text>
  <rect x="1210" y="291" width="14" height="14" rx="7" fill="${COLORS.direct}"/><text class="tiny" x="1234" y="304">LLM alone</text>
  <rect x="1360" y="291" width="14" height="14" rx="7" fill="${COLORS.layer}"/><text class="tiny" x="1384" y="304">with layer</text>
  ${domainRow(825, 375, 330, confirm.tasks[0], "BBH multistep arithmetic", 1525)}
  ${domainRow(825, 470, 330, confirm.tasks[1], "BBH date understanding", 1525)}
  ${domainRow(825, 565, 330, confirm.tasks[2], "GSM8K", 1525)}
  ${domainRow(825, 660, 330, confirm.tasks[3], "TriviaQA", 1525)}
  <line x1="825" y1="720" x2="1542" y2="720" stroke="${COLORS.rule}" stroke-width="2"/>
  <text class="tiny" x="825" y="754">Supported: verified deterministic expert layer, +29 pp, zero paired regressions.</text>
  <text class="tiny" x="825" y="782">Not established: separate Nexus gain = 0 pp; MATmem was not exercised.</text>
  <text class="tiny" x="825" y="810">Official prompts, filters and scorers unchanged · no target reuse · no automatic learning.</text>
  <text x="1542" y="856" text-anchor="end" font-size="15" fill="${COLORS.blue}">github.com/sxc3030-eng/mat-nexus-showcase</text>`;
  return baseSvg(
    1600,
    900,
    "MAT Nexus pilot and 100-question confirmation",
    "Granite 3.3 2B improves from 22% to 51% with a verified deterministic expert layer on 100 official lm-eval questions.",
    content,
  );
}

const outputs = [
  ["hf-jobs-granite-two-stage-linkedin-en.svg", linkedinSvg("en")],
  ["hf-jobs-granite-two-stage-linkedin-fr.svg", linkedinSvg("fr")],
  ["hf-jobs-granite-two-stage-github-en.svg", githubSvg()],
];

for (const [name, svg] of outputs) {
  fs.writeFileSync(path.join(outDir, name), svg, "utf8");
  process.stdout.write(`wrote ${name}\n`);
}

async function renderPngs() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    process.stdout.write("sharp unavailable; SVG files are ready and PNG rendering was skipped\n");
    return;
  }
  for (const [name, svg] of outputs) {
    const pngName = name.replace(/\.svg$/, ".png");
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(outDir, pngName));
    process.stdout.write(`wrote ${pngName}\n`);
  }
}

renderPngs().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
