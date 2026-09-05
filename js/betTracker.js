/**
 * Gestor de Historial de Apuestas y Rendimiento (BetTracker)
 * Versión 3.0.0 - Arquitectura con Aislamiento Temporal y Hard-Reset Administrativo
 */
export class BetTracker {
  constructor(storageKey = "parley_stats_v3_clean") {
    this.storageKey = storageKey;
    this.epochStart = new Date("2026-09-04T00:00:00Z").getTime();
    this.bets = this.loadBets();
  }

  loadBets() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          // Filtrado estricto por timestamp: únicamente apuestas registradas a partir de hoy
          return parsed.filter(b => {
            const betTime = new Date(b.date).getTime();
            return !isNaN(betTime) && betTime >= this.epochStart;
          });
        }
      }
    } catch (e) {
      console.warn("Error leyendo localStorage:", e);
    }
    // Estado por defecto: lista estrictamente vacía
    return [];
  }

  saveBets() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.bets));
    } catch (e) {
      console.error("Error persistiendo en localStorage:", e);
    }
  }

  addBet(betData) {
    const newBet = {
      id: "bet_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      date: new Date().toISOString(),
      stake: parseFloat(betData.stake) || 0,
      combinedOdds: parseFloat(betData.combinedOdds) || 1.0,
      payout: parseFloat(betData.payout) || 0,
      legs: Array.isArray(betData.legs) ? betData.legs : [],
      status: betData.status || "pending", // "won", "lost", "pending", "void"
      sport: betData.sport || "General",
      notes: betData.notes || ""
    };
    this.bets.unshift(newBet);
    this.saveBets();
    return newBet;
  }

  updateBetStatus(betId, newStatus) {
    const bet = this.bets.find(b => b.id === betId);
    if (bet) {
      bet.status = newStatus;
      this.saveBets();
      return true;
    }
    return false;
  }

  deleteBet(betId) {
    this.bets = this.bets.filter(b => b.id !== betId);
    this.saveBets();
  }

  /**
   * Purgado Administrativo Forzoso (Hard Reset)
   */
  hardReset() {
    this.bets = [];
    try {
      // Eliminar claves históricas y actuales
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem("parley_stats_tracker_bets");
      localStorage.removeItem("parley_stats_clean_v1");
      localStorage.removeItem("parley_stats_v2026_oficial");
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    } catch (e) {
      console.error("Error ejecutando hardReset:", e);
    }
    return true;
  }

  getMetrics() {
    // Si no hay apuestas o lista vacía, retorno determinista 0.0
    if (!this.bets || this.bets.length === 0) {
      return {
        totalBets: 0,
        settledBets: 0,
        wonCount: 0,
        lostCount: 0,
        pendingCount: 0,
        winRate: 0.0,
        totalStaked: 0.0,
        totalReturned: 0.0,
        netProfit: 0.0,
        roi: 0.0,
        legsMetrics: []
      };
    }

    const settledBets = this.bets.filter(b => b.status === "won" || b.status === "lost");
    const totalCount = this.bets.length;
    const settledCount = settledBets.length;
    const wonBets = this.bets.filter(b => b.status === "won");
    const lostBets = this.bets.filter(b => b.status === "lost");
    const pendingBets = this.bets.filter(b => b.status === "pending");

    let totalStaked = 0;
    let totalReturned = 0;

    settledBets.forEach(b => {
      totalStaked += b.stake;
      if (b.status === "won") {
        totalReturned += (b.stake * b.combinedOdds);
      }
    });

    const netProfit = totalReturned - totalStaked;
    const roi = totalStaked > 0 ? (netProfit / totalStaked) * 100 : 0;
    const winRate = settledCount > 0 ? (wonBets.length / settledCount) * 100 : 0;

    // Agrupación por patas / legs
    const legsBreakdown = {};
    settledBets.forEach(b => {
      const legCount = b.legs ? b.legs.length : 1;
      const key = legCount >= 5 ? "5+ legs" : `${legCount} legs`;
      if (!legsBreakdown[key]) {
        legsBreakdown[key] = { total: 0, won: 0, staked: 0, returned: 0 };
      }
      legsBreakdown[key].total++;
      legsBreakdown[key].staked += b.stake;
      if (b.status === "won") {
        legsBreakdown[key].won++;
        legsBreakdown[key].returned += (b.stake * b.combinedOdds);
      }
    });

    const legsMetrics = Object.keys(legsBreakdown).map(key => {
      const data = legsBreakdown[key];
      const p = data.returned - data.staked;
      return {
        legs: key,
        total: data.total,
        won: data.won,
        winRate: parseFloat(((data.won / data.total) * 100).toFixed(1)),
        profit: parseFloat(p.toFixed(2)),
        roi: data.staked > 0 ? parseFloat(((p / data.staked) * 100).toFixed(1)) : 0
      };
    });

    return {
      totalBets: totalCount,
      settledBets: settledCount,
      wonCount: wonBets.length,
      lostCount: lostBets.length,
      pendingCount: pendingBets.length,
      winRate: parseFloat(winRate.toFixed(1)),
      totalStaked: parseFloat(totalStaked.toFixed(2)),
      totalReturned: parseFloat(totalReturned.toFixed(2)),
      netProfit: parseFloat(netProfit.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      legsMetrics
    };
  }

  exportToJSON() {
    return JSON.stringify(this.bets, null, 2);
  }

  exportToCSV() {
    const headers = ["ID", "Fecha", "Cuota Combinada", "Apostado ($)", "Retorno Estimado ($)", "Resultado", "Cantidad de Legs", "Deporte"];
    const rows = this.bets.map(b => [
      b.id,
      new Date(b.date).toISOString(),
      b.combinedOdds,
      b.stake,
      (b.stake * b.combinedOdds).toFixed(2),
      b.status,
      b.legs ? b.legs.length : 1,
      b.sport
    ]);
    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }

  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        this.bets = data;
        this.saveBets();
        return { success: true, count: data.length };
      }
      return { success: false, error: "El formato no es un array de apuestas válido." };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}
