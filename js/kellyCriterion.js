/**
 * Gestión de Bankroll y Criterio de Kelly
 */
export class KellyCriterion {
  /**
   * Calcula el porcentaje óptimo de Kelly
   * f* = (bp - q) / b
   * Donde:
   * b = cuota decimal - 1 (ganancia neta por unidad apostada)
   * p = probabilidad real estimada de ganar (0 a 1)
   * q = probabilidad de perder (1 - p)
   */
  static calculateKellyFraction(decimalOdds, winProb) {
    if (decimalOdds <= 1.0 || winProb <= 0 || winProb > 1) return 0;
    const b = decimalOdds - 1;
    const p = winProb;
    const q = 1 - p;
    const kelly = (b * p - q) / b;
    return Math.max(0, kelly);
  }

  /**
   * Calcula sugerencias de apuestas con diferentes fracciones de Kelly
   */
  static getSizingRecommendations(bankroll, decimalOdds, winProb) {
    const fullKellyFraction = this.calculateKellyFraction(decimalOdds, winProb);
    const halfKellyFraction = fullKellyFraction / 2;
    const quarterKellyFraction = fullKellyFraction / 4;

    const b = decimalOdds - 1;
    const p = winProb;
    const evPercentage = ((p * b) - (1 - p)) * 100;

    return {
      isPositiveEV: fullKellyFraction > 0,
      evPercentage: parseFloat(evPercentage.toFixed(2)),
      fullKelly: {
        percent: parseFloat((fullKellyFraction * 100).toFixed(2)),
        amount: parseFloat((bankroll * fullKellyFraction).toFixed(2)),
        risk: "Alto (Óptimo matemático, alta volatilidad)"
      },
      halfKelly: {
        percent: parseFloat((halfKellyFraction * 100).toFixed(2)),
        amount: parseFloat((bankroll * halfKellyFraction).toFixed(2)),
        risk: "Moderado (Recomendado para apostadores disciplinados)"
      },
      quarterKelly: {
        percent: parseFloat((quarterKellyFraction * 100).toFixed(2)),
        amount: parseFloat((bankroll * quarterKellyFraction).toFixed(2)),
        risk: "Conservador (Mínima probabilidad de drawdown severo)"
      }
    };
  }

  /**
   * Estimación aproximada de Riesgo de Quiebra (Risk of Ruin)
   */
  static calculateRiskOfRuin(winProb, payoutMultiplier, betFraction) {
    if (winProb * payoutMultiplier <= 1) return 100; // EV negativo = quiebra segura a largo plazo
    const b = payoutMultiplier - 1;
    const p = winProb;
    const q = 1 - p;
    const r = ((1 - p) / (p * b));
    if (r >= 1) return 100;
    const units = 1 / betFraction;
    const ror = Math.pow(r, units) * 100;
    return parseFloat(Math.min(100, Math.max(0, ror)).toFixed(2));
  }
}
