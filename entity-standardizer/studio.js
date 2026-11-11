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
  "addr-wacker": {
    street1: "233 s. wacker dr. flr 84",
    street2: "suite 8400",
    city: "chicago",
    state: "IL",
    zip: "60606",
    country: "US",
    geocode: true,
  },
  "addr-pr": {
    street1: "urb los olmos 142 calle a",
    street2: "apt 3",
    city: "san juan",
    state: "puerto rico",
    zip: "00927",
    country: "US",
    geocode: true,
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
  "contact-intl": {
    person: "Prof. Elena V. Rostova, PhD",
    title: "managing director, systematic macro",
    org: "CITADEL ENTERPRISE EUROPE LIMITED DBA CITADEL SECURITIES",
    email: "elena.rostova+macro@citadel.com",
    phone: "+44 (0) 20 7946 0921",
    website: "https://www.citadel.com/strategies?utm_campaign=q4&fbclid=abc99",
    social: "https://www.linkedin.com/in/elena-rostova-phd/",
    street: "120 london wall",
    city: "london",
    state: "EC2Y 5ET",
  },
  "pillars-inst": {
    company: "J.P. MORGAN INVESTMENT MANAGEMENT INC. /DE/ DBA JPM ASSET MGMT",
    person: "Dr. Robert (Bob) J. Smith, III, MD, CFA",
    title: "evp & global head of quantitative engineering",
    email: "Robert.Smith+institutional@jpmorgan.com",
    url: "HTTPS://am.jpmorgan.com/us/en?utm_medium=cpc&gclid=abc",
    social: "https://www.linkedin.com/in/robert-smith-cfa/",
  },
  "pillars-eu": {
    company: "ALLIANZ GLOBAL INVESTORS GMBH FKA ALLIANZ DRESDNER ASSET MGMT",
    person: "Prof. Dr. Lukas M. Weber, PhD",
    title: "chief risk & compliance officer",
    email: "Lukas.Weber+emea@allianzgi.com",
    url: "https://www.allianzgi.com/en/institutional?utm_source=email",
    social: "https://x.com/allianzgi",
  },
  "pillars-tech": {
    company: "ANTHROPIC, PBC /DE/ DBA CLAUDE ENTERPRISE",
    person: "William (Bill) K. Vance, Jr., CPA",
    title: "sr. staff distributed systems engineer",
    email: "bill.vance+devtools@anthropic.com",
    url: "https://www.anthropic.com/enterprise?fbclid=xyz987&utm_term=ai",
    social: "https://github.com/billvance-dev",
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
  "dedup-person-pair": {
    mode: "person-pair",
    a: "Dr. Robert (Bob) J. Smith, III, MD",
    b: "Bob Smith III",
  },
  "dedup-email-pair": {
    mode: "email-pair",
    a: "Sarah.Jenkins+events@Vanguard.com",
    b: "sarah.jenkins@vanguard.com",
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
  "phone-jp": { raw: "+81 (0) 3-5224-6111", country: "JP" },
};

const SAMPLE_CSV_TEXT = `full_name,job_title,company,email,phone,website,street1,street2,city,state,zip,country
"Dr. Sarah J. Jenkins, CFA",sr. managing dir - institutional sales,"THE VANGUARD GROUP, INC. /PA/",Sarah.Jenkins+crm@vanguard.com,1 (610) 669-1000 ext. 882,https://institutional.vanguard.com?utm_source=crm,100 vanguard blvd,bldg m3,malvern,PA,19355,US
"Sarah Jenkins",Senior Managing Director,Vanguard Group Inc,sarah.jenkins@vanguard.com,(610) 669-1000,https://vanguard.com,100 Vanguard Boulevard,Bldg M3,Malvern,Pennsylvania,19355-0001,US
"Michael R. Chen, CPA",evp & chief technology officer,"BLACKROCK, INC. /DE/ DBA BLACKROCK ALADDIN",mchen@blackrock.com,(212) 810-5300,https://www.blackrock.com/aladdin?gclid=99,50 hudson yards,fl 40,new york,NY,10001,US
"M. R. Chen",EVP & CTO,BlackRock Inc,mchen+events@blackrock.com,+1-212-810-5300,blackrock.com,50 HUDSON YDS,40th Floor,NEW YORK,New York,10001,US
"FIDELITY DISTRIBUTORS COMPANY LLC",vp regional consultant,,advisor.support@fmr.com,800-343-3548,https://institutional.fidelity.com,245 summer street,,boston,MA,02210,US
"Elena Rostova",head of quantitative research,"Citadel Enterprise Americas LLC",,+44 (0) 20 7946 0921,https://www.citadel.com?fbclid=123,221b baker st,flat 2,london,,nw1 6xe,GB`;

const SAMPLE_ADDRESS_CSV_TEXT = `company,street1,street2,city,state,zip,country
"Vanguard Institutional",100 vanguard blvd,bldg m3,malvern,Pennsylvania,19355,US
"Vanguard Group",100 VANGUARD BOULEVARD,BLDG M3,MALVERN,PA,19355-0001,US
"Corporation Trust Center",1209 orange st,#441,wilmington,delaware,19801,US
"Willis Tower Operations",233 s. wacker drive,suite 8400,chicago,illinois,60606,US
"Sherlock Consulting Ltd",221b baker street,flat 2,london,,nw1 6xe,GB`;

const TARGET_FIELDS = [
  { key: "", label: "— Ignore / Pass-Through —" },
  { key: "person_name", label: "Person Name" },
  { key: "job_title", label: "Job Title" },
  { key: "organization", label: "Organization / Company" },
  { key: "email", label: "Email Address" },
  { key: "phone", label: "Phone Number" },
  { key: "website", label: "Website URL" },
  { key: "social", label: "Social Profile" },
  { key: "street1", label: "Street Line 1" },
  { key: "street2", label: "Street Line 2 / Suite" },
  { key: "city", label: "City" },
  { key: "state", label: "State / Province" },
  { key: "postal_code", label: "Postal / ZIP Code" },
  { key: "country", label: "Country ISO" },
];

let parsedCsvState = {
  headers: [],
  rows: [],
  mapping: {},
  lastBatchResults: null,
  lastClusterMap: {},
};

function parseCsvText(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  const clean = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field.trim());
      field = "";
    } else if (ch === "\n") {
      row.push(field.trim());
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    if (row.some((c) => c !== "")) rows.push(row);
  }
  if (rows.length === 0) return { headers: [], rows: [] };
  return { headers: rows[0], rows: rows.slice(1, 1001) };
}

function guessFieldMapping(header) {
  const h = String(header || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (["personname", "fullname", "name", "contactname", "person", "advisorname"].includes(h)) return "person_name";
  if (["jobtitle", "title", "role", "position", "occupation"].includes(h)) return "job_title";
  if (["organization", "company", "companyname", "org", "firm", "firmname", "employer", "legalname"].includes(h))
    return "organization";
  if (["email", "emailaddress", "workemail", "mail"].includes(h)) return "email";
  if (["phone", "phonenumber", "telephone", "tel", "mobile", "workphone", "cell"].includes(h)) return "phone";
  if (["website", "url", "web", "domain", "companyurl", "homepage"].includes(h)) return "website";
  if (["social", "linkedin", "linkedinurl", "twitter", "handle"].includes(h)) return "social";
  if (["street1", "street", "address", "address1", "addr1", "streetaddress", "line1", "deliveryline1"].includes(h))
    return "street1";
  if (["street2", "address2", "addr2", "suite", "apt", "unit", "line2", "secondary"].includes(h)) return "street2";
  if (["city", "town", "locality", "municipality"].includes(h)) return "city";
  if (["state", "province", "region", "statecode", "st"].includes(h)) return "state";
  if (["postalcode", "zip", "zipcode", "postcode", "postal"].includes(h)) return "postal_code";
  if (["country", "countrycode", "countryiso", "nation"].includes(h)) return "country";
  return "";
}

function csvEscapeCell(val) {
  const s = val === null || val === undefined ? "" : String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function loadCsvTextIntoMapper(csvText, syncTextarea = true) {
  const rawArea = document.getElementById("csv-raw-textarea");
  if (syncTextarea && rawArea && rawArea.value !== csvText) {
    rawArea.value = csvText;
  }
  const parsed = parseCsvText(csvText);
  parsedCsvState.headers = parsed.headers;
  parsedCsvState.rows = parsed.rows;
  parsedCsvState.mapping = {};
  parsedCsvState.lastBatchResults = null;
  parsedCsvState.lastClusterMap = {};

  const mapperBox = document.getElementById("csv-mapper-box");
  const mapperGrid = document.getElementById("csv-mapper-grid");
  const countBadge = document.getElementById("csv-row-count-badge");
  const runBtn = document.getElementById("btn-run-csv-batch");
  const dlBtn = document.getElementById("btn-download-csv");

  if (!parsed.headers.length || !parsed.rows.length) {
    mapperBox.hidden = true;
    runBtn.disabled = true;
    dlBtn.disabled = true;
    document.getElementById("csv-output").innerHTML =
      `<div class="alert alert-danger">CSV file must contain a header row and at least 1 data row.</div>`;
    return;
  }

  countBadge.textContent = `${parsed.rows.length} row${parsed.rows.length === 1 ? "" : "s"} ready`;
  mapperBox.hidden = false;
  runBtn.disabled = false;

  mapperGrid.innerHTML = parsed.headers
    .map((h, idx) => {
      const guessed = guessFieldMapping(h);
      parsedCsvState.mapping[idx] = guessed;
      const optionsHtml = TARGET_FIELDS.map(
        (tf) => `<option value="${tf.key}" ${tf.key === guessed ? "selected" : ""}>${esc(tf.label)}</option>`
      ).join("");
      return `<div class="csv-mapper-item">
        <label for="csv-map-col-${idx}" title="${esc(h)}">${esc(h)}</label>
        <select id="csv-map-col-${idx}" class="csv-mapper-select" data-col-idx="${idx}">
          ${optionsHtml}
        </select>
      </div>`;
    })
    .join("");

  mapperGrid.querySelectorAll(".csv-mapper-select").forEach((sel) => {
    sel.addEventListener("change", () => {
      const colIdx = Number(sel.getAttribute("data-col-idx"));
      parsedCsvState.mapping[colIdx] = sel.value;
    });
  });
}

async function runCsvBatchStandardization() {
  const out = document.getElementById("csv-output");
  const dlBtn = document.getElementById("btn-download-csv");
  if (!parsedCsvState.rows.length) return;

  try {
    const contacts = parsedCsvState.rows.map((row) => {
      const obj = {};
      parsedCsvState.headers.forEach((_, idx) => {
        const targetField = parsedCsvState.mapping[idx];
        const cellVal = row[idx];
        if (targetField && cellVal !== undefined && cellVal !== "") {
          obj[targetField] = cellVal;
        }
      });
      return obj;
    });

    const t0 = performance.now();
    const [batchData, clusterData] = await Promise.all([
      apiPost("/v1/contact/batch", { contacts, default_country: "US" }, "csv-latency"),
      fetch(`${API_BASE}/v1/contact/cluster`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: contacts }),
      }).then((r) => (r.ok ? r.json() : { clusters: [], cluster_count: contacts.length })),
    ]);
    const totalMs = (performance.now() - t0).toFixed(1);
    document.getElementById("csv-latency").textContent = `${totalMs} ms (${contacts.length} rows)`;

    const clusterMap = {};
    (clusterData.clusters || []).forEach((c, idx) => {
      const recIds = c.record_ids || c.member_indices || [];
      recIds.forEach((rid) => {
        const mIdx = typeof rid === "string" && rid.startsWith("rec-") ? Number(rid.slice(4)) - 1 : Number(rid);
        clusterMap[mIdx] = {
          clusterNum: idx + 1,
          clusterId: c.cluster_id || `CLUSTER_${idx + 1}`,
          size: recIds.length,
          reasons: (c.linkage_reasons || []).join(", "),
        };
      });
    });

    const results = batchData.results || [];
    parsedCsvState.lastBatchResults = results;
    parsedCsvState.lastClusterMap = clusterMap;
    dlBtn.disabled = false;

    let totalHealCount = 0;
    const rowsHtml = results
      .map((r, i) => {
        const p = r.person || {};
        const t = r.job_title || {};
        const o = r.organization || {};
        const e = r.email || {};
        const ph = r.phone || {};
        const a = r.address || {};
        const heals = [
          ...(r.cross_healing_actions || []),
          ...(p.healing_actions || []),
          ...(t.healing_actions || []),
          ...(o.healing_actions || []),
          ...(e.healing_actions || []),
          ...(ph.healing_actions || []),
          ...(r.website?.healing_actions || []),
        ];
        totalHealCount += heals.length;
        const cInfo = clusterMap[i] || { clusterNum: i + 1, size: 1, reasons: "" };
        const clusterBadge =
          cInfo.size > 1
            ? `<span class="badge bg-light text-dark border" title="${esc(cInfo.reasons || "Merged duplicate entity")}">Cluster #${cInfo.clusterNum} (${cInfo.size}x)</span>`
            : `<span class="small text-muted">Cluster #${cInfo.clusterNum}</span>`;

        const addrFormatted = [a.street1, a.street2, a.city, a.state, a.postal_code, a.country]
          .filter(Boolean)
          .join(", ");

        return `<tr>
          <th scope="row">${i + 1}</th>
          <td>${clusterBadge}</td>
          <td>
            <div class="fw-bold">${esc(p.full_name || p.canonical_name)}</div>
            <div class="small text-muted">${esc(t.normalized_title || t.canonical_title)}</div>
          </td>
          <td>
            <div class="fw-bold">${esc(o.legal_name)}</div>
            ${o.dba_name ? `<div class="small text-muted">DBA: ${esc(o.dba_name)}</div>` : ""}
          </td>
          <td>
            <div>${esc(e.email)}</div>
            <div class="small text-muted font-monospace">${esc(ph.e164)}${ph.extension ? ` x${esc(ph.extension)}` : ""}</div>
          </td>
          <td>${esc(addrFormatted)}</td>
          <td>
            <span class="badge bg-light text-dark border">${(Number(r.overall_confidence || 0) * 100).toFixed(0)}%</span>
            ${heals.length ? `<div class="small text-muted mt-1">${heals.length} heal${heals.length === 1 ? "" : "s"}</div>` : ""}
          </td>
        </tr>`;
      })
      .join("");

    const uniqueCount = clusterData.cluster_count || results.length;
    out.innerHTML = `
      <div class="studio-kv-grid">
        ${kvCard("Rows Standardized", `${results.length} records`)}
        ${kvCard("Unique Entities", `${uniqueCount} (${results.length - uniqueCount} duplicates merged)`)}
        ${kvCard("Auto-Repair Actions", `${totalHealCount} cross-field & pillar heals`)}
      </div>
      <div tabindex="0" role="region" aria-labelledby="csv-results-caption" class="csv-results-table-wrap">
        <table class="csv-results-table">
          <caption id="csv-results-caption">
            Standardized &amp; Deduplicated Batch Results (${results.length} rows &rarr; ${uniqueCount} unique entities)
          </caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Cluster</th>
              <th scope="col">Person &amp; Title</th>
              <th scope="col">Organization (ISO 20275)</th>
              <th scope="col">Email &amp; E.164 Phone</th>
              <th scope="col">Standardized Address</th>
              <th scope="col">Quality</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      ${jsonDetails(batchData)}
    `;
  } catch (err) {
    out.innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`;
  }
}

function downloadStandardizedCsv() {
  if (!parsedCsvState.lastBatchResults) return;
  const appendedHeaders = [
    "std_cluster_id",
    "std_entity_key",
    "std_person_name",
    "std_job_title",
    "std_organization",
    "std_dba_name",
    "std_email",
    "std_phone_e164",
    "std_website",
    "std_street1",
    "std_street2",
    "std_city",
    "std_state",
    "std_postal_code",
    "std_country",
    "std_confidence",
    "std_healing_actions",
  ];
  const allHeaders = [...parsedCsvState.headers, ...appendedHeaders];
  const lines = [allHeaders.map(csvEscapeCell).join(",")];

  parsedCsvState.lastBatchResults.forEach((r, idx) => {
    const origRow = parsedCsvState.rows[idx] || [];
    const p = r.person || {};
    const t = r.job_title || {};
    const o = r.organization || {};
    const e = r.email || {};
    const ph = r.phone || {};
    const w = r.website || {};
    const a = r.address || {};
    const cInfo = parsedCsvState.lastClusterMap[idx] || { clusterNum: idx + 1 };
    const heals = [
      ...(r.cross_healing_actions || []),
      ...(p.healing_actions || []),
      ...(t.healing_actions || []),
      ...(o.healing_actions || []),
      ...(e.healing_actions || []),
      ...(ph.healing_actions || []),
      ...(w.healing_actions || []),
    ].join("|");

    const stdCols = [
      `CLUSTER_${cInfo.clusterNum}`,
      r.entity_key || "",
      p.full_name || p.canonical_name || "",
      t.normalized_title || t.canonical_title || "",
      o.legal_name || "",
      o.dba_name || "",
      e.email || "",
      ph.e164 ? `${ph.e164}${ph.extension ? ` ext. ${ph.extension}` : ""}` : "",
      w.url || "",
      a.street1 || "",
      a.street2 || "",
      a.city || "",
      a.state || "",
      a.postal_code || "",
      a.country || "",
      r.overall_confidence !== undefined ? Number(r.overall_confidence).toFixed(3) : "",
      heals,
    ];
    lines.push([...origRow, ...stdCols].map(csvEscapeCell).join(","));
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "entity_standardizer_enriched.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

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

function jsonDetails(data, sdkSnippet = "") {
  const sdkBlock = sdkSnippet
    ? `<details class="studio-json-details">
        <summary>Python SDK &amp; REST cURL Quickstart Snippet</summary>
        <pre class="studio-json-pre" tabindex="0" role="region" aria-label="SDK and cURL code snippet"><code>${esc(sdkSnippet)}</code></pre>
      </details>`
    : "";
  return `${sdkBlock}
  <details class="studio-json-details">
    <summary>Inspect Full JSON Payload</summary>
    <pre class="studio-json-pre" tabindex="0" role="region" aria-label="Raw JSON response"><code>${esc(JSON.stringify(data, null, 2))}</code></pre>
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
    const rawStreet1 = document.getElementById("addr-street1").value.trim();
    const rawStreet2 = document.getElementById("addr-street2").value.trim();
    const rawCity = document.getElementById("addr-city").value.trim();
    const stateZipRaw = document.getElementById("addr-state").value.trim();
    const rawZip = document.getElementById("addr-zip").value.trim();
    const rawCountry = document.getElementById("addr-country").value.trim() || "US";
    const body = {
      street1: rawStreet1 || null,
      street2: rawStreet2 || null,
      city: rawCity || null,
      state: stateZipRaw || null,
      postal_code: rawZip || null,
      country: rawCountry,
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

    const sdkSnippet = `from entity_standardizer import standardize_address

res = standardize_address(
    street1=${JSON.stringify(rawStreet1)},
    street2=${JSON.stringify(rawStreet2 || null)},
    city=${JSON.stringify(rawCity)},
    state=${JSON.stringify(stateZipRaw)},
    postal_code=${JSON.stringify(rawZip)},
    country=${JSON.stringify(rawCountry)},
    enable_geocoding=${body.enable_geocoding ? "True" : "False"},
)
print(res.street1, res.city, res.state, res.postal_code, res.normalized_address_key)`;

    out.innerHTML = `
      <div class="diff-grid">
        <div class="diff-box diff-box-before">
          <div class="studio-kv-label">Before (Raw Input)</div>
          <div class="fw-bold">${esc(rawStreet1)}${rawStreet2 ? ` <span class="text-muted">(${esc(rawStreet2)})</span>` : ""}</div>
          <div class="small text-muted">${esc(rawCity)}, ${esc(stateZipRaw)} ${esc(rawZip)} \u2022 ${esc(rawCountry)}</div>
        </div>
        <div class="diff-box diff-box-after">
          <div class="studio-kv-label">After (Canonical USPS Pub 28 / UPU S42)</div>
          <div class="fw-bold">${esc(data.street1)}${data.street2 ? ` <span class="text-muted">(${esc(data.street2)})</span>` : ""}</div>
          <div class="small text-muted">${esc(data.city)}, ${esc(data.state)} ${esc(data.postal_code)} \u2022 ${esc(data.country)}</div>
        </div>
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
      ${jsonDetails(data, sdkSnippet)}
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
    const org = data.organization || {};
    const person = data.person || {};
    const title = data.job_title || {};
    const email = data.email || {};
    const phone = data.phone || {};
    const web = data.website || {};
    const social = data.social || {};
    const addr = data.address || {};

    const allHealBadges = [
      ...(data.cross_healing_actions || []).map((a) =>
        typeof a === "string"
          ? `<span class="heal-badge"><strong>CROSS-PILLAR:</strong> ${esc(a)}</span>`
          : `<span class="heal-badge"><strong>${esc(a.action_type || a.rule || "HEALED")}:</strong> ${esc(a.source_field)} &rarr; ${esc(a.target_field)}</span>`
      ),
      ...(person.healing_actions || []).map((a) => `<span class="heal-badge"><strong>PERSON:</strong> ${esc(a)}</span>`),
      ...(title.healing_actions || []).map((a) => `<span class="heal-badge"><strong>TITLE:</strong> ${esc(a)}</span>`),
      ...(org.healing_actions || []).map((a) => `<span class="heal-badge"><strong>ORG:</strong> ${esc(a)}</span>`),
      ...(email.healing_actions || []).map((a) => `<span class="heal-badge"><strong>EMAIL:</strong> ${esc(a)}</span>`),
      ...(web.healing_actions || []).map((a) => `<span class="heal-badge"><strong>WEB:</strong> ${esc(a)}</span>`),
      ...(social.healing_actions || []).map((a) => `<span class="heal-badge"><strong>SOCIAL:</strong> ${esc(a)}</span>`),
      ...(phone.healing_actions || []).map((a) => `<span class="heal-badge"><strong>PHONE:</strong> ${esc(a)}</span>`),
    ].join(" ");

    const confPct = `${(Number(data.overall_confidence || 0) * 100).toFixed(0)}%`;

    out.innerHTML = `
      <div class="studio-hero-box">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="small text-muted fw-bold text-uppercase">Unified Golden Record Entity Key</span>
          <span class="badge bg-light text-dark border">Overall Confidence: ${confPct}</span>
        </div>
        <div class="fw-bold font-monospace small">${esc(data.entity_key)}</div>
        <div class="score-meter-track"><div class="score-meter-fill" style="--score-pct: ${confPct}"></div></div>
      </div>
      ${allHealBadges ? `<div><div class="small fw-bold text-muted mb-1">Cross-Healing &amp; Pillar Repair Actions Triggered:</div><div class="d-flex flex-wrap gap-1">${allHealBadges}</div></div>` : ""}
      <div class="studio-kv-grid">
        ${kvCard("Person Canonical", person.full_name || person.canonical_name)}
        ${kvCard("Credentials / Honorific", [person.salutation, (person.credentials || []).join(", ")].filter(Boolean).join(" \u2022 "))}
        ${kvCard("Job Title / Seniority", `${title.normalized_title || title.canonical_title || "\u2014"} (${title.seniority_level || "Standard"} / ${title.department || "General"})`)}
        ${kvCard("Organization Legal Name", org.legal_name)}
        ${kvCard("Brand Stem / DBA", [org.brand_stem, org.dba_name ? `DBA: ${org.dba_name}` : ""].filter(Boolean).join(" \u2022 "))}
        ${kvCard("Canonical Email", email.email || email.canonical_email)}
        ${kvCard("Clean Website URL", web.url || web.canonical_url)}
        ${kvCard("E.164 Phone + Ext", `${phone.e164 || "\u2014"}${phone.extension ? ` ext. ${phone.extension}` : ""}`)}
        ${kvCard("Standardized Address", [addr.street1, addr.street2, addr.city, addr.state, addr.postal_code].filter(Boolean).join(", "))}
      </div>
      ${jsonDetails(data)}
    `;
  } catch (err) {
    out.innerHTML = `<div class="alert alert-danger">${esc(err.message)}</div>`;
  }
}

async function runPillarsDeepDive() {
  const out = document.getElementById("pillars-output");
  try {
    const companyRaw = document.getElementById("pil-company").value.trim();
    const personRaw = document.getElementById("pil-person").value.trim();
    const titleRaw = document.getElementById("pil-title").value.trim();
    const emailRaw = document.getElementById("pil-email").value.trim();
    const urlRaw = document.getElementById("pil-url").value.trim();
    const socialRaw = document.getElementById("pil-social").value.trim();

    const t0 = performance.now();
    const [co, pe, ti, em, ur, so] = await Promise.all([
      apiPost("/v1/company", { name: companyRaw, country: "US" }, "pillars-latency"),
      apiPost("/v1/person", { name: personRaw }, "pillars-latency"),
      apiPost("/v1/job-title", { title: titleRaw }, "pillars-latency"),
      apiPost("/v1/email", { email: emailRaw }, "pillars-latency"),
      apiPost("/v1/url", { url: urlRaw }, "pillars-latency"),
      apiPost("/v1/social", { profile: socialRaw }, "pillars-latency"),
    ]);
    document.getElementById("pillars-latency").textContent = `${(performance.now() - t0).toFixed(1)} ms (6 calls)`;

    out.innerHTML = `
      <div class="studio-hero-box">
        <div class="small text-muted fw-bold text-uppercase mb-1">1. Organization Parser (ISO 20275 ELF)</div>
        <div class="fw-bold">${esc(co.legal_name)} ${co.dba_name ? `<span class="text-muted">(DBA: ${esc(co.dba_name)})</span>` : ""}</div>
        <div class="small text-muted">Brand Key: <code>${esc(co.brand_key)}</code> \u2022 Phonetic: <code>${esc(co.phonetic_key)}</code> \u2022 Heals: <code>${esc((co.healing_actions || []).join(", ") || "None")}</code></div>
      </div>
      <div class="studio-kv-grid">
        ${kvCard("Person Canonical", `${pe.full_name || "\u2014"} (Root: ${pe.root_first_name || pe.first_name || "\u2014"})`)}
        ${kvCard("Nickname / Suffix / Creds", [pe.nickname ? `Nick: ${pe.nickname}` : "", pe.generational_suffix, (pe.credentials || []).join(", ")].filter(Boolean).join(" \u2022 "))}
        ${kvCard("Job Title Canonical", ti.normalized_title)}
        ${kvCard("Seniority & Department", `${ti.seniority_level || "Standard"} \u2022 ${ti.department || "General"} ${ti.is_executive ? "(Executive)" : ""}`)}
        ${kvCard("Canonical Email & +Tag", `${em.email || "\u2014"} ${em.subaddress ? `(Subaddress: +${em.subaddress})` : ""}`)}
        ${kvCard("Email Classification", `${em.email_type || "STANDARD"} (Free: ${em.is_free_provider ? "Yes" : "No"}, Role: ${em.is_role_account ? "Yes" : "No"})`)}
        ${kvCard("Clean Website URL", `${ur.url || "\u2014"} (Domain: ${ur.domain || "\u2014"})`)}
        ${kvCard("Social Handle & Platform", `${so.platform || "\u2014"}: @${so.handle || "\u2014"} (${so.profile_type || "PROFILE"})`)}
      </div>
      ${jsonDetails({ company: co, person: pe, job_title: ti, email: em, url: ur, social: so })}
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
      const pct = `${(Number(data.score || 0) * 100).toFixed(1)}%`;
      out.innerHTML = `
        <div class="studio-hero-box">
          <div class="small text-muted fw-bold text-uppercase mb-1">ISO 20275 Company Resolution Verdict</div>
          <div class="h5 fw-bold mb-1">
            ${data.is_match ? "MATCH" : "DISTINCT"} \u2022 Score: ${pct} (${esc(data.match_type)})
          </div>
          <div class="score-meter-track"><div class="score-meter-fill" style="--score-pct: ${pct}"></div></div>
        </div>
        <div class="studio-kv-grid">
          ${kvCard("Company A Legal Name", data.company_a?.legal_name)}
          ${kvCard("Company B Legal Name", data.company_b?.legal_name)}
          ${kvCard("Company A Brand Key", data.company_a?.brand_key)}
          ${kvCard("Company B Brand Key", data.company_b?.brand_key)}
          ${kvCard("Company A DBA / Suffix", `${data.company_a?.legal_suffix || "\u2014"} / ${data.company_a?.dba_name || "\u2014"}`)}
          ${kvCard("Company B DBA / Suffix", `${data.company_b?.legal_suffix || "\u2014"} / ${data.company_b?.dba_name || "\u2014"}`)}
        </div>
        ${jsonDetails(data)}
      `;
    } else if (mode === "address-pair") {
      const a = document.getElementById("dedup-entity-a").value.trim();
      const b = document.getElementById("dedup-entity-b").value.trim();
      const data = await apiPost("/v1/address/compare", { address_a: a, address_b: b }, "dedup-latency");
      const pct = `${(Number(data.similarity || data.score || 0) * 100).toFixed(1)}%`;
      out.innerHTML = `
        <div class="studio-hero-box">
          <div class="small text-muted fw-bold text-uppercase mb-1">Address Comparison Verdict</div>
          <div class="h5 fw-bold mb-1">
            ${data.is_match ? "MATCH" : "DISTINCT"} \u2022 Similarity: ${pct} (${esc(data.match_type)})
          </div>
          <div class="score-meter-track"><div class="score-meter-fill" style="--score-pct: ${pct}"></div></div>
        </div>
        ${jsonDetails(data)}
      `;
    } else if (mode === "person-pair") {
      const a = document.getElementById("dedup-entity-a").value.trim();
      const b = document.getElementById("dedup-entity-b").value.trim();
      const data = await apiPost("/v1/person/compare", { person_a: a, person_b: b }, "dedup-latency");
      const pct = `${(Number(data.score || 0) * 100).toFixed(1)}%`;
      out.innerHTML = `
        <div class="studio-hero-box">
          <div class="small text-muted fw-bold text-uppercase mb-1">Person Name &amp; Nickname Root Resolution</div>
          <div class="h5 fw-bold mb-1">
            ${data.is_match ? "MATCH" : "DISTINCT"} \u2022 Score: ${pct} (${esc(data.match_type)})
          </div>
          <div class="score-meter-track"><div class="score-meter-fill" style="--score-pct: ${pct}"></div></div>
        </div>
        <div class="studio-kv-grid">
          ${kvCard("Person A Root Key", data.person_a?.person_root_key)}
          ${kvCard("Person B Root Key", data.person_b?.person_root_key)}
          ${kvCard("Person A Heals", (data.person_a?.healing_actions || []).join(", "))}
          ${kvCard("Person B Heals", (data.person_b?.healing_actions || []).join(", "))}
        </div>
        ${jsonDetails(data)}
      `;
    } else if (mode === "email-pair") {
      const a = document.getElementById("dedup-entity-a").value.trim();
      const b = document.getElementById("dedup-entity-b").value.trim();
      const data = await apiPost("/v1/email/compare", { email_a: a, email_b: b }, "dedup-latency");
      const pct = `${(Number(data.score || 0) * 100).toFixed(1)}%`;
      out.innerHTML = `
        <div class="studio-hero-box">
          <div class="small text-muted fw-bold text-uppercase mb-1">Email Subaddress &amp; Alias Resolution</div>
          <div class="h5 fw-bold mb-1">
            ${data.is_match ? "MATCH" : "DISTINCT"} \u2022 Score: ${pct} (${esc(data.match_type)})
          </div>
          <div class="score-meter-track"><div class="score-meter-fill" style="--score-pct: ${pct}"></div></div>
        </div>
        <div class="studio-kv-grid">
          ${kvCard("Email A Canonical", data.email_a?.email)}
          ${kvCard("Email B Canonical", data.email_b?.email)}
          ${kvCard("Email A +Tag Extracted", data.email_a?.subaddress)}
          ${kvCard("Email B +Tag Extracted", data.email_b?.subaddress)}
        </div>
        ${jsonDetails(data)}
      `;
    } else {
      const rawJson = JSON.parse(document.getElementById("dedup-records-json").value);
      const data = await apiPost("/v1/contact/cluster", { records: rawJson }, "dedup-latency");
      const clustersHtml = (data.clusters || [])
        .map((c, i) => {
          const recIds = c.record_ids || c.member_indices || [];
          const reasons = (c.linkage_reasons || []).join(", ") || "Distinct Entity";
          return `
          <div class="studio-kv-item">
            <span class="studio-kv-label">${esc(c.cluster_id || `Cluster #${i + 1}`)} (${recIds.length} records merged)</span>
            <span class="studio-kv-value">Records: [${esc(recIds.join(", "))}]</span>
            <div class="small text-muted mt-1">Linkage: ${esc(reasons)}</div>
          </div>`;
        })
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
    const exp = data.explanation || {};
    const healList = (exp.healing_actions || rec.healing_actions || []).join(", ") || "None";
    const riskList = (exp.risk_flags || rec.risk_flags || []).join(", ") || "None";
    const routingTier = exp.routing_tier || rec.routing_tier || "AUTO_PASS";

    out.innerHTML = `
      <div class="studio-hero-box">
        <div class="small text-muted fw-bold text-uppercase mb-1">ITU-T E.164 Canonical Number</div>
        <div class="h4 fw-bold mb-1">${esc(rec.e164)}${rec.extension ? ` <span class="text-muted">ext. ${esc(rec.extension)}</span>` : ""}</div>
        <div class="small text-muted">International: <strong>${esc(rec.international)}</strong> \u2022 National: <strong>${esc(rec.national)}</strong> \u2022 RFC 3966: <code>${esc(rec.rfc3966)}</code></div>
      </div>
      <div class="studio-kv-grid">
        ${kvCard("Validation Status", rec.is_valid ? `Valid (${routingTier})` : "Invalid / Partial")}
        ${kvCard("Country ISO / Code", `${rec.country_iso2 || "\u2014"} (+${rec.country_calling_code || rec.calling_code || "\u2014"})`)}
        ${kvCard("Line Classification", rec.line_type || intel.line_type || "Standard")}
        ${kvCard("Geographic Region", [intel.locality, rec.region_code].filter(Boolean).join(", ") || "\u2014")}
        ${kvCard("Time Zone", (intel.timezones || []).join(", ") || "\u2014")}
        ${kvCard("Confidence Score", rec.confidence !== undefined ? `${(Number(rec.confidence) * 100).toFixed(0)}%` : "\u2014")}
      </div>
      <div class="small text-muted"><strong>Normalization Audit Trail:</strong> Healing Actions: <code>${esc(healList)}</code> \u2022 Risk Flags: <code>${esc(riskList)}</code></div>
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
  } else if (key.startsWith("pillars-")) {
    document.getElementById("pil-company").value = p.company;
    document.getElementById("pil-person").value = p.person;
    document.getElementById("pil-title").value = p.title;
    document.getElementById("pil-email").value = p.email;
    document.getElementById("pil-url").value = p.url;
    document.getElementById("pil-social").value = p.social;
    runPillarsDeepDive();
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

  function activateStudioTab(target, moveFocus = false) {
    const tab = document.querySelector(`.studio-tab[data-tab="${target}"]`);
    if (!tab) return;
    document.querySelectorAll(".studio-tab").forEach((t) => {
      const active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    if (typeof tab.scrollIntoView === "function") {
      tab.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    document.querySelectorAll(".studio-panel").forEach((panel) => {
      const isTarget = panel.id === `panel-${target}`;
      panel.hidden = !isTarget;
      panel.classList.toggle("active", isTarget);
    });
    if (target === "contact" && !document.getElementById("contact-output").innerHTML) {
      runContactCrossHealing();
    } else if (target === "pillars" && !document.getElementById("pillars-output").innerHTML) {
      runPillarsDeepDive();
    } else if (target === "dedup" && !document.getElementById("dedup-output").innerHTML) {
      runDeduplication();
    } else if (target === "phone" && !document.getElementById("phone-output").innerHTML) {
      runPhoneInspector();
      runDialPlanLookup();
    } else if (target === "csv" && !parsedCsvState.rows.length) {
      loadCsvTextIntoMapper(SAMPLE_CSV_TEXT);
      runCsvBatchStandardization();
    }
    if (moveFocus && target === "csv") {
      const heading = document.getElementById("csv-panel-heading");
      if (heading) heading.focus();
    }
  }

  // Tab switching
  document.querySelectorAll(".studio-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activateStudioTab(tab.getAttribute("data-tab"), false);
    });
  });

  // Top Header & Quick-Start Banner CSV buttons
  const headerCsvBtn = document.getElementById("btn-header-csv-jump");
  if (headerCsvBtn) {
    headerCsvBtn.addEventListener("click", () => activateStudioTab("csv", true));
  }
  const quickUploadBtn = document.getElementById("btn-quick-upload-csv");
  if (quickUploadBtn) {
    quickUploadBtn.addEventListener("click", () => {
      activateStudioTab("csv", true);
      const csvInput = document.getElementById("csv-file-input");
      if (csvInput) csvInput.click();
    });
  }
  const quickSampleBtn = document.getElementById("btn-quick-sample-csv");
  if (quickSampleBtn) {
    quickSampleBtn.addEventListener("click", () => {
      activateStudioTab("csv", true);
      loadCsvTextIntoMapper(SAMPLE_CSV_TEXT);
      runCsvBatchStandardization();
    });
  }

  // Preset buttons
  document.querySelectorAll(".preset-btn[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => applyPreset(btn.getAttribute("data-preset")));
  });

  // Autocomplete prefix quick chips
  document.querySelectorAll(".auto-prefix-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("addr-autocomplete-input").value = btn.getAttribute("data-prefix") || "";
      runAutocomplete();
    });
  });

  // Dial plan quick country pills
  document.querySelectorAll(".dialplan-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("dialplan-iso").value = btn.getAttribute("data-iso") || "US";
      runDialPlanLookup();
    });
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

  document.getElementById("form-pillars").addEventListener("submit", (e) => {
    e.preventDefault();
    runPillarsDeepDive();
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

  // Batch CSV Upload & Export handlers
  const csvFileInput = document.getElementById("csv-file-input");
  const csvDropzone = document.getElementById("csv-dropzone");
  if (csvFileInput) {
    csvFileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        loadCsvTextIntoMapper(String(reader.result || ""));
        runCsvBatchStandardization();
      };
      reader.readAsText(file);
    });
  }
  if (csvDropzone) {
    csvDropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      csvDropzone.classList.add("dragover");
    });
    csvDropzone.addEventListener("dragleave", () => {
      csvDropzone.classList.remove("dragover");
    });
    csvDropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      csvDropzone.classList.remove("dragover");
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        loadCsvTextIntoMapper(String(reader.result || ""));
        runCsvBatchStandardization();
      };
      reader.readAsText(file);
    });
  }
  document.getElementById("btn-csv-sample").addEventListener("click", () => {
    loadCsvTextIntoMapper(SAMPLE_CSV_TEXT);
    runCsvBatchStandardization();
  });
  const sampleAddrBtn = document.getElementById("btn-csv-sample-addr");
  if (sampleAddrBtn) {
    sampleAddrBtn.addEventListener("click", () => {
      loadCsvTextIntoMapper(SAMPLE_ADDRESS_CSV_TEXT);
      runCsvBatchStandardization();
    });
  }
  document.getElementById("btn-csv-template").addEventListener("click", () => {
    const blob = new Blob([SAMPLE_CSV_TEXT], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "entity_standardizer_sample_template.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
  const csvRawTextarea = document.getElementById("csv-raw-textarea");
  if (csvRawTextarea) {
    csvRawTextarea.addEventListener("input", () => {
      loadCsvTextIntoMapper(csvRawTextarea.value, false);
    });
  }
  document.getElementById("btn-run-csv-batch").addEventListener("click", runCsvBatchStandardization);
  document.getElementById("btn-download-csv").addEventListener("click", downloadStandardizedCsv);

  // Initial load on Tab 1
  runAddressStandardization();
  runAutocomplete();
});
