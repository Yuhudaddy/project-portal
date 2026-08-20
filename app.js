const TAB_LABELS = {
  overview: "工程概要",
  wall: "壁體資訊",
  quality: "品質自檢",
  excavation: "開挖紀錄",
  prework: "前置紀錄",
  pouring: "澆置紀錄"
};

const TOOL_LABELS = {
  unit: "連續壁施工紀錄",
  trench: "導溝施工複核",
  cage: "鋼筋籠吊放前複核"
};

const PRINT_TAB_GROUPS = {
  overview: "overview-wall",
  wall: "overview-wall",
  quality: "quality",
  excavation: "excavation-prework",
  prework: "excavation-prework",
  pouring: "pouring",
  trench: "trench",
  cage: "cage"
};

const TRENCH_CHECKS = [
  ["單元位置與中心線", "放樣點位、單元順序與核定圖說相符"],
  ["導溝寬度與淨寬", "依核定施工圖；尺寸容許差依圖說"],
  ["導溝頂高程／深度", "依核定施工圖與測量基準"],
  ["壁面與底部完整性", "無鬆動、剝落、裂縫；底部無堆積物"],
  ["單元界面與接頭區", "界面位置、接頭區淨空可供後續施工"],
  ["施工平台與排水", "平台平整，排水及運輸動線無阻"],
  ["成槽前放行條件", "測量複核、現場條件及廠商自檢紀錄齊備"]
];

const CAGE_PARTS = [
  "A 面縱向主筋", "B 面縱向主筋", "A 面水平分布筋", "B 面水平分布筋",
  "垂直補強筋", "桁架筋／剛性補強", "吊筋／吊環", "接頭區補強筋", "保護層定位筋／墊塊"
];

const CAGE_CHECKS = [
  ["籠號與單元對應", "籠號、單元號與核定配筋圖一致"],
  ["籠體幾何尺寸", "長度、寬度、厚度與圖說相符"],
  ["接頭、搭接與焊接", "位置、長度與施工規範相符"],
  ["保護層墊塊與固定", "位置、數量及固定方式可確保保護層"],
  ["吊點、吊具及臨時補強", "吊點、吊筋、桁架及補強可安全吊放"],
  ["接頭構件／預埋件", "止水、接頭鋼板及預埋件位置依圖說"],
  ["外觀與吊放前狀態", "無顯著變形、鬆脫、污染或妨礙吊放之雜物"]
];

const QUALITY_CHECKS = [
  ["連續壁單元位置、刃法順序確認", "單元編號 No.", "例如：單元 21／順序 05"],
  ["挖掘深度確認", "依核定 GL 深度確認", "例如：GL -35.8 m"],
  ["底部沉渣及泥屑清除確認", "底部沉泥小於 20 cm", "例如：沉泥 12 cm"],
  ["端板接頭清洗（公及公母單元時）", "以大小鋼刷確實清洗", "填寫清洗狀況"],
  ["穩定液新鮮液之貯存量是否充裕", "大於單元用量", "填寫液量或確認說明"],
  ["槽溝穩定液面高度控制", "鋪面下 50 cm～100 cm 以內", "例如：鋪面下 70 cm"],
  ["廢土清運是否正常", "不致影響挖掘進度", "填寫異常說明"],
  ["施工動線及運土車輛之安排", "不致延遲澆置時間", "填寫異常說明"],
  ["壁體坍塌處是否需作補強", "若需補強，說明方式", "填寫補強方式或無需補強"],
  ["鋼筋籠吊放位置及高程確認", "橫向 ±5 cm、豎向 ±3 cm", "例如：橫向 +2 cm／豎向 -1 cm"],
  ["帆布是否破損（母單元時）", "單元起吊前及下放時檢查", "填寫檢查狀況"],
  ["鋼筋籠吊放完成再測孔深", "依設計 GL 深度確認", "例如：GL -35.3 m"],
  ["開挖深度與管長之配合", "管底與槽溝底部距離 ≤30 cm", "填寫距離"],
  ["特密管之檢查（變形、破裂、堵塞、水密性）", "下放前及過程中目視檢查", "填寫檢查狀況"],
  ["插入位置、深度、組合之記錄", "位置符合圖面；長度配合挖掘深度", "填寫左／中／右位置與管長"],
  ["放置橡皮碗", "澆置前放置於漏斗內", "填寫是／否"],
  ["穩定液回收池容積是否足夠", "同時間無挖掘，容積大於回收量", "填寫是／否或容積"],
  ["混凝土坍度之確認", "設計坍度 18 cm ±4 cm", "例如：實測 19 cm"],
  ["混凝土是否合乎設計強度", "記錄空打段、實打段 GL 與強度", "填寫 GL／psi"],
  ["特密管埋入混凝土內之確認", "母及公母單元 ≥1 m；公單元 ≥1.5 m", "填寫埋入深度"],
  ["設計混凝土澆置完成面", "依設計 GL 高程", "例如：設計 GL -0.5 m／實測 GL -0.3 m"],
  ["超音波記錄結果說明", "依單元型式及圖說完成檢測記錄", "填寫位置與垂直精度"],
  ["混凝土設計及實際數量說明", "實際用量與設計用量誤差：超灌量 ±5%、少灌量 ±5%", "填寫空打／實打／整體方量與誤差"]
];

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
  trucks: [],
  trench: {
    project: "", contractor: "", date: today, unitNo: "", reviewer: "", note: "",
    checks: TRENCH_CHECKS.map(([item, standard]) => ({ item, standard, actual: "", result: "待確認" }))
  },
  cage: {
    project: "", date: today, unitNo: "", cageNo: "", reviewer: "", note: "",
    rebars: CAGE_PARTS.map(part => ({ part, designNo: "", designQty: "", actualNo: "", actualQty: "", result: "待確認" })),
    checks: CAGE_CHECKS.map(([item, standard]) => ({ item, standard, actual: "", result: "待確認" }))
  },
  quality: {
    project: "", contractor: "", subcontractor: "", unitCategory: "", unitType: "", unitNo: "", sequence: "",
    excavationStart: "", excavationEnd: "", constructionStart: "", constructionEnd: "", note: "",
    checks: QUALITY_CHECKS.map(([item, standard, placeholder]) => ({ item, standard, placeholder, actual: "", result: "待確認" }))
  }
};

let activeTab = "overview";
let activeTool = "unit";
const editIndex = { soil: null, depth: null, truck: null, rebar: null };
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

const formatDateDisplay = value => {
  const [y, m, d] = String(value ?? "").split("-");
  return y && m && d ? `${y}/${m}/${d}` : "";
};

function syncDateTimeDisplay(input) {
  const wrap = input.closest(".native-field-wrap");
  const display = wrap ? wrap.querySelector(".native-field-display") : null;
  if (!display) return;
  const value = input.value;
  display.classList.toggle("is-empty", !value);
  display.textContent = value
    ? (input.type === "date" ? formatDateDisplay(value) : value)
    : (input.type === "date" ? "尚未選擇日期" : "尚未選擇時間");
}

function syncAllDateTimeDisplays() {
  $$('input[type="date"], input[type="time"]').forEach(syncDateTimeDisplay);
}

function designHeight() {
  const depth = number(state.wall.designDepth);
  const elevation = number(state.wall.topElevation);
  if (depth === null || elevation === null) return null;
  // Accept both a positive downward depth (e.g. 35.8) and a signed GL level (e.g. -39.5).
  return Math.max(0, depth < 0 ? elevation - depth : depth + elevation);
}

function calculatedDesignVolume() {
  const height = designHeight();
  const thickness = number(state.wall.thickness);
  const length = number(state.wall.length);
  if (height === null || thickness === null || length === null) return null;
  return height * thickness * length;
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
  if (activeTool === "trench") {
    $("#record-identity").textContent = state.trench.unitNo ? `導溝｜${state.trench.unitNo}` : "導溝施工複核";
    return;
  }
  if (activeTool === "cage") {
    $("#record-identity").textContent = state.cage.cageNo || state.cage.unitNo ? [state.cage.unitNo, state.cage.cageNo].filter(Boolean).join("｜") : "鋼筋籠吊放前複核";
    return;
  }
  const parts = [state.wall.unitType, state.wall.unitNo].filter(Boolean);
  $("#record-identity").textContent = parts.length ? parts.join("｜") : "尚未指定單元";
}

function updateWallCalculation() {
  const height = designHeight();
  const volume = calculatedDesignVolume();
  state.wall.designVolume = volume === null ? "" : volume.toFixed(2);
  const volumeInput = $('[data-bind="wall.designVolume"]');
  if (volumeInput) volumeInput.value = state.wall.designVolume;
  $("#design-height-preview").textContent = height === null ? "— m" : `${fixed(height)} m`;
  $("#design-volume-preview").textContent = volume === null ? "— m³" : `${fixed(volume)} m³`;
  updateIdentity();
  renderExcavation();
  renderPouring();
}

function currentExportLabel(tool = activeTool, tab = activeTab) {
  if (tool === "unit") {
    if (PRINT_TAB_GROUPS[tab] === "overview-wall") return "工程概要＋壁體資訊";
    if (PRINT_TAB_GROUPS[tab] === "quality") return "品質自檢";
    if (PRINT_TAB_GROUPS[tab] === "excavation-prework") return "開挖紀錄＋前置紀錄";
    return TAB_LABELS[tab];
  }
  return TOOL_LABELS[tool];
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
  if (activeTool === "unit") {
    $("#active-tab-label").textContent = TAB_LABELS[tab];
    $("#export-current-label").textContent = currentExportLabel("unit", tab);
  }
  if (focusPanel) $(`#panel-${tab}`).focus({ preventScroll: true });
}

function showTool(tool) {
  if (!TOOL_LABELS[tool]) return;
  activeTool = tool;
  document.body.dataset.activeTool = tool;
  $$('[data-tool-view]').forEach(view => { view.hidden = view.dataset.toolView !== tool; });
  $$('[data-select-tool]').forEach(button => {
    if (button.dataset.selectTool === tool) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  const label = tool === "unit" ? TAB_LABELS[activeTab] : TOOL_LABELS[tool];
  $("#active-tab-label").textContent = label;
  $("#export-current-label").textContent = currentExportLabel(tool, activeTab);
  updateIdentity();
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
  if (phase.start) fields.push(`<label class="field"><span>${esc(phase.start)}</span><span class="native-field-wrap"><input type="time" data-phase-input="start" value="${esc(record.start)}" /><span class="native-field-display" aria-hidden="true"></span></span></label>`);
  if (phase.end) fields.push(`<label class="field"><span>${esc(phase.end)}</span><span class="native-field-wrap"><input type="time" data-phase-input="end" value="${esc(record.end)}" /><span class="native-field-display" aria-hidden="true"></span></span></label>`);
  $("#phase-time-fields").innerHTML = fields.join("");
  syncAllDateTimeDisplays();
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

function resultOptions(selected) {
  return ["待確認", "符合", "不符合", "不適用"]
    .map(value => `<option value="${value}" ${value === selected ? "selected" : ""}>${value}</option>`)
    .join("");
}

function renderCheckCards(type) {
  const target = $(`#${type}-check-list`);
  target.innerHTML = state[type].checks.map((check, index) => `
    <article class="check-card ${check.result === "不符合" ? "is-failed" : ""}">
      <div class="check-card-head"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(check.item)}</strong></div>
      <p>${esc(check.standard)}</p>
      <div class="check-card-fields">
        <label class="field"><span>現場紀錄／實測</span><input type="text" value="${esc(check.actual)}" data-check-item="${type}" data-check-index="${index}" data-check-field="actual" /></label>
        <label class="field result-field"><span>複核結果</span><select data-check-item="${type}" data-check-index="${index}" data-check-field="result">${resultOptions(check.result)}</select></label>
      </div>
    </article>`).join("");
  const completed = state[type].checks.filter(check => check.result !== "待確認").length;
  if (type === "trench") {
    $("#trench-progress").textContent = `${completed} / ${state.trench.checks.length}`;
    $("#trench-pending").textContent = String(state.trench.checks.length - completed);
  } else {
    $("#cage-check-progress").textContent = `${completed} / ${state.cage.checks.length}`;
  }
}

function renderRebars() {
  const rows = state.cage.rebars;
  $("#cage-rebar-list").innerHTML = rows.length ? rows.map((rebar, index) => `
    <article class="rebar-card ${rebar.result === "不符合" ? "is-failed" : ""}">
      <div class="rebar-card-main">
        <div class="rebar-card-title"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(rebar.part)}</strong><em>${esc(rebar.result)}</em></div>
        <dl>
          <div><dt>設計</dt><dd>${esc([rebar.designNo, rebar.designQty].filter(Boolean).join("／") || "尚未填寫")}</dd></div>
          <div><dt>實際</dt><dd>${esc([rebar.actualNo, rebar.actualQty].filter(Boolean).join("／") || "尚未填寫")}</dd></div>
        </dl>
      </div>
      <div class="record-item-actions"><button type="button" data-edit-rebar="${index}">填寫</button><button type="button" data-delete-rebar="${index}">刪除</button></div>
    </article>`).join("") : emptyState("尚無配筋項目，請按＋新增。 ");
  const completed = rows.filter(rebar => rebar.result !== "待確認").length;
  $("#cage-rebar-progress").textContent = `${completed} / ${rows.length}`;
}

function setChecklistInputs() {
  $$('[data-check-bind]').forEach(input => {
    const [type, key] = input.dataset.checkBind.split(".");
    input.value = state[type][key] ?? "";
  });
}

function setQualityInputs() {
  $$('[data-quality-bind]').forEach(input => {
    input.value = state.quality[input.dataset.qualityBind] ?? "";
  });
}

function renderQuality() {
  setQualityInputs();
  $("#quality-check-list").innerHTML = state.quality.checks.map((check, index) => `
    <article class="quality-card ${check.result === "不符合" ? "is-failed" : ""}">
      <div class="quality-card-head"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(check.item)}</strong></div>
      <p>${esc(check.standard)}</p>
      <div class="quality-card-fields">
        <label class="field"><span>現場紀錄／實測</span><input type="text" value="${esc(check.actual)}" placeholder="${esc(check.placeholder)}" data-quality-item="${index}" data-quality-field="actual" /></label>
        <label class="field result-field"><span>檢查結果</span><select data-quality-item="${index}" data-quality-field="result">${resultOptions(check.result)}</select></label>
      </div>
    </article>`).join("");
  const completed = state.quality.checks.filter(check => check.result !== "待確認").length;
  $("#quality-progress").textContent = `${completed} / ${state.quality.checks.length}`;
  $("#quality-pending").textContent = String(state.quality.checks.length - completed);
}

function renderChecklists() {
  setChecklistInputs();
  renderCheckCards("trench");
  renderCheckCards("cage");
  renderRebars();
  renderQuality();
}

function renderAll() {
  updateIdentity();
  updateWallCalculation();
  renderPrework();
  renderChecklists();
}

function clearAllData() {
  state.overview = { project: "", contractor: "", date: "", reviewer: "" };
  state.wall = {
    unitType: "", unitNo: "", designDepth: "", strength: "", thickness: "", length: "",
    topElevation: "", designVolume: "", actualVolume: ""
  };
  state.soil = [];
  state.depth = [];
  state.prework = Object.fromEntries(PHASES.map(phase => [phase.id, { start: "", end: "" }]));
  state.trucks = [];
  state.trench = {
    project: "", contractor: "", date: "", unitNo: "", reviewer: "", note: "",
    checks: TRENCH_CHECKS.map(([item, standard]) => ({ item, standard, actual: "", result: "待確認" }))
  };
  state.cage = {
    project: "", date: "", unitNo: "", cageNo: "", reviewer: "", note: "",
    rebars: CAGE_PARTS.map(part => ({ part, designNo: "", designQty: "", actualNo: "", actualQty: "", result: "待確認" })),
    checks: CAGE_CHECKS.map(([item, standard]) => ({ item, standard, actual: "", result: "待確認" }))
  };
  state.quality = {
    project: "", contractor: "", subcontractor: "", unitCategory: "", unitType: "", unitNo: "", sequence: "",
    excavationStart: "", excavationEnd: "", constructionStart: "", constructionEnd: "", note: "",
    checks: QUALITY_CHECKS.map(([item, standard, placeholder]) => ({ item, standard, placeholder, actual: "", result: "待確認" }))
  };
  Object.keys(editIndex).forEach(key => { editIndex[key] = null; });
  clearTimeout(undoTimer);
  undoAction = null;
  $("#undo-toast").hidden = true;
  setInitialInputs();
  setChecklistInputs();
  setQualityInputs();
  $("#phase-select").value = PHASES[0].id;
  renderPhaseEditor();
  renderAll();
  syncAllDateTimeDisplays();
  $("#clear-dialog").close();
}

function openSoilDialog(index = null) {
  editIndex.soil = index;
  const record = index === null ? { time: "" } : state.soil[index];
  $("#soil-time").value = record.time;
  syncDateTimeDisplay($("#soil-time"));
  $("#soil-dialog-title").textContent = index === null ? "新增出土紀錄" : `修改第 ${index + 1} 次出土`;
  $("#soil-form [type='submit']").textContent = index === null ? "確認加入" : "確認更新";
  $("#soil-dialog").showModal();
}

function openDepthDialog(index = null) {
  editIndex.depth = index;
  const record = index === null ? { time: "", value: "" } : state.depth[index];
  $("#depth-time").value = record.time;
  syncDateTimeDisplay($("#depth-time"));
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
  syncDateTimeDisplay($("#truck-unload"));
  syncDateTimeDisplay($("#truck-finish"));
  $("#truck-volume").value = record.volume;
  $("#truck-measured").value = record.measured;
  $("#truck-dialog-title").textContent = index === null ? `新增第 ${state.trucks.length + 1} 車` : `修改第 ${index + 1} 車`;
  $("#truck-form [type='submit']").textContent = index === null ? "確認加入" : "確認更新";
  $("#truck-dialog").showModal();
}

function openRebarDialog(index = null) {
  editIndex.rebar = index;
  const record = index === null
    ? { part: "", designNo: "", designQty: "", actualNo: "", actualQty: "", result: "待確認" }
    : state.cage.rebars[index];
  $("#rebar-part").value = record.part;
  $("#rebar-design-no").value = record.designNo;
  $("#rebar-design-qty").value = record.designQty;
  $("#rebar-actual-no").value = record.actualNo;
  $("#rebar-actual-qty").value = record.actualQty;
  $("#rebar-result").value = record.result;
  $("#rebar-dialog-title").textContent = index === null ? "新增配筋項目" : `填寫第 ${index + 1} 項配筋`;
  $("#rebar-form [type='submit']").textContent = index === null ? "確認加入" : "確認更新";
  $("#rebar-dialog").showModal();
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

function removeRebar(index) {
  const [removed] = state.cage.rebars.splice(index, 1);
  renderRebars();
  showUndo("已刪除配筋項目", () => {
    state.cage.rebars.splice(index, 0, removed);
    renderRebars();
  });
}

function printHeader(title, sequence, project = state.overview.project, recordIdentity = null) {
  const identity = recordIdentity || [state.wall.unitType, state.wall.unitNo].filter(Boolean).join("｜") || "未指定單元";
  return `<header class="print-document-header"><div><p>CONTINUOUS WALL FIELD RECORD / ${sequence}</p><h1>${esc(title)}</h1></div><div class="print-header-meta"><strong>${esc(display(project))}<br />${esc(identity)}</strong><img class="print-logo" src="./taisei.png" alt="" /></div></header>`;
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

  $("#print-overview-wall").innerHTML = `${printHeader("連續壁施工紀錄", "01–02")}
    <section class="print-section"><h2>01｜工程概要</h2><div class="print-meta-grid">
      <div><span>工程名稱</span><strong>${esc(display(state.overview.project))}</strong></div>
      <div><span>施工廠商</span><strong>${esc(display(state.overview.contractor))}</strong></div>
      <div><span>施工日期</span><strong>${esc(display(state.overview.date))}</strong></div>
      <div><span>填表人</span><strong>${esc(display(state.overview.reviewer))}</strong></div>
    </div></section>
    <section class="print-section"><h2>02｜壁體資訊</h2><div class="print-meta-grid three">
      <div><span>單元類型</span><strong>${esc(display(state.wall.unitType))}</strong></div>
      <div><span>樁／壁編號</span><strong>${esc(display(state.wall.unitNo))}</strong></div>
      <div><span>混凝土強度（kgf/cm2）</span><strong>${esc(display(state.wall.strength))}</strong></div>
      <div><span>設計深度（GL, m）</span><strong>GL ${esc(display(state.wall.designDepth))} m</strong></div>
      <div><span>壁厚／單元長度</span><strong>${esc(display(state.wall.thickness))} m ／ ${esc(display(state.wall.length))} m</strong></div>
      <div><span>澆置頂端高程</span><strong>GL ${number(state.wall.topElevation) !== null && number(state.wall.topElevation) >= 0 ? "+" : ""}${esc(display(state.wall.topElevation))} m</strong></div>
      <div><span>設計澆置高度</span><strong>${fixed(height)} m</strong></div>
      <div><span>設計數量</span><strong>${esc(display(state.wall.designVolume))} m³</strong></div>
      <div><span>實際數量</span><strong>${esc(display(state.wall.actualVolume))} m³</strong></div>
    </div></section>${printFooter()}`;

  const qualityRows = state.quality.checks.map((check, index) => `<tr><td>${index + 1}</td><td class="text-left">${esc(check.item)}</td><td class="text-left">${esc(check.standard)}</td><td class="text-left">${esc(display(check.actual))}</td><td>${esc(check.result)}</td></tr>`).join("");
  const qualityProject = state.quality.project || state.overview.project;
  const qualityIdentity = [state.quality.unitNo, state.quality.sequence ? `順序 ${state.quality.sequence}` : ""].filter(Boolean).join("｜") || "未指定單元";
  $("#print-quality").innerHTML = `${printHeader("連續壁施工品質自檢總表", "03", qualityProject, qualityIdentity)}
    <section class="print-section"><h2>基本資料</h2><div class="print-meta-grid three compact-meta">
      <div><span>工程名稱</span><strong>${esc(display(state.quality.project || state.overview.project))}</strong></div>
      <div><span>承包商</span><strong>${esc(display(state.quality.contractor || state.overview.contractor))}</strong></div>
      <div><span>分包商</span><strong>${esc(display(state.quality.subcontractor))}</strong></div>
      <div><span>單元類別</span><strong>${esc(display(state.quality.unitCategory))}</strong></div>
      <div><span>單元型式</span><strong>${esc(display(state.quality.unitType || state.wall.unitType))}</strong></div>
      <div><span>單元編號</span><strong>${esc(display(state.quality.unitNo || state.wall.unitNo))}</strong></div>
      <div><span>施工順序</span><strong>${esc(display(state.quality.sequence))}</strong></div>
      <div><span>挖掘開始／結束</span><strong>${esc(display(state.quality.excavationStart))} ／ ${esc(display(state.quality.excavationEnd))}</strong></div>
      <div><span>施工開始／結束</span><strong>${esc(display(state.quality.constructionStart))} ／ ${esc(display(state.quality.constructionEnd))}</strong></div>
    </div></section>
    <section class="print-section compact-print-section"><h2>品質自檢項目</h2><table class="print-table quality-print-table"><thead><tr><th>項次</th><th>檢查項目</th><th>檢查標準</th><th>現場紀錄／實測</th><th>結果</th></tr></thead><tbody>${qualityRows}</tbody></table></section>
    <section class="print-section quality-note-section"><h2>缺失及改善結果</h2><div class="print-note">${esc(display(state.quality.note))}</div></section>${printFooter()}`;

  const soilRows = state.soil.length ? state.soil.map((record, index) => `<tr><td>${index + 1}</td><td>${esc(record.time)}</td></tr>`).join("") : `<tr><td colspan="2" class="print-empty">尚無出土紀錄</td></tr>`;
  const depthRows = state.depth.length ? state.depth.map((record, index) => {
    const value = number(record.value);
    const diff = value !== null && number(state.wall.designDepth) !== null ? value - number(state.wall.designDepth) : null;
    return `<tr><td>${index + 1}</td><td>${esc(record.time)}</td><td>${fixed(value)}</td><td>${fixed(diff)}</td></tr>`;
  }).join("") : `<tr><td colspan="4" class="print-empty">尚無深度確認</td></tr>`;
  const phaseRows = PHASES.map((phase, index) => {
    const record = state.prework[phase.id];
    return `<tr><td>${index + 1}</td><td class="text-left">${esc(phase.label)}</td><td>${phase.start ? esc(display(record.start)) : "—"}</td><td>${phase.end ? esc(display(record.end)) : "—"}</td></tr>`;
  }).join("");
  $("#print-excavation-prework").innerHTML = `${printHeader("開挖與前置紀錄", "04–05")}
    <section class="print-section"><h2>04｜開挖紀錄</h2><div class="print-summary">
      <div><span>出土次數</span><strong>${state.soil.length} 次</strong></div>
      <div><span>深度確認</span><strong>${state.depth.length} 次</strong></div>
      <div><span>最新深度</span><strong>${fixed(latestDepthValue)} m</strong></div>
      <div><span>與設計差異</span><strong>${fixed(depthDiff)} m</strong></div>
    </div></section>
    <section class="print-section"><h2>出土紀錄</h2><table class="print-table"><thead><tr><th>次數</th><th>出土時間</th></tr></thead><tbody>${soilRows}</tbody></table></section>
    <section class="print-section"><h2>深度確認</h2><table class="print-table"><thead><tr><th>次數</th><th>確認時間</th><th>深度（m）</th><th>與設計差異（m）</th></tr></thead><tbody>${depthRows}</tbody></table></section>
    <section class="print-section"><h2>05｜前置紀錄時間紀錄</h2><table class="print-table"><thead><tr><th>項次</th><th>作業項目</th><th>開始時間</th><th>完成時間</th></tr></thead><tbody>${phaseRows}</tbody></table></section>${printFooter()}`;

  const pouringRows = truckRows.length ? truckRows.map(row => `<tr>
    <td>${row.index + 1}</td><td>${esc(row.truckNo)}</td><td>${esc(row.unload)}</td><td>${esc(row.finish)}</td><td>${fixed(row.volume)}</td><td>${fixed(row.cumulative)}</td><td>${fixed(row.expected)}</td><td>${fixed(row.measured)}</td><td>${fixed(row.difference)}</td>
  </tr>`).join("") : `<tr><td colspan="9" class="print-empty">尚無澆置紀錄</td></tr>`;
  $("#print-pouring").innerHTML = `${printHeader("澆置紀錄", "06")}
    <section class="print-section"><h2>澆置主控摘要</h2><div class="print-summary">
      <div><span>車次</span><strong>${truckRows.length} 車</strong></div>
      <div><span>逐車累積量</span><strong>${fixed(lastTruck?.cumulative ?? 0)} m³</strong></div>
      <div><span>設計／實際數量</span><strong>${esc(display(state.wall.designVolume))} ／ ${esc(display(state.wall.actualVolume))} m³</strong></div>
      <div><span>預估／實測／差異</span><strong>${fixed(lastTruck?.expected ?? null)} ／ ${fixed(lastTruck?.measured ?? null)} ／ ${fixed(lastTruck?.difference ?? null)} m</strong></div>
    </div></section>
    <section class="print-section"><h2>逐車混凝土澆置紀錄</h2><table class="print-table"><thead><tr><th>車次</th><th>車號</th><th>卸料</th><th>結束</th><th>方量<br />m³</th><th>累積<br />m³</th><th>預估高度<br />m</th><th>實測高度<br />m</th><th>差異<br />m</th></tr></thead><tbody>${pouringRows}</tbody></table></section>${printFooter()}`;

  const trenchRows = state.trench.checks.map((check, index) => `<tr><td>${index + 1}</td><td class="text-left">${esc(check.item)}</td><td class="text-left">${esc(check.standard)}</td><td class="text-left">${esc(display(check.actual))}</td><td>${esc(check.result)}</td></tr>`).join("");
  $("#print-trench").innerHTML = `${printHeader("導溝施工複核表", "07", state.trench.project, state.trench.unitNo || "未指定單元")}
    <section class="print-section"><h2>基本資料</h2><div class="print-meta-grid three">
      <div><span>工程名稱</span><strong>${esc(display(state.trench.project))}</strong></div>
      <div><span>施工廠商</span><strong>${esc(display(state.trench.contractor))}</strong></div>
      <div><span>複核日期</span><strong>${esc(display(state.trench.date))}</strong></div>
      <div><span>單元編號</span><strong>${esc(display(state.trench.unitNo))}</strong></div>
      <div><span>營造廠複核人</span><strong>${esc(display(state.trench.reviewer))}</strong></div>
      <div><span>複核意見</span><strong>${esc(display(state.trench.note))}</strong></div>
    </div></section>
    <section class="print-section"><h2>導溝複核項目</h2><table class="print-table checklist-print-table"><thead><tr><th>項次</th><th>複核項目</th><th>確認基準</th><th>現場紀錄／實測</th><th>結果</th></tr></thead><tbody>${trenchRows}</tbody></table></section>${printFooter()}`;

  const rebarRows = state.cage.rebars.length ? state.cage.rebars.map((rebar, index) => `<tr><td>${index + 1}</td><td class="text-left">${esc(rebar.part)}</td><td>${esc(display(rebar.designNo))}</td><td>${esc(display(rebar.designQty))}</td><td>${esc(display(rebar.actualNo))}</td><td>${esc(display(rebar.actualQty))}</td><td>${esc(rebar.result)}</td></tr>`).join("") : `<tr><td colspan="7" class="print-empty">尚無配筋項目</td></tr>`;
  const cageRows = state.cage.checks.map((check, index) => `<tr><td>${index + 1}</td><td class="text-left">${esc(check.item)}</td><td class="text-left">${esc(check.standard)}</td><td class="text-left">${esc(display(check.actual))}</td><td>${esc(check.result)}</td></tr>`).join("");
  $("#print-cage").innerHTML = `${printHeader("鋼筋籠吊放前複核表", "08", state.cage.project, [state.cage.unitNo, state.cage.cageNo].filter(Boolean).join("｜") || "未指定鋼筋籠")}
    <section class="print-section"><h2>基本資料</h2><div class="print-meta-grid three compact-meta">
      <div><span>工程名稱</span><strong>${esc(display(state.cage.project))}</strong></div>
      <div><span>複核日期</span><strong>${esc(display(state.cage.date))}</strong></div>
      <div><span>營造廠複核人</span><strong>${esc(display(state.cage.reviewer))}</strong></div>
      <div><span>單元編號</span><strong>${esc(display(state.cage.unitNo))}</strong></div>
      <div><span>鋼筋籠編號</span><strong>${esc(display(state.cage.cageNo))}</strong></div>
      <div><span>複核意見</span><strong>${esc(display(state.cage.note))}</strong></div>
    </div></section>
    <section class="print-section compact-print-section"><h2>配筋複核明細</h2><table class="print-table cage-print-table"><thead><tr><th>項次</th><th>位置／用途</th><th>設計號數</th><th>設計數量／間距</th><th>實際號數</th><th>實際數量／間距</th><th>結果</th></tr></thead><tbody>${rebarRows}</tbody></table></section>
    <section class="print-section compact-print-section"><h2>組裝與吊放條件</h2><table class="print-table cage-check-print-table"><thead><tr><th>項次</th><th>複核項目</th><th>確認基準</th><th>現場紀錄／實測</th><th>結果</th></tr></thead><tbody>${cageRows}</tbody></table></section>${printFooter()}`;
}

function exportPdf(scope) {
  renderPrint();
  document.body.dataset.printScope = scope;
  const current = activeTool === "unit" ? PRINT_TAB_GROUPS[activeTab] : PRINT_TAB_GROUPS[activeTool];
  $$('.print-page').forEach(page => page.classList.toggle("print-selected", page.dataset.printTab === current));
  $("#export-dialog").close();
  window.print();
}

function initialize() {
  setInitialInputs();
  $("#phase-select").innerHTML = PHASES.map(phase => `<option value="${phase.id}">${esc(phase.label)}</option>`).join("");
  renderPhaseEditor();
  renderAll();
  syncAllDateTimeDisplays();
  showTab("overview");

  document.addEventListener("input", event => {
    if (event.target.matches('input[type="date"], input[type="time"]')) syncDateTimeDisplay(event.target);
    const input = event.target.closest("[data-bind]");
    if (input) {
      const [group, key] = input.dataset.bind.split(".");
      state[group][key] = input.value;
      if (group === "wall") updateWallCalculation();
      else if (group === "overview") updateIdentity();
      return;
    }
    const meta = event.target.closest("[data-check-bind]");
    if (meta) {
      const [type, key] = meta.dataset.checkBind.split(".");
      state[type][key] = meta.value;
      updateIdentity();
      return;
    }
    const qualityMeta = event.target.closest("[data-quality-bind]");
    if (qualityMeta) {
      state.quality[qualityMeta.dataset.qualityBind] = qualityMeta.value;
      return;
    }
    const check = event.target.closest("[data-check-item]");
    if (check) state[check.dataset.checkItem].checks[Number(check.dataset.checkIndex)][check.dataset.checkField] = check.value;
    const qualityCheck = event.target.closest("[data-quality-item]");
    if (qualityCheck) state.quality.checks[Number(qualityCheck.dataset.qualityItem)][qualityCheck.dataset.qualityField] = qualityCheck.value;
  });

  document.addEventListener("change", event => {
    const input = event.target.closest("[data-bind]");
    if (input?.type === "radio") {
      const [group, key] = input.dataset.bind.split(".");
      state[group][key] = input.value;
      updateIdentity();
      return;
    }
    const check = event.target.closest("[data-check-item]");
    if (check) {
      const type = check.dataset.checkItem;
      state[type].checks[Number(check.dataset.checkIndex)][check.dataset.checkField] = check.value;
      if (check.dataset.checkField === "result") renderCheckCards(type);
    }
    const qualityCheck = event.target.closest("[data-quality-item]");
    if (qualityCheck) {
      state.quality.checks[Number(qualityCheck.dataset.qualityItem)][qualityCheck.dataset.qualityField] = qualityCheck.value;
      if (qualityCheck.dataset.qualityField === "result") renderQuality();
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

  $("#project-tool-button").addEventListener("click", () => $("#record-switcher").scrollIntoView({ behavior: "smooth", block: "start" }));
  $("#help-button").addEventListener("click", () => $("#help-dialog").showModal());
  $("#clear-button").addEventListener("click", () => $("#clear-dialog").showModal());
  $("#confirm-clear").addEventListener("click", clearAllData);
  $("#export-button").addEventListener("click", () => {
    $("#export-current-label").textContent = currentExportLabel();
    $("#export-dialog").showModal();
  });
  $$('[data-close-dialog]').forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
  $$('[data-export-scope]').forEach(button => button.addEventListener("click", () => exportPdf(button.dataset.exportScope)));
  $$('[data-select-tool]').forEach(button => button.addEventListener("click", () => showTool(button.dataset.selectTool)));

  $("#add-soil").addEventListener("click", () => openSoilDialog());
  $("#add-depth").addEventListener("click", () => openDepthDialog());
  $("#add-truck").addEventListener("click", () => openTruckDialog());
  $("#add-rebar").addEventListener("click", () => openRebarDialog());

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

  $("#rebar-form").addEventListener("submit", event => {
    event.preventDefault();
    const record = {
      part: $("#rebar-part").value.trim(),
      designNo: $("#rebar-design-no").value.trim(),
      designQty: $("#rebar-design-qty").value.trim(),
      actualNo: $("#rebar-actual-no").value.trim(),
      actualQty: $("#rebar-actual-qty").value.trim(),
      result: $("#rebar-result").value
    };
    if (editIndex.rebar === null) state.cage.rebars.push(record);
    else state.cage.rebars[editIndex.rebar] = record;
    $("#rebar-dialog").close();
    renderRebars();
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
    const editRebar = event.target.closest("[data-edit-rebar]");
    const deleteRebar = event.target.closest("[data-delete-rebar]");
    if (editSoil) openSoilDialog(Number(editSoil.dataset.editSoil));
    else if (deleteSoil) removeRecord("soil", Number(deleteSoil.dataset.deleteSoil));
    else if (editDepth) openDepthDialog(Number(editDepth.dataset.editDepth));
    else if (deleteDepth) removeRecord("depth", Number(deleteDepth.dataset.deleteDepth));
    else if (editTruck) openTruckDialog(Number(editTruck.dataset.editTruck));
    else if (deleteTruck) removeRecord("truck", Number(deleteTruck.dataset.deleteTruck));
    else if (editRebar) openRebarDialog(Number(editRebar.dataset.editRebar));
    else if (deleteRebar) removeRebar(Number(deleteRebar.dataset.deleteRebar));
  });

  $("#undo-button").addEventListener("click", () => {
    if (undoAction) undoAction();
    clearTimeout(undoTimer);
    undoAction = null;
    $("#undo-toast").hidden = true;
  });

  window.addEventListener("afterprint", () => { document.body.dataset.printScope = "none"; });
  showTool("unit");
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("./sw.js").catch(() => {});
}

initialize();
