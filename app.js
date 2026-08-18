const TAB_LABELS = {
  overview: "工程概要",
  wall: "壁體資訊",
  excavation: "開挖紀錄",
  prework: "前置作業",
  pouring: "澆置紀錄"
};

const PHASES = [
  { id: "slurry", label: "清沉泥", start: "開始時間", end: "完成時間" },
  { id: "lowerCage", label: "下方鋼筋籠吊放", start: "開始時間", end: "完成時間" },
  { id: "upperCage", label: "上方鋼筋籠吊放", start: "開始時間" },
  { id: "splice", label: "鋼筋籠續接", start: "開始時間", end: "完成時間" },
  { id: "cageComplete", label: "鋼筋籠吊放完成", end: "完成時間" },
  { id: "tremie", label: "特密管施工", start: "開始時間", end: "完成時間" }
];

const localDate = new Date();
const today = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

const state = {
  overview: { project: "", contractor: "", date: today, reviewer: "" },
  wall: {
    unitType: "",
    unitNo: "",
    designDepth: "",
    strength: "",
    thickness: "",
    length: "",
    topElevation: "",
    designVolume: "",
    actualVolume: ""
  },
  soil: [],
  depth: [],
  prework: Object.fromEntries(PHASES.map(phase => [phase.id, { start: "", end: "" }])),
  trucks: []
};

let activeTab = "overview";
const editIndex = { soil: null, depth: null, truck: null };
let undoTimer;
let undoAction = null;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const number = value => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const fixed = value => Number.isFinite(value) ? value.toFixed(2) : "—";
const display = value => String(value ?? "").trim() || "—";
const esc = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function designHeight() {
  const depth = number(state.wall.designDepth);
  const elevation = number(state.wall.topElevation);
  if (depth === null || elevation === null) return null;
  return Math.max(0, depth + elevation);
}

function calculatedTrucks() {
  const designVolume = number(state.wall.designVolume);
  const height = designHeight();
  let cumulative = 0;
  return state.trucks.map((truck, index) => {
    const volume = number(truck.volume) ?? 0;
    const measured = number(truck.measured);
    cumulative += volume;
    const expected = designVolume && height !== null ? height * cumulative / designVolume : null;
    const difference = measured !== null && expected !== null ? measured - expected : null;
    return { ...truck, index, volume, cumulative, measured, expected, difference };
  });
}

function setInitialInputs() {
  $$('[data-bind]').forEach(input => {
    const [group, key] = input.dataset.bind.split(".");
    if (input.type === "radio") input.checked = state[group][key] === input.value;
    else input.value = state[group][key] ?? "";
  });
}

function updateIdentity() {
  const parts = [state.wall.unitType, state.wall.unitNo].filter(Boolean);
  $("#record-identity").textContent = parts.length ? parts.join("｜") : "尚未指定單元";
}

function updateWallCalculation() {
  const height = designHeight();
  $("#design-height-preview").textContent = height === null ? "— m" : `${fixed(height)} m`;
  updateIdentity();
  renderExcavation();
  renderPouring();
}

function showTab(tab, focusPanel = false) {
  if (!TAB_LABELS[tab]) return;
  activeTab = tab;
  document.body.dataset.activeTab = tab;
  $$('.tab-panel').forEach(panel => { panel.hidden = panel.id !== `panel-${tab}`; });
  $$('[role="tab"]').forEach(button => {
    const selected = button.dataset.tab === tab;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $("#active-tab-label").textContent = TAB_LABELS[tab];
  $("#export-current-label").textContent = TAB_LABELS[tab];
  if (focusPanel) $(`#panel-${tab}`).focus({ preventScroll: true });
}

function emptyState(text) {
  return `<p class="empty-state">${esc(text)}</p>`;
}

function renderExcavation() {
  const latest = state.depth.at(-1);
  const latestValue = latest ? number(latest.value) : null;
  const designDepthValue = number(state.wall.designDepth);
  const difference = latestValue !== null && designDepthValue !== null ? latestValue - designDepthValue : null;

  $("#soil-count").innerHTML = `${state.soil.length} <small>次</small>`;
  $("#depth-count").innerHTML = `${state.depth.length} <small>次</small>`;
  $("#latest-depth").innerHTML = `${fixed(latestValue)} <small>m</small>`;
  $("#depth-difference").innerHTML = `${fixed(difference)} <small>m</small>`;
  $("#depth-difference-cell").classList.toggle("is-warning", difference !== null && difference < 0);

  $("#soil-list").innerHTML = state.soil.length ? state.soil.map((record, index) => `
    <article class="record-item">
      <div class="record-item-main">
        <div class="record-item-title"><strong>第 ${index + 1} 次出土</strong><span>${esc(record.time)}</span></div>
      </div>
      <div class="record-item-actions">
        <button type="button" data-edit-soil="${index}">修改</button>
        <button type="button" data-delete-soil="${index}">刪除</button>
      </div>
    </article>`).join("") : emptyState("尚無出土紀錄，請按＋新增。");

  $("#depth-list").innerHTML = state.depth.length ? state.depth.map((record, index) => {
    const value = number(record.value);
    const diff = value !== null && designDepthValue !== null ? value - designDepthValue : null;
    return `
      <article class="record-item">
        <div class="record-item-main">
          <div class="record-item-title"><strong>深度 ${fixed(value)} m</strong><span>${esc(record.time)}</span></div>
          <div class="record-item-meta"><span>第 ${index + 1} 次確認</span><span class="${diff !== null && diff < 0 ? "warning-text" : ""}">與設計差異 ${fixed(diff)} m</span></div>
        </div>
        <div class="record-item-actions">
          <button type="button" data-edit-depth="${index}">修改</button>
          <button type="button" data-delete-depth="${index}">刪除</button>
        </div>
      </article>`;
  }).join("") : emptyState("尚無深度確認，請按＋新增。");
}

function phaseTimeText(phase) {
  const record = state.prework[phase.id];
  const values = [];
  if (phase.start) values.push(`開始 ${record.start || "—"}`);
  if (phase.end) values.push(`完成 ${record.end || "—"}`);
  return values.join(" ／ ");
}

function renderPhaseEditor() {
  const phase = PHASES.find(item => item.id === $("#phase-select").value) || PHASES[0];
  const record = state.prework[phase.id];
  const fields = [];
  if (phase.start) fields.push(`<label class="field"><span>${esc(phase.start)}</span><input type="time" data-phase-input="start" value="${esc(record.start)}" /></label>`);
  if (phase.end) fields.push(`<label class="field"><span>${esc(phase.end)}</span><input type="time" data-phase-input="end" value="${esc(record.end)}" /></label>`);
  $("#phase-time-fields").innerHTML = fields.join("");
}

function renderPrework() {
  $("#phase-summary").innerHTML = PHASES.map(phase => {
    const record = state.prework[phase.id];
    const complete = (!phase.start || record.start) && (!phase.end || record.end);
    return `<div class="phase-row"><strong>${esc(phase.label)}</strong><span class="${complete ? "" : "pending"}">${esc(phaseTimeText(phase))}</span></div>`;
  }).join("");
}

function renderPouring() {
  const rows = calculatedTrucks();
  const last = rows.at(-1);
  $("#truck-count").innerHTML = `${rows.length} <small>車</small>`;
  $("#pour-volume").innerHTML = `${fixed(last?.cumulative ?? 0)} <small>m³</small>`;
  $("#pour-expected").innerHTML = `${fixed(last?.expected ?? null)} <small>m</small>`;
  $("#pour-measured").innerHTML = `${fixed(last?.measured ?? null)} <small>m</small>`;
  $("#pour-difference").innerHTML = `${fixed(last?.difference ?? null)} <small>m</small>`;
  $("#pour-difference-cell").classList.toggle("is-warning", Boolean(last && last.difference !== null && last.difference < -0.3));

  $("#truck-list").innerHTML = rows.length ? rows.map(row => `
    <article class="record-item">
      <div class="record-item-main">
        <div class="record-item-title"><strong>第 ${row.index + 1} 車｜${esc(row.truckNo)}</strong><span>${esc(row.unload)}–${esc(row.finish)}</span></div>
        <div class="record-item-meta">
          <span>本車 ${fixed(row.volume)} m³</span>
          <span>累積 ${fixed(row.cumulative)} m³</span>
          <span>預估 ${fixed(row.expected)} m</span>
          <span>實測 ${fixed(row.measured)} m</span>
          <span class="${row.difference !== null && row.difference < -0.3 ? "warning-text" : ""}">差異 ${fixed(row.difference)} m</span>
        </div>
      </div>
      <div class="record-item-actions">
        <button type="button" data-edit-truck="${row.index}">修改</button>
        <button type="button" data-delete-truck="${row.index}">刪除</button>
      </div>
    </article>`).join("") : emptyState("尚無澆置車次，請按＋新增車次。");

  const warnings = rows.filter(row => row.difference !== null && row.difference < -0.3);
  $("#pour-warnings").innerHTML = warnings.map(row => `<div class="warning-item"><strong>第 ${row.index + 1} 車差異 ${fixed(row.difference)} m：</strong>請確認量測基準、實際方量、超挖或坍孔可能性。</div>`).join("");
}

function renderAll() {
  updateIdentity();
  updateWallCalculation();
  renderPrework();
}

function openSoilDialog(index = null) {
  editIndex.soil = index;
  const record = index === null ? { time: "" } : state.soil[index];
  $("#soil-time").value = record.time;
  $("#soil-dialog-title").textContent = index === null ? "新增出土紀錄" : `修改第 ${index + 1} 次出土`;
  $("#soil-form [type='submit']").textContent = index === null ? "確認加入" : "確認更新";
  $("#soil-dialog").showModal();
}

function openDepthDialog(index = null) {
  editIndex.depth = index;
  const record = index === null ? { time: "", value: "" } : state.depth[index];
  $("#depth-time").value = record.time;
  $("#depth-value").value = record.value;
  $("#depth-dialog-title").textContent = index === null ? "新增深度確認" : `修改第 ${index + 1} 次深度`;
  $("#depth-form [type='submit']").textContent = index === null ? "確認加入" : "確認更新";
  $("#depth-dialog").showModal();
}

function openTruckDialog(index = null) {
  editIndex.truck = index;
  const record = index === null ? { truckNo: "", unload: "", finish: "", volume: "", measured: "" } : state.trucks[index];
  $("#truck-number").value = record.truckNo;
  $("#truck-unload").value = record.unload;
  $("#truck-finish").value = record.finish;
  $("#truck-volume").value = record.volume;
  $("#truck-measured").value = record.measured;
  $("#truck-dialog-title").textContent = index === null ? `新增第 ${state.trucks.length + 1} 車` : `修改第 ${index + 1} 車`;
  $("#truck-form [type='submit']").textContent = index === null ? "確認加入" : "確認更新";
  $("#truck-dialog").showModal();
}

function showUndo(message, action) {
  clearTimeout(undoTimer);
  undoAction = action;
  $("#undo-message").textContent = message;
  $("#undo-toast").hidden = false;
  undoTimer = setTimeout(() => {
    $("#undo-toast").hidden = true;
    undoAction = null;
  }, 5000);
}

function removeRecord(type, index) {
  const collection = state[type];
  const [removed] = collection.splice(index, 1);
  if (type === "truck") renderPouring();
  else renderExcavation();
  const label = type === "soil" ? "出土紀錄" : type === "depth" ? "深度確認" : "澆置車次";
  showUndo(`已刪除${label}`, () => {
    collection.splice(index, 0, removed);
    if (type === "truck") renderPouring();
    else renderExcavation();
  });
}

function printHeader(title, sequence) {
  const identity = [state.wall.unitType, state.wall.unitNo].filter(Boolean).join("｜") || "未指定單元";
  return `<header class="print-document-header"><div><p>CONTINUOUS WALL FIELD RECORD / ${sequence}</p><h1>${esc(title)}</h1></div><strong>${esc(display(state.overview.project))}<br />${esc(identity)}</strong></header>`;
}

function printFooter() {
  return `<footer class="print-footer">輸出時間：${esc(new Date().toLocaleString("zh-TW", { hour12: false }))}</footer>`;
}

function renderPrint() {
  const height = designHeight();
  const latestDepth = state.depth.at(-1);
  const latestDepthValue = latestDepth ? number(latestDepth.value) : null;
  const depthDiff = latestDepthValue !== null && number(state.wall.designDepth) !== null ? latestDepthValue - number(state.wall.designDepth) : null;
  const truckRows = calculatedTrucks();
  const lastTruck = truckRows.at(-1);

  $("#print-overview").innerHTML = `${printHeader("工程概要", "01")}
    <section class="print-section"><h2>工程基本資料</h2><div class="print-meta-grid">
      <div><span>工程名稱</span><strong>${esc(display(state.overview.project))}</strong></div>
      <div><span>施工廠商</span><strong>${esc(display(state.overview.contractor))}</strong></div>
      <div><span>施工日期</span><strong>${esc(display(state.overview.date))}</strong></div>
      <div><span>填表人</span><strong>${esc(display(state.overview.reviewer))}</strong></div>
    </div></section>${printFooter()}`;

  $("#print-wall").innerHTML = `${printHeader("壁體資訊", "02")}
    <section class="print-section"><h2>單元與設計基準</h2><div class="print-meta-grid three">
      <div><span>單元類型</span><strong>${esc(display(state.wall.unitType))}</strong></div>
      <div><span>樁／壁編號</span><strong>${esc(display(state.wall.unitNo))}</strong></div>
      <div><span>混凝土強度</span><strong>${esc(display(state.wall.strength))}</strong></div>
      <div><span>設計深度</span><strong>${esc(display(state.wall.designDepth))} m</strong></div>
      <div><span>壁厚／單元長度</span><strong>${esc(display(state.wall.thickness))} m ／ ${esc(display(state.wall.length))} m</strong></div>
      <div><span>澆置頂端高程</span><strong>GL ${number(state.wall.topElevation) !== null && number(state.wall.topElevation) >= 0 ? "+" : ""}${esc(display(state.wall.topElevation))} m</strong></div>
      <div><span>設計澆置高度</span><strong>${fixed(height)} m</strong></div>
      <div><span>設計數量</span><strong>${esc(display(state.wall.designVolume))} m³</strong></div>
      <div><span>實際數量</span><strong>${esc(display(state.wall.actualVolume))} m³</strong></div>
    </div></section>${printFooter()}`;

  const soilRows = state.soil.length ? state.soil.map((record, index) => `<tr><td>${index + 1}</td><td>${esc(record.time)}</td></tr>`).join("") : `<tr><td colspan="2" class="print-empty">尚無出土紀錄</td></tr>`;
  const depthRows = state.depth.length ? state.depth.map((record, index) => {
    const value = number(record.value);
    const diff = value !== null && number(state.wall.designDepth) !== null ? value - number(state.wall.designDepth) : null;
    return `<tr><td>${index + 1}</td><td>${esc(record.time)}</td><td>${fixed(value)}</td><td>${fixed(diff)}</td></tr>`;
  }).join("") : `<tr><td colspan="4" class="print-empty">尚無深度確認</td></tr>`;
  $("#print-excavation").innerHTML = `${printHeader("開挖紀錄", "03")}
    <section class="print-section"><h2>開挖主控摘要</h2><div class="print-summary">
      <div><span>出土次數</span><strong>${state.soil.length} 次</strong></div>
      <div><span>深度確認</span><strong>${state.depth.length} 次</strong></div>
      <div><span>最新深度</span><strong>${fixed(latestDepthValue)} m</strong></div>
      <div><span>與設計差異</span><strong>${fixed(depthDiff)} m</strong></div>
    </div></section>
    <section class="print-section"><h2>出土紀錄</h2><table class="print-table"><thead><tr><th>次數</th><th>出土時間</th></tr></thead><tbody>${soilRows}</tbody></table></section>
    <section class="print-section"><h2>深度確認</h2><table class="print-table"><thead><tr><th>次數</th><th>確認時間</th><th>深度（m）</th><th>與設計差異（m）</th></tr></thead><tbody>${depthRows}</tbody></table></section>${printFooter()}`;

  const phaseRows = PHASES.map((phase, index) => {
    const record = state.prework[phase.id];
    return `<tr><td>${index + 1}</td><td class="text-left">${esc(phase.label)}</td><td>${phase.start ? esc(display(record.start)) : "—"}</td><td>${phase.end ? esc(display(record.end)) : "—"}</td></tr>`;
  }).join("");
  $("#print-prework").innerHTML = `${printHeader("前置作業", "04")}
    <section class="print-section"><h2>前置作業時間紀錄</h2><table class="print-table"><thead><tr><th>項次</th><th>作業項目</th><th>開始時間</th><th>完成時間</th></tr></thead><tbody>${phaseRows}</tbody></table></section>${printFooter()}`;

  const pouringRows = truckRows.length ? truckRows.map(row => `<tr>
    <td>${row.index + 1}</td><td>${esc(row.truckNo)}</td><td>${esc(row.unload)}</td><td>${esc(row.finish)}</td><td>${fixed(row.volume)}</td><td>${fixed(row.cumulative)}</td><td>${fixed(row.expected)}</td><td>${fixed(row.measured)}</td><td>${fixed(row.difference)}</td>
  </tr>`).join("") : `<tr><td colspan="9" class="print-empty">尚無澆置紀錄</td></tr>`;
  $("#print-pouring").innerHTML = `${printHeader("澆置紀錄", "05")}
    <section class="print-section"><h2>澆置主控摘要</h2><div class="print-summary">
      <div><span>車次</span><strong>${truckRows.length} 車</strong></div>
      <div><span>逐車累積量</span><strong>${fixed(lastTruck?.cumulative ?? 0)} m³</strong></div>
      <div><span>設計／實際數量</span><strong>${esc(display(state.wall.designVolume))} ／ ${esc(display(state.wall.actualVolume))} m³</strong></div>
      <div><span>預估／實測／差異</span><strong>${fixed(lastTruck?.expected ?? null)} ／ ${fixed(lastTruck?.measured ?? null)} ／ ${fixed(lastTruck?.difference ?? null)} m</strong></div>
    </div></section>
    <section class="print-section"><h2>逐車混凝土澆置紀錄</h2><table class="print-table"><thead><tr><th>車次</th><th>車號</th><th>卸料</th><th>結束</th><th>方量<br />m³</th><th>累積<br />m³</th><th>預估高度<br />m</th><th>實測高度<br />m</th><th>差異<br />m</th></tr></thead><tbody>${pouringRows}</tbody></table></section>${printFooter()}`;
}

function exportPdf(scope) {
  renderPrint();
  document.body.dataset.printScope = scope;
  $$('.print-page').forEach(page => page.classList.toggle("print-selected", page.dataset.printTab === activeTab));
  $("#export-dialog").close();
  window.print();
}

function initialize() {
  setInitialInputs();
  $("#phase-select").innerHTML = PHASES.map(phase => `<option value="${phase.id}">${esc(phase.label)}</option>`).join("");
  renderPhaseEditor();
  renderAll();
  showTab("overview");

  document.addEventListener("input", event => {
    const input = event.target.closest("[data-bind]");
    if (!input) return;
    const [group, key] = input.dataset.bind.split(".");
    state[group][key] = input.value;
    if (group === "wall") updateWallCalculation();
    else if (group === "overview") updateIdentity();
  });

  document.addEventListener("change", event => {
    const input = event.target.closest("[data-bind]");
    if (input?.type === "radio") {
      const [group, key] = input.dataset.bind.split(".");
      state[group][key] = input.value;
      updateIdentity();
    }
  });

  $$('[role="tab"]').forEach(button => {
    button.addEventListener("click", () => showTab(button.dataset.tab));
    button.addEventListener("keydown", event => {
      const tabs = $$('[role="tab"]');
      const index = tabs.indexOf(button);
      const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      showTab(next.dataset.tab);
      next.focus();
    });
  });

  $("#project-tool-button").addEventListener("click", () => $("#project-tool").scrollIntoView({ behavior: "smooth", block: "start" }));
  $("#help-button").addEventListener("click", () => $("#help-dialog").showModal());
  $("#export-button").addEventListener("click", () => {
    $("#export-current-label").textContent = TAB_LABELS[activeTab];
    $("#export-dialog").showModal();
  });
  $$('[data-close-dialog]').forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
  $$('[data-export-scope]').forEach(button => button.addEventListener("click", () => exportPdf(button.dataset.exportScope)));

  $("#add-soil").addEventListener("click", () => openSoilDialog());
  $("#add-depth").addEventListener("click", () => openDepthDialog());
  $("#add-truck").addEventListener("click", () => openTruckDialog());

  $("#soil-form").addEventListener("submit", event => {
    event.preventDefault();
    const record = { time: $("#soil-time").value };
    if (editIndex.soil === null) state.soil.push(record);
    else state.soil[editIndex.soil] = record;
    $("#soil-dialog").close();
    renderExcavation();
  });

  $("#depth-form").addEventListener("submit", event => {
    event.preventDefault();
    const record = { time: $("#depth-time").value, value: $("#depth-value").value };
    if (editIndex.depth === null) state.depth.push(record);
    else state.depth[editIndex.depth] = record;
    $("#depth-dialog").close();
    renderExcavation();
  });

  $("#truck-form").addEventListener("submit", event => {
    event.preventDefault();
    const record = {
      truckNo: $("#truck-number").value.trim(),
      unload: $("#truck-unload").value,
      finish: $("#truck-finish").value,
      volume: $("#truck-volume").value,
      measured: $("#truck-measured").value
    };
    if (editIndex.truck === null) state.trucks.push(record);
    else state.trucks[editIndex.truck] = record;
    $("#truck-dialog").close();
    renderPouring();
  });

  $("#phase-select").addEventListener("change", renderPhaseEditor);
  $("#confirm-phase").addEventListener("click", () => {
    const phase = PHASES.find(item => item.id === $("#phase-select").value);
    $$('[data-phase-input]').forEach(input => { state.prework[phase.id][input.dataset.phaseInput] = input.value; });
    renderPrework();
  });

  document.addEventListener("click", event => {
    const editSoil = event.target.closest("[data-edit-soil]");
    const deleteSoil = event.target.closest("[data-delete-soil]");
    const editDepth = event.target.closest("[data-edit-depth]");
    const deleteDepth = event.target.closest("[data-delete-depth]");
    const editTruck = event.target.closest("[data-edit-truck]");
    const deleteTruck = event.target.closest("[data-delete-truck]");
    if (editSoil) openSoilDialog(Number(editSoil.dataset.editSoil));
    else if (deleteSoil) removeRecord("soil", Number(deleteSoil.dataset.deleteSoil));
    else if (editDepth) openDepthDialog(Number(editDepth.dataset.editDepth));
    else if (deleteDepth) removeRecord("depth", Number(deleteDepth.dataset.deleteDepth));
    else if (editTruck) openTruckDialog(Number(editTruck.dataset.editTruck));
    else if (deleteTruck) removeRecord("truck", Number(deleteTruck.dataset.deleteTruck));
  });

  $("#undo-button").addEventListener("click", () => {
    if (undoAction) undoAction();
    clearTimeout(undoTimer);
    undoAction = null;
    $("#undo-toast").hidden = true;
  });

  window.addEventListener("afterprint", () => { document.body.dataset.printScope = "none"; });
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("./sw.js").catch(() => {});
}

initialize();
