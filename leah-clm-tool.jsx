import React, { useState, useCallback, memo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  PALETTE
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0b0e14", bgCard: "#131820", bgPanel: "#181e28", bgInput: "#0d1117",
  border: "#252d3d", borderHi: "#3a4a62",
  amber: "#f0a500", amberDim: "#a87200", amberGlow: "rgba(240,165,0,.13)",
  green: "#22c55e", greenDim: "rgba(34,197,94,.13)",
  red: "#ef4444", redDim: "rgba(239,68,68,.13)",
  blue: "#3b82f6", blueDim: "rgba(59,130,246,.13)",
  purple: "#a855f7", purpleDim: "rgba(168,85,247,.13)",
  text: "#e2e8f0", textSub: "#94a3b8", textDim: "#2d3a52",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html,body,#root{height:100%;}
body{background:${C.bg};color:${C.text};font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;}
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:${C.borderHi};}

.spin{animation:spin .8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.fadeUp{animation:fadeUp .2s ease forwards;}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
.slideR{animation:slideR .28s cubic-bezier(.16,1,.3,1) forwards;}
@keyframes slideR{from{opacity:0;transform:translateX(28px);}to{opacity:1;transform:none;}}

.ch{transition:border-color .18s,box-shadow .18s,transform .12s;cursor:pointer;}
.ch:hover{border-color:${C.amber}!important;box-shadow:0 0 22px ${C.amberGlow};transform:translateY(-2px);}
.rh{transition:background .12s,border-color .15s;cursor:pointer;}
.rh:hover{background:${C.bgPanel}!important;border-color:${C.amber}!important;}

input,select,textarea{background:${C.bgInput};color:${C.text};border:1.5px solid ${C.border};border-radius:7px;padding:9px 13px;font-family:inherit;font-size:13px;width:100%;outline:none;transition:border-color .18s,box-shadow .18s;-webkit-appearance:none;appearance:none;}
input:focus,select:focus,textarea:focus{border-color:${C.amber};box-shadow:0 0 0 3px ${C.amberGlow};}
input[type=radio]{width:auto;accent-color:${C.amber};}
select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px;}
select option{background:${C.bgCard};}
button{cursor:pointer;font-family:inherit;transition:all .15s;border:none;}
button:disabled{opacity:.4;cursor:not-allowed;}

.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:99px;font-size:10.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;border:1px solid;white-space:nowrap;}
.ba{background:${C.amberGlow};color:${C.amber};border-color:${C.amberDim};}
.bg{background:${C.greenDim};color:${C.green};border-color:${C.green}44;}
.bb{background:${C.blueDim};color:${C.blue};border-color:${C.blue}44;}
.br{background:${C.redDim};color:${C.red};border-color:${C.red}44;}
.bx{background:#1e293b;color:${C.textSub};border-color:${C.border};}
.mono{font-family:'IBM Plex Mono',monospace;}

/* RESPONSIVE LAYOUTS */
.contract-grid { display: grid; grid-template-columns: 100px 90px 1fr auto 20px; gap: 0 14px; alignItems: center; }
.app-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 12px; }

@media (max-width: 768px) {
  .contract-grid { grid-template-columns: 1fr auto 20px; row-gap: 8px; }
  .hide-mob { display: none !important; }
  .mob-stack { flex-direction: column !important; align-items: stretch !important; }
  .app-grid { grid-template-columns: 1fr; }
  main { padding: 16px 14px !important; }
  header { padding: 0 14px !important; }
}
`;

// ─────────────────────────────────────────────────────────────────────────────
//  ICON PATHS
// ─────────────────────────────────────────────────────────────────────────────
const IC = {
  key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-1.5-8.7A7 7 0 0 0 5.3 10.5L3 12l2.3 1.5A7 7 0 0 0 10.5 19.2l.5 2.3h2l.5-2.3a7 7 0 0 0 5.2-5.2l2.3-.5v-2l-2.3-.5A7 7 0 0 0 13.5 6.3L13 4h-2Z",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z",
  close: "M6 6l12 12M6 18 18 6",
  edit: "M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15",
  back: "M19 12H5M12 19l-7-7 7-7",
  file: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z",
  layers: "M12 2l10 6-10 6L2 8l10-6zM2 14l10 6 10-6M2 19l10 6 10-6",
  warn: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  ok: "M20 6 9 17l-5-5",
  info: "M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  more: "M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7",
  eye: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm-9.7.65A7.08 7.08 0 0 1 12 7c2.7 0 5.02 1.48 6.7 3.65a1 1 0 0 1 0 .7C17.02 13.52 14.7 15 12 15s-5.02-1.48-6.7-3.65a1 1 0 0 1 0-.7z",
};

const Ico = memo(({ d, size = 15, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} fill="none" stroke={color} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d={d} />
  </svg>
));

// ─────────────────────────────────────────────────────────────────────────────
//  MINI UI
// ─────────────────────────────────────────────────────────────────────────────
const Spin = ({ size = 18, color = C.amber }) => (
  <svg className="spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity=".18" strokeWidth="3" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Btn = memo(({ children, onClick, v = "primary", disabled, loading, sm, full, style: s = {} }) => {
  const base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, border: "1.5px solid", borderRadius: 8, fontWeight: 700, fontFamily: "inherit", padding: sm ? "6px 14px" : "10px 20px", fontSize: sm ? 12 : 13.5, width: full ? "100%" : undefined, ...s };
  const V = {
    primary: { background: C.amber, borderColor: C.amber, color: "#0b0e14" },
    ghost: { background: "transparent", borderColor: C.border, color: C.text },
    danger: { background: C.redDim, borderColor: C.red + "66", color: C.red },
    success: { background: C.greenDim, borderColor: C.green + "66", color: C.green },
  };
  return (
    <button style={{ ...base, ...V[v] }} onClick={onClick} disabled={disabled || loading}>
      {loading && <Spin size={sm ? 12 : 14} color={v === "primary" ? "#0b0e14" : C.amber} />}
      {children}
    </button>
  );
});

const Label = ({ children, sub }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 5 }}>
    {children}{sub && <span style={{ color: C.amber, marginLeft: 4 }}>{sub}</span>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  API LAYER — CORRECT v1.9 SPEC ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────
const H = tok => ({ Authorization: `Bearer ${tok}`, "Content-Type": "application/json", Accept: "application/json" });

async function doAuth(cloud, tenant, user, pass) {
  const r = await fetch(`https://${cloud}/cpaimt_auth/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "password", username: user, password: pass, domain: tenant }),
  });
  if (!r.ok) { const t = await r.text(); throw new Error(`Auth ${r.status}: ${t.slice(0, 200)}`); }
  const d = await r.json();
  if (!d.access_token) throw new Error("No access_token returned");
  return d.access_token;
}

async function doAppTypes(cloud, tenant, tok, username) {
  const q = new URLSearchParams({ "filter.pageNo": "1", "filter.perPage": "100", "filter.requestorUsername": username });
  const r = await fetch(`https://${cloud}/cpaimt_api/api/${tenant}/v1/applicationtype?${q}`, { headers: H(tok) });
  if (!r.ok) throw new Error(`AppTypes ${r.status}`);
  const d = await r.json();
  return Array.isArray(d) ? d : (d.data || d.items || []);
}

async function doContractList(newApi, tenant, tok, { applicationTypeId, pageNo = 1, pageSize = 50, requestIdSearch = "" } = {}) {
  const q = new URLSearchParams({ pageNo: String(pageNo), pageSize: String(pageSize) });
  if (applicationTypeId) q.set("applicationTypeId", String(applicationTypeId));
  if (requestIdSearch) q.set("requestIdSearch", requestIdSearch);
  const url = `https://${newApi}/api/${tenant}/contract-request?${q}`;
  const r = await fetch(url, { headers: H(tok) });
  if (!r.ok) throw new Error(`ContractList ${r.status}: ${await r.text().catch(() => "")}`);
  return r.json();
}

async function doDetail(newApi, tenant, tok, id) {
  const r = await fetch(`https://${newApi}/api/${tenant}/contract-request/${id}`, { headers: H(tok) });
  if (r.status === 403) throw new Error(`403 Forbidden — no access to Request #${id}`);
  if (r.status === 404) throw new Error(`404 Not Found — Request #${id} doesn't exist`);
  if (!r.ok) throw new Error(`Detail ${r.status}: ${await r.text().catch(() => "")}`);
  const d = await r.json();
  return d.data || d;
}

async function doUpdate(newApi, tenant, tok, id, payload) {
  const url = `https://${newApi}/api/${tenant}/contract-request/${id}`;
  const r = await fetch(url, { method: "PUT", headers: H(tok), body: JSON.stringify(payload) });
  let body;
  try { body = await r.json(); } catch { body = {}; }
  if (!r.ok) {
    const errMsg = body?.errors || body?.Errors || body?.detail || body?.Detail || body?.message || body?.Message || JSON.stringify(body);
    throw new Error(`Update ${r.status}: ${typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg)}`);
  }
  return body;
}

async function doIntakeFields(newApi, tenant, tok, appTypeId) {
  try {
    const r = await fetch(`https://${newApi}/api/${tenant}/application-type/intake-form-field-groups?ApplicationTypeId=${appTypeId}&SkipFieldOptions=false`, { headers: H(tok) });
    if (!r.ok) return {};
    const d = await r.json();
    const map = {};
    const groups = d.data || d || [];
    (Array.isArray(groups) ? groups : []).forEach(g => {
      const secs = g.sections || [g];
      secs.forEach(s => { (s.fields || []).forEach(f => { if (f.fieldId) map[f.fieldId] = f; }); });
    });
    return map;
  } catch { return {}; }
}

// ─────────────────────────────────────────────────────────────────────────────
//  PAYLOAD BUILDER — STRICT PASS-THROUGH
// ─────────────────────────────────────────────────────────────────────────────
function buildUpdatePayload(detail, edits, username) {
  const customFields = [];
  (detail.customFieldGroups || []).forEach(g =>
    (g.customFields || []).forEach(f => {
      const val = edits[f.customFieldId] !== undefined ? edits[f.customFieldId] : f.customFieldValue;
      if (val !== null && val !== undefined && val !== "") {
        customFields.push({ customFieldId: f.customFieldId, customFieldValue: String(val) });
      }
    })
  );

  return {
    id: detail.id,
    applicationTypeId: detail.applicationTypeId,
    recordId: detail.recordId || 0,
    isUploadedContract: detail.isUploadedContract ?? false,
    assignees: (detail.assignees || []).map(a => ({
      userId: a.userId,
      departmentId: a.departmentId,
      functionId: a.functionId || null,
      isPrimary: a.isPrimary ?? true,
    })),
    requesterUser: {
      UserId: detail.requesterUser?.userId || detail.requestorId || detail.addedById,
      DepartmentId: detail.requesterUser?.departmentId || detail.requesterDepartmentId,
    },
    legalParties: (detail.legalParties || []).map(l => ({
      legalPartyId: l.legalPartyId,
      isPrimary: l.isPrimary ?? true,
    })),
    contractPriority: {
      priority: detail.contractPriority?.priority || false,
      priorityReason: detail.contractPriority?.priorityReason || ""
    },
    recordClassificationId: detail.recordClassificationId || 0,
    integrationId: detail.integrationId || [],
    clients: (detail.clients || []).map(c => ({
      clientId: c.clientId,
      isPrimary: c.isPrimary ?? true,
      addressDetailId: c.addressDetailId || null,
      contactNumberDetailId: c.contactNumberDetailId || null,
      emailDetailId: c.emailDetailId || null,
      contactNameDetailId: c.contactNameDetailId || null,
      roleId: c.roleId || null,
      customFields: c.customFields || [],
    })),
    requestorUsername: username,
    description: edits.__description !== undefined ? edits.__description : (detail.description || ""),
    isConfidential: detail.isConfidential ?? false,
    skipCustomFields: false,
    skipClientCustomFields: true,
    confidentialRecords: detail.confidentialRecords || [],
    customFields,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const PRIORITY_WORDS = ["dealer", "distributor", "agent"];
const isPri = at => PRIORITY_WORDS.some(w => (at.applicationTypeName || at.name || "").toLowerCase().includes(w));
const fmt = d => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const stageCls = s => {
  const l = (s || "").toLowerCase();
  if (l.includes("sign") || l.includes("signature")) return "ba";
  if (l.includes("review") || l.includes("approv") || l.includes("negotiat")) return "bb";
  if (l.includes("active") || l.includes("execut") || l.includes("complet")) return "bg";
  if (l.includes("terminat") || l.includes("expir") || l.includes("reject")) return "br";
  return "bx";
};

// ─────────────────────────────────────────────────────────────────────────────
//  SETTINGS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const SettingsModal = memo(({ cfg, onSave, onClose, err }) => {
  const [f, setF] = useState({ ...cfg });
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000aa", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, width: 500, maxWidth: "100%", boxShadow: "0 24px 80px #000a" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: C.amberGlow, border: `1px solid ${C.amberDim}`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico d={IC.key} size={16} color={C.amber} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 17 }}>API Connection</span>
          </div>
          <button onClick={onClose} style={{ background: "none", color: C.textSub, padding: 6, borderRadius: 6 }}><Ico d={IC.close} size={17} /></button>
        </div>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 9, padding: "11px 14px", marginBottom: 18, fontSize: 12, color: C.textSub, lineHeight: 1.6 }}>
          Auth: <span className="mono" style={{ color: C.amber }}>https://&#123;Cloud Instance&#125;/cpaimt_auth/auth/token</span><br />
          Contracts: <span className="mono" style={{ color: C.blue }}>https://&#123;New Cloud API&#125;/api/&#123;tenant&#125;/contract-request</span>
        </div>
        {[
          ["Cloud Instance (Auth + AppTypes)", "cloudInstance", "cloud20.contractpod.com", "text"],
          ["New Cloud API (Contracts + Update)", "newCloudApi", "cpai-productapi-pus20.azurewebsites.net", "text"],
          ["Tenant", "tenant", "pentair", "text"],
          ["Username", "username", "user@domain.com", "text"],
          ["Password", "password", "••••••••", "password"],
        ].map(([label, key, hint, type]) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <Label>{label}</Label>
            <input type={type} value={f[key] || ""} onChange={s(key)} placeholder={hint} autoComplete={key === "password" ? "current-password" : "off"} />
          </div>
        ))}
        {err && (
          <div style={{ background: C.redDim, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.red, marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Ico d={IC.warn} size={14} color={C.red} />{err}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <Btn v="ghost" sm onClick={onClose}>Cancel</Btn>
          <Btn sm onClick={() => onSave(f)}><Ico d={IC.key} size={13} color="#0b0e14" />Save & Connect</Btn>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
//  FIELD INPUT
// ─────────────────────────────────────────────────────────────────────────────
const FieldInput = memo(({ field, value, onChange, intakeMap }) => {
  const type = field.type || "";
  const intake = intakeMap?.[field.customFieldId];
  const options = intake
    ? (intake.selectOptions
      ? Object.entries(intake.selectOptions).map(([v, l]) => ({ value: v, label: l }))
      : (intake.values || []))
    : [];

  if (type === "RadioButton" || type === "Radio") {
    const opts = options.length > 0 ? options.map(o => o.label || o.value) : ["Yes", "No"];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {opts.map(opt => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, padding: "5px 12px", borderRadius: 6, border: `1.5px solid ${value === opt ? C.amber : C.border}`, background: value === opt ? C.amberGlow : "transparent" }}>
            <input type="radio" name={`r${field.customFieldId}`} checked={value === opt} onChange={() => onChange(opt)} style={{ width: "auto" }} />
            {opt}
          </label>
        ))}
        {value && !opts.includes(value) && (
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "5px 12px", borderRadius: 6, border: `1.5px solid ${C.amber}`, background: C.amberGlow }}>
            <input type="radio" checked readOnly style={{ width: "auto" }} />{value}
          </label>
        )}
        {value && <button onClick={() => onChange("")} style={{ fontSize: 11, color: C.textSub, background: "none", padding: "5px 10px", border: `1px solid ${C.border}`, borderRadius: 6 }}>Clear</button>}
      </div>
    );
  }

  if ((type === "Dropdown" || type === "Select") && options.length > 0) {
    return (
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {options.map(o => { const v = o.label || o.value; return <option key={v} value={v}>{v}</option>; })}
      </select>
    );
  }

  if (type === "Date") return <input type="date" value={String(value || "").split("T")[0] || ""} onChange={e => onChange(e.target.value)} />;
  if (type === "MultilineText" || type === "LongText") return <textarea rows={3} style={{ resize: "vertical" }} value={value} onChange={e => onChange(e.target.value)} />;
  if (type === "Number" || type === "Currency") return <input type="number" value={value} onChange={e => onChange(e.target.value)} />;

  return <input type="text" value={value} onChange={e => onChange(e.target.value)} />;
});

// ─────────────────────────────────────────────────────────────────────────────
//  EDIT DRAWER
// ─────────────────────────────────────────────────────────────────────────────
const EditDrawer = memo(({ detail, intakeMap, onClose, onSave, saving, saveErr, saveOk }) => {
  const [edits, setEdits] = useState({});
  const set = useCallback((id, v) => setEdits(p => ({ ...p, [id]: v })), []);

  const dirtyCount = Object.keys(edits).length;
  const groups = detail.customFieldGroups || [];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000077", zIndex: 800, display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div className="slideR" style={{ background: C.bgPanel, width: "min(700px, 100vw)", height: "100vh", display: "flex", flexDirection: "column", borderLeft: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ position: "sticky", top: 0, background: C.bgPanel, borderBottom: `1px solid ${C.border}`, padding: "15px 20px", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Ico d={IC.edit} size={15} color={C.amber} />
                <span style={{ fontWeight: 800, fontSize: 15.5 }}>Edit Contract</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 7, padding: "4px 11px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: .5 }}>Req ID</span>
                  <span className="mono" style={{ color: C.amber, fontSize: 14, fontWeight: 700 }}>#{detail.id}</span>
                </div>
                {detail.recordId ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 7, padding: "4px 11px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: .5 }}>Rec ID</span>
                    <span className="mono" style={{ color: C.blue, fontSize: 14, fontWeight: 700 }}>#{detail.recordId}</span>
                  </div>
                ) : null}
                <span className={`badge ${stageCls(detail.workflowStage)}`}>{detail.workflowStage || "—"}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", color: C.textSub, padding: 6, borderRadius: 6, marginLeft: 8, flexShrink: 0 }}><Ico d={IC.close} size={18} /></button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
            {[
              ["App Type", detail.applicationTypeName], ["Req Type", detail.requestType],
              ["Added By", detail.addedByName], ["Added On", fmt(detail.addedOn)],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 10, color: C.textSub, fontWeight: 700, textTransform: "uppercase", letterSpacing: .4, marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{v || "—"}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <Label>Description</Label>
            <textarea rows={2} style={{ resize: "vertical" }} value={edits.__description ?? (detail.description || "")} onChange={e => set("__description", e.target.value)} placeholder="Contract description…" />
          </div>

          {groups.length === 0 && <div style={{ textAlign: "center", padding: "20px 0", color: C.textSub, fontSize: 13 }}>No custom fields found.</div>}

          {groups.map(grp => (
            <div key={grp.id} style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 3, height: 14, background: C.amber, borderRadius: 2 }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: C.amber, textTransform: "uppercase", letterSpacing: .6 }}>{grp.name}</span>
                <span className="mono" style={{ fontSize: 10, color: C.textDim }}>({(grp.customFields || []).length})</span>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {(grp.customFields || []).map(field => {
                  const cur = edits[field.customFieldId] !== undefined ? edits[field.customFieldId] : (field.customFieldValue || "");
                  const dirty = edits[field.customFieldId] !== undefined && edits[field.customFieldId] !== (field.customFieldValue || "");
                  return (
                    <div key={field.customFieldId} style={{ background: C.bgCard, border: `1.5px solid ${dirty ? C.amber : C.border}`, borderRadius: 9, padding: "12px 14px", transition: "border-color .15s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <label style={{ fontSize: 12.5, fontWeight: 700, color: dirty ? C.amber : C.text, flex: 1, paddingRight: 10 }}>
                          {field.customFieldDisplayName}
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                          {dirty && <span className="badge ba" style={{ padding: "1px 6px", fontSize: 9 }}>EDITED</span>}
                          <span className="mono" style={{ fontSize: 9.5, color: C.textDim }}>ID:{field.customFieldId}</span>
                        </div>
                      </div>
                      <FieldInput field={field} value={cur} onChange={v => set(field.customFieldId, v)} intakeMap={intakeMap} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ position: "sticky", bottom: 0, background: C.bgPanel, borderTop: `1px solid ${C.border}`, padding: "14px 20px" }}>
          {saveErr && (
            <div style={{ background: C.redDim, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.red, marginBottom: 12, display: "flex", gap: 7, alignItems: "flex-start", wordBreak: "break-word" }}>
              <Ico d={IC.warn} size={14} color={C.red} /><span>{saveErr}</span>
            </div>
          )}
          {saveOk && (
            <div style={{ background: C.greenDim, border: `1px solid ${C.green}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.green, marginBottom: 12, display: "flex", gap: 7 }}>
              <Ico d={IC.ok} size={14} color={C.green} />Contract updated successfully!
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.textSub }}>{dirtyCount} field{dirtyCount !== 1 ? "s" : ""} modified</span>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn v="ghost" sm onClick={onClose}>Cancel</Btn>
              <Btn sm loading={saving} disabled={dirtyCount === 0} onClick={() => onSave(detail, edits)}>
                <Ico d={IC.save} size={13} color="#0b0e14" />Save Changes
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
//  CONTRACT ROW
// ─────────────────────────────────────────────────────────────────────────────
const ContractRow = memo(({ c, onClick }) => {
  const stage = c.workflowStage || c.stage || "—";
  const party = c.legalParties?.[0]?.name || c.clientName || c.description || `Request #${c.id}`;
  const by = c.assignees?.[0]?.userName || c.addedByName || "";

  return (
    <div className="rh" onClick={() => onClick(c)} style={{ border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", background: C.bgCard, marginBottom: 8 }}>
      <div className="contract-grid">
        <div className="hide-mob">
          <div style={{ fontSize: 9.5, color: C.textSub, fontWeight: 700, textTransform: "uppercase", letterSpacing: .4, marginBottom: 1 }}>Req ID</div>
          <div className="mono" style={{ color: C.amber, fontSize: 14, fontWeight: 700 }}>#{c.id}</div>
        </div>
        <div className="hide-mob">
          <div style={{ fontSize: 9.5, color: C.textSub, fontWeight: 700, textTransform: "uppercase", letterSpacing: .4, marginBottom: 1 }}>Rec ID</div>
          <div className="mono" style={{ color: c.recordId ? C.blue : C.textDim, fontSize: 12, fontWeight: 600 }}>{c.recordId ? `#${c.recordId}` : "—"}</div>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>
            <span className="mono hide-desktop" style={{ color: C.amber, fontSize: 12, marginRight: 6 }}>#{c.id}</span>{party}
          </div>
          <div style={{ fontSize: 11.5, color: C.textSub }}>{by}{by && c.addedOn ? " · " : ""}{c.addedOn ? fmt(c.addedOn) : ""}</div>
        </div>
        <span className={`badge ${stageCls(stage)}`}>{stage}</span>
        <Ico d={IC.edit} size={14} color={C.amber} />
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
//  APP TYPE CARD
// ─────────────────────────────────────────────────────────────────────────────
const AppTypeCard = memo(({ at, onClick }) => {
  const pri = isPri(at);
  return (
    <div className="ch" onClick={() => onClick(at)} style={{ border: `1.5px solid ${pri ? C.amberDim : C.border}`, borderRadius: 11, padding: "18px 18px 14px", background: pri ? `linear-gradient(135deg,${C.amberGlow},${C.bgCard} 70%)` : C.bgCard, position: "relative", overflow: "hidden" }}>
      {pri && <div style={{ position: "absolute", top: 0, right: 0, background: C.amber, color: "#0b0e14", fontSize: 9, fontWeight: 800, padding: "3px 10px", letterSpacing: 1, borderBottomLeftRadius: 7 }}>PRIORITY</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: pri ? C.amber + "28" : C.bgPanel, border: `1.5px solid ${pri ? C.amber : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ico d={IC.file} size={17} color={pri ? C.amber : C.textSub} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 13, lineHeight: 1.35, marginBottom: 2 }}>{at.applicationTypeName || at.name}</div>
          <span className="mono" style={{ fontSize: 10, color: C.textSub }}>ID:{at.applicationTypeId || at.id}</span>
        </div>
      </div>
      {at.applicationName && <div style={{ fontSize: 11.5, color: C.textSub, marginTop: 2 }}>{at.applicationName}</div>}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [cfg, setCfg] = useState({
    cloudInstance: "cloud20.contractpod.com",
    newCloudApi: "cpai-productapi-pus20.azurewebsites.net",
    tenant: "pentair",
    username: "yashraj.singh@integreon.com",
    password: "",
  });
  const [showCfg, setShowCfg] = useState(false);
  const [tok, setTok] = useState(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authErr, setAuthErr] = useState(null);

  const [appTypes, setAppTypes] = useState([]);
  const [atBusy, setAtBusy] = useState(false);
  const [selAt, setSelAt] = useState(null);

  const [contracts, setContracts] = useState([]);
  const [cBusy, setCBusy] = useState(false);
  const [cTotal, setCTotal] = useState(0);
  const [cPage, setCPage] = useState(1);
  const [searchQ, setSearchQ] = useState("");

  const [dlBusy, setDlBusy] = useState(false);
  const [detail, setDetail] = useState(null);
  const [intakeMap, setIntakeMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState(null);
  const [saveOk, setSaveOk] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4500);
  }, []);

  const connect = useCallback(async (newCfg) => {
    setCfg(newCfg); setShowCfg(false); setAuthBusy(true); setAuthErr(null);
    try {
      const t = await doAuth(newCfg.cloudInstance, newCfg.tenant, newCfg.username, newCfg.password);
      setTok(t);
      showToast("Connected successfully!", "success");
      setAtBusy(true);
      const list = await doAppTypes(newCfg.cloudInstance, newCfg.tenant, t, newCfg.username);
      setAppTypes(list);
      setAtBusy(false);
    } catch (e) { setAuthErr(e.message); showToast(e.message, "error"); setAuthBusy(false); }
  }, [showToast]);

  const loadContracts = useCallback(async (at, page = 1, search = "") => {
    setCBusy(true);
    if (page === 1) setContracts([]);
    try {
      const id = at.applicationTypeId || at.id;
      const raw = await doContractList(cfg.newCloudApi, cfg.tenant, tok, { applicationTypeId: id, pageNo: page, pageSize: 50, requestIdSearch: search || undefined });
      const list = raw.data || raw.items || (Array.isArray(raw) ? raw : []);
      const total = raw.totalRecords || raw.totalCount || raw.total || list.length;
      setContracts(prev => page === 1 ? list : [...prev, ...list]);
      setCTotal(total);
      setCPage(page);
    } catch (e) { showToast(e.message, "error"); }
    finally { setCBusy(false); }
  }, [cfg, tok, showToast]);

  const selectAppType = useCallback(async (at) => {
    setSelAt(at); setSearchQ(""); setCPage(1); setCTotal(0);
    loadContracts(at, 1, "");
    doIntakeFields(cfg.newCloudApi, cfg.tenant, tok, at.applicationTypeId || at.id).then(map => setIntakeMap(map));
  }, [cfg, tok, loadContracts]);

  const openContract = useCallback(async (c) => {
    setDlBusy(true); setSaveErr(null); setSaveOk(false);
    try {
      const d = await doDetail(cfg.newCloudApi, cfg.tenant, tok, c.id);
      setDetail(d);
    } catch (e) { showToast(e.message, "error"); }
    finally { setDlBusy(false); }
  }, [cfg, tok, showToast]);

  const handleSearch = useCallback(async () => {
    const q = searchQ.trim();
    if (!q) return;
    if (/^\d+$/.test(q)) {
      await openContract({ id: q });
    } else if (selAt) {
      loadContracts(selAt, 1, q);
    }
  }, [searchQ, selAt, openContract, loadContracts]);

  const handleSave = useCallback(async (det, edits) => {
    setSaving(true); setSaveErr(null); setSaveOk(false);
    try {
      const payload = buildUpdatePayload(det, edits, cfg.username);
      await doUpdate(cfg.newCloudApi, cfg.tenant, tok, det.id, payload);
      setSaveOk(true);
      showToast("Contract updated successfully!", "success");
    } catch (e) { setSaveErr(e.message); }
    finally { setSaving(false); }
  }, [cfg, tok, showToast]);

  const priorityTypes = appTypes.filter(isPri);
  const otherTypes = appTypes.filter(a => !isPri(a));

  return (
    <>
      <style>{CSS}</style>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 3000, background: C.bgPanel, border: `1.5px solid ${toast.type === "success" ? C.green : toast.type === "error" ? C.red : C.border}`, borderRadius: 11, padding: "12px 18px", fontSize: 13, fontWeight: 600, color: toast.type === "success" ? C.green : toast.type === "error" ? C.red : C.text, maxWidth: 400, boxShadow: "0 8px 40px #000a", display: "flex", alignItems: "flex-start", gap: 8 }}>
          <Ico d={toast.type === "success" ? IC.ok : toast.type === "error" ? IC.warn : IC.info} size={14} color={toast.type === "success" ? C.green : toast.type === "error" ? C.red : C.textSub} />
          <span style={{ wordBreak: "break-word" }}>{toast.msg}</span>
        </div>
      )}

      {showCfg && <SettingsModal cfg={cfg} onSave={connect} onClose={() => setShowCfg(false)} err={authErr} />}

      {dlBusy && (
        <div style={{ position: "fixed", inset: 0, background: "#00000066", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Spin size={38} /><span style={{ color: C.textSub, fontSize: 13 }}>Fetching contract…</span>
          </div>
        </div>
      )}

      {detail && (
        <EditDrawer detail={detail} intakeMap={intakeMap} onClose={() => { setDetail(null); setSaveOk(false); setSaveErr(null); }} onSave={handleSave} saving={saving} saveErr={saveErr} saveOk={saveOk} />
      )}

      <header style={{ borderBottom: `1px solid ${C.border}`, background: C.bgCard, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, position: "sticky", top: 0, zIndex: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: C.amber, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico d={IC.layers} size={17} color="#0b0e14" />
          </div>
          <div className="header-text">
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-.3px" }}>Leah CLM</div>
            <div style={{ fontSize: 11, color: C.textSub, fontFamily: "IBM Plex Mono" }}>Quick-Edit</div>
          </div>
          {selAt && (
            <>
              <div className="hide-mob" style={{ width: 1, height: 26, background: C.border, margin: "0 6px" }} />
              <button onClick={() => { setSelAt(null); setContracts([]); }} style={{ background: "none", color: C.textSub, display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, borderRadius: 6, padding: "4px 8px" }}>
                <Ico d={IC.back} size={13} /><span className="hide-mob">{selAt.applicationTypeName || selAt.name}</span>
              </button>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {tok && <span className="badge bg hide-mob">● {cfg.tenant}</span>}
          {authBusy && <Spin size={16} />}
          <button onClick={() => setShowCfg(true)} style={{ background: "none", border: `1.5px solid ${C.border}`, color: C.textSub, borderRadius: 8, padding: "6px 13px", display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700 }}>
            <Ico d={IC.settings} size={14} />{tok ? <span className="hide-mob">Settings</span> : "Connect"}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 22px" }}>
        {!tok && (
          <div className="fadeUp" style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 72, height: 72, background: C.amberGlow, border: `1.5px solid ${C.amberDim}`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
              <Ico d={IC.key} size={32} color={C.amber} />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>Connect to Leah CLM</h1>
            <p style={{ color: C.textSub, maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.6 }}>
              Uses the official ContractPodAI v1.9 API spec.<br />Auth via <span className="mono" style={{ color: C.amber }}>cpaimt_auth</span>, contracts via <span className="mono" style={{ color: C.blue }}>New Cloud API</span>.
            </p>
            {authErr && <div style={{ background: C.redDim, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.red, maxWidth: 420, margin: "0 auto 16px", display: "flex", gap: 8 }}><Ico d={IC.warn} size={14} color={C.red} />{authErr}</div>}
            <Btn onClick={() => setShowCfg(true)} loading={authBusy}><Ico d={IC.key} size={14} color="#0b0e14" />Configure & Connect</Btn>
          </div>
        )}

        {tok && !selAt && (
          <div className="fadeUp">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div>
                <h2 style={{ fontSize: 21, fontWeight: 800, marginBottom: 3 }}>Application Types</h2>
                <p style={{ color: C.textSub, fontSize: 13 }}>{appTypes.length} types · click to browse</p>
              </div>
            </div>
            {atBusy && <div style={{ textAlign: "center", padding: 60 }}><Spin size={36} /></div>}
            {!atBusy && appTypes.length === 0 && <div style={{ textAlign: "center", padding: 60, color: C.textSub }}>No application types found. Check credentials.</div>}
            {priorityTypes.length > 0 && (
              <div style={{ marginBottom: 26 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.amber, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>⭐ Priority — Dealer / Distributor / Agent</div>
                <div className="app-grid">
                  {priorityTypes.map(at => <AppTypeCard key={at.applicationTypeId || at.id} at={at} onClick={selectAppType} />)}
                </div>
              </div>
            )}
            {otherTypes.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.textSub, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>All Types</div>
                <div className="app-grid">
                  {otherTypes.map(at => <AppTypeCard key={at.applicationTypeId || at.id} at={at} onClick={selectAppType} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {tok && selAt && (
          <div className="fadeUp">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }} className="mob-stack">
              <div>
                <h2 style={{ fontSize: 21, fontWeight: 800, marginBottom: 4 }}>{selAt.applicationTypeName || selAt.name}</h2>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
                  <span className="mono" style={{ fontSize: 11, color: C.textSub }}>AppType #{selAt.applicationTypeId || selAt.id}</span>
                  {cTotal > 0 && <span className="badge bx">{cTotal.toLocaleString()} total</span>}
                </div>
              </div>
            </div>

            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: .5, marginBottom: 10 }}>Quick Find</div>
              <div style={{ display: "flex", gap: 10 }} className="mob-stack">
                <div style={{ position: "relative", flex: 1 }}>
                  <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Ico d={IC.search} size={15} color={C.textSub} /></div>
                  <input style={{ paddingLeft: 38 }} placeholder="Type Request ID (e.g. 92355) to open directly…" value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
                </div>
                <Btn sm loading={dlBusy || cBusy} onClick={handleSearch}><Ico d={IC.search} size={13} color="#0b0e14" />Open / Filter</Btn>
              </div>
            </div>

            {contracts.length > 0 && (
              <div className="contract-grid hide-mob" style={{ padding: "0 16px 8px", fontSize: 10.5, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: .5 }}>
                <span>Request ID</span><span>Record ID</span><span>Party / Description</span><span>Stage</span><span />
              </div>
            )}

            {cBusy && contracts.length === 0 && <div style={{ textAlign: "center", padding: 60 }}><Spin size={36} /></div>}
            {!cBusy && contracts.length === 0 && <div style={{ textAlign: "center", padding: 60, color: C.textSub, lineHeight: 1.8 }}>No contracts found.<br /><span style={{ fontSize: 12 }}>Try entering a Request ID to open directly.</span></div>}

            {contracts.map(c => <ContractRow key={c.id} c={c} onClick={openContract} />)}

            {contracts.length > 0 && contracts.length < cTotal && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Btn v="ghost" loading={cBusy} onClick={() => loadContracts(selAt, cPage + 1, searchQ)}>
                  <Ico d={IC.more} size={14} />Load more ({contracts.length} of {cTotal})
                </Btn>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}