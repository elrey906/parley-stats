/**
 * Aplicación Principal - Parley Stats Dashboard (Core v3.0 - Zero State)
 */
import { OddsCalculator } from "./oddsCalculator.js";
import { KellyCriterion } from "./kellyCriterion.js";
import { MonteCarloSimulator } from "./monteCarlo.js";
import { SPORTS_DATA, TOP_PICKS_OF_THE_DAY } from "./sportsData.js";
import { STAKE_PICKS_OF_THE_DAY, STAKE_PARLAY_PRESETS } from "./sportsDataStake.js";
import { BetTracker } from "./betTracker.js";
import { ChartManager } from "./charts.js";

class ParleyApp {
  constructor() {
    // 1. Limpieza preventiva forzosa de claves legacy en localStorage
    try {
      localStorage.removeItem("parley_stats_tracker_bets");
      localStorage.removeItem("parley_stats_clean_v1");
      localStorage.removeItem("parley_stats_v2026_oficial");
    } catch (e) {
      console.warn("Storage cleanup exception:", e);
    }

    this.tracker = new BetTracker("parley_stats_v3_clean");
    this.chartManager = new ChartManager();

    // Casa de apuestas activa: 'stake' por defecto (USD / USDT) o 'parleyla'
    this.activeSportsbook = "parleyla";

    // 2. Parley Builder: Carrito de selecciones activas inicia en vacío []
    this.currentLegs = [];
    this.currentStake = 25;
    this.currentTopPicksFilter = "all";

    this.init();
  }

  init() {
    this.setupTabs();
    this.setupTopPicks();
    this.setupParlayCalculator();
    this.setupMonteCarlo();
    this.setupSportsStats();
    this.setupKellyTab();
    this.setupBetTracker();
    this.updateGlobalMetrics();
    this.updateBadgeCounts();
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    if (type === "success") toast.style.borderLeftColor = "#10b981";
    if (type === "error") toast.style.borderLeftColor = "#ef4444";
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  }

    setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        this.switchTab(tab);
      });
    });

    document.querySelectorAll(".btn-go-calc").forEach(btn => {
      btn.addEventListener("click", () => this.switchTab("calculator"));
    });
  }

  switchTab(tabName) {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const views = document.querySelectorAll(".view-content");

    tabButtons.forEach(b => {
      if (b.getAttribute("data-tab") === tabName) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    views.forEach(v => v.classList.remove("active"));
    const activeView = document.getElementById(`view-${tabName}`);
    if (activeView) {
      activeView.classList.add("active");
    }

    if (tabName === "picks-stake") {
      this.renderStakeGrid();
    } else if (tabName === "picks-parleyla") {
      this.renderParleyLaGrid();
    } else if (tabName === "monte-carlo") {
      this.runMonteCarlo();
    } else if (tabName === "tracker") {
      this.renderTrackerUI();
    }
  }

  updateBadgeCounts() {
    const count = this.currentLegs.length;
    const headerCount = document.getElementById("header-parlay-count");
    if (headerCount) headerCount.innerText = count;

    document.querySelectorAll(".badge-parlay-count").forEach(el => {
      el.innerText = count;
    });

    const legsCountBadge = document.getElementById("parlay-legs-count-badge");
    if (legsCountBadge) legsCountBadge.innerText = count;
  }

  /* =========================================================================
     0. DOS PESTAÑAS INDEPENDIENTES: STAKE.COM & PARLEY.LA
     ========================================================================= */
  setupTopPicks() {
    this.stakeFilter = "all";
    this.parleyLaFilter = "all";

    // 1. Filtros de Stake
    const stakePills = document.querySelectorAll("#pills-stake .pill-btn");
    stakePills.forEach(pill => {
      pill.addEventListener("click", () => {
        stakePills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.stakeFilter = pill.getAttribute("data-filter");
        this.renderStakeGrid();
      });
    });

    // 2. Filtros de Parley.la
    const plaPills = document.querySelectorAll("#pills-parleyla .pill-btn");
    plaPills.forEach(pill => {
      pill.addEventListener("click", () => {
        plaPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.parleyLaFilter = pill.getAttribute("data-filter");
        this.renderParleyLaGrid();
      });
    });

    // 3. Parleys prearmados Stake
    const sSafe = document.getElementById("btn-stake-parley-safe");
    if (sSafe) sSafe.addEventListener("click", () => this.loadPresetStake("safe"));

    const sOpt = document.getElementById("btn-stake-parley-opt");
    if (sOpt) sOpt.addEventListener("click", () => this.loadPresetStake("opt"));

    const sBomb = document.getElementById("btn-stake-parley-bomb");
    if (sBomb) sBomb.addEventListener("click", () => this.loadPresetStake("bomb"));

    // 4. Parleys prearmados Parley.la
    const pSafe = document.getElementById("btn-pla-parley-safe");
    if (pSafe) pSafe.addEventListener("click", () => this.loadPresetParleyLa("safe"));

    const pOpt = document.getElementById("btn-pla-parley-opt");
    if (pOpt) pOpt.addEventListener("click", () => this.loadPresetParleyLa("opt"));

    const pBomb = document.getElementById("btn-pla-parley-bomb");
    if (pBomb) pBomb.addEventListener("click", () => this.loadPresetParleyLa("bomb"));

    // Render inicial de ambas
    this.renderStakeGrid();
    this.renderParleyLaGrid();
  }

  renderStakeGrid() {
    const container = document.getElementById("stake-picks-grid");
    if (!container) return;
    container.innerHTML = "";

    const filter = this.stakeFilter || "all";
    const filtered = STAKE_PICKS_OF_THE_DAY.filter(pick => {
      if (filter === "all") return true;
      if (filter === "seguro" || filter === "valor" || filter === "bomba") {
        return pick.category === filter;
      }
      return pick.sport === filter;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 2rem; color:#64748b;">No hay picks disponibles para este filtro.</div>`;
      return;
    }

    filtered.forEach(pick => {
      const isSelected = this.currentLegs.some(leg => leg.match === pick.match && leg.selection === pick.selection);
      const card = document.createElement("div");
      card.className = `pick-card ${isSelected ? "selected-in-parlay" : ""}`;

      const stars = "★".repeat(pick.stars) + "☆".repeat(5 - pick.stars);
      const categoryBadge = pick.category === "seguro" 
        ? `<span class="badge badge-green">${pick.categoryLabel}</span>` 
        : `<span class="badge badge-blue">${pick.categoryLabel}</span>`;

      card.innerHTML = `
        <div>
          <div class="pick-card-top">
            <div>
              ${categoryBadge}
              <span style="font-size: 0.8rem; color: #94a3b8; margin-left: 0.4rem;">${pick.sportIcon} ${pick.league}</span>
            </div>
            <div class="pick-odds-box" style="border: 1px solid rgba(16, 185, 129, 0.4);">
              <div style="font-size: 0.7rem; color: #34d399; text-transform: uppercase;">Stake USD</div>
              <div class="pick-odds-number" style="color: #34d399;">@${pick.decimalOdds.toFixed(2)}</div>
            </div>
          </div>

          <div class="pick-match-title">${pick.match}</div>
          <div style="font-size: 0.8rem; color: #38bdf8; margin: 0.25rem 0; font-weight: 600;">
            🕒 <strong>${pick.gameDate || 'Hoy 05 Sep'}</strong> - <strong>${pick.gameTime || 'Hoy'}</strong>
          </div>
          <div style="font-size: 0.78rem; color: #cbd5e1; margin-bottom: 0.4rem; background: rgba(0,0,0,0.25); padding: 0.25rem 0.5rem; border-radius: 4px;">
            ⚾ <strong>Abridores:</strong> ${pick.pitchers || 'Confirmados'}
          </div>
          <div class="pick-selection-title" style="color: #f8fafc;">🎯 ${pick.selection}</div>

          <div class="pick-reasoning">
            💡 ${pick.reasoning}
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 0.82rem; color: #94a3b8;">
            <div>Confianza: <strong style="color: #f8fafc;">${pick.confidenceScore}%</strong> <span style="color:#fbbf24;">${stars}</span></div>
            <div>Ventaja: <strong style="color: #10b981;">${pick.edgePercent} EV</strong></div>
          </div>

          <div class="pick-metrics-footer">
            <button class="btn ${isSelected ? "btn-danger" : "btn-primary"} btn-sm toggle-stake-btn" style="width: 100%;" data-id="${pick.id}">
              ${isSelected ? "✕ Quitar del Parley" : "⚡ Añadir a Mi Parley"}
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll(".toggle-stake-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const pick = STAKE_PICKS_OF_THE_DAY.find(p => p.id === id);
        if (!pick) return;

        const idx = this.currentLegs.findIndex(l => l.match === pick.match && l.selection === pick.selection);
        if (idx >= 0) {
          this.removeLeg(idx);
          this.showToast(`Eliminado del Parley: ${pick.selection}`, "info");
        } else {
          this.addCustomLeg({
            id: pick.id,
            match: pick.match,
            selection: pick.selection + " [Stake]",
            decimalOdds: pick.decimalOdds,
            estimatedProb: pick.estimatedProb
          });
          this.showToast(`Añadido de Stake: ${pick.selection} (@${pick.decimalOdds})`, "success");
        }
        this.renderStakeGrid();
      });
    });
  }

  renderParleyLaGrid() {
    const container = document.getElementById("parleyla-picks-grid");
    if (!container) return;
    container.innerHTML = "";

    const filter = this.parleyLaFilter || "all";
    const filtered = TOP_PICKS_OF_THE_DAY.filter(pick => {
      if (filter === "all") return true;
      if (filter === "seguro" || filter === "valor" || filter === "bomba") {
        return pick.category === filter;
      }
      return pick.sport === filter;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 2rem; color:#64748b;">No hay picks disponibles para este filtro.</div>`;
      return;
    }

    filtered.forEach(pick => {
      const isSelected = this.currentLegs.some(leg => leg.match === pick.match && leg.selection.includes(pick.selection));
      const card = document.createElement("div");
      card.className = `pick-card ${isSelected ? "selected-in-parlay" : ""}`;

      const stars = "★".repeat(pick.stars) + "☆".repeat(5 - pick.stars);
      const categoryBadge = `<span class="badge badge-green">${pick.categoryLabel}</span>`;

      card.innerHTML = `
        <div>
          <div class="pick-card-top">
            <div>
              ${categoryBadge}
              <span style="font-size: 0.8rem; color: #94a3b8; margin-left: 0.4rem;">${pick.sportIcon} ${pick.league}</span>
            </div>
            <div class="pick-odds-box" style="border: 1px solid rgba(59, 130, 246, 0.4);">
              <div style="font-size: 0.7rem; color: #60a5fa; text-transform: uppercase;">Parley.la</div>
              <div class="pick-odds-number" style="color: #60a5fa;">@${pick.decimalOdds.toFixed(2)}</div>
            </div>
          </div>

          <div class="pick-match-title">${pick.match}</div>
          <div style="font-size: 0.82rem; color: #60a5fa; margin: 0.25rem 0; font-weight: 700;">
            🕒 <strong>${pick.gameDate || 'Hoy 05 Sep'}</strong> - <strong>${pick.gameTime || 'Hoy'}</strong>
          </div>
          <div style="font-size: 0.78rem; color: #cbd5e1; margin-bottom: 0.4rem; background: rgba(15, 23, 42, 0.6); padding: 0.3rem 0.5rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);">
            ⚾ <strong>Lanzadores:</strong> ${pick.pitchers || 'Confirmados'}
          </div>
          <div class="pick-selection-title">🎯 ${pick.selection}</div>

          <div class="pick-reasoning">
            💡 ${pick.reasoning}
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-size: 0.82rem; color: #94a3b8;">
            <div>Confianza: <strong style="color: #f8fafc;">${pick.confidenceScore}%</strong> <span style="color:#fbbf24;">${stars}</span></div>
            <div>Ventaja: <strong style="color: #10b981;">${pick.edgePercent} EV</strong></div>
          </div>

          <div class="pick-metrics-footer">
            <button class="btn ${isSelected ? "btn-danger" : "btn-primary"} btn-sm toggle-pla-btn" style="width: 100%;" data-id="${pick.id}">
              ${isSelected ? "✕ Quitar del Parley" : "⚡ Añadir a Mi Parley"}
            </button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll(".toggle-pla-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const pick = TOP_PICKS_OF_THE_DAY.find(p => p.id === id);
        if (!pick) return;

        const idx = this.currentLegs.findIndex(l => l.match === pick.match && l.selection.includes(pick.selection));
        if (idx >= 0) {
          this.removeLeg(idx);
          this.showToast(`Eliminado del Parley: ${pick.selection}`, "info");
        } else {
          this.addCustomLeg({
            id: pick.id,
            match: pick.match,
            selection: pick.selection + " [Parley.la]",
            decimalOdds: pick.decimalOdds,
            estimatedProb: pick.estimatedProb
          });
          this.showToast(`Añadido de Parley.la: ${pick.selection} (@${pick.decimalOdds})`, "success");
        }
        this.renderParleyLaGrid();
      });
    });
  }

  loadPresetStake(type) {
    const preset = STAKE_PARLAY_PRESETS[type];
    if (preset) {
      this.currentLegs = preset.legs.map(l => ({
        ...l,
        selection: l.selection + " [Stake]"
      }));
      this.showToast(`Cargado ${preset.title}`, "success");
      this.renderParlayLegs();
      this.renderParlaySummary();
      this.updateBadgeCounts();
      this.renderStakeGrid();
      this.switchTab("calculator");
    }
  }

  loadPresetParleyLa(type) {
    if (type === "safe") {
      this.currentLegs = [
        { id: "pla-1", match: "Phillies vs Marlins (6:40 PM)", selection: "Phillies a Ganar (R. Suárez) [Parley.la]", decimalOdds: 1.48, estimatedProb: 0.74 },
        { id: "pla-3", match: "Angels vs Rangers (8:05 PM)", selection: "Rangers a Ganar (C. Bradford) [Parley.la]", decimalOdds: 1.55, estimatedProb: 0.71 }
      ];
      this.showToast("Cargado Banquero de Hoy Parley.la (@2.29)", "success");
    } else if (type === "opt") {
      this.currentLegs = [
        { id: "pla-1", match: "Phillies vs Marlins (6:40 PM)", selection: "Phillies a Ganar (R. Suárez) [Parley.la]", decimalOdds: 1.48, estimatedProb: 0.74 },
        { id: "pla-2", match: "Nationals vs Pirates (6:40 PM)", selection: "Pirates a Ganar (B. Falter) [Parley.la]", decimalOdds: 1.63, estimatedProb: 0.68 },
        { id: "pla-3", match: "Angels vs Rangers (8:05 PM)", selection: "Rangers a Ganar (C. Bradford) [Parley.la]", decimalOdds: 1.55, estimatedProb: 0.71 }
      ];
      this.showToast("Cargado Parley Equilibrado Parley.la (@3.73)", "success");
    } else if (type === "bomb") {
      this.currentLegs = [
        { id: "pla-1", match: "Phillies vs Marlins (6:40 PM)", selection: "Phillies a Ganar (R. Suárez) [Parley.la]", decimalOdds: 1.48, estimatedProb: 0.74 },
        { id: "pla-2", match: "Nationals vs Pirates (6:40 PM)", selection: "Pirates a Ganar (B. Falter) [Parley.la]", decimalOdds: 1.63, estimatedProb: 0.68 },
        { id: "pla-4", match: "Rockies vs Braves (7:20 PM)", selection: "Braves a Ganar (R. López) [Parley.la]", decimalOdds: 1.40, estimatedProb: 0.77 },
        { id: "pla-5", match: "Tigers vs Padres (8:40 PM)", selection: "Padres a Ganar (M. Pérez) [Parley.la]", decimalOdds: 1.62, estimatedProb: 0.67 }
      ];
      this.showToast("Cargado Parley Multiplicador Parley.la (@5.22)", "success");
    }

    this.renderParlayLegs();
    this.renderParlaySummary();
    this.updateBadgeCounts();
    this.renderParleyLaGrid();
    this.switchTab("calculator");
  }

  /* =========================================================================
     1. CALCULADORA DE PARLEY
     ========================================================================= */
  setupParlayCalculator() {
    const stakeInput = document.getElementById("parlay-stake-input");
    if (stakeInput) {
      stakeInput.addEventListener("input", (e) => {
        this.currentStake = parseFloat(e.target.value) || 0;
        this.renderParlaySummary();
      });
    }

    const addBtn = document.getElementById("btn-add-custom-leg");
    if (addBtn) addBtn.addEventListener("click", () => this.addCustomLeg());

    const saveBtn = document.getElementById("btn-save-parlay-to-tracker");
    if (saveBtn) saveBtn.addEventListener("click", () => this.saveCurrentParlayToTracker());

    const clearBtn = document.getElementById("btn-clear-parlay");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.currentLegs = [];
        this.renderParlayLegs();
        this.renderParlaySummary();
        this.updateBadgeCounts();
        this.renderTopPicksGrid();
        this.showToast("Parley reiniciado a cero.", "info");
      });
    }

    this.renderParlayLegs();
    this.renderParlaySummary();
  }

  addCustomLeg(customData = null) {
    const newLeg = customData || {
      id: Date.now(),
      match: "Partido Personalizado",
      selection: "Selección",
      decimalOdds: 1.90,
      estimatedProb: 0.52
    };
    this.currentLegs.push(newLeg);
    this.renderParlayLegs();
    this.renderParlaySummary();
    this.updateBadgeCounts();
  }

  removeLeg(index) {
    this.currentLegs.splice(index, 1);
    this.renderParlayLegs();
    this.renderParlaySummary();
    this.updateBadgeCounts();
    this.renderTopPicksGrid();
  }

  renderParlayLegs() {
    const container = document.getElementById("parlay-legs-container");
    if (!container) return;
    container.innerHTML = "";

    if (this.currentLegs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2.5rem; color: #64748b;">
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No hay selecciones en tu parley</p>
          <p style="font-size: 0.85rem;">Selecciona picks desde la pestaña de <strong>Top Picks del Día</strong> o añade una manual.</p>
        </div>
      `;
      return;
    }

    this.currentLegs.forEach((leg, index) => {
      const row = document.createElement("div");
      row.className = "leg-row";
      row.innerHTML = `
        <div class="leg-info">
          <input type="text" class="input-field" style="margin-bottom: 0.3rem;" value="${leg.match}" placeholder="Partido / Evento" data-field="match" data-index="${index}">
          <input type="text" class="input-field" value="${leg.selection}" placeholder="Pronóstico / Selección" data-field="selection" data-index="${index}">
        </div>
        <div>
          <label class="form-label" style="font-size: 0.75rem;">Cuota Decimal</label>
          <input type="number" step="0.01" min="1.01" class="input-field" value="${leg.decimalOdds}" data-field="decimalOdds" data-index="${index}">
        </div>
        <div>
          <label class="form-label" style="font-size: 0.75rem;">Prob. Real (%)</label>
          <input type="number" step="1" min="1" max="99" class="input-field" value="${Math.round((leg.estimatedProb || OddsCalculator.impliedProbability(leg.decimalOdds)) * 100)}" data-field="estimatedProb" data-index="${index}">
        </div>
        <div>
          <button class="btn btn-danger btn-sm" data-action="delete" data-index="${index}">✕</button>
        </div>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll("input").forEach(input => {
      input.addEventListener("change", (e) => {
        const idx = parseInt(e.target.getAttribute("data-index"));
        const field = e.target.getAttribute("data-field");
        if (field === "decimalOdds") {
          this.currentLegs[idx].decimalOdds = parseFloat(e.target.value) || 1.0;
        } else if (field === "estimatedProb") {
          this.currentLegs[idx].estimatedProb = (parseFloat(e.target.value) || 50) / 100;
        } else {
          this.currentLegs[idx][field] = e.target.value;
        }
        this.renderParlaySummary();
      });
    });

    container.querySelectorAll("[data-action='delete']").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"));
        this.removeLeg(idx);
      });
    });
  }

  renderParlaySummary() {
    const summary = OddsCalculator.calculateParlay(this.currentLegs, this.currentStake);

    const combDec = document.getElementById("res-combined-decimal");
    if (combDec) combDec.innerText = summary.combinedOdds.toFixed(2);

    const combAm = document.getElementById("res-combined-american");
    if (combAm) combAm.innerText = summary.americanOdds;

    const combFr = document.getElementById("res-combined-fractional");
    if (combFr) combFr.innerText = summary.fractionalOdds;

    const impProb = document.getElementById("res-implied-prob");
    if (impProb) impProb.innerText = `${summary.impliedProb}%`;

    const realProb = document.getElementById("res-real-prob");
    if (realProb) realProb.innerText = `${summary.estimatedRealProb}%`;

    const payoutEl = document.getElementById("res-payout");
    if (payoutEl) payoutEl.innerText = `$${summary.payout.toFixed(2)}`;
    
    const profitEl = document.getElementById("res-profit");
    if (profitEl) profitEl.innerText = `+$${summary.profit.toFixed(2)}`;

    const evEl = document.getElementById("res-ev-badge");
    if (evEl) {
      const evVal = summary.ev.evPercentage;
      if (evVal > 0) {
        evEl.className = "badge badge-green";
        evEl.innerText = `+${evVal}% EV (Ventaja Positiva)`;
      } else if (evVal < 0) {
        evEl.className = "badge badge-red";
        evEl.innerText = `${evVal}% EV (Valor Negativo)`;
      } else {
        evEl.className = "badge badge-blue";
        evEl.innerText = "0% EV";
      }
    }

    const corrWarn = document.getElementById("parlay-correlation-warning");
    if (corrWarn) corrWarn.style.display = summary.hasCorrelatedRisk ? "block" : "none";

    const kellyText = document.getElementById("res-kelly-rec");
    if (kellyText) {
      const kellyRec = KellyCriterion.getSizingRecommendations(1000, summary.combinedOdds, summary.estimatedRealProb / 100);
      if (kellyRec.isPositiveEV) {
        kellyText.innerText = `Sugerencia Kelly (Bankroll $1,000): Fraccional 1/4 = $${kellyRec.quarterKelly.amount} (${kellyRec.quarterKelly.percent}%)`;
        kellyText.style.color = "#34d399";
      } else {
        kellyText.innerText = "EV Negativo: Matemáticamente no se recomienda apostar a largo plazo según Kelly.";
        kellyText.style.color = "#f87171";
      }
    }
  }

  saveCurrentParlayToTracker() {
    if (this.currentLegs.length === 0) {
      this.showToast("Agrega al menos una selección al parley.", "error");
      return;
    }

    const summary = OddsCalculator.calculateParlay(this.currentLegs, this.currentStake);
    const bet = {
      stake: this.currentStake,
      combinedOdds: summary.combinedOdds,
      payout: summary.payout,
      status: "pending",
      sport: this.currentLegs.length > 1 ? "Combinada / Mixta" : "Individual",
      notes: this.currentLegs.map(l => `${l.match} (${l.selection})`).join(" + "),
      legs: this.currentLegs.map(l => ({ ...l }))
    };

    this.tracker.addBet(bet);
    this.updateGlobalMetrics();
    this.renderTrackerUI();
    this.showToast("¡Parley guardado en el Tracker exitosamente!", "success");
  }

  /* =========================================================================
     2. MONTE CARLO SIMULATION
     ========================================================================= */
  setupMonteCarlo() {
    const runBtn = document.getElementById("btn-run-monte-carlo");
    if (runBtn) runBtn.addEventListener("click", () => this.runMonteCarlo());

    const inputs = ["mc-bankroll", "mc-stake", "mc-odds", "mc-winprob", "mc-numbets", "mc-numsims"];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          const valDisplay = document.getElementById(`${id}-val`);
          if (valDisplay) valDisplay.innerText = el.value;
        });
      }
    });

    setTimeout(() => this.runMonteCarlo(), 200);
  }

  runMonteCarlo() {
    const initialBankroll = parseFloat(document.getElementById("mc-bankroll")?.value) || 1000;
    const betAmount = parseFloat(document.getElementById("mc-stake")?.value) || 25;
    const isPercentage = document.getElementById("mc-stake-type")?.value === "percent";
    const decimalOdds = parseFloat(document.getElementById("mc-odds")?.value) || 4.5;
    const winProb = (parseFloat(document.getElementById("mc-winprob")?.value) || 25) / 100;
    const numBets = parseInt(document.getElementById("mc-numbets")?.value) || 100;
    const numSimulations = parseInt(document.getElementById("mc-numsims")?.value) || 1000;

    const results = MonteCarloSimulator.runSimulation({
      initialBankroll,
      betAmount,
      isPercentageStake: isPercentage,
      winProb,
      decimalOdds,
      numBets,
      numSimulations
    });

    const bustEl = document.getElementById("mc-res-bust-rate");
    if (bustEl) {
      bustEl.innerText = `${results.metrics.bustRate}%`;
      bustEl.style.color = results.metrics.bustRate > 15 ? "#ef4444" : "#10b981";
    }

    const profEl = document.getElementById("mc-res-profit-prob");
    if (profEl) profEl.innerText = `${results.metrics.profitProbability}%`;

    const medEl = document.getElementById("mc-res-median-bankroll");
    if (medEl) medEl.innerText = `$${results.metrics.medianFinalBankroll}`;

    const p10El = document.getElementById("mc-res-p10");
    if (p10El) p10El.innerText = `$${results.metrics.p10}`;

    const p90El = document.getElementById("mc-res-p90");
    if (p90El) p90El.innerText = `$${results.metrics.p90}`;

    const ddEl = document.getElementById("mc-res-max-drawdown");
    if (ddEl) ddEl.innerText = `${results.metrics.maxDrawdown}%`;

    const streakEl = document.getElementById("mc-res-longest-streak");
    if (streakEl) streakEl.innerText = `${results.metrics.longestLosingStreak} derrotas`;

    this.chartManager.renderMonteCarloChart("chart-monte-carlo-lines", results);
    this.chartManager.renderMonteCarloHistogram("chart-monte-carlo-hist", results.histogram);
  }

  /* =========================================================================
     3. SPORTS STATS & FIXTURES FEED
     ========================================================================= */
  setupSportsStats() {
    const sportFilter = document.getElementById("sports-category-filter");
    if (sportFilter) {
      sportFilter.addEventListener("change", (e) => {
        this.renderSportsContent(e.target.value);
      });
    }
    this.renderSportsContent("all");
  }

  renderSportsContent(category) {
    const container = document.getElementById("sports-matches-container");
    const teamsContainer = document.getElementById("sports-teams-table-body");
    if (!container || !teamsContainer) return;
    container.innerHTML = "";
    teamsContainer.innerHTML = "";

    const sportsKeys = category === "all" ? Object.keys(SPORTS_DATA) : [category];

    sportsKeys.forEach(sKey => {
      const sport = SPORTS_DATA[sKey];
      if (!sport) return;

      sport.teams.forEach(team => {
        const tr = document.createElement("tr");
        const formBadges = team.form.map(res => `<span class="form-dot form-${res.toLowerCase()}">${res}</span>`).join("");
        tr.innerHTML = `
          <td><strong>${team.name}</strong> <span style="font-size:0.75rem; color:#64748b;">(${team.league})</span></td>
          <td><div class="form-badges">${formBadges}</div></td>
          <td><strong style="color: #10b981;">${team.winRate}%</strong></td>
          <td>${team.over25Rate || team.atsCoverRate || 50}%</td>
          <td><span class="badge badge-blue">${team.streak}</span></td>
        `;
        teamsContainer.appendChild(tr);
      });

      sport.upcomingMatches.forEach(match => {
        const matchCard = document.createElement("div");
        matchCard.className = "card";
        matchCard.style.marginBottom = "1rem";
        matchCard.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <span class="badge badge-amber">${match.league}</span>
              <span style="font-size: 0.8rem; color: #94a3b8; margin-left: 0.5rem;">📅 ${match.date}</span>
            </div>
            <span style="font-size: 0.8rem; color: #64748b;">${match.market}</span>
          </div>
          <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem;">${match.homeTeam} vs ${match.awayTeam}</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem;">
            ${match.options.map(opt => `
              <button class="btn btn-secondary btn-sm match-option-btn" 
                data-match="${match.homeTeam} vs ${match.awayTeam}" 
                data-selection="${opt.name}" 
                data-odds="${opt.odds}" 
                data-prob="${opt.prob}"
                style="display: flex; justify-content: space-between; padding: 0.6rem 0.75rem;">
                <span style="font-size: 0.8rem;">${opt.name}</span>
                <strong style="color: #10b981;">${opt.odds.toFixed(2)}</strong>
              </button>
            `).join("")}
          </div>
        `;
        container.appendChild(matchCard);
      });
    });

    container.querySelectorAll(".match-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const match = btn.getAttribute("data-match");
        const selection = btn.getAttribute("data-selection");
        const odds = parseFloat(btn.getAttribute("data-odds"));
        const prob = parseFloat(btn.getAttribute("data-prob"));

        this.addCustomLeg({
          id: Date.now(),
          match,
          selection,
          decimalOdds: odds,
          estimatedProb: prob
        });

        this.showToast(`Añadido al Parley: ${selection} (@${odds})`, "success");
      });
    });
  }

  /* =========================================================================
     4. KELLY CRITERION TAB
     ========================================================================= */
  setupKellyTab() {
    const calcBtn = document.getElementById("btn-calc-kelly");
    if (calcBtn) calcBtn.addEventListener("click", () => this.runKellyCalculator());
    this.runKellyCalculator();
  }

  runKellyCalculator() {
    const bankroll = parseFloat(document.getElementById("kelly-bankroll")?.value) || 1000;
    const decimalOdds = parseFloat(document.getElementById("kelly-odds")?.value) || 2.50;
    const winProb = (parseFloat(document.getElementById("kelly-prob")?.value) || 45) / 100;

    const rec = KellyCriterion.getSizingRecommendations(bankroll, decimalOdds, winProb);
    const ror = KellyCriterion.calculateRiskOfRuin(winProb, decimalOdds, (rec.fullKelly.percent / 100) || 0.05);

    const statusBadge = document.getElementById("kelly-ev-status");
    if (statusBadge) {
      if (rec.isPositiveEV) {
        statusBadge.className = "badge badge-green";
        statusBadge.innerText = `+${rec.evPercentage}% EV (Ventaja Positiva)`;
      } else {
        statusBadge.className = "badge badge-red";
        statusBadge.innerText = `${rec.evPercentage}% EV (Desventaja Matemática)`;
      }
    }

    const fullVal = document.getElementById("kelly-full-val");
    if (fullVal) fullVal.innerText = `$${rec.fullKelly.amount} (${rec.fullKelly.percent}%)`;

    const halfVal = document.getElementById("kelly-half-val");
    if (halfVal) halfVal.innerText = `$${rec.halfKelly.amount} (${rec.halfKelly.percent}%)`;

    const qVal = document.getElementById("kelly-quarter-val");
    if (qVal) qVal.innerText = `$${rec.quarterKelly.amount} (${rec.quarterKelly.percent}%)`;

    const rorVal = document.getElementById("kelly-ror-val");
    if (rorVal) rorVal.innerText = `${ror}%`;
  }

  /* =========================================================================
     5. BET TRACKER & PERFORMANCE (HARD RESET INTEGRATION)
     ========================================================================= */
  setupBetTracker() {
    const exportCsvBtn = document.getElementById("btn-export-csv");
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener("click", () => {
        const csv = this.tracker.exportToCSV();
        this.downloadFile(csv, "parley_stats_historial.csv", "text/csv");
      });
    }

    const exportJsonBtn = document.getElementById("btn-export-json");
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener("click", () => {
        const json = this.tracker.exportToJSON();
        this.downloadFile(json, "parley_stats_backup.json", "application/json");
      });
    }

    // BOTÓN ADMINISTRATIVO DE HARD RESET
    const btnHardReset = document.getElementById("btn-force-zero");
    if (btnHardReset) {
      btnHardReset.addEventListener("click", () => {
        this.executeAdministrativeHardReset();
      });
    }

    // REGISTRAR LOS 3 TICKETS OFICIALES DE $10
    const btnLoadOfficial = document.getElementById("btn-load-official-10");
    if (btnLoadOfficial) {
      btnLoadOfficial.addEventListener("click", () => {
        this.registerOfficialThreeTickets();
      });
    }

    const resetSampleBtn = document.getElementById("btn-reset-sample-data");
    if (resetSampleBtn) {
      resetSampleBtn.addEventListener("click", () => {
        this.executeAdministrativeHardReset();
      });
    }

    const fileInput = document.getElementById("input-import-json");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const res = this.tracker.importJSON(ev.target.result);
          if (res.success) {
            this.renderTrackerUI();
            this.updateGlobalMetrics();
            this.showToast(`Importadas ${res.count} apuestas con éxito.`, "success");
          } else {
            this.showToast(`Error al importar: ${res.error}`, "error");
          }
        };
        reader.readAsText(file);
      });
    }

    this.renderTrackerUI();
  }

  executeAdministrativeHardReset() {
    this.tracker.hardReset();
    this.currentLegs = [];
    this.renderParlayLegs();
    this.renderParlaySummary();
    this.updateBadgeCounts();
    this.updateGlobalMetrics();
    this.renderTrackerUI();
    this.renderStakeGrid();
    this.renderParleyLaGrid();
    this.showToast("HARD RESET EJECUTADO: Historial y métricas purgadas a 0.", "success");
  }

  registerOfficialThreeTickets() {
    // 1. Ticket 1: Banquero de Hoy ($5.00 a cuota @2.29)
    this.tracker.addBet({
      stake: 5.00,
      combinedOdds: 2.29,
      payout: 11.45,
      status: "pending",
      sport: "MLB (Parley.la)",
      notes: "Ticket 1 (Banquero $5): Phillies (R. Suárez 6:40 PM) + Rangers (C. Bradford 8:05 PM)",
      legs: [
        { id: "pla-1", match: "Phillies vs Marlins (6:40 PM)", selection: "Phillies a Ganar (R. Suárez)", decimalOdds: 1.48 },
        { id: "pla-3", match: "Angels vs Rangers (8:05 PM)", selection: "Rangers a Ganar (C. Bradford)", decimalOdds: 1.55 }
      ]
    });

    // 2. Ticket 2: Equilibrado (+EV) ($3.50 a cuota @3.73)
    this.tracker.addBet({
      stake: 3.50,
      combinedOdds: 3.73,
      payout: 13.06,
      status: "pending",
      sport: "MLB (Parley.la)",
      notes: "Ticket 2 (Equilibrado $3.5): Phillies (6:40 PM) + Pirates (6:40 PM) + Rangers (8:05 PM)",
      legs: [
        { id: "pla-1", match: "Phillies vs Marlins (6:40 PM)", selection: "Phillies a Ganar (R. Suárez)", decimalOdds: 1.48 },
        { id: "pla-2", match: "Nationals vs Pirates (6:40 PM)", selection: "Pirates a Ganar (B. Falter)", decimalOdds: 1.63 },
        { id: "pla-3", match: "Angels vs Rangers (8:05 PM)", selection: "Rangers a Ganar (C. Bradford)", decimalOdds: 1.55 }
      ]
    });

    // 3. Ticket 3: Multiplicador Cuotón ($1.50 a cuota @5.22)
    this.tracker.addBet({
      stake: 1.50,
      combinedOdds: 5.22,
      payout: 7.83,
      status: "pending",
      sport: "MLB (Parley.la)",
      notes: "Ticket 3 (Cuotón $1.5): Phillies + Pirates + Braves (7:20 PM) + Padres (8:40 PM)",
      legs: [
        { id: "pla-1", match: "Phillies vs Marlins (6:40 PM)", selection: "Phillies a Ganar (R. Suárez)", decimalOdds: 1.48 },
        { id: "pla-2", match: "Nationals vs Pirates (6:40 PM)", selection: "Pirates a Ganar (B. Falter)", decimalOdds: 1.63 },
        { id: "pla-4", match: "Rockies vs Braves (7:20 PM)", selection: "Braves a Ganar (R. López)", decimalOdds: 1.40 },
        { id: "pla-5", match: "Tigers vs Padres (8:40 PM)", selection: "Padres a Ganar (M. Pérez)", decimalOdds: 1.62 }
      ]
    });

    this.updateGlobalMetrics();
    this.renderTrackerUI();
    this.switchTab("tracker");
    this.showToast("✅ Registrados los 3 tickets oficiales ($10 totales) en Historial & ROI", "success");
  }

  renderTrackerUI() {
    const tableBody = document.getElementById("tracker-table-body");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    const bets = this.tracker.bets;
    if (bets.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2.5rem; color: #64748b;">No hay apuestas registradas en el historial oficial. Todo en cero.</td></tr>`;
      this.chartManager.renderTrackerRoiChart("chart-tracker-roi", []);
      this.chartManager.renderLegsWinRateChart("chart-legs-winrate", []);
      return;
    }

    bets.forEach(bet => {
      const tr = document.createElement("tr");
      const statusBadge = 
        bet.status === "won" ? `<span class="badge badge-green">Ganada</span>` :
        bet.status === "lost" ? `<span class="badge badge-red">Perdida</span>` :
        `<span class="badge badge-amber">Pendiente</span>`;

      const profit = bet.status === "won" ? (bet.stake * bet.combinedOdds - bet.stake) : bet.status === "lost" ? -bet.stake : 0;
      const profitText = bet.status === "pending" ? "--" : `${profit >= 0 ? "+" : ""}$${profit.toFixed(2)}`;
      const profitColor = profit > 0 ? "#10b981" : profit < 0 ? "#ef4444" : "#94a3b8";

      tr.innerHTML = `
        <td>${new Date(bet.date).toLocaleDateString()}</td>
        <td>
          <div style="font-weight: 600;">${bet.notes || "Parley"}</div>
          <div style="font-size: 0.75rem; color: #64748b;">${bet.legs ? bet.legs.length : 1} selecciones (${bet.sport})</div>
        </td>
        <td><strong>@${parseFloat(bet.combinedOdds).toFixed(2)}</strong></td>
        <td>$${bet.stake.toFixed(2)}</td>
        <td style="font-weight: 700; color: ${profitColor};">${profitText}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display: flex; gap: 0.3rem;">
            <button class="btn btn-secondary btn-sm" title="Marcar Ganada" data-action="set-status" data-id="${bet.id}" data-status="won">✓</button>
            <button class="btn btn-secondary btn-sm" title="Marcar Perdida" data-action="set-status" data-id="${bet.id}" data-status="lost">✕</button>
            <button class="btn btn-danger btn-sm" title="Eliminar" data-action="delete" data-id="${bet.id}">🗑</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll("[data-action='set-status']").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const status = btn.getAttribute("data-status");
        this.tracker.updateBetStatus(id, status);
        this.renderTrackerUI();
        this.updateGlobalMetrics();
      });
    });

    tableBody.querySelectorAll("[data-action='delete']").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.tracker.deleteBet(id);
        this.renderTrackerUI();
        this.updateGlobalMetrics();
        this.showToast("Apuesta eliminada.", "info");
      });
    });

    const metrics = this.tracker.getMetrics();
    this.chartManager.renderTrackerRoiChart("chart-tracker-roi", bets);
    this.chartManager.renderLegsWinRateChart("chart-legs-winrate", metrics.legsMetrics);
  }

  downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Iniciar aplicación al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  window.app = new ParleyApp();
});
