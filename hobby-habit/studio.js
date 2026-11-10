const PROJECTS = {
  woodworking: {
    name: "Walnut Dining Table",
    hobby: "Fine Woodworking",
    hours: 68.5,
    description: "8-foot black walnut trestle table with hand-cut mortise and tenon joinery and oil-wax finish.",
    goals: [
      { id: "w1", title: "Mill rough 8/4 walnut boards to 1.75\" thickness", done: true, est: "8 hrs" },
      { id: "w2", title: "Edge-joint and glue up 40\" x 96\" tabletop slab", done: true, est: "10 hrs" },
      { id: "w3", title: "Cut wedged through-tenons for trestle base", done: true, est: "14 hrs" },
      { id: "w4", title: "Hand-plane & sand surfaces to 220 grit + apply hardwax oil", done: false, est: "12 hrs" },
    ],
  },
  guitar: {
    name: "Villa-Lobos 5 Preludes",
    hobby: "Classical Guitar",
    hours: 44.0,
    description: "Performance preparation and tempo mastery for Heitor Villa-Lobos's Complete Solo Guitar Preludes.",
    goals: [
      { id: "g1", title: "Prelude No. 1 in E Minor — lyrical cello melody voicing", done: true, est: "10 hrs" },
      { id: "g2", title: "Prelude No. 2 in E Major — right-hand arpeggio section at 108 BPM", done: true, est: "12 hrs" },
      { id: "g3", title: "Prelude No. 3 in A Minor — Bach-style sequential phrasing", done: true, est: "8 hrs" },
      { id: "g4", title: "Prelude No. 4 & 5 full memory run-through + studio recording", done: false, est: "14 hrs" },
    ],
  },
  hydroponics: {
    name: "Automated NFT Hydroponics Rack",
    hobby: "Indoor Gardening & IoT",
    hours: 30.0,
    description: "Recirculating Nutrient Film Technique (NFT) channel rack with ESP32 pH/EC telemetry and dosing.",
    goals: [
      { id: "h1", title: "Assemble 3-tier food-grade PVC channel manifold and reservoir", done: true, est: "6 hrs" },
      { id: "h2", title: "Calibrate Atlas Scientific pH and electrical conductivity probes", done: true, est: "5 hrs" },
      { id: "h3", title: "Configure Home Assistant & PostgreSQL time-series alerts", done: true, est: "8 hrs" },
      { id: "h4", title: "Complete 45-day basil & heirloom lettuce harvest cycle", done: false, est: "11 hrs" },
    ],
  },
};

const SESSIONS = [
  { project: "Walnut Dining Table", duration: 2.0, date: "Today", note: "Fit trestle stretcher wedges and leveled feet." },
  { project: "Villa-Lobos 5 Preludes", duration: 1.25, date: "Yesterday", note: "Slow metronome work on Prelude No. 2 slurs." },
  { project: "Automated NFT Hydroponics Rack", duration: 1.5, date: "2 days ago", note: "Balanced reservoir EC to 1.6 mS/cm and pH 5.8." },
];

const BLUEPRINTS = [
  {
    id: "bp1",
    title: "Traditional Japanese Kumiko Lantern",
    author: "@woodcraft_ken",
    hobby: "Fine Woodworking",
    milestones: 6,
    estHours: "24 hrs",
    summary: "Step-by-step jig setup and Asa-no-ha pattern assembly using basswood strips and shoji paper.",
    adopted: false,
  },
  {
    id: "bp2",
    title: "12-Week Fingerstyle Arrangement Lab",
    author: "@acoustic_maya",
    hobby: "Music & Guitar",
    milestones: 8,
    estHours: "36 hrs",
    summary: "Structured milestone progression covering thumb independence, harmonic voicings, and transcription.",
    adopted: false,
  },
  {
    id: "bp3",
    title: "Self-Hosted Home Lab & Monitoring Stack",
    author: "@jake_white",
    hobby: "Systems & Homelab",
    milestones: 5,
    estHours: "18 hrs",
    summary: "Docker Compose + Nginx Proxy Manager + automated PostgreSQL backups and health telemetry.",
    adopted: false,
  },
];

const INVENTORY = [
  { name: "Lie-Nielsen No. 5 Jack Plane", category: "Tool", status: "Ready (Honed)", project: "Walnut Dining Table" },
  { name: "8/4FAS Black Walnut Lumber (65 BF)", category: "Material", status: "In Use", project: "Walnut Dining Table" },
  { name: "Rubio Monocoat Pure 2C Oil", category: "Material", status: "In Stock", project: "Walnut Dining Table" },
  { name: "Cordoba Luthier Cedar Concert Guitar", category: "Tool", status: "Ready", project: "Villa-Lobos 5 Preludes" },
  { name: "Savarez 510ARJ Cantiga Strings", category: "Material", status: "2 Sets Remaining", project: "Villa-Lobos 5 Preludes" },
  { name: "ESP32 + Atlas pH/EC Sensor Array", category: "Tool", status: "Calibrated", project: "Automated NFT Hydroponics Rack" },
];

let activeProjectKey = "woodworking";
let activeInvFilter = "all";

function esc(val) {
  return String(val || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function updateSummaryMetrics() {
  const projList = Object.values(PROJECTS);
  const totalHours = projList.reduce((acc, p) => acc + p.hours, 0);
  const allGoals = projList.flatMap((p) => p.goals);
  const doneGoals = allGoals.filter((g) => g.done).length;
  const pct = Math.round((doneGoals / allGoals.length) * 100);

  document.getElementById("metric-hours").textContent = `${totalHours.toFixed(1)} hrs`;
  document.getElementById("metric-goals").textContent = `${doneGoals} / ${allGoals.length}`;
  document.getElementById("metric-pct").textContent = `${pct}% roadmap completion`;
}

function renderActiveProject() {
  const p = PROJECTS[activeProjectKey];
  const doneCount = p.goals.filter((g) => g.done).length;
  const pct = Math.round((doneCount / p.goals.length) * 100);

  document.getElementById("project-detail-box").innerHTML = `
    <div class="p-3 rounded border bg-light">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span class="badge bg-white text-dark border">${esc(p.hobby)}</span>
        <span class="small fw-bold text-muted">${p.hours.toFixed(1)} hrs logged &bull; ${pct}% Complete</span>
      </div>
      <h3 class="h5 fw-bold mb-1 mt-2">${esc(p.name)}</h3>
      <p class="small text-muted mb-2">${esc(p.description)}</p>
      <div class="hh-progress-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="hh-progress-fill" style="width: ${pct}%"></div>
      </div>
    </div>
  `;

  const goalContainer = document.getElementById("goal-list");
  goalContainer.innerHTML = p.goals
    .map(
      (g) => `
      <button type="button" class="hh-goal-item ${g.done ? "completed" : ""}" data-goal-id="${esc(g.id)}">
        <div>
          <span class="me-2">${g.done ? "&#9989;" : "&#9744;"}</span>
          <span class="hh-goal-title fw-bold small">${esc(g.title)}</span>
        </div>
        <span class="badge bg-white text-dark border">${esc(g.est)}</span>
      </button>
    `
    )
    .join("");

  goalContainer.querySelectorAll(".hh-goal-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-goal-id");
      const goal = p.goals.find((item) => item.id === id);
      if (goal) {
        goal.done = !goal.done;
        renderActiveProject();
        updateSummaryMetrics();
      }
    });
  });
}

function renderSessions() {
  const container = document.getElementById("session-feed");
  container.innerHTML = SESSIONS.slice(0, 5)
    .map(
      (s) => `
      <div class="hh-session-card">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong class="small">${esc(s.project)}</strong>
          <span class="badge bg-white text-dark border">${s.duration.toFixed(2)} hrs &bull; ${esc(s.date)}</span>
        </div>
        <div class="small text-muted">${esc(s.note)}</div>
      </div>
    `
    )
    .join("");
}

function renderBlueprints() {
  const adoptedCount = BLUEPRINTS.filter((b) => b.adopted).length;
  document.getElementById("adopted-count-badge").textContent = `${adoptedCount} Blueprint${adoptedCount === 1 ? "" : "s"} Cloned in Sandbox`;

  const grid = document.getElementById("blueprint-grid");
  grid.innerHTML = BLUEPRINTS.map(
    (b) => `
    <div class="col-md-4">
      <div class="modern-card h-100 d-flex flex-column justify-content-between p-3">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-light text-dark border">${esc(b.hobby)}</span>
            <span class="small text-muted">${esc(b.author)}</span>
          </div>
          <h3 class="h6 fw-bold mb-2">${esc(b.title)}</h3>
          <p class="small text-muted mb-3">${esc(b.summary)}</p>
        </div>
        <div>
          <div class="small text-muted mb-2">${b.milestones} milestones &bull; Est. ${esc(b.estHours)}</div>
          <button type="button" class="btn btn-sm ${b.adopted ? "btn-outline-secondary" : "btn-custom-primary"} rounded-pill w-100 bp-adopt-btn" data-bp-id="${esc(b.id)}">
            ${b.adopted ? "Cloned to Workspace &#10003;" : "Clone Blueprint"}
          </button>
        </div>
      </div>
    </div>
  `
  ).join("");

  grid.querySelectorAll(".bp-adopt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const bp = BLUEPRINTS.find((item) => item.id === btn.getAttribute("data-bp-id"));
      if (bp) {
        bp.adopted = !bp.adopted;
        renderBlueprints();
      }
    });
  });
}

function renderInventory() {
  const items = INVENTORY.filter((i) => activeInvFilter === "all" || i.category === activeInvFilter);
  document.getElementById("inventory-grid").innerHTML = items
    .map(
      (item) => `
      <div class="col-md-4">
        <div class="p-3 rounded border bg-light h-100">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="badge bg-white text-dark border">${esc(item.category)}</span>
            <span class="small fw-bold text-success">${esc(item.status)}</span>
          </div>
          <div class="fw-bold mt-2">${esc(item.name)}</div>
          <div class="small text-muted mt-1">Linked: ${esc(item.project)}</div>
        </div>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  // Mark sessionStorage so clicking "Open Full App (My Hub)" enters /hub cleanly
  const hubBtn = document.getElementById("open-full-hub-btn");
  if (hubBtn) {
    hubBtn.addEventListener("click", () => {
      try {
        sessionStorage.setItem("hh_launched", "1");
      } catch (_) {}
    });
  }

  // Tab switching
  document.querySelectorAll(".hh-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      document.querySelectorAll(".hh-tab").forEach((t) => {
        const active = t === tab;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      document.querySelectorAll(".hh-panel").forEach((panel) => {
        const isTarget = panel.id === `panel-${target}`;
        panel.hidden = !isTarget;
        panel.classList.toggle("active", isTarget);
      });
    });
  });

  // Project switching
  document.querySelectorAll(".project-select-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeProjectKey = btn.getAttribute("data-project");
      document.querySelectorAll(".project-select-btn").forEach((b) => b.classList.toggle("active", b === btn));
      renderActiveProject();
    });
  });

  // Session form
  document.getElementById("form-log-session").addEventListener("submit", (e) => {
    e.preventDefault();
    const hrs = parseFloat(document.getElementById("session-hours").value) || 1.0;
    const note = document.getElementById("session-note").value.trim() || "Logged practice session.";
    const p = PROJECTS[activeProjectKey];
    p.hours += hrs;
    SESSIONS.unshift({ project: p.name, duration: hrs, date: "Just now", note });
    renderActiveProject();
    renderSessions();
    updateSummaryMetrics();
  });

  // Inventory filter
  document.querySelectorAll(".inv-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeInvFilter = btn.getAttribute("data-filter");
      document.querySelectorAll(".inv-filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
      renderInventory();
    });
  });

  updateSummaryMetrics();
  renderActiveProject();
  renderSessions();
  renderBlueprints();
  renderInventory();
});
