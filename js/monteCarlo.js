/**
 * Motor de Simulación Monte Carlo para Parleys y Bankroll
 */
export class MonteCarloSimulator {
  /**
   * Ejecuta simulaciones estocásticas de series de parleys
   * @param {object} config
   * @param {number} config.initialBankroll Capital inicial
   * @param {number} config.betAmount Monto fijo por apuesta o porcentaje si isPercentageStake=true
   * @param {boolean} config.isPercentageStake Si la apuesta es fija o % del bankroll dinámico
   * @param {number} config.winProb Probabilidad real estimada por parlay (0 a 1)
   * @param {number} config.decimalOdds Cuota combinada del parlay
   * @param {number} config.numBets Cantidad de apuestas en la serie (ej: 100)
   * @param {number} config.numSimulations Cantidad de trayectorias (ej: 1000)
   */
  static runSimulation(config) {
    const {
      initialBankroll = 1000,
      betAmount = 25,
      isPercentageStake = false,
      winProb = 0.20,
      decimalOdds = 5.0,
      numBets = 100,
      numSimulations = 1000
    } = config;

    const allTrajectories = [];
    const finalBankrolls = [];
    let bustCount = 0;
    let profitCount = 0;
    let maxDrawdownOverall = 0;
    let longestLosingStreakGlobal = 0;

    // Guardaremos hasta 15 trayectorias de muestra para graficar claramente
    const sampleTrajectories = [];
    const sampleIndices = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    for (let sim = 0; sim < numSimulations; sim++) {
      let currentBankroll = initialBankroll;
      let peakBankroll = initialBankroll;
      let maxDrawdownThisSim = 0;
      let currentLosingStreak = 0;
      let maxLosingStreakThisSim = 0;

      const trajectory = [currentBankroll];

      for (let bet = 0; bet < numBets; bet++) {
        if (currentBankroll <= 1.0) {
          // Bancarrota
          currentBankroll = 0;
          trajectory.push(0);
          continue;
        }

        const stake = isPercentageStake
          ? Math.max(1, currentBankroll * (betAmount / 100))
          : Math.min(betAmount, currentBankroll);

        const won = Math.random() < winProb;

        if (won) {
          const profit = stake * (decimalOdds - 1);
          currentBankroll += profit;
          currentLosingStreak = 0;
        } else {
          currentBankroll -= stake;
          currentLosingStreak++;
          if (currentLosingStreak > maxLosingStreakThisSim) {
            maxLosingStreakThisSim = currentLosingStreak;
          }
        }

        if (currentBankroll > peakBankroll) {
          peakBankroll = currentBankroll;
        }

        const drawdown = peakBankroll > 0 ? ((peakBankroll - currentBankroll) / peakBankroll) * 100 : 0;
        if (drawdown > maxDrawdownThisSim) {
          maxDrawdownThisSim = drawdown;
        }

        trajectory.push(parseFloat(currentBankroll.toFixed(2)));
      }

      if (currentBankroll <= 1.0) {
        bustCount++;
      }
      if (currentBankroll > initialBankroll) {
        profitCount++;
      }
      if (maxDrawdownThisSim > maxDrawdownOverall) {
        maxDrawdownOverall = maxDrawdownThisSim;
      }
      if (maxLosingStreakThisSim > longestLosingStreakGlobal) {
        longestLosingStreakGlobal = maxLosingStreakThisSim;
      }

      finalBankrolls.push(currentBankroll);

      if (sampleIndices.has(sim) || sim < 15) {
        sampleTrajectories.push({
          id: sim + 1,
          data: trajectory
        });
      }
    }

    // Calcular estadísticas de distribución y percentiles
    finalBankrolls.sort((a, b) => a - b);
    const p10 = finalBankrolls[Math.floor(numSimulations * 0.10)] || 0;
    const p25 = finalBankrolls[Math.floor(numSimulations * 0.25)] || 0;
    const p50 = finalBankrolls[Math.floor(numSimulations * 0.50)] || 0; // Mediana
    const p75 = finalBankrolls[Math.floor(numSimulations * 0.75)] || 0;
    const p90 = finalBankrolls[Math.floor(numSimulations * 0.90)] || 0;
    const minBankroll = finalBankrolls[0];
    const maxBankroll = finalBankrolls[finalBankrolls.length - 1];

    const sum = finalBankrolls.reduce((acc, v) => acc + v, 0);
    const meanBankroll = sum / numSimulations;

    // Generar datos para histograma de distribución final
    const histogramBins = 15;
    const binRange = (p90 - Math.max(0, p10)) / histogramBins || 100;
    const bins = [];
    for (let i = 0; i < histogramBins; i++) {
      const start = Math.max(0, p10) + (i * binRange);
      const end = start + binRange;
      const count = finalBankrolls.filter(v => v >= start && v < end).length;
      bins.push({
        label: `$${Math.round(start)} - $${Math.round(end)}`,
        count
      });
    }

    return {
      initialBankroll,
      numSimulations,
      numBets,
      winProb: parseFloat((winProb * 100).toFixed(2)),
      decimalOdds,
      metrics: {
        bustRate: parseFloat(((bustCount / numSimulations) * 100).toFixed(2)),
        profitProbability: parseFloat(((profitCount / numSimulations) * 100).toFixed(2)),
        medianFinalBankroll: parseFloat(p50.toFixed(2)),
        meanFinalBankroll: parseFloat(meanBankroll.toFixed(2)),
        p10: parseFloat(p10.toFixed(2)),
        p25: parseFloat(p25.toFixed(2)),
        p75: parseFloat(p75.toFixed(2)),
        p90: parseFloat(p90.toFixed(2)),
        min: parseFloat(minBankroll.toFixed(2)),
        max: parseFloat(maxBankroll.toFixed(2)),
        maxDrawdown: parseFloat(maxDrawdownOverall.toFixed(2)),
        longestLosingStreak: longestLosingStreakGlobal
      },
      sampleTrajectories,
      histogram: bins
    };
  }
}
