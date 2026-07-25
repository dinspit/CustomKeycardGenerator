const IMAGES = {
  KeycardCustomSite02: "assets/Keycard_CustomSite02.png",
  KeycardCustomMetalCase: "assets/Keycard_CustomSite02.png",
  KeycardCustomTaskForce: "assets/Keycard_Operative.png",
  KeycardCustomManagement: "assets/Custom_Managment.png"
};

const TYPE_LABELS = {
  KeycardCustomSite02: "SITE-02",
  KeycardCustomMetalCase: "METAL CASE",
  KeycardCustomTaskForce: "TASK FORCE",
  KeycardCustomManagement: "MANAGEMENT"
};

const COLORS = {
  con: "#c0181a",
  arm: "#2f74b8",
  adm: "#c49a2c"
};

const PIP_LAYOUT = {
  KeycardCustomSite02: { left: 3.1, top: 30.3, width: 42.4, height: 65.3, gap: 11 },
  KeycardCustomMetalCase: { left: 3.1, top: 30.3, width: 42.4, height: 65.3, gap: 11 },
  KeycardCustomTaskForce: { left: 3.5, top: 44.3, width: 31, height: 50, gap: 13.5 },
  KeycardCustomManagement: { left: 22.8, top: 48.9, width: 29.1, height: 45.9, gap: 15 }
};

const LS_KEY = "ckrp_local_presets_v3";

const SERVER_PRESETS = [
  { name: "Директор участка", dept: "Административная служба", role: "Директор Участка", type: "KeycardCustomMetalCase", color: "#960030", adm: 3, arm: 3, con: 3 },
  { name: "Рук. исследований", dept: "Научная служба", role: "Руководитель", type: "KeycardCustomMetalCase", color: "#c89020", adm: 3, arm: 1, con: 3 },
  { name: "Ст. научный сотр.", dept: "Научная служба", role: "Ст. Научный Сотр.", type: "KeycardCustomSite02", color: "#c89020", adm: 1, arm: 0, con: 3 },
  { name: "Научный сотрудник", dept: "Научная служба", role: "Научный Сотрудник", type: "KeycardCustomSite02", color: "#c89020", adm: 1, arm: 0, con: 2 },
  { name: "Куратор SCP", dept: "Научная служба", role: "Куратор SCP-000", type: "KeycardCustomSite02", color: "#c89020", adm: 1, arm: 2, con: 3 },
  { name: "Командир МОГ", dept: "Мобильная Оперативная Группа", role: "Командир МОГ", type: "KeycardCustomTaskForce", color: "#1e3a8a", adm: 3, arm: 3, con: 3 },
  { name: "Оперативник МОГ", dept: "Мобильная Оперативная Группа", role: "Оперативник", type: "KeycardCustomTaskForce", color: "#1e3a8a", adm: 1, arm: 2, con: 2 },
  { name: "Нач. охраны", dept: "Служба безопасности", role: "Начальник Охраны", type: "KeycardCustomSite02", color: "#4a6741", adm: 2, arm: 3, con: 2 },
  { name: "Охранник", dept: "Служба безопасности", role: "Рядовой", type: "KeycardCustomSite02", color: "#4a6741", adm: 0, arm: 2, con: 1 },
  { name: "Инженер", dept: "Инженерно-технический отд.", role: "Инженер", type: "KeycardCustomSite02", color: "#00ad76", adm: 1, arm: 0, con: 3 },
  { name: "IT-специалист", dept: "Инженерно-технический отд.", role: "IT-Специалист", type: "KeycardCustomSite02", color: "#00ad76", adm: 1, arm: 0, con: 2 },
  { name: "Логист", dept: "Логистическая служба", role: "Логист", type: "KeycardCustomSite02", color: "#0048ad", adm: 0, arm: 0, con: 1 },
  { name: "Менеджер зон", dept: "Административная служба", role: "Менеджер Зон Содержания", type: "KeycardCustomManagement", color: "#2c5f5f", adm: 3, arm: 1, con: 2 }
];

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const clamp = (v, a, b) => Math.min(b, Math.max(a, Number.isFinite(v) ? v : 0));
const isHex = (s) => /^#[\da-fA-F]{6}$/.test(s);
const cmdSafe = (s) => String(s).trim().replace(/\s+/g, "_");

const refs = {
  cardId: $("cardId"),
  kcName: $("kcName"),
  dept: $("dept"),
  role: $("role"),
  cardType: $("cardType"),
  cardColor: $("cardColor"),
  colorHex: $("colorHex"),
  admLvl: $("admLvl"),
  armLvl: $("armLvl"),
  conLvl: $("conLvl"),
  cmdOut: $("cmdOut"),
  copyBtn: $("copyBtn"),
  stageLabel: $("stageLabel"),
  cardWrap: $("cardWrap"),
  serverGrid: $("serverGrid"),
  localGrid: $("localGrid"),
  localEmpty: $("localEmpty"),
  localPane: $("localPane"),
  serverPane: $("serverPane"),
  modalBg: $("modalBg"),
  presetNameInput: $("presetNameInput"),
  importFile: $("importFile")
};

function makeStepper(input, minusId, plusId) {
  $(minusId).addEventListener("click", () => {
    input.value = clamp(Number(input.value) - 1, 0, 3);
    update();
  });
  $(plusId).addEventListener("click", () => {
    input.value = clamp(Number(input.value) + 1, 0, 3);
    update();
  });
  input.addEventListener("input", () => {
    input.value = clamp(Number(input.value), 0, 3);
    update();
  });
}

function stateFromInputs() {
  const color = isHex(refs.colorHex.value) ? refs.colorHex.value : refs.cardColor.value;
  return {
    type: refs.cardType.value,
    color,
    adm: clamp(Number(refs.admLvl.value), 0, 3),
    arm: clamp(Number(refs.armLvl.value), 0, 3),
    con: clamp(Number(refs.conLvl.value), 0, 3),
    id: refs.cardId.value.trim() || "0",
    kcName: refs.kcName.value.trim() || "Ключ-Карта",
    dept: refs.dept.value.trim() || "Департамент",
    role: refs.role.value.trim() || "%Role%"
  };
}

function rowSpec(type) {
  if (type === "KeycardCustomManagement") {
    return {
      levels: (adm, arm, con) => [con, arm, adm],
      colors: [COLORS.con, COLORS.arm, COLORS.adm]
    };
  }
  return {
    levels: (adm, arm, con) => [adm, arm, con],
    colors: [COLORS.adm, COLORS.arm, COLORS.con]
  };
}

function buildPips(type, adm, arm, con) {
  const spec = rowSpec(type);
  const levels = spec.levels(adm, arm, con);
  let html = "";
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const lit = col >= 3 - levels[row];
      html += lit
        ? `<div class="pip lit" style="--pc:${spec.colors[row]}"></div>`
        : `<div class="pip"></div>`;
    }
  }
  return html;
}

function pipsStyle(type) {
  const v = PIP_LAYOUT[type] || PIP_LAYOUT.KeycardCustomSite02;
  return `left:${v.left}%;top:${v.top}%;width:${v.width}%;height:${v.height}%;gap:${v.gap}%;`;
}

function cardHtml(st) {
  const src = IMAGES[st.type] || IMAGES.KeycardCustomSite02;
  const pips = buildPips(st.type, st.adm, st.arm, st.con);
  const dept = esc(st.dept);
  const role = esc(st.role);

  if (st.type === "KeycardCustomTaskForce") {
    return `
      <img class="card-base" src="${src}" alt="">
      <div class="ov ov-tf">
        <div class="tint" style="background:${st.color}"></div>
        <div class="pips" style="${pipsStyle(st.type)}">${pips}</div>
      </div>`;
  }

  if (st.type === "KeycardCustomManagement") {
    return `
      <img class="card-base" src="${src}" alt="">
      <div class="ov ov-mgmt">
        <div class="bar" style="background:${st.color}">
          <div class="mgmt-text">
            <div class="dept">${dept}</div>
            <div class="role">${role}</div>
          </div>
        </div>
        <div class="pips" style="${pipsStyle(st.type)}">${pips}</div>
      </div>`;
  }

  const metal = st.type === "KeycardCustomMetalCase"
    ? " style=\"filter:contrast(1.05) saturate(0.9) brightness(0.88)\""
    : "";

  return `
    <img class="card-base" src="${src}" alt=""${metal}>
    <div class="ov ov-std">
      <div class="bar" style="background:${st.color}"></div>
      <div class="dept">${dept}</div>
      <div class="role">${role}</div>
      <div class="pips" style="${pipsStyle(st.type)}">${pips}</div>
    </div>`;
}

function commandString(st) {
  return `ckrp add ${st.type} ${st.con} ${st.adm} ${st.arm} ${cmdSafe(st.dept)} ${cmdSafe(st.role)} ${st.color} ${cmdSafe(st.kcName)} ${st.id}`;
}

function update() {
  const st = stateFromInputs();
  refs.cardColor.value = st.color;
  if (isHex(refs.colorHex.value) || !refs.colorHex.value) {
    refs.colorHex.value = st.color;
  }
  refs.cardWrap.innerHTML = cardHtml(st);
  refs.stageLabel.textContent = TYPE_LABELS[st.type] || st.type;
  refs.cmdOut.textContent = commandString(st);
}

function makePipsDots(level, color) {
  return Array.from({ length: 3 }, (_, i) =>
    `<span class="pp${i < level ? " on" : ""}" style="--col:${color}"></span>`
  ).join("");
}

function makePresetCard(preset, onClick, withDelete, onDelete) {
  const el = document.createElement("article");
  el.className = "preset";
  el.style.setProperty("--pc", preset.color);
  el.innerHTML = `
    <div class="preset-name">${esc(preset.name)}</div>
    <div class="preset-dept">${esc((preset.dept || "").slice(0, 42))}</div>
    <div class="ppips">
      ${makePipsDots(preset.con, COLORS.con)}<span class="sep"></span>
      ${makePipsDots(preset.arm, COLORS.arm)}<span class="sep"></span>
      ${makePipsDots(preset.adm, COLORS.adm)}
    </div>`;
  el.addEventListener("click", onClick);
  if (withDelete) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "del";
    btn.textContent = "✕";
    btn.title = "Удалить";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onDelete();
    });
    el.appendChild(btn);
  }
  return el;
}

function applyPreset(preset) {
  refs.cardType.value = preset.type;
  refs.kcName.value = preset.kcName || String(preset.role || "").replace(/\s+/g, "_");
  refs.dept.value = preset.dept || "";
  refs.role.value = preset.role || "";
  refs.cardColor.value = preset.color;
  refs.colorHex.value = preset.color;
  refs.admLvl.value = clamp(Number(preset.adm), 0, 3);
  refs.armLvl.value = clamp(Number(preset.arm), 0, 3);
  refs.conLvl.value = clamp(Number(preset.con), 0, 3);
  update();
}

function readLocalPresets() {
  try {
    const data = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeLocalPresets(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function renderServerPresets() {
  refs.serverGrid.innerHTML = "";
  SERVER_PRESETS.forEach((preset) => {
    refs.serverGrid.appendChild(makePresetCard(preset, () => applyPreset(preset), false));
  });
}

function renderLocalPresets() {
  const data = readLocalPresets();
  refs.localGrid.innerHTML = "";
  refs.localEmpty.hidden = data.length > 0;
  data.forEach((preset, idx) => {
    refs.localGrid.appendChild(makePresetCard(
      preset,
      () => applyPreset(preset),
      true,
      () => {
        const next = readLocalPresets();
        next.splice(idx, 1);
        writeLocalPresets(next);
        renderLocalPresets();
      }
    ));
  });
}

function openSaveModal() {
  refs.presetNameInput.value = refs.role.value.trim() || "Шаблон";
  refs.modalBg.hidden = false;
  refs.presetNameInput.focus();
}

function closeSaveModal() {
  refs.modalBg.hidden = true;
}

function savePreset() {
  const name = refs.presetNameInput.value.trim();
  if (!name) {
    refs.presetNameInput.focus();
    return;
  }
  const st = stateFromInputs();
  const data = readLocalPresets();
  data.push({
    name,
    dept: st.dept,
    role: st.role,
    kcName: st.kcName,
    type: st.type,
    color: st.color,
    adm: st.adm,
    arm: st.arm,
    con: st.con
  });
  writeLocalPresets(data);
  renderLocalPresets();
  closeSaveModal();
  switchTab("local");
}

function clearPresets() {
  if (!confirm("Удалить все локальные шаблоны?")) return;
  writeLocalPresets([]);
  renderLocalPresets();
}

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  refs.serverPane.hidden = tab !== "server";
  refs.localPane.hidden = tab !== "local";
  if (tab === "local") renderLocalPresets();
}

async function copyCommand() {
  const text = refs.cmdOut.textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  const prev = refs.copyBtn.textContent;
  refs.copyBtn.className = "btn btn-ok";
  refs.copyBtn.textContent = "Скопировано";
  setTimeout(() => {
    refs.copyBtn.className = "btn btn-main";
    refs.copyBtn.textContent = prev || "Скопировать";
  }, 1400);
}

function exportPresets() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    current: stateFromInputs(),
    localPresets: readLocalPresets()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ckrp-presets-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function normalizePreset(raw) {
  if (!raw || typeof raw !== "object") return null;
  const type = String(raw.type || "");
  if (!IMAGES[type]) return null;
  return {
    name: String(raw.name || raw.role || "Шаблон").slice(0, 40),
    dept: String(raw.dept || ""),
    role: String(raw.role || "%Role%"),
    kcName: String(raw.kcName || raw.role || "Ключ-Карта"),
    type,
    color: isHex(raw.color) ? raw.color : "#528198",
    adm: clamp(Number(raw.adm), 0, 3),
    arm: clamp(Number(raw.arm), 0, 3),
    con: clamp(Number(raw.con), 0, 3)
  };
}

function importPresets(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || "{}"));
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.localPresets)
          ? data.localPresets
          : [];
      const incoming = list.map(normalizePreset).filter(Boolean);
      if (!incoming.length && !data.current) {
        alert("В файле нет подходящих шаблонов.");
        return;
      }
      if (incoming.length) {
        const merged = readLocalPresets().concat(incoming);
        writeLocalPresets(merged);
        renderLocalPresets();
        switchTab("local");
      }
      if (data.current) {
        const current = normalizePreset({ ...data.current, name: "current" });
        if (current) applyPreset(current);
      }
    } catch {
      alert("Не удалось прочитать JSON.");
    }
  };
  reader.readAsText(file);
}

function bindEvents() {
  makeStepper(refs.conLvl, "conMinus", "conPlus");
  makeStepper(refs.armLvl, "armMinus", "armPlus");
  makeStepper(refs.admLvl, "admMinus", "admPlus");

  ["cardId", "kcName", "dept", "role", "cardType"].forEach((id) => {
    $(id).addEventListener("input", update);
  });

  refs.cardColor.addEventListener("input", () => {
    refs.colorHex.value = refs.cardColor.value;
    update();
  });

  refs.colorHex.addEventListener("input", () => {
    if (isHex(refs.colorHex.value)) {
      refs.cardColor.value = refs.colorHex.value;
      update();
    }
  });

  refs.copyBtn.addEventListener("click", copyCommand);
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
  $("savePresetBtn").addEventListener("click", openSaveModal);
  $("clearPresetsBtn").addEventListener("click", clearPresets);
  $("cancelSaveBtn").addEventListener("click", closeSaveModal);
  $("confirmSaveBtn").addEventListener("click", savePreset);
  $("exportBtn").addEventListener("click", exportPresets);
  $("importBtn").addEventListener("click", () => refs.importFile.click());
  refs.importFile.addEventListener("change", () => {
    const file = refs.importFile.files && refs.importFile.files[0];
    if (file) importPresets(file);
    refs.importFile.value = "";
  });

  refs.modalBg.addEventListener("click", (e) => {
    if (e.target === refs.modalBg) closeSaveModal();
  });
  refs.presetNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") savePreset();
    if (e.key === "Escape") closeSaveModal();
  });
}

bindEvents();
renderServerPresets();
update();
