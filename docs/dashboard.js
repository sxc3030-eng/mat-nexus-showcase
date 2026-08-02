"use strict";
const pct=value=>`${(value*100).toFixed(value*100%1?1:0)} %`;
const signedPoints=value=>`${value>=0?"+":""}${value.toFixed(1)} pp`;
const score=(row,key)=>row[key]/row.questions;

function renderKpis(rows){
  const gains=rows.filter(row=>row.classification==="GAIN").length;
  const totalQuestions=rows.reduce((sum,row)=>sum+row.questions,0);
  const totalRaw=rows.reduce((sum,row)=>sum+row.raw_correct,0);
  const totalNexus=rows.reduce((sum,row)=>sum+row.nexus_correct,0);
  const cards=[[String(totalQuestions),"questions auditées publiées"],[`${gains}/${rows.length}`,"comparaisons classées GAIN"],[signedPoints((totalNexus/totalQuestions-totalRaw/totalQuestions)*100),"écart descriptif agrégé (non méta-analytique)"]];
  document.querySelector("#kpis").innerHTML=cards.map(([value,label])=>`<div class="kpi"><strong>${value}</strong><span>${label}</span></div>`).join("");
}

function renderPairedChart(rows){
  document.querySelector("#paired-chart").innerHTML=rows.map(row=>{
    const raw=score(row,"raw_correct"),nexus=score(row,"nexus_correct"),delta=(nexus-raw)*100;
    const label=`${row.model}, ${row.domain}, ${row.questions} questions`;
    return `<article class="result-row" aria-label="${label}: modèle seul ${pct(raw)}, avec Nexus ${pct(nexus)}, écart ${signedPoints(delta)}"><div class="model-label"><strong>${row.model}</strong><span>${row.domain} · n=${row.questions}</span></div><div class="bars" aria-hidden="true"><div class="track"><div class="bar raw" style="width:${raw*100}%">${pct(raw)}</div></div><div class="track"><div class="bar nexus" style="width:${nexus*100}%">${pct(nexus)}</div></div></div><div class="delta">${signedPoints(delta)}</div></article>`;
  }).join("");
}

function renderDecisions(rows){
  document.querySelector("#decision-grid").innerHTML=rows.map(row=>`<article class="decision-card"><span class="badge ${row.classification}">${row.classification}</span><h3>${row.model}</h3><strong>${row.wins} victoire${row.wins===1?"":"s"} · ${row.losses} perte${row.losses===1?"":"s"}</strong><p>Test exact bilatéral : p=${row.two_sided_exact_p_value}. Statut : ${row.evidence_status}.</p></article>`).join("");
}

function renderTable(rows){
  document.querySelector("#results-body").innerHTML=rows.map(row=>{
    const raw=score(row,"raw_correct"),nexus=score(row,"nexus_correct");
    return `<tr><td>${row.model}</td><td>${row.domain}</td><td>${row.questions}</td><td>${row.raw_correct}/${row.questions} (${pct(raw)})</td><td>${row.nexus_correct}/${row.questions} (${pct(nexus)})</td><td>${signedPoints((nexus-raw)*100)}</td><td><span class="badge ${row.classification}">${row.classification}</span></td><td>${row.two_sided_exact_p_value}</td></tr>`;
  }).join("");
}

const metricSummary=metrics=>Object.entries(metrics).map(([key,value])=>`${key.replaceAll("_"," ")}: ${pct(value)}`).join(" · ");
function renderAudit(data){
  document.querySelector("#audit-grid").innerHTML=data.diagnostic_campaigns.map(row=>`<article class="audit-card"><span class="status">${row.status}</span><h3>${row.id}</h3><p>${row.questions} questions · ${row.kind}</p><p>${metricSummary(row.metrics)}</p><p><strong>Pourquoi séparé :</strong> ${row.caveat}</p></article>`).join("");
  document.querySelector("#excluded-list").innerHTML=data.excluded_campaigns.map(row=>`<div class="excluded"><strong>${row.id} · ${row.status}</strong>${row.reason}</div>`).join("");
}

async function init(){
  const status=document.querySelector("#data-status");
  try{
    const response=await fetch("data/public-benchmark-catalog.json",{cache:"no-store"});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const data=await response.json(),rows=data.primary_comparisons;
    renderKpis(rows);renderPairedChart(rows);renderDecisions(rows);renderTable(rows);renderAudit(data);
    status.textContent=`${rows.length} comparaisons principales · données ${data.generated_on} · schéma ${data.schema_version}`;
  }catch(error){status.classList.add("error");status.textContent=`Données indisponibles : ${error.message}. Utilisez les exports JSON/CSV.`}
}
init();
