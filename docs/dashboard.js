"use strict";

const translations={
  en:{skip:"Skip to results",github:"GitHub repository",heroTitle:"A verified layer can help a small LLM — within a measurable domain.",heroLead:"Paired comparisons on mechanically verifiable tasks. Diagnostics, pretests and invalidated campaigns are never pooled with primary evidence.",primaryEyebrow:"PRIMARY EVIDENCE",primaryTitle:"LLM alone vs LLM + Nexus Safe",primaryNote:"Accuracy is directly labelled. No hover is required.",rawLabel:"LLM alone",nexusLabel:"LLM + Nexus Safe",decisionEyebrow:"PAIRED DECISION",decisionTitle:"Gain, loss or inconclusive result",decisionNote:"A higher score is not enough: the decision accounts for discordant pairs and sample size.",portableEyebrow:"PORTABLE DATA",tableTitle:"Complete primary comparison table",caption:"Audited results published without questions, answers or targets.",thModel:"Model",thDomain:"Domain",thAlone:"Alone",thDecision:"Decision",thP:"exact p",auditEyebrow:"AUDIT LEDGER",auditTitle:"Informative evidence that is not a product claim",auditNote:"These campaigns remain visible, but are excluded from primary averages.",excludedTitle:"Excluded or running campaigns",readingEyebrow:"HOW TO READ THIS",methodTitle:"What these numbers do — and do not — show",shows:"<strong>They show</strong> a reproducible gain on some verifiable problems when Nexus has an appropriate executor or verifier.",notShows:"<strong>They do not show</strong> universal improvement in reasoning, creativity, code or open-domain knowledge.",publicationRule:"<strong>Publication rule:</strong> previously observed answers are never reused to score a new campaign; sealed sets are not used for training.",footer:"MAT Nexus public portfolio edition · aggregate data, explicit public boundaries.",loading:"Loading audited data…",questionsAudited:"audited questions published",comparisonsGain:"comparisons classified as GAIN",aggregateGap:"descriptive aggregate gap (not a meta-analysis)",questions:"questions",modelAlone:"model alone",withNexus:"with Nexus",gap:"gap",wins:"wins",losses:"losses",exactTest:"Two-sided exact test",status:"Status",whySeparate:"Why separate",dataReady:(n,d,s)=>`${n} primary comparisons · data ${d} · schema ${s}`,dataError:e=>`Data unavailable: ${e}. Use the JSON/CSV exports.`},
  fr:{skip:"Aller aux résultats",github:"Dépôt GitHub",heroTitle:"Une couche vérifiée peut aider un petit LLM — dans son domaine mesurable.",heroLead:"Comparaisons pairées sur des tâches à réponse mécaniquement vérifiable. Les diagnostics, prétests et campagnes invalidées ne sont jamais mélangés aux preuves principales.",primaryEyebrow:"PREUVES PRINCIPALES",primaryTitle:"LLM seul vs LLM + Nexus sûr",primaryNote:"Exactitude directement étiquetée. Aucun survol requis.",rawLabel:"LLM seul",nexusLabel:"LLM + Nexus sûr",decisionEyebrow:"DÉCISION PAIRÉE",decisionTitle:"Gain, perte ou résultat non concluant",decisionNote:"La hausse du score ne suffit pas : la décision tient compte des paires discordantes et de la taille de l’échantillon.",portableEyebrow:"DONNÉES PORTABLES",tableTitle:"Table complète des comparaisons principales",caption:"Résultats audités publiés sans questions, réponses ni cibles.",thModel:"Modèle",thDomain:"Domaine",thAlone:"Seul",thDecision:"Décision",thP:"p exacte",auditEyebrow:"REGISTRE D’AUDIT",auditTitle:"Ce qui est informatif sans devenir une promesse",auditNote:"Ces campagnes restent visibles, mais sont exclues des moyennes principales.",excludedTitle:"Campagnes exclues ou en cours",readingEyebrow:"LECTURE CORRECTE",methodTitle:"Ce que ces chiffres disent — et ne disent pas",shows:"<strong>Ils montrent</strong> un gain reproductible sur certains problèmes vérifiables lorsque Nexus possède un exécuteur ou un vérificateur approprié.",notShows:"<strong>Ils ne montrent pas</strong> une amélioration universelle du raisonnement, de la créativité, du code ou des connaissances ouvertes.",publicationRule:"<strong>Règle de publication :</strong> aucune réponse déjà observée n’est réutilisée pour noter une nouvelle campagne; les jeux scellés ne servent pas à l’entraînement.",footer:"Édition portfolio publique de MAT Nexus · données agrégées, frontières publiques explicites.",loading:"Chargement des données auditées…",questionsAudited:"questions auditées publiées",comparisonsGain:"comparaisons classées GAIN",aggregateGap:"écart descriptif agrégé (pas une méta-analyse)",questions:"questions",modelAlone:"modèle seul",withNexus:"avec Nexus",gap:"écart",wins:"victoires",losses:"pertes",exactTest:"Test exact bilatéral",status:"Statut",whySeparate:"Pourquoi séparé",dataReady:(n,d,s)=>`${n} comparaisons principales · données ${d} · schéma ${s}`,dataError:e=>`Données indisponibles : ${e}. Utilisez les exports JSON/CSV.`}
};

const labels={
  domain:{en:{mixed_verifiable:"mixed verifiable",code:"code"},fr:{mixed_verifiable:"mixte vérifiable",code:"code"}},
  classification:{en:{GAIN:"GAIN",LOSS:"LOSS",INCONCLUSIVE:"INCONCLUSIVE"},fr:{GAIN:"GAIN",LOSS:"PERTE",INCONCLUSIVE:"NON CONCLUANT"}},
  caveat:{fr:{"nexus-four-arm-1000q-v1":"Ablation de composants; non fusionnée avec le benchmark pairé actuel de la couche sûre.","nexus-adapter-ab-1000q-v1-safe":"Utile pour diagnostiquer l’architecture; le comportement du bras brut empêche d’en faire une affirmation principale.","full-circuit-all-functional-ab-v2-safe":"Aperçu contrôlé, explicitement distinct d’un benchmark officiel."}},
  reason:{fr:{"nexus-neutral-10x20-v1":"Le plafond uniforme de 96 jetons tronquait les sorties; 36 cas Granite ont été consommés puis exclus du score.","nexus-neutral-10x20-v2":"La campagne pairée neutre plus large reste non publiée jusqu’à sa fin et son audit."}}
};

const pct=value=>`${(value*100).toFixed(value*100%1?1:0)} %`;
const signedPoints=value=>`${value>=0?"+":""}${value.toFixed(1)} pp`;
const score=(row,key)=>row[key]/row.questions;
let currentLang="en";
let catalog=null;
const tr=key=>translations[currentLang][key];

function initialLanguage(){
  const query=new URLSearchParams(location.search).get("lang");
  if(query==="en"||query==="fr")return query;
  return "en";
}

function applyStaticTranslations(){
  document.documentElement.lang=currentLang;
  document.title=currentLang==="fr"?"MAT Nexus — résultats publics":"MAT Nexus — public results";
  document.querySelectorAll("[data-i18n]").forEach(node=>{node.textContent=tr(node.dataset.i18n)});
  document.querySelectorAll("[data-i18n-html]").forEach(node=>{node.innerHTML=tr(node.dataset.i18nHtml)});
  document.querySelectorAll("[data-lang]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.lang===currentLang)));
}

function renderKpis(rows){
  const gains=rows.filter(row=>row.classification==="GAIN").length,totalQuestions=rows.reduce((sum,row)=>sum+row.questions,0),totalRaw=rows.reduce((sum,row)=>sum+row.raw_correct,0),totalNexus=rows.reduce((sum,row)=>sum+row.nexus_correct,0);
  const cards=[[String(totalQuestions),tr("questionsAudited")],[`${gains}/${rows.length}`,tr("comparisonsGain")],[signedPoints((totalNexus/totalQuestions-totalRaw/totalQuestions)*100),tr("aggregateGap")]];
  document.querySelector("#kpis").innerHTML=cards.map(([value,label])=>`<div class="kpi"><strong>${value}</strong><span>${label}</span></div>`).join("");
}

function renderPairedChart(rows){
  document.querySelector("#paired-chart").innerHTML=rows.map(row=>{const raw=score(row,"raw_correct"),nexus=score(row,"nexus_correct"),delta=(nexus-raw)*100,domain=labels.domain[currentLang][row.domain]||row.domain,label=`${row.model}, ${domain}, ${row.questions} ${tr("questions")}`;return `<article class="result-row" aria-label="${label}: ${tr("modelAlone")} ${pct(raw)}, ${tr("withNexus")} ${pct(nexus)}, ${tr("gap")} ${signedPoints(delta)}"><div class="model-label"><strong>${row.model}</strong><span>${domain} · n=${row.questions}</span></div><div class="bars" aria-hidden="true"><div class="track"><div class="bar raw" style="width:${raw*100}%">${pct(raw)}</div></div><div class="track"><div class="bar nexus" style="width:${nexus*100}%">${pct(nexus)}</div></div></div><div class="delta">${signedPoints(delta)}</div></article>`}).join("");
}

function renderDecisions(rows){document.querySelector("#decision-grid").innerHTML=rows.map(row=>`<article class="decision-card"><span class="badge ${row.classification}">${labels.classification[currentLang][row.classification]}</span><h3>${row.model}</h3><strong>${row.wins} ${tr("wins")} · ${row.losses} ${tr("losses")}</strong><p>${tr("exactTest")}: p=${row.two_sided_exact_p_value}. ${tr("status")}: ${row.evidence_status}.</p></article>`).join("")}

function renderTable(rows){document.querySelector("#results-body").innerHTML=rows.map(row=>{const raw=score(row,"raw_correct"),nexus=score(row,"nexus_correct"),domain=labels.domain[currentLang][row.domain]||row.domain;return `<tr><td>${row.model}</td><td>${domain}</td><td>${row.questions}</td><td>${row.raw_correct}/${row.questions} (${pct(raw)})</td><td>${row.nexus_correct}/${row.questions} (${pct(nexus)})</td><td>${signedPoints((nexus-raw)*100)}</td><td><span class="badge ${row.classification}">${labels.classification[currentLang][row.classification]}</span></td><td>${row.two_sided_exact_p_value}</td></tr>`}).join("")}

const metricLabel=(key)=>currentLang==="fr"?key.replaceAll("_"," ").replace("accuracy","exactitude"):key.replaceAll("_"," ");
const metricSummary=metrics=>Object.entries(metrics).map(([key,value])=>`${metricLabel(key)}: ${pct(value)}`).join(" · ");
function renderAudit(data){document.querySelector("#audit-grid").innerHTML=data.diagnostic_campaigns.map(row=>{const caveat=currentLang==="fr"?(labels.caveat.fr[row.id]||row.caveat):row.caveat;return `<article class="audit-card"><span class="status">${row.status}</span><h3>${row.id}</h3><p>${row.questions} ${tr("questions")} · ${row.kind.replaceAll("_"," ")}</p><p>${metricSummary(row.metrics)}</p><p><strong>${tr("whySeparate")}:</strong> ${caveat}</p></article>`}).join("");document.querySelector("#excluded-list").innerHTML=data.excluded_campaigns.map(row=>{const reason=currentLang==="fr"?(labels.reason.fr[row.id]||row.reason):row.reason;return `<div class="excluded"><strong>${row.id} · ${row.status}</strong>${reason}</div>`}).join("")}

function renderAll(){
  applyStaticTranslations();
  const status=document.querySelector("#data-status");
  if(!catalog){status.textContent=tr("loading");return}
  const rows=catalog.primary_comparisons;renderKpis(rows);renderPairedChart(rows);renderDecisions(rows);renderTable(rows);renderAudit(catalog);status.textContent=tr("dataReady")(rows.length,catalog.generated_on,catalog.schema_version);
}

function setLanguage(language){
  currentLang=language;
  const url=new URL(location.href);url.searchParams.set("lang",language);history.replaceState(null,"",url);
  renderAll();
}

async function init(){
  currentLang=initialLanguage();renderAll();
  document.querySelectorAll("[data-lang]").forEach(button=>button.addEventListener("click",()=>setLanguage(button.dataset.lang)));
  try{const response=await fetch("data/public-benchmark-catalog.json?v=3",{cache:"force-cache"});if(!response.ok)throw new Error(`HTTP ${response.status}`);catalog=await response.json();renderAll()}catch(error){const status=document.querySelector("#data-status");status.classList.add("error");status.textContent=tr("dataError")(error.message)}
}

init();
