/**
 * Motor Matemático de Cuotas y Parleys
 */
export class OddsCalculator {
  static americanToDecimal(american) {
    const val = parseFloat(american);
    if (isNaN(val)) return 1.0;
    if (val > 0) return (val / 100) + 1;
    if (val < 0) return (100 / Math.abs(val)) + 1;
    return 1.0;
  }

  static decimalToAmerican(decimal) {
    const val = parseFloat(decimal);
    if (isNaN(val) || val <= 1.0) return "+0";
    if (val >= 2.0) {
      const am = Math.round((val - 1) * 100);
      return `+${am}`;
    } else {
      const am = Math.round(-100 / (val - 1));
      return `${am}`;
    }
  }

  static fractionalToDecimal(fractional) {
    if (!fractional || typeof fractional !== 'string') return 1.0;
    const parts = fractional.trim().split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return (num / den) + 1;
      }
    }
    return 1.0;
  }

  static decimalToFractional(decimal) {
    const val = parseFloat(decimal);
    if (isNaN(val) || val <= 1) return "0/1";
    const net = val - 1;
    const tolerance = 1.0E-4;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = net;
    do {
      let a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(net - h1 / k1) > net * tolerance && k1 < 100);
    return `${h1}/${k1}`;
  }

  static impliedProbability(decimal) {
    const val = parseFloat(decimal);
    if (isNaN(val) || val <= 1.0) return 0;
    return 1 / val;
  }

  static calculateVig2Way(odds1, odds2) {
    const p1 = this.impliedProbability(odds1);
    const p2 = this.impliedProbability(odds2);
    const total = p1 + p2;
    return (total - 1) * 100;
  }

  static fairProbability(decimalOdds, oppositeOdds) {
    const p1 = this.impliedProbability(decimalOdds);
    const p2 = this.impliedProbability(oppositeOdds);
    const total = p1 + p2;
    return total > 0 ? (p1 / total) : p1;
  }

  static calculateEV(stake, decimalOdds, estimatedWinProb) {
    const winProfit = stake * (decimalOdds - 1);
    const loseLoss = stake;
    const lossProb = 1 - estimatedWinProb;

    const ev = (estimatedWinProb * winProfit) - (lossProb * loseLoss);
    const evPercent = stake > 0 ? (ev / stake) * 100 : 0;

    return {
      evValue: parseFloat(ev.toFixed(2)),
      evPercentage: parseFloat(evPercent.toFixed(2))
    };
  }

  static calculateParlay(legs, stake = 10) {
    if (!legs || legs.length === 0) {
      return {
        combinedOdds: 1.0,
        americanOdds: "+0",
        fractionalOdds: "0/1",
        impliedProb: 0,
        estimatedRealProb: 0,
        payout: 0,
        profit: 0,
        ev: { evValue: 0, evPercentage: 0 },
        legsCount: 0,
        hasCorrelatedRisk: false
      };
    }

    let combinedDecimal = 1.0;
    let combinedEstimatedProb = 1.0;
    const matchIds = new Set();
    let hasCorrelatedRisk = false;

    legs.forEach(leg => {
      const dec = parseFloat(leg.decimalOdds) || 1.0;
      combinedDecimal *= dec;

      if (leg.matchId) {
        if (matchIds.has(leg.matchId)) {
          hasCorrelatedRisk = true;
        }
        matchIds.add(leg.matchId);
      }

      let prob = leg.estimatedProb;
      if (prob === undefined || isNaN(prob)) {
        prob = this.impliedProbability(dec);
      }
      combinedEstimatedProb *= prob;
    });

    const payout = stake * combinedDecimal;
    const profit = payout - stake;
    const impliedProb = this.impliedProbability(combinedDecimal);
    const americanOdds = this.decimalToAmerican(combinedDecimal);
    const fractionalOdds = this.decimalToFractional(combinedDecimal);
    const ev = this.calculateEV(stake, combinedDecimal, combinedEstimatedProb);

    return {
      combinedOdds: parseFloat(combinedDecimal.toFixed(3)),
      americanOdds,
      fractionalOdds,
      impliedProb: parseFloat((impliedProb * 100).toFixed(2)),
      estimatedRealProb: parseFloat((combinedEstimatedProb * 100).toFixed(2)),
      payout: parseFloat(payout.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      ev,
      legsCount: legs.length,
      hasCorrelatedRisk
    };
  }
}
