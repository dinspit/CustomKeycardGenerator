const IMAGES = {
  KeycardCustomSite02: "assets/Keycard_CustomSite02.png",
  KeycardCustomMetalCase: "assets/Keycard_CustomSite02.png",
  KeycardCustomTaskForce: "assets/Keycard_Operative.png",
  KeycardCustomManagement: "assets/Custom_Managment.png"
};

const TYPE_LABELS = {
  KeycardCustomSite02: "SITE-02 / СТАНДАРТНАЯ",
  KeycardCustomMetalCase: "METAL CASE / КЕЙС",
  KeycardCustomTaskForce: "TASK FORCE / ОПЕРАТИВНИК",
  KeycardCustomManagement: "MANAGEMENT / УПРАВЛЕНИЕ"
};

const ROW_COLORS = ["#d4aa4a", "#4a8ed4", "#c0181a"];
const LS_KEY = "ckrp_local_presets_v2";
const PIP_LAYOUT = {
  KeycardCustomSite02: { left: 1.4, top: 29.8, width: 44.8, height: 63.8, gap: 2.7 },
  KeycardCustomMetalCase: { left: 1.4, top: 29.8, width: 44.8, height: 63.8, gap: 2.7 },
  KeycardCustomTaskForce: { left: 3.8, top: 42.9, width: 39.2, height: 49.1, gap: 4.0 },
  KeycardCustomManagement: { left: 1.9, top: 40.3, width: 45.4, height: 49.2, gap: 3.0 }
};

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
const clamp = (v, min, max) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : 0));
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
  presetNameInput: $("presetNameInput")
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
  const type = refs.cardType.value;
  const color = isHex(refs.colorHex.value) ? refs.colorHex.value : refs.cardColor.value;
  return {
    type,
    color,
    adm: clamp(Number(refs.admLvl.value), 0, 3),
    arm: clamp(Number(refs.armLvl.value), 0, 3),
    con: clamp(Number(refs.conLvl.value), 0, 3),
    id: refs.cardId.value.trim() || "0",
    kcName: refs.kcName.value.trim() || "Ключ-Карта",
    dept: refs.dept.value.trim() || "Департамент",
    role: refs.role.value.trim() || "Роль"
  };
}

function buildPips(adm, arm, con) {
  const levels = [adm, arm, con];
  let html = "";
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const lit = col >= 3 - levels[row];
      const color = ROW_COLORS[row];
      html += `<div class="pip${lit ? " lit" : ""}"${lit ? ` style="--pc:${color}"` : ""}></div>`;
    }
  }
  return html;
}

function pipsStyleFor(type) {
  const v = PIP_LAYOUT[type] || PIP_LAYOUT.KeycardCustomSite02;
  return `left:${v.left}%;top:${v.top}%;width:${v.width}%;height:${v.height}%;gap:${v.gap}%;`;
}

function cardHtml(st) {
  const src = IMAGES[st.type] || IMAGES.KeycardCustomSite02;
  const pips = buildPips(st.adm, st.arm, st.con);
  const dept = esc(st.dept);
  const role = esc(st.role);

  if (st.type === "KeycardCustomTaskForce") {
    return `
      <img class="card-base" src="${src}" alt="TaskForce">
      <div class="ov ov-tf">
        <div class="tint" style="background:${st.color}"></div>
        <div class="pips" style="${pipsStyleFor(st.type)}">${pips}</div>
      </div>
    `;
  }

  if (st.type === "KeycardCustomManagement") {
    return `
      <img class="card-base" src="${src}" alt="Management">
      <div class="ov ov-mgmt">
        <div class="bar" style="background:${st.color}"></div>
        <div class="dept">${dept}</div>
        <div class="role">${role}</div>
        <div class="pips" style="${pipsStyleFor(st.type)}">${pips}</div>
      </div>
    `;
  }

  const metalFilter = st.type === "KeycardCustomMetalCase" ? " style='filter:contrast(1.04) saturate(0.92) brightness(0.9)'" : "";
  return `
    <img class="card-base" src="${src}" alt="Site02"${metalFilter}>
    <div class="ov ov-std">
      <div class="bar" style="background:${st.color}"></div>
      <div class="dept">${dept}</div>
      <div class="role">${role}</div>
      <div class="pips" style="${pipsStyleFor(st.type)}">${pips}</div>
    </div>
  `;
}

function commandString(st) {
  return `ckrp add ${st.type} ${st.con} ${st.adm} ${st.arm} ${cmdSafe(st.dept)} ${cmdSafe(st.role)} ${st.color} ${cmdSafe(st.kcName)} ${st.id}`;
}

function update() {
  const st = stateFromInputs();
  refs.cardColor.value = st.color;
  refs.colorHex.value = st.color;
  refs.cardWrap.innerHTML = cardHtml(st);
  refs.stageLabel.textContent = TYPE_LABELS[st.type] || st.type;
  refs.cmdOut.textContent = commandString(st);
}

function makePresetCard(preset, onClick, withDelete, onDelete) {
  const el = document.createElement("article");
  el.className = "preset";
  el.style.setProperty("--pc", preset.color);
  el.innerHTML = `
    <div class="preset-name">${esc(preset.name)}</div>
    <div class="preset-dept">${esc((preset.dept || "").slice(0, 44))}</div>
    <div class="ppips">
      ${makePipsDots(preset.adm, "#d4aa4a")}<span class="sep"></span>
      ${makePipsDots(preset.arm, "#4a8ed4")}<span class="sep"></span>
      ${makePipsDots(preset.con, "#c0181a")}
    </div>
  `;
  el.addEventListener("click", onClick);

  if (withDelete) {
    const btn = document.createElement("button");
    btn.className = "del";
    btn.type = "button";
    btn.textContent = "✕";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onDelete();
    });
    el.appendChild(btn);
  }
  return el;
}

function makePipsDots(level, color) {
  return Array.from({ length: 3 }, (_, i) => `<span class="pp${i < level ? " on" : ""}" style="--col:${color}"></span>`).join("");
}

function applyPreset(preset) {
  refs.cardType.value = preset.type;
  refs.kcName.value = preset.kcName || preset.role.replace(/\s+/g, "_");
  refs.dept.value = preset.dept;
  refs.role.value = preset.role;
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
    refs.serverGrid.appendChild(makePresetCard(preset, () => applyPreset(preset), false, null));
  });
}

function renderLocalPresets() {
  const data = readLocalPresets();
  refs.localGrid.innerHTML = "";
  refs.localEmpty.style.display = data.length ? "none" : "block";
  data.forEach((preset, idx) => {
    refs.localGrid.appendChild(makePresetCard(
      preset,
      () => applyPreset(preset),
      true,
      () => {
        const fresh = readLocalPresets();
        fresh.splice(idx, 1);
        writeLocalPresets(fresh);
        renderLocalPresets();
      }
    ));
  });
}

function openSaveModal() {
  refs.presetNameInput.value = refs.role.value.trim();
  refs.modalBg.classList.add("open");
  refs.presetNameInput.focus();
}

function closeSaveModal() {
  refs.modalBg.classList.remove("open");
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
}

function clearPresets() {
  if (!confirm("Удалить все локальные шаблоны?")) {
    return;
  }
  writeLocalPresets([]);
  renderLocalPresets();
}

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  refs.serverPane.style.display = tab === "server" ? "" : "none";
  refs.localPane.style.display = tab === "local" ? "" : "none";
  if (tab === "local") {
    renderLocalPresets();
  }
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
  refs.copyBtn.className = "btn btn-ok";
  refs.copyBtn.textContent = "✓ Скопировано";
  setTimeout(() => {
    refs.copyBtn.className = "btn btn-red";
    refs.copyBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"></path></svg> Скопировать`;
  }, 1600);
}

function bindEvents() {
  makeStepper(refs.admLvl, "admMinus", "admPlus");
  makeStepper(refs.armLvl, "armMinus", "armPlus");
  makeStepper(refs.conLvl, "conMinus", "conPlus");

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
    }
    update();
  });

  refs.copyBtn.addEventListener("click", copyCommand);
  document.querySelectorAll(".tab").forEach((btn) => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
  $("savePresetBtn").addEventListener("click", openSaveModal);
  $("clearPresetsBtn").addEventListener("click", clearPresets);
  $("cancelSaveBtn").addEventListener("click", closeSaveModal);
  $("confirmSaveBtn").addEventListener("click", savePreset);
  refs.modalBg.addEventListener("click", (e) => {
    if (e.target === refs.modalBg) {
      closeSaveModal();
    }
  });
  refs.presetNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      savePreset();
    }
  });

}

bindEvents();
renderServerPresets();
update();
