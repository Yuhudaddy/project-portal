const APP_VERSION = "1.0-rebar";
const localDate = new Date();
const today = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
const STATUS_OPTIONS = ["待確認", "合格", "不合格", "不適用"];
const MEMBER_TYPES = ["柱", "牆", "梁", "板", "基礎／地梁"];
const BAR_KINDS = ["主筋", "箍筋", "水平筋", "垂直筋", "腰筋", "繫筋", "開口補強筋", "角隅補強筋", "其他"];
const BAR_SIZES = ["D10", "D13", "D16", "D19", "D22", "D25", "D29", "D32", "D35", "D38", "D41", "D51"];

const MATERIAL_CHECKS = [
  ["radiation", "無輻射證明", "鋼筋進場應有無輻射污染證明文件", "文件編號／日期"],
  ["millCert", "材料證明與爐號", "鋼筋材質、強度、號數及爐號可追溯，符合合約與圖說", "填寫文件或爐號"],
  ["physical", "物理性檢驗", "抗拉強度、降伏強度、伸長率等檢驗結果符合核定標準", "填寫試驗報告編號"],
  ["chemical", "化學性檢驗", "化學成分檢驗結果符合核定標準", "填寫試驗報告編號"],
  ["storage", "進場堆置與防鏽", "鋼筋分類堆置、離地墊高，無明顯油污、泥砂或鏽蝕影響使用", "填寫堆置狀況"],
  ["coupler", "機械式續接器文件", "使用續接器時，型錄、試驗報告及施工方式已確認；未使用請選不適用", "文件編號／不適用"],
  ["drawing", "配筋圖與現場版本", "施工圖、配筋表及現場放樣版本一致，變更已完成核准", "填寫圖號／版次"]
];

const PLACEMENT_CHECKS = {
  柱: [
    ["main", "主筋強度／號數／支數", "主筋材質、號數及支數符合配筋圖；現場數值應與構件資訊一致", "例如：D25 × 12 支"],
    ["xy", "X／Y 向配置", "長短向主筋配置、位置及排列符合配筋圖", "填寫 X／Y 配置"],
    ["horizontal", "水平淨間距 ch", "ch ≥ max{4 cm、1.5db、1.33dagg}", "填寫實測最小值（cm）"],
    ["vertical", "垂直淨間距 cv", "上下層主筋垂直淨間距控制於 2.5～4 cm", "填寫實測值（cm）"],
    ["ties", "箍筋號數／間距／彎鉤", "箍筋號數、間距、彎鉤方向及 135° 彎鉤符合配筋圖", "例如：D13@10、135°"],
    ["waist", "腰筋配置", "腰筋號數、數量及位置符合配筋圖", "填寫號數／數量"],
    ["spacer", "間隔器與保護層", "間隔器數量及位置足以維持設計保護層", "填寫保護層實測（cm）"]
  ],
  牆: [
    ["thickness", "牆厚與筋號／間距", "牆厚、水平筋與垂直筋號數及間距符合配筋圖", "填寫設計／實測值"],
    ["lap", "搭接位置與長度", "搭接位置避開不利區域，搭接長度符合配筋圖及核定標準", "填寫位置／長度（cm）"],
    ["anchorage", "柱牆、梁牆錨定", "柱牆及梁牆交界之牆筋確實錨定，彎鉤方向正確", "填寫錨定確認"],
    ["spacer", "間隔器與保護層", "牆筋間隔器配置足夠，保護層厚度符合圖說", "填寫保護層實測（cm）"],
    ["opening", "開口補強筋", "門窗、機電及其他開口補強筋號數、長度及位置符合圖說", "填寫補強筋資訊"],
    ["corner", "T 字／轉角補強筋", "T 字交界、牆端及轉角補強筋已配置", "填寫補強筋資訊"],
    ["starter", "牆壁預留筋", "預留筋位置及長度正確，未伸出構件外造成碰撞", "填寫預留筋確認"],
    ["induced", "誘導裂縫截斷", "設計誘導裂縫位置之鋼筋已依圖說截斷或處理", "填寫位置／不適用"]
  ],
  梁: [
    ["main", "主筋強度／號數／支數", "梁主筋材質、號數及支數符合配筋圖", "例如：D25 上 3／下 4"],
    ["ties", "箍筋與腰筋", "箍筋、腰筋及增筋號數、間距與位置符合圖說", "填寫號數／間距"],
    ["sameLayer", "同層淨間距", "同層鋼筋淨間距 ≥ max{2.5 cm、1.5db、1.33dagg}", "填寫實測最小值（cm）"],
    ["doubleLayer", "雙層鋼筋淨距", "雙層鋼筋上下淨距 > 2.5 cm，排列整齊且無過度下垂", "填寫實測值（cm）"],
    ["lap", "搭接／伸展／彎鉤", "搭接位置、伸展長度及彎鉤符合圖說，避開塑鉸區", "填寫位置／長度（cm）"],
    ["coupler", "機械式續接位置", "續接位置距接頭不小於梁深 h／2，且避開塑鉸區；未使用請選不適用", "填寫位置／距離（cm）"],
    ["opening", "梁側穿孔補強", "梁側穿孔及套管位置、尺寸與補強筋符合圖說", "填寫開孔／補強資訊"],
    ["piping", "梁內配管介面", "配管不得削弱保護層、鋼筋配置或造成應力集中", "填寫介面確認"]
  ],
  板: [
    ["thickness", "板厚", "板厚與降板位置符合結構圖及建築完成面", "填寫設計／實測（cm）"],
    ["short", "短向鋼筋號數／間距", "短向鋼筋號數、間距及層位符合配筋圖", "例如：D13@15"],
    ["long", "長向鋼筋號數／間距", "長向鋼筋號數、間距及層位符合配筋圖", "例如：D13@20"],
    ["direction", "長短向配置方向", "長短向鋼筋依主結構方向配置，支承與跨距方向正確", "填寫方向確認"],
    ["lap", "搭接位置", "板筋搭接位置及長度符合圖說，錯開配置", "填寫位置／長度（cm）"],
    ["positive", "正彎矩鋼筋延伸", "正彎矩鋼筋延伸至板邊交界至少 15 cm 並確實錨定", "填寫實測長度（cm）"],
    ["cover", "保護層與間隔器", "保護層厚度及間隔器配置符合圖說", "填寫保護層實測（cm）"],
    ["corner", "角隅補強筋", "板角隅補強筋號數、長度及位置符合標準圖", "填寫補強筋資訊"],
    ["opening", "開口補強筋", "板上開口四周補強筋符合圖說，未任意截斷主筋", "填寫開口／補強資訊"]
  ],
  "基礎／地梁": [
    ["main", "上下層主筋號數／支數", "基礎或地梁上下層主筋號數、支數及位置符合配筋圖", "填寫號數／支數"],
    ["ties", "箍筋／繫筋", "箍筋、繫筋號數與間距符合圖說，彎鉤方向正確", "填寫號數／間距"],
    ["anchorage", "柱筋、牆筋錨定", "柱筋、牆筋及地梁主筋錨定長度符合圖說", "填寫錨定長度（cm）"],
    ["spacing", "鋼筋淨間距", "鋼筋間距足以確保混凝土澆置及搗實，符合圖說", "填寫最小淨間距（cm）"],
    ["cover", "底部與側面保護層", "底部及側面墊塊、間隔器足夠，保護層符合圖說", "填寫保護層實測（cm）"],
    ["opening", "開口／套管補強", "穿梁、集水坑、設備開口及套管補強完成", "填寫補強資訊"]
  ]
};

const DETAIL_CHECKS = {
  柱: [["lap", "主筋搭接與接頭位置", "接頭位置、搭接長度及主筋偏折符合圖說；接頭內偏折不得超過 1／6"], ["development", "主筋伸展與錨定", "梁柱接頭及柱腳主筋伸展、彎鉤與錨定完成"], ["cover", "保護層實測", "柱側保護層與間隔器配置符合圖說", "填寫實測值（cm）"], ["torque", "續接器扭力／試驗", "使用機械式續接器時，扭力或試驗紀錄已確認；未使用請選不適用", "填寫試驗／扭力紀錄"]],
  牆: [["lap", "水平／垂直筋搭接", "搭接位置、長度及錯開方式符合圖說", "填寫位置／長度（cm）"], ["anchorage", "牆筋錨定", "柱牆、梁牆及牆端錨定長度符合圖說", "填寫錨定確認"], ["cover", "牆筋保護層", "牆兩側保護層及間隔器配置符合圖說", "填寫實測值（cm）"], ["coupler", "牆筋續接器", "使用續接器時，位置、規格及試驗紀錄已確認；未使用請選不適用", "填寫續接器資訊"]],
  梁: [["lap", "搭接與伸展長度", "搭接位置避開塑鉸區，伸展長度與彎鉤符合圖說", "填寫位置／長度（cm）"], ["coupler", "機械式續接", "續接位置距接頭不小於 h／2，且有施工及試驗紀錄；未使用請選不適用", "填寫距離／紀錄"], ["cover", "梁側與梁底保護層", "間隔器配置足夠，梁側及梁底保護層符合圖說", "填寫實測值（cm）"], ["coordination", "機電配管介面", "配管與鋼筋、保護層及梁柱接頭無衝突", "填寫介面確認"]],
  板: [["lap", "板筋搭接與錨定", "搭接位置、長度及板邊錨定符合圖說", "填寫位置／長度（cm）"], ["cover", "板筋保護層", "上、下層鋼筋保護層及馬椅筋高度符合圖說", "填寫實測值（cm）"], ["opening", "開口及角隅補強", "開口、板角及降板處補強筋已完成且固定", "填寫補強確認"], ["coordination", "機電套管介面", "套管位置不任意截斷主筋，補強與固定完成", "填寫介面確認"]],
  "基礎／地梁": [["lap", "主筋搭接與伸展", "搭接位置、長度及柱牆錨定符合圖說", "填寫位置／長度（cm）"], ["cover", "保護層與墊塊", "底部及側面保護層實測符合圖說", "填寫實測值（cm）"], ["coordination", "設備開口介面", "集水坑、套管及設備開口補強完成", "填寫介面確認"]]
};

const RELEASE_CHECKS = [
  ["drawing", "配筋圖與現場版本一致", "圖號、版次及變更紀錄已確認"],
  ["material", "材料文件已完成", "材質、爐號、試驗及無輻射證明已備妥"],
  ["placement", "主筋與箍筋配置完成", "號數、數量、間距、方向及位置已複核"],
  ["joint", "搭接／錨定／續接完成", "接頭位置、長度、續接器及彎鉤已確認"],
  ["cover", "保護層與間隔器完成", "墊塊、間隔器及馬椅筋可維持設計保護層"],
  ["openings", "開口、套管與補強完成", "結構及機電介面不衝突，補強筋未遺漏"],
  ["clean", "澆置面清潔完成", "鋼筋內無木屑、泥砂、積水及其他雜物"],
  ["vendor", "廠商自主檢查完成", "專業廠商已提出自主檢查與缺失改善紀錄"]
];

const TAB_LABELS = { overview: "工程概要", members: "構件資訊", material: "材料與施工前", placement: "鋼筋配置", detail: "接頭／保護層", release: "澆置前放行" };
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const esc = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const display = value => String(value ?? "").trim() || "—";
const formatDate = value => { const [y, m, d] = String(value ?? "").split("-"); return y && m && d ? `${y}/${m}/${d}` : ""; };
const statusOptions = selected => STATUS_OPTIONS.map(item => `<option value="${item}" ${item === selected ? "selected" : ""}>${item}</option>`).join("");
const barSizeOptions = selected => [`<option value="" ${!selected ? "selected" : ""}>選擇號數</option>`, ...BAR_SIZES.map(item => `<option value="${item}" ${item === selected ? "selected" : ""}>${item}</option>`)].join("");

function createMember() { return { id: "", type: "柱", grid: "", strength: "SD420", width: "", height: "", cover: "", bars: [{ kind: "主筋", size: "", count: "", spacing: "", note: "" }], checks: {}, detailChecks: {} }; }
function createState() { return { overview: { project: "", contractor: "", date: today, inspectionDate: today, reviewer: "", floor: "", drawing: "", stage: "綁紮完成" }, members: [createMember()], activeMember: 0, material: {}, release: { checks: {}, decision: "待放行", decisionNote: "" } }; }
let state = createState();
let activeTab = "overview";

function activeMember() { return state.members[state.activeMember] || null; }
function ensureMember(member) { [...(PLACEMENT_CHECKS[member.type] || []), ...(DETAIL_CHECKS[member.type] || [])].forEach(item => { const target = (PLACEMENT_CHECKS[member.type] || []).includes(item) ? member.checks : member.detailChecks; const id = item[0]; if (!target[id]) target[id] = { actual: "", result: "待確認" }; }); }
function syncDateDisplay(input) { const displayEl = input.closest(".native-field-wrap")?.querySelector(".native-field-display"); if (!displayEl) return; displayEl.textContent = input.value ? formatDate(input.value) : "尚未選擇日期"; displayEl.classList.toggle("is-empty", !input.value); }
function syncDateDisplays() { $$('input[type="date"]').forEach(syncDateDisplay); }
function updateIdentity() { const member = activeMember(); $("#record-identity").textContent = member && (member.id || member.type) ? [state.overview.floor, member.type, member.id].filter(Boolean).join("｜") : "尚未指定構件"; }
function bindGeneralInputs() { $$('[data-bind]').forEach(input => { const [group, key] = input.dataset.bind.split("."); input.value = state[group][key] ?? ""; }); $$('[data-release-bind]').forEach(input => { input.value = state.release[input.dataset.releaseBind] ?? ""; }); syncDateDisplays(); }

function renderBars(member, memberIndex) {
  return `<div class="bar-entry-wrap"><div class="bar-entry-head"><strong>配筋資料</strong><span>鋼筋號數由選單選擇；僅需輸入數量／支數與間距</span><button class="add-button compact-button" type="button" data-add-bar="${memberIndex}">＋新增鋼筋</button></div><div class="bar-entry-list">${member.bars.map((bar, barIndex) => `<div class="bar-entry"><label class="field"><span>類別</span><select data-bar-field="kind" data-member-index="${memberIndex}" data-bar-index="${barIndex}">${BAR_KINDS.map(item => `<option value="${item}" ${item === bar.kind ? "selected" : ""}>${item}</option>`).join("")}</select></label><label class="field"><span>鋼筋號數</span><select data-bar-field="size" data-member-index="${memberIndex}" data-bar-index="${barIndex}">${barSizeOptions(bar.size)}</select></label><label class="field"><span>數量／支數</span><input type="number" min="0" step="1" data-bar-field="count" data-member-index="${memberIndex}" data-bar-index="${barIndex}" value="${esc(bar.count)}" placeholder="例如：12" /></label><label class="field"><span>間距（cm）</span><input type="number" min="0" step="0.5" data-bar-field="spacing" data-member-index="${memberIndex}" data-bar-index="${barIndex}" value="${esc(bar.spacing)}" placeholder="例如：15" /></label><label class="field bar-note"><span>備註</span><input type="text" data-bar-field="note" data-member-index="${memberIndex}" data-bar-index="${barIndex}" value="${esc(bar.note)}" placeholder="位置／層位" /></label>${member.bars.length > 1 ? `<button class="bar-remove" type="button" data-remove-bar="${memberIndex}" data-bar-index="${barIndex}">移除</button>` : ""}</div>`).join("")}</div></div>`;
}

function renderMembers() {
  $("#member-count").textContent = `${state.members.length} 個構件`;
  $("#member-list").innerHTML = state.members.map((member, index) => { ensureMember(member); return `<article class="member-card" data-member-card="${index}"><div class="member-card-header"><strong>構件 ${index + 1}</strong>${state.members.length > 1 ? `<button type="button" data-remove-member="${index}">移除</button>` : ""}</div><div class="form-grid"><label class="field"><span>構件類型</span><select data-member-field="type" data-member-index="${index}">${MEMBER_TYPES.map(type => `<option value="${type}" ${member.type === type ? "selected" : ""}>${type}</option>`).join("")}</select></label><label class="field"><span>構件編號</span><input type="text" data-member-field="id" data-member-index="${index}" value="${esc(member.id)}" placeholder="例如：C1-03／B2" /></label><label class="field"><span>軸線／位置</span><input type="text" data-member-field="grid" data-member-index="${index}" value="${esc(member.grid)}" placeholder="例如：A-1／B～C" /></label><label class="field"><span>鋼筋強度</span><input type="text" data-member-field="strength" data-member-index="${index}" value="${esc(member.strength)}" placeholder="例如：SD420" /></label><label class="field"><span>設計寬度／厚度（cm）</span><input type="text" data-member-field="width" data-member-index="${index}" value="${esc(member.width)}" placeholder="例如：30" /></label><label class="field"><span>設計高度（cm）</span><input type="text" data-member-field="height" data-member-index="${index}" value="${esc(member.height)}" placeholder="例如：60" /></label><label class="field"><span>設計保護層（cm）</span><input type="text" data-member-field="cover" data-member-index="${index}" value="${esc(member.cover)}" placeholder="例如：4" /></label><label class="field"><span>圖說備註</span><input type="text" data-member-field="note" data-member-index="${index}" value="${esc(member.note || "")}" placeholder="構件特殊條件" /></label></div>${renderBars(member, index)}</article>`; }).join("");
  renderSelectors(); updateIdentity();
}
function renderSelectors() { const options = state.members.map((member, index) => `<option value="${index}" ${index === state.activeMember ? "selected" : ""}>${index + 1}. ${member.type}｜${esc(member.id || "未編號")}</option>`).join("") || `<option value="">尚未新增構件</option>`; ["#active-member", "#detail-member"].forEach(selector => { $(selector).innerHTML = options; $(selector).disabled = !state.members.length; }); const member = activeMember(); $("#active-member-summary").textContent = member ? `${member.type}｜${member.id || "未編號"}${member.grid ? `｜${member.grid}` : ""}` : "尚未新增構件"; }

function renderCheckCard(check, index, collection, record) { const actual = record?.actual || ""; const result = record?.result || "待確認"; return `<article class="check-card ${result === "不合格" ? "is-failed" : result !== "待確認" ? "is-passed" : "is-pending"}"><div><h4>${index + 1}. ${esc(check[1])}</h4><p>${esc(check[2])}</p></div><div class="check-card-fields"><label class="field"><span>紀錄／實測</span><input type="text" data-check-actual="${collection}" data-check-id="${esc(check[0])}" value="${esc(actual)}" placeholder="${esc(check[3] || "填寫現場結果")}" /></label><label class="field result-field"><span>結果</span><select data-check-result="${collection}" data-check-id="${esc(check[0])}">${statusOptions(result)}</select></label></div></article>`; }
function renderMaterial() { const completed = MATERIAL_CHECKS.filter(item => state.material[item[0]]?.result !== "待確認" && state.material[item[0]]?.result).length; $("#material-progress").textContent = `${completed} / ${MATERIAL_CHECKS.length}`; $("#material-pending").textContent = String(MATERIAL_CHECKS.length - completed); $("#material-check-list").innerHTML = MATERIAL_CHECKS.map((item, index) => renderCheckCard(item, index, "material", state.material[item[0]])).join(""); }
function renderPlacement() { const member = activeMember(); if (!member) { $("#placement-check-list").innerHTML = `<div class="empty-state">請先在「構件資訊」新增構件。</div>`; return; } ensureMember(member); const checks = PLACEMENT_CHECKS[member.type] || []; $("#placement-heading").textContent = `${member.type}｜鋼筋配置項目`; $("#placement-check-list").innerHTML = checks.map((item, index) => renderCheckCard(item, index, "placement", member.checks[item[0]])).join(""); const complete = checks.filter(item => member.checks[item[0]]?.result !== "待確認").length; $("#placement-progress").textContent = `${complete} / ${checks.length}`; $("#placement-pending").textContent = String(checks.length - complete); }
function renderDetail() { const member = activeMember(); if (!member) { $("#detail-check-list").innerHTML = `<div class="empty-state">請先在「構件資訊」新增構件。</div>`; return; } ensureMember(member); const checks = DETAIL_CHECKS[member.type] || []; $("#detail-check-list").innerHTML = checks.map((item, index) => renderCheckCard(item, index, "detail", member.detailChecks[item[0]])).join(""); }
function renderRelease() { const complete = RELEASE_CHECKS.filter(item => state.release.checks[item[0]]?.result !== "待確認").length; $("#release-progress").textContent = `${complete} / ${RELEASE_CHECKS.length}`; $("#release-pending").textContent = String(RELEASE_CHECKS.length - complete); $("#release-check-list").innerHTML = RELEASE_CHECKS.map((item, index) => renderCheckCard(item, index, "release", state.release.checks[item[0]])).join(""); $$('[data-release-bind]').forEach(input => { input.value = state.release[input.dataset.releaseBind] ?? ""; }); }
function renderAll() { renderMembers(); renderMaterial(); renderPlacement(); renderDetail(); renderRelease(); bindGeneralInputs(); syncDateDisplays(); }
function setTab(tab) { activeTab = tab; $$('[role="tab"]').forEach(button => { const selected = button.dataset.tab === tab; button.setAttribute("aria-selected", selected ? "true" : "false"); button.tabIndex = selected ? 0 : -1; }); $$(".tab-panel").forEach(panel => { panel.hidden = panel.id !== `panel-${tab}`; }); if (tab === "material") renderMaterial(); if (tab === "placement") renderPlacement(); if (tab === "detail") renderDetail(); if (tab === "release") renderRelease(); $("#active-tab-label").textContent = TAB_LABELS[tab]; document.body.dataset.activeTab = tab; }

function updateCheck(collection, id, key, value) { if (collection === "material") { state.material[id] ||= { actual: "", result: "待確認" }; state.material[id][key] = value; } else if (collection === "release") { state.release.checks[id] ||= { actual: "", result: "待確認" }; state.release.checks[id][key] = value; } else { const member = activeMember(); if (!member) return; const target = collection === "detail" ? member.detailChecks : member.checks; target[id] ||= { actual: "", result: "待確認" }; target[id][key] = value; } }
function updateMemberField(index, key, value) { if (!state.members[index]) return; state.members[index][key] = value; }
function exportObject() { return { schema: "project-portal.rebar-review.v1", exported_at: new Date().toISOString(), tool: "RC鋼筋工程營造廠施工查驗", overview: { ...state.overview }, members: state.members.map(member => ({ ...member, bars: member.bars.map(bar => ({ ...bar })), checks: { ...member.checks }, detailChecks: { ...member.detailChecks } })), material: { ...state.material }, release: { ...state.release, checks: { ...state.release.checks } } }; }
function fileDownload(filename, content, type) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function markdownExport() { const lines = ["# 鋼筋工程查驗表", "", `- 工程名稱：${display(state.overview.project)}`, `- 施工廠商：${display(state.overview.contractor)}`, `- 檢查日期：${display(state.overview.inspectionDate)}`, "", "## 構件與配筋"]; state.members.forEach((member, index) => { lines.push(`\n### ${index + 1}. ${member.type}｜${display(member.id)}`); lines.push(`- 強度：${display(member.strength)}；尺寸：${display(member.width)} × ${display(member.height)} cm；保護層：${display(member.cover)} cm`); lines.push(`- 配筋：${member.bars.map(bar => `${bar.kind} ${display(bar.size)} ${display(bar.count)}支 @${display(bar.spacing)}cm`).join("；")}`); }); lines.push("", "## 材料與施工前"); MATERIAL_CHECKS.forEach(item => lines.push(`- ${item[1]}：${display(state.material[item[0]]?.actual)}（${display(state.material[item[0]]?.result)}）`)); lines.push("", "## 澆置前放行", `- 判定：${state.release.decision}`, `- 備註：${display(state.release.decisionNote)}`); return lines.join("\n"); }
function printHeader(title, sequence) { const member = activeMember(); const identity = [state.overview.floor, member?.type, member?.id].filter(Boolean).join("｜") || "未指定構件"; return `<header class="print-document-header"><div><p>RC REBAR / FIELD REVIEW / ${sequence}</p><h1>${esc(title)}</h1></div><div class="print-header-meta"><strong>${esc(display(state.overview.project))}<br />${esc(identity)}</strong><img class="print-logo" src="./taisei.png" alt="" /></div></header>`; }
function printFooter() { return `<footer class="print-footer">資料版本：${APP_VERSION}｜輸出時間：${esc(new Date().toLocaleString("zh-TW", { hour12: false }))}<br />本文件為營造廠現場查驗紀錄，正式效力依公司簽核流程辦理。</footer>`; }
function printValue(value) { return esc(display(value)); }
function checkRows(items, getRecord) { return items.map((item, index) => { const record = getRecord(item[0]) || {}; return `<tr><td>${index + 1}</td><td class="text-left">${printValue(item[1])}</td><td class="text-left">${printValue(item[2])}</td><td class="text-left">${printValue(record.actual)}</td><td>${printValue(record.result)}</td></tr>`; }).join(""); }
function renderPrint() {
  const overviewMeta = [["工程名稱", state.overview.project], ["施工廠商", state.overview.contractor], ["施工日期", state.overview.date], ["檢查日期", state.overview.inspectionDate], ["填表人", state.overview.reviewer], ["檢查樓層／區域", state.overview.floor], ["施工圖／版次", state.overview.drawing], ["查驗階段", state.overview.stage]];
  const memberRows = state.members.map((m, i) => `<tr><td>${i + 1}</td><td>${printValue(m.type)}</td><td>${printValue(m.id)}</td><td class="text-left">${printValue(m.grid)}</td><td>${printValue(m.strength)}</td><td>${printValue(m.width)}</td><td>${printValue(m.height)}</td><td>${printValue(m.cover)}</td></tr>`).join("");
  const barRows = state.members.flatMap((m, i) => m.bars.map((bar, j) => `<tr><td>${i + 1}.${j + 1}</td><td class="text-left">${printValue(m.type)}｜${printValue(m.id)}</td><td>${printValue(bar.kind)}</td><td>${printValue(bar.size)}</td><td>${printValue(bar.count)}</td><td>${printValue(bar.spacing)}</td><td class="text-left">${printValue(bar.note)}</td></tr>`)).join("");
  $("#print-template-overview").innerHTML = `${printHeader("鋼筋工程查驗表", "01–02")}<section class="print-section"><h2>01｜工程概要</h2><div class="print-meta-grid three">${overviewMeta.map(([label, value]) => `<div><span>${label}</span><strong>${printValue(value)}</strong></div>`).join("")}</div></section><section class="print-section"><h2>02｜構件資訊</h2><table class="print-table"><thead><tr><th>項次</th><th>類型</th><th>構件編號</th><th>軸線／位置</th><th>強度</th><th>寬／厚<br />cm</th><th>高度<br />cm</th><th>保護層<br />cm</th></tr></thead><tbody>${memberRows}</tbody></table></section><section class="print-section"><h2>配筋資料</h2><table class="print-table"><thead><tr><th>構件</th><th>類型／編號</th><th>鋼筋類別</th><th>號數</th><th>數量／支數</th><th>間距<br />cm</th><th>備註</th></tr></thead><tbody>${barRows}</tbody></table></section>${printFooter()}`;
  $("#print-template-material").innerHTML = `${printHeader("材料與施工前查驗", "03")}<section class="print-section"><h2>03｜材料與施工前</h2><table class="print-table"><thead><tr><th>項次</th><th>檢查項目</th><th>判定標準</th><th>紀錄／實測</th><th>結果</th></tr></thead><tbody>${checkRows(MATERIAL_CHECKS, id => state.material[id])}</tbody></table></section>${printFooter()}`;
  const placementRows = state.members.flatMap((member, memberIndex) => (PLACEMENT_CHECKS[member.type] || []).map((item, index) => { const r = member.checks[item[0]] || {}; return `<tr><td>${memberIndex + 1}.${index + 1}</td><td class="text-left">${printValue(member.type)}｜${printValue(member.id)}</td><td class="text-left">${printValue(item[1])}</td><td class="text-left">${printValue(item[2])}</td><td class="text-left">${printValue(r.actual)}</td><td>${printValue(r.result)}</td></tr>`; })).join("");
  $("#print-template-placement").innerHTML = `${printHeader("鋼筋配置查驗", "04")}<section class="print-section"><h2>04｜鋼筋配置</h2><table class="print-table"><thead><tr><th>項次</th><th>構件</th><th>檢查項目</th><th>判定標準</th><th>紀錄／實測</th><th>結果</th></tr></thead><tbody>${placementRows}</tbody></table></section>${printFooter()}`;
  const detailRows = state.members.flatMap((member, memberIndex) => (DETAIL_CHECKS[member.type] || []).map((item, index) => { const r = member.detailChecks[item[0]] || {}; return `<tr><td>${memberIndex + 1}.${index + 1}</td><td class="text-left">${printValue(member.type)}｜${printValue(member.id)}</td><td class="text-left">${printValue(item[1])}</td><td class="text-left">${printValue(item[2])}</td><td class="text-left">${printValue(r.actual)}</td><td>${printValue(r.result)}</td></tr>`; })).join("");
  $("#print-template-detail").innerHTML = `${printHeader("接頭／保護層查驗", "05")}<section class="print-section"><h2>05｜接頭／保護層</h2><table class="print-table"><thead><tr><th>項次</th><th>構件</th><th>檢查項目</th><th>判定標準</th><th>紀錄／實測</th><th>結果</th></tr></thead><tbody>${detailRows}</tbody></table></section>${printFooter()}`;
  $("#print-template-release").innerHTML = `${printHeader("鋼筋澆置前放行", "06")}<section class="print-section"><h2>06｜澆置前放行</h2><table class="print-table"><thead><tr><th>項次</th><th>檢查項目</th><th>判定標準</th><th>紀錄／說明</th><th>結果</th></tr></thead><tbody>${checkRows(RELEASE_CHECKS, id => state.release.checks[id])}</tbody></table></section><section class="print-section"><h2>放行判定</h2><div class="print-summary"><div><span>澆置判定</span><strong>${printValue(state.release.decision)}</strong></div><div><span>備註</span><strong>${printValue(state.release.decisionNote)}</strong></div></div></section>${printFooter()}`;
}
function exportPdf(scope) { renderPrint(); document.body.dataset.printScope = scope; const page = activeTab === "overview" || activeTab === "members" ? "overview" : activeTab; $$(".print-page").forEach(item => item.classList.toggle("print-selected", item.dataset.printPage === page)); $("#export-dialog").close(); window.print(); }
function clearAll() { state = createState(); activeTab = "overview"; renderAll(); setTab("overview"); $("#clear-dialog").close(); }

function handleEvent(event) {
  const target = event.target;
  if (target.matches("[data-bind]")) { const [group, key] = target.dataset.bind.split("."); state[group][key] = target.value; }
  if (target.matches("[data-release-bind]")) state.release[target.dataset.releaseBind] = target.value;
  if (target.matches("[data-member-field]")) { updateMemberField(Number(target.dataset.memberIndex), target.dataset.memberField, target.value); if (target.dataset.memberField === "type") { const member = state.members[Number(target.dataset.memberIndex)]; member.checks = {}; member.detailChecks = {}; ensureMember(member); renderMembers(); renderPlacement(); renderDetail(); } else updateIdentity(); }
  if (target.matches("[data-bar-field]")) { const member = state.members[Number(target.dataset.memberIndex)]; if (member?.bars[Number(target.dataset.barIndex)]) member.bars[Number(target.dataset.barIndex)][target.dataset.barField] = target.value; }
  if (target.matches("[data-check-actual]")) { updateCheck(target.dataset.checkActual, target.dataset.checkId, "actual", target.value); if (event.type === "change") { renderMaterial(); renderPlacement(); renderDetail(); renderRelease(); } }
  if (target.matches("[data-check-result]")) { updateCheck(target.dataset.checkResult, target.dataset.checkId, "result", target.value); renderMaterial(); renderPlacement(); renderDetail(); renderRelease(); }
  if (target.matches("[data-tab]")) setTab(target.dataset.tab);
  if (target.matches("#active-member, #detail-member")) { state.activeMember = Number(target.value) || 0; renderPlacement(); renderDetail(); renderSelectors(); updateIdentity(); }
}

document.addEventListener("input", handleEvent);
document.addEventListener("change", handleEvent);
document.addEventListener("click", event => {
  const target = event.target.closest("button, [data-remove-member], [data-remove-bar], [data-add-bar], [data-export], [data-close-dialog]");
  if (!target) return;
  if (target.matches("[data-tab]")) setTab(target.dataset.tab);
  if (target.matches("[data-remove-member]")) { state.members.splice(Number(target.dataset.removeMember), 1); state.activeMember = Math.min(state.activeMember, Math.max(0, state.members.length - 1)); renderAll(); }
  if (target.matches("[data-add-bar]")) { state.members[Number(target.dataset.addBar)]?.bars.push({ kind: "主筋", size: "", count: "", spacing: "", note: "" }); renderMembers(); }
  if (target.matches("[data-remove-bar]")) { const member = state.members[Number(target.dataset.removeBar)]; if (member?.bars.length > 1) member.bars.splice(Number(target.dataset.barIndex), 1); renderMembers(); }
  if (target.matches("[data-export]")) { const option = target.dataset.export; if (option === "current-pdf") exportPdf("current"); if (option === "all-pdf") exportPdf("all"); if (option === "json") { fileDownload(`rebar-review-${today}.json`, JSON.stringify(exportObject(), null, 2), "application/json;charset=utf-8"); $("#export-dialog").close(); } if (option === "markdown") { fileDownload(`rebar-review-${today}.md`, markdownExport(), "text/markdown;charset=utf-8"); $("#export-dialog").close(); } }
  if (target.matches("[data-close-dialog]")) target.closest("dialog")?.close();
  if (target.id === "add-member") { state.members.push(createMember()); state.activeMember = state.members.length - 1; renderAll(); setTab("members"); }
  if (target.id === "help-button") $("#help-dialog").showModal();
  if (target.id === "export-button") { renderPrint(); $("#export-dialog").showModal(); }
  if (target.id === "clear-button") $("#clear-dialog").showModal();
  if (target.id === "confirm-clear") clearAll();
});

renderAll();
setTab("overview");
