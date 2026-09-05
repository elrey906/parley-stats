/**
 * Conector y Feed de Cuotas de STAKE.COM (USD / USDT)
 * Partidos de HOY (05 de Septiembre) con Hora de Venezuela (VET) y Abridores
 */

export const STAKE_PICKS_OF_THE_DAY = [
  {
    id: "stk-1",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (National League)",
    match: "Philadelphia Phillies vs Miami Marlins",
    gameDate: "Hoy 05 Sep",
    gameTime: "6:40 PM (Hora VE)",
    pitchers: "Ranger Suárez (PHI) vs Adam Oller (MIA)",
    selection: "Phillies -1.5 Runline (R. Suárez)",
    decimalOdds: 1.82,
    americanOdds: "-122",
    estimatedProb: 0.65,
    category: "seguro",
    categoryLabel: "💎 Stake Pick Seguro",
    stars: 5,
    edgePercent: "+18.3%",
    confidenceScore: 94,
    sportsbook: "Stake.com",
    reasoning: "Ranger Suárez con efectividad de 2.65. Phillies cubren el -1.5 ante abridores débiles como Adam Oller. Aplica Seguro MLB 2+ Carreras."
  },
  {
    id: "stk-2",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (National League)",
    match: "Washington Nationals vs Pittsburgh Pirates",
    gameDate: "Hoy 05 Sep",
    gameTime: "6:40 PM (Hora VE)",
    pitchers: "Patrick Corbin (WSH) vs Bailey Falter (PIT)",
    selection: "Pirates ML (B. Falter)",
    decimalOdds: 1.72,
    americanOdds: "-139",
    estimatedProb: 0.68,
    category: "valor",
    categoryLabel: "🚀 Stake Alto Valor (+EV)",
    stars: 5,
    edgePercent: "+17.0%",
    confidenceScore: 91,
    sportsbook: "Stake.com",
    reasoning: "En Stake la cuota de Pirates paga @1.72 (+9 puntos por encima del mercado local). Corbin permite 1.5 cuadrangulares por salida."
  },
  {
    id: "stk-3",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (American League)",
    match: "Los Angeles Angels vs Texas Rangers",
    gameDate: "Hoy 05 Sep",
    gameTime: "8:05 PM (Hora VE)",
    pitchers: "Jack Kochanowicz (LAA) vs Cody Bradford (TEX)",
    selection: "Texas Rangers ML (C. Bradford)",
    decimalOdds: 1.62,
    americanOdds: "-161",
    estimatedProb: 0.71,
    category: "seguro",
    categoryLabel: "💎 Stake Base Fija",
    stars: 5,
    edgePercent: "+15.0%",
    confidenceScore: 92,
    sportsbook: "Stake.com",
    reasoning: "Cody Bradford con WHIP de 0.95 en Arlington. Angels lideran la liga en ponches en las últimas dos semanas."
  },
  {
    id: "stk-4",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (National League)",
    match: "Colorado Rockies vs Atlanta Braves",
    gameDate: "Hoy 05 Sep",
    gameTime: "7:20 PM (Hora VE)",
    pitchers: "Austin Gomber (COL) vs Reynaldo López (ATL)",
    selection: "Braves -1.5 Runline (R. López)",
    decimalOdds: 1.76,
    americanOdds: "-132",
    estimatedProb: 0.67,
    category: "valor",
    categoryLabel: "🚀 Stake Runline (+EV)",
    stars: 4,
    edgePercent: "+17.9%",
    confidenceScore: 89,
    sportsbook: "Stake.com",
    reasoning: "Atlanta anota 6.2 carreras de local y Reynaldo López es candidato a líder de efectividad en la Liga Nacional."
  },
  {
    id: "stk-5",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (Interleague)",
    match: "Detroit Tigers vs San Diego Padres",
    gameDate: "Hoy 05 Sep",
    gameTime: "8:40 PM (Hora VE)",
    pitchers: "Kenta Maeda (DET) vs Martín Pérez (SD)",
    selection: "Padres ML (M. Pérez)",
    decimalOdds: 1.70,
    americanOdds: "-143",
    estimatedProb: 0.67,
    category: "valor",
    categoryLabel: "🚀 Stake Valor",
    stars: 4,
    edgePercent: "+13.9%",
    confidenceScore: 87,
    sportsbook: "Stake.com",
    reasoning: "San Diego jugando en Petco Park donde Martín Pérez reduce su efectividad a 3.10 con el respaldo del bullpen élite."
  }
];

export const STAKE_PARLAY_PRESETS = {
  safe: {
    title: "🛡️ Parley Seguro Stake USD (@2.95)",
    multiplier: 2.95,
    legs: [
      { id: "stk-1", match: "Phillies vs Marlins (6:40 PM)", selection: "Phillies -1.5 Runline", decimalOdds: 1.82, estimatedProb: 0.65 },
      { id: "stk-3", match: "Angels vs Rangers (8:05 PM)", selection: "Texas Rangers ML", decimalOdds: 1.62, estimatedProb: 0.71 }
    ],
    payoutExample: "Si apuestas $20 USD cobras $59.00 USD (ganancia neta de +$39.00 USDT en Binance)"
  },
  opt: {
    title: "⚖️ Parley Equilibrado Stake (+EV @5.07)",
    multiplier: 5.07,
    legs: [
      { id: "stk-1", match: "Phillies vs Marlins (6:40 PM)", selection: "Phillies -1.5 Runline", decimalOdds: 1.82, estimatedProb: 0.65 },
      { id: "stk-2", match: "Nationals vs Pirates (6:40 PM)", selection: "Pirates ML", decimalOdds: 1.72, estimatedProb: 0.68 },
      { id: "stk-3", match: "Angels vs Rangers (8:05 PM)", selection: "Texas Rangers ML", decimalOdds: 1.62, estimatedProb: 0.71 }
    ],
    payoutExample: "Si apuestas $20 USD cobras $101.40 USD (ganancia neta de +$81.40 USDT)"
  },
  bomb: {
    title: "💣 Super Cuotón Stake USD (@8.92)",
    multiplier: 8.92,
    legs: [
      { id: "stk-1", match: "Phillies vs Marlins (6:40 PM)", selection: "Phillies -1.5 Runline", decimalOdds: 1.82, estimatedProb: 0.65 },
      { id: "stk-2", match: "Nationals vs Pirates (6:40 PM)", selection: "Pirates ML", decimalOdds: 1.72, estimatedProb: 0.68 },
      { id: "stk-4", match: "Rockies vs Braves (7:20 PM)", selection: "Braves -1.5 Runline", decimalOdds: 1.76, estimatedProb: 0.67 },
      { id: "stk-5", match: "Tigers vs Padres (8:40 PM)", selection: "Padres ML", decimalOdds: 1.70, estimatedProb: 0.67 }
    ],
    payoutExample: "Si apuestas $20 USD cobras $178.40 USD (ganancia neta de +$158.40 USDT)"
  }
};
