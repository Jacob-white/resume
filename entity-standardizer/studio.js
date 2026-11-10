const API_BASE = "/entity-standardizer";

const PRESETS = {
  "addr-wall": {
    street1: "100 wall street ste 2400-b",
    street2: "attn: institutional ops",
    city: "new york",
    state: "New York",
    zip: "10005-0001",
    country: "US",
    geocode: true,
  },
  "addr-cmra": {
    street1: "1209 orange st #441",
    street2: "c/o corporation trust center",
    city: "wilmington",
    state: "delaware",
    zip: "19801",
    country: "US",
    geocode: true,
  },
  "addr-pobox": {
    street1: "p.o. box 8842",
    street2: "",
    city: "chicago",
    state: "illinois",
    zip: "60601-8842",
    country: "US",
    geocode: true,
  },
  "addr-intl": {
    street1: "221b baker st",
    street2: "flat 2",
    city: "london",
    state: "",
    zip: "nw1 6xe",
    country: "GB",
    geocode: false,
  },
  "contact-heal": {
    person: "Dr. Sarah J. Jenkins, CFA, PhD",
    title: "sr. managing dir - institutional sales",
    org: "",
    email: "Sarah.Jenkins+crm@vanguard.com",
    phone: "1 (610) 669-1000 ext. 882",
    website: "HTTPS://Institutional.Vanguard.com/solutions?utm_source=linkedin&fbclid=123",
    social: "https://www.linkedin.com/in/sarah-jenkins-cfa/",
    street: "100 vanguard blvd bldg m3",
    city: "malvern",
    state: "PA 19355",
  },
  "contact-sec": {
    person: "Michael R. Chen, CPA",
    title: "evp & chief technology officer",
    org: "BLACKROCK, INC. /DE/ DBA BLACKROCK ALADDIN",
    email: "mchen@blackrock.com",
    phone: "(212) 810-5300",
    website: "https://www.blackrock.com/aladdin?gclid=test999",
    social: "@blackrock",
    street: "50 hudson yards fl 40",
    city: "new york",
    state: "NY 10001",
  },
  "contact-swapped": {
    person: "FIDELITY DISTRIBUTORS COMPANY LLC",
    title: "vp regional consultant",
    org: "",
    email: "advisor.support@fmr.com",
    phone: "800-343-3548",
    website: "https://institutional.fidelity.com",
    social: "linkedin.com/company/fidelity-investments",
    street: "245 summer street",
    city: "boston",
    state: "MA 02210",
  },
  "dedup-company-pair": {
    mode: "company-pair",
    a: "THE VANGUARD GROUP, INC. /PA/",
    b: "Vanguard Group Inc DBA Vanguard Institutional",
  },
  "dedup-address-pair": {
    mode: "address-pair",
    a: "100 Wall Street, Suite 2400, New York, NY 10005",
    b: "100 WALL ST STE 2400, NEW YORK, NY 10005-0001",
  },
  "dedup-contact-cluster": {
    mode: "contact-cluster",
    records: [
      {
        person_name: "Sarah J. Jenkins, CFA",
        organization: "The Vanguard Group, Inc.",
        email: "sarah.jenkins@vanguard.com",
        phone: "(610) 669-1000",
        street1: "100 Vanguard Blvd",
        city: "Malvern",
        state: "PA",
        postal_code: "19355",
      },
      {
        person_name: "Dr. Sarah Jenkins",
        organization: "VANGUARD GROUP INC /PA/",
        email: "sarah.jenkins+events@vanguard.com",
        phone: "+1-610-669-1000 ext 88",
        street1: "100 VANGUARD BOULEVARD",
        city: "MALVERN",
        state: "Pennsylvania",
        postal_code: "19355",
      },
      {
        person_name: "Michael R. Chen",
        organization: "BlackRock, Inc. /DE/",
        email: "mchen@blackrock.com",
        phone: "212-810-5300",
        street1: "50 Hudson Yards",
        city: "New York",
        state: "NY",
        postal_code: "10001",
      },
      {
        person_name: "M. R. Chen, CPA",
        organization: "BLACKROCK INC",
        email: "mchen@blackrock.com",
        phone: "+1 (212) 810-5300",
        street1: "50 HUDSON YDS",
        city: "NEW YORK",
        state: "NY",
        postal_code: "10001",
      },
    ],
  },
  "phone-us": { raw: "+1 (212) 555-0199 ext. 402", country: "US" },
  "phone-uk": { raw: "+44 (0) 20 7946 0921", country: "GB" },
  "phone-vanity": { raw: "1-800-FLOWERS", country: "US" },
  "phone-de": { raw: "0049 (0) 89 12345678", country: "DE" },
};

function esc(val) {
  if (val === null || val === undefined || val === "") return "\u2014";
  return String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function kvCard(label, value) {
  return `<div class="studio-kv-item">
    <span class="studio-kv-label">${esc(label)}</span>
    <span class="studio-kv-value">${esc(value)}</span>
  </div>`;
}

function jsonDetails(data) {
  return `<details class="studio-json-details">
    <summary>Inspect Full JSON Payload</summary>
    <pre class="studio-json-pre"><code>${esc(JSON.stringify(data, null, 2))}</code></pre>
  </details>`;
}

async function apiPost(path, body, latencyBadgeId) {
  const badge = document.getElementById(latencyBadgeId);
  if (badge) badge.textContent = "Running\u2026";
  const t0 = performance.now();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const elapsed = (performance.now() - t0).toFixed(1);
  if (badge) badge.textContent = `${elapsed} ms`;
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText}`);
  }
  return res.json();
}

async function checkEngineStatus() {
  const badge = document.getElementById("engine-status-badge");
  try {
    const res = await fetch(`${API_BASE}/ready`);
    if (!res.ok) throw new Error("Not ready");
    const data = await res.json();
    const engineLabel = data.native_available ? "Native Rust (PyO3) Active" : "Python Fallback Active";
    badge.textContent = `v${data.version} \u2022 ${engineLabel}`;
  } catch (_) {
    badge.textContent = "Engine Offline";
  }
}

async function runAddressStandardization() {
  const out = document.getElementById("address-output");
  try {
    const stateZipRaw = document.getElementById("addr-state").value.trim();
    const body = {
      street1: document.getElementById("addr-street1").value.trim() || null,
      street2: document.getElementById("addr-street2").value.trim() || null,
      city: document.getElementById("addr-city").value.trim() || null,
      state: stateZipRaw || null,
      postal_code: document.getElementById("addr-zip").value.trim() || null,
      country: document.getElementById("addr-country").value.trim() || "US",
      enable_geocoding: document.getElementById("addr-geocode").checked,
      explain: true,
    };
    const data = await apiPost("/v1/address", body, "addr-latency");
    const h3 = data.spatial_result && data.spatial_result.h3_index ? data.spatial_result.h3_index : "\u2014";
    const coords =
      data.latitude !== null && data.latitude !== undefined
        ? `${Number(data.latitude).toFixed(4)}, ${Number(data.longitude).toFixed(4)} (${data.precision || "centroid"})`
        : "\u2014";

    const confEntries = data.field_confidence
      ? Object.entries(data.field_confidence)
          .map(([k, v]) => `${k}: ${(Number(v) * 100).toFixed(0)}%`)
          .join(" \u2022 ")
      : "\u2014";

    out.innerHTML = `
      <div class="studio-hero-box">
        <div class="small text-muted fw-bold text-uppercase mb-1">Canonical USPS Pub 28 / UPU S42 Envelope</div>
        <div class="h5 fw-bold mb-1">${esc(data.street1)}${data.street2 ? ` <span class="text-muted">(${esc(data.street2)})</span>` : ""}</div>
        <div class="fw-bold text-muted">${esc(data.city)}, ${esc(data.state)} ${esc(data.postal_code)} \u2022 ${esc(data.country)}</div>
      </div>
      <div class="studio-kv-grid">
        ${kvCard("Address Status", data.address_status)}
        ${kvCard("Normalized Key", data.normalized_address_key)}
        ${kvCard("Building Key", data.building_key)}
        ${kvCard("Phonetic Key", data.phonetic_key)}
        ${kvCard("Registered Agent / CMRA", data.is_registered_agent_hub ? "Yes (Agent Hub)" : "No")}
        ${kvCard("Private Residence", data.is_private_residence ? "Yes" : "Commercial / Institutional")}
        ${kvCard("Coordinates", coords)}
        ${kvCard("H3 Spatial Index", h3)}
        ${kvCard("FIPS / Census Tract", `${data.fips_code || "\u2014"} / ${data.census_tract || "\u2014"}`)}
      </div>
      <div class="small text-muted"><strong>Field Confidence:</strong> ${esc(confEntries)}</div>
      ${jsonDetails(data)}
    `;
  } catch (err) {
    out.innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`;
  }
}

async function runAutocomplete() {
  const prefix = document.getElementById("addr-autocomplete-input").value.trim();
  const container = document.getElementById("autocomplete-results");
  if (!prefix) return;
  try {
    const data = await apiPost("/v1/address/autocomplete", { prefix, max_results: 5 }, "addr-latency");
    if (!data.suggestions || data.suggestions.length === 0) {
      container.innerHTML = `<span class="text-muted">No offline reference matches for "${esc(prefix)}".</span>`;
      return;
    }
    container.innerHTML = data.suggestions
      .map(
        (s, idx) =>
          `<button type="button" class="autocomplete-pill" data-idx="${idx}" data-street="${esc(s.street1)}" data-city="${esc(s.city)}" data-state="${esc(s.state)}" data-zip="${esc(s.postal_code)}">
            <strong>${esc(s.text)}</strong> ${s.secondary_prompt_required ? `<span class="text-muted">(${esc(s.prompt_message)})</span>` : ""}
          </button>`
      )
      .join("");
    container.querySelectorAll(".autocomplete-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("addr-street1").value = btn.getAttribute("data-street") || "";
        document.getElementById("addr-city").value = btn.getAttribute("data-city") || "";
        document.getElementById("addr-state").value = btn.getAttribute("data-state") || "";
        document.getElementById("addr-zip").value = btn.getAttribute("data-zip") || "";
        runAddressStandardization();
      });
    });
  } catch (err) {
    container.innerHTML = `<span class="text-danger">${esc(err.message)}</span>`;
  }
}

async function runContactCrossHealing() {
  const out = document.getElementById("contact-output");
  try {
    const stateZip = document.getElementById("cnt-state").value.trim().split(/\s+/);
    const state = stateZip[0] || null;
    const postal_code = stateZip.slice(1).join(" ") || null;

    const body = {
      person_name: document.getElementById("cnt-person").value.trim() || null,
      job_title: document.getElementById("cnt-title").value.trim() || null,
      organization: document.getElementById("cnt-org").value.trim() || null,
      email: document.getElementById("cnt-email").value.trim() || null,
      phone: document.getElementById("cnt-phone").value.trim() || null,
      website: document.getElementById("cnt-website").value.trim() || null,
      social: document.getElementById("cnt-social").value.trim() || null,
      street1: document.getElementById("cnt-street").value.trim() || null,
      city: document.getElementById("cnt-city").value.trim() || null,
      state,
      postal_code,
      country: "US",
    };
    const data = await apiPost("/v1/contact", body, "contact-latency");
    const actions = (data.cross_healing_actions || [])
      .map(
        (a) =>
          `<div class="heal-badge"><strong>${esc(a.action_type || a.rule || "HEALED")}:</strong> ${esc(a.source_field)} &rarr; ${esc(a.target_field)} (${esc(a.reason || a.details || "Cross-pillar signal")})</div>`
      )
      .join("");

    const org = data.organization || {};
    const person = data.person || {};
    const title = data.job_title || {};
    const email = data.email || {};
    const phone = data.phone || {};
    const web = data.website || {};
    const addr = data.address || {};

    out.innerHTML = `
      <div class="studio-hero-box">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="small text-muted fw-bold text-uppercase">Unified Entity Key</span>
          <span class="badge bg-light text-dark border">Confidence: ${(Number(data.overall_confidence || 0) * 100).toFixed(0)}%</span>
        </div>
        <div class="fw-bold font-monospace small">${esc(data.entity_key)}</div>
      </div>
      ${actions ? `<div><div class="small fw-bold text-muted mb-1">Cross-Healing Actions Triggered:</div>${actions}</div>` : ""}
      <div class="studio-kv-grid">
        ${kvCard("Person Canonical", person.full_name || person.canonical_name)}
        ${kvCard("Credentials / Honorific", [person.salutation, (person.credentials || []).join(", ")].filter(Boolean).join(" \u2022 "))}
        ${kvCard("Job Title / Seniority", `${title.canonical_title || "\u2014"} (${title.seniority_level || "Standard"} / ${title.department || "General"})`)}
        ${kvCard("Organization Legal Name", org.legal_name)}
        ${kvCard("Brand Stem / DBA", [org.brand_stem, org.dba_name ? `DBA: ${org.dba_name}` : ""].filter(Boolean).join(" \u2022 "))}
        ${kvCard("Canonical Email", email.canonical_email)}
        ${kvCard("Clean Website URL", web.canonical_url)}
        ${kvCard("E.164 Phone + Ext", `${phone.e164 || "\u2014"}${phone.extension ? ` ext. ${phone.extension}` : ""}`)}
        ${kvCard("Standardized Address", [addr.street1, addr.city, addr.state, addr.postal_code].filter(Boolean).join(", "))}
      </div>
      ${jsonDetails(data)}
    `;
  } catch (err) {
    out.innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`;
  }
}

async function runDeduplication() {
  const out = document.getElementById("dedup-output");
  const mode = document.getElementById("dedup-mode").value;
  try {
    if (mode === "company-pair") {
      const a = document.getElementById("dedup-entity-a").value.trim();
      const b = document.getElementById("dedup-entity-b").value.trim();
      const data = await apiPost("/v1/company/compare", { company_a: a, company_b: b }, "dedup-latency");
      out.innerHTML = `
        <div class="studio-hero-box">
          <div class="small text-muted fw-bold text-uppercase mb-1">ISO 20275 Company Resolution Verdict</div>
          <div class="h5 fw-bold mb-0">
            ${data.is_match ? "MATCH" : "DISTINCT"} \u2022 Score: ${(Number(data.score) * 100).toFixed(1)}% (${esc(data.match_type)})
          </div>
        </div>
        <div class="studio-kv-grid">
          ${kvCard("Company A Legal Name", data.company_a?.legal_name)}
          ${kvCard("Company B Legal Name", data.company_b?.legal_name)}
          ${kvCard("Company A Brand Key", data.company_a?.brand_key)}
          ${kvCard("Company B Brand Key", data.company_b?.brand_key)}
          ${kvCard("Company ADBA / Suffix", `${data.company_a?.legal_suffix || "\u2014"} / ${data.company_a?.dba_name || "\u2014"}`)}
          ${kvCard("Company B DBA / Suffix", `${data.company_b?.legal_suffix || "\u2014"} / ${data.company_b?.dba_name || "\u2014"}`)}
        </div>
        ${jsonDetails(data)}
      `;
    } else if (mode === "address-pair") {
      const a = document.getElementById("dedup-entity-a").value.trim();
      const b = document.getElementById("dedup-entity-b").value.trim();
      const data = await apiPost("/v1/address/compare", { address_a: a, address_b: b }, "dedup-latency");
      out.innerHTML = `
        <div class="studio-hero-box">
          <div class="small text-muted fw-bold text-uppercase mb-1">Address Comparison Verdict</div>
          <div class="h5 fw-bold mb-0">
            ${data.is_match ? "MATCH" : "DISTINCT"} \u2022 Similarity: ${(Number(data.similarity || data.score || 0) * 100).toFixed(1)}% (${esc(data.match_type)})
          </div>
        </div>
        ${jsonDetails(data)}
      `;
    } else {
      const rawJson = JSON.parse(document.getElementById("dedup-records-json").value);
      const data = await apiPost("/v1/contact/cluster", { records: rawJson }, "dedup-latency");
      const clustersHtml = (data.clusters || [])
        .map(
          (c, i) => `
          <div class="studio-kv-item">
            <span class="studio-kv-label">Cluster #${i + 1} (${(c.member_indices || []).length} records merged)</span>
            <span class="studio-kv-value">Canonical Key: ${esc(c.canonical_key || c.cluster_id)}</span>
            <div class="small text-muted mt-1">Member indices: [${(c.member_indices || []).join(", ")}]</div>
          </div>`
        )
        .join("");
      out.innerHTML = `
        <div class="studio-hero-box">
          <div class="small text-muted fw-bold text-uppercase mb-1">Multi-Record Contact Clustering</div>
          <div class="h5 fw-bold mb-0">Collapsed ${rawJson.length} Input Records &rarr; ${data.cluster_count} Canonical Entities</div>
        </div>
        <div class="studio-kv-grid">${clustersHtml}</div>
        ${jsonDetails(data)}
      `;
    }
  } catch (err) {
    out.innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`;
  }
}

async function runPhoneInspector() {
  const out = document.getElementById("phone-output");
  try {
    const body = {
      phone: document.getElementById("phone-raw").value.trim(),
      default_country: document.getElementById("phone-country").value.trim() || "US",
    };
    const data = await apiPost("/v1/explain", body, "phone-latency");
    const rec = data.record || {};
    const intel = data.intelligence || {};
    const steps = (data.explanation?.steps || data.explanation || []);
    const stepsText = Array.isArray(steps)
      ? steps.map((s) => (typeof s === "string" ? s : JSON.stringify(s))).join(" \u2192 ")
      : JSON.stringify(steps);

    out.innerHTML = `
      <div class="studio-hero-box">
        <div class="small text-muted fw-bold text-uppercase mb-1">ITU-T E.164 Canonical Number</div>
        <div class="h4 fw-bold mb-1">${esc(rec.e164)}${rec.extension ? ` <span class="text-muted">ext. ${esc(rec.extension)}</span>` : ""}</div>
        <div class="small text-muted">International: <strong>${esc(rec.international)}</strong> \u2022 National: <strong>${esc(rec.national)}</strong> \u2022 RFC 3966: <code>${esc(rec.rfc3966)}</code></div>
      </div>
      <div class="studio-kv-grid">
        ${kvCard("Validation Status", rec.is_valid ? "Valid" : "Invalid / Partial")}
        ${kvCard("Country ISO / Code", `${rec.country_iso2 || "\u2014"} (+${rec.calling_code || "\u2014"})`)}
        ${kvCard("Line Classification", intel.line_type || rec.number_type || "Standard")}
        ${kvCard("Geographic Region", intel.region_name || intel.state_or_province || "\u2014")}
        ${kvCard("Time Zone", (intel.timezones || []).join(", ") || "\u2014")}
        ${kvCard("Confidence Score", rec.confidence !== undefined ? `${(Number(rec.confidence) * 100).toFixed(0)}%` : "\u2014")}
      </div>
      <div class="small text-muted"><strong>Audit Trail:</strong> ${esc(stepsText)}</div>
      ${jsonDetails(data)}
    `;
  } catch (err) {
    out.innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`;
  }
}

async function runDialPlanLookup() {
  const iso = document.getElementById("dialplan-iso").value.trim();
  const container = document.getElementById("dialplan-output");
  if (!iso) return;
  try {
    const res = await fetch(`${API_BASE}/v1/countries/${encodeURIComponent(iso)}`);
    if (!res.ok) throw new Error(`Country "${iso}" not found`);
    const plan = await res.json();
    container.innerHTML = `
      <div class="studio-kv-grid mt-2">
        ${kvCard("Country", `${plan.name} (${plan.iso2} / ${plan.iso3})`)}
        ${kvCard("Calling Code / Trunk", `+${plan.calling_code} (IDD: ${plan.idd_prefix}, Trunk: ${plan.national_trunk_prefix || "None"})`)}
        ${kvCard("NSN Lengths", (plan.nsn_lengths || []).join(", "))}
        ${kvCard("Mobile Prefixes", (plan.mobile_prefixes || []).slice(0, 8).join(", "))}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<span class="text-danger">${esc(err.message)}</span>`;
  }
}

function applyPreset(key) {
  const p = PRESETS[key];
  if (!p) return;
  if (key.startsWith("addr-")) {
    document.getElementById("addr-street1").value = p.street1;
    document.getElementById("addr-street2").value = p.street2;
    document.getElementById("addr-city").value = p.city;
    document.getElementById("addr-state").value = p.state;
    document.getElementById("addr-zip").value = p.zip;
    document.getElementById("addr-country").value = p.country;
    document.getElementById("addr-geocode").checked = p.geocode;
    runAddressStandardization();
  } else if (key.startsWith("contact-")) {
    document.getElementById("cnt-person").value = p.person;
    document.getElementById("cnt-title").value = p.title;
    document.getElementById("cnt-org").value = p.org;
    document.getElementById("cnt-email").value = p.email;
    document.getElementById("cnt-phone").value = p.phone;
    document.getElementById("cnt-website").value = p.website;
    document.getElementById("cnt-social").value = p.social;
    document.getElementById("cnt-street").value = p.street;
    document.getElementById("cnt-city").value = p.city;
    document.getElementById("cnt-state").value = p.state;
    runContactCrossHealing();
  } else if (key.startsWith("dedup-")) {
    document.getElementById("dedup-mode").value = p.mode;
    const pairDiv = document.getElementById("dedup-pair-inputs");
    const clusterDiv = document.getElementById("dedup-cluster-inputs");
    if (p.mode === "contact-cluster") {
      pairDiv.hidden = true;
      clusterDiv.hidden = false;
      document.getElementById("dedup-records-json").value = JSON.stringify(p.records, null, 2);
    } else {
      pairDiv.hidden = false;
      clusterDiv.hidden = true;
      document.getElementById("dedup-entity-a").value = p.a;
      document.getElementById("dedup-entity-b").value = p.b;
    }
    runDeduplication();
  } else if (key.startsWith("phone-")) {
    document.getElementById("phone-raw").value = p.raw;
    document.getElementById("phone-country").value = p.country;
    runPhoneInspector();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkEngineStatus();

  // Tab switching
  document.querySelectorAll(".studio-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      document.querySelectorAll(".studio-tab").forEach((t) => {
        const active = t === tab;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      document.querySelectorAll(".studio-panel").forEach((panel) => {
        const isTarget = panel.id === `panel-${target}`;
        panel.hidden = !isTarget;
        panel.classList.toggle("active", isTarget);
      });
      if (target === "contact" && !document.getElementById("contact-output").innerHTML) {
        runContactCrossHealing();
      } else if (target === "dedup" && !document.getElementById("dedup-output").innerHTML) {
        runDeduplication();
      } else if (target === "phone" && !document.getElementById("phone-output").innerHTML) {
        runPhoneInspector();
        runDialPlanLookup();
      }
    });
  });

  // Preset buttons
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyPreset(btn.getAttribute("data-preset")));
  });

  // Form submissions
  document.getElementById("form-address").addEventListener("submit", (e) => {
    e.preventDefault();
    runAddressStandardization();
  });
  document.getElementById("btn-autocomplete").addEventListener("click", runAutocomplete);

  document.getElementById("form-contact").addEventListener("submit", (e) => {
    e.preventDefault();
    runContactCrossHealing();
  });

  document.getElementById("form-dedup").addEventListener("submit", (e) => {
    e.preventDefault();
    runDeduplication();
  });

  document.getElementById("form-phone").addEventListener("submit", (e) => {
    e.preventDefault();
    runPhoneInspector();
  });
  document.getElementById("btn-dialplan").addEventListener("click", runDialPlanLookup);

  // Initial load on Tab 1
  runAddressStandardization();
  runAutocomplete();
});
