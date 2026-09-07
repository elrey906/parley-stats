/**
 * Base de Datos Oficial STAKE.COM (USD / USDT) - Parley Stats Pro v5.2.0
 * Cuotas Oficiales en Dólares, Seguro MLB y Mercados F5
 */

export const STAKE_PICKS_OF_THE_DAY = [
  {
    id: "stk-giants-tonight",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (National League)",
    match: "St. Louis Cardinals vs San Francisco Giants",
    gameDate: "Hoy 07 Sep",
    gameTime: "8:10 PM (Hora VE)",
    pitchers: "Michael McGreevy (STL) vs Logan Webb (SF)",
    selection: "San Francisco Giants ML (Logan Webb)",
    decimalOdds: 1.76,
    americanOdds: "-132",
    estimatedProb: 0.74,
    category: "seguro",
    categoryLabel: "💎 As de Stake (Score 94)",
    stars: 5,
    edgePercent: "+14.2%",
    confidenceScore: 94,
    sportsbook: "Stake.com",
    reasoning: "Logan Webb en Oracle Park con 61% de roletazos. Aplica Seguro MLB de Stake: si Giants lideran por 2+ carreras en cualquier momento, pagan la apuesta ganadora."
  },
  {
    id: "stk-bluejays-tonight",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (American League)",
    match: "Toronto Blue Jays vs Athletics",
    gameDate: "Hoy 07 Sep",
    gameTime: "10:05 PM (Hora VE)",
    pitchers: "Dylan Cease (TOR) vs Jacob Lopez (OAK)",
    selection: "Toronto Blue Jays ML (Dylan Cease)",
    decimalOdds: 1.52,
    americanOdds: "-192",
    estimatedProb: 0.76,
    category: "seguro",
    categoryLabel: "💎 Base Fija Stake (Score 92)",
    stars: 5,
    edgePercent: "+12.8%",
    confidenceScore: 93,
    sportsbook: "Stake.com",
    reasoning: "Dylan Cease promedia 11.2 K/9 frente a la alineación que más se poncha de la Liga Americana. Jacob Lopez tiene efectividad sobre 5.00."
  },
  {
    id: "stk-under-dodgers",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (National League)",
    match: "Cincinnati Reds vs Los Angeles Dodgers",
    gameDate: "Hoy 07 Sep",
    gameTime: "9:10 PM (Hora VE)",
    pitchers: "Chase Burns (CIN) vs Undecided (LAD)",
    selection: "Total Menos de 8.5 Carreras (Under 8.5)",
    decimalOdds: 1.85,
    americanOdds: "-118",
    estimatedProb: 0.66,
    category: "valor",
    categoryLabel: "🚀 Joya de Pitcheo (+EV)",
    stars: 5,
    edgePercent: "+16.5%",
    confidenceScore: 90,
    sportsbook: "Stake.com",
    reasoning: "Chase Burns lanza a 100 mph. Clima nocturno frío en Dodger Stadium frena batazos de poder. Se proyecta duelo cerrado 3-2 o 4-2."
  },
  {
    id: "stk-gremio-bra",
    sport: "soccer",
    sportName: "Fútbol",
    sportIcon: "⚽",
    league: "Brasil Serie A",
    match: "Gremio vs Vitoria",
    gameDate: "Hoy 07 Sep",
    gameTime: "7:00 PM (Hora VE)",
    pitchers: "Arena do Gremio (Porto Alegre)",
    selection: "Gremio a Ganar (1X2)",
    decimalOdds: 1.65,
    americanOdds: "-154",
    estimatedProb: 0.71,
    category: "seguro",
    categoryLabel: "⚽ Banquero Fútbol Stake",
    stars: 4,
    edgePercent: "+11.4%",
    confidenceScore: 89,
    sportsbook: "Stake.com",
    reasoning: "Gremio invicto en sus últimos 5 juegos de local. Vitoria es uno de los 3 peores visitantes del Brasileirao con solo 1 victoria en ruta."
  },
  {
    id: "stk-redsox-tue",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (Martes)",
    match: "Los Angeles Angels vs Boston Red Sox",
    gameDate: "Martes 08 Sep",
    gameTime: "6:45 PM (Hora VE)",
    pitchers: "Reid Detmers (LAA) vs Patrick Sandoval (BOS)",
    selection: "Boston Red Sox ML",
    decimalOdds: 1.68,
    americanOdds: "-147",
    estimatedProb: 0.69,
    category: "valor",
    categoryLabel: "🚀 As Martes Fenway (+EV)",
    stars: 4,
    edgePercent: "+13.1%",
    confidenceScore: 88,
    sportsbook: "Stake.com",
    reasoning: "Detmers tiene efectividad de 5.25 y permite 1.6 HR por salida. Boston de local en Fenway Park batea para .282 colectivo."
  },
  {
    id: "stk-orioles-tue",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (Martes)",
    match: "Cleveland Guardians vs Baltimore Orioles",
    gameDate: "Martes 08 Sep",
    gameTime: "6:35 PM (Hora VE)",
    pitchers: "Por Anunciar (CLE) vs Brandon Young (BAL)",
    selection: "Baltimore Orioles ML",
    decimalOdds: 1.85,
    americanOdds: "-118",
    estimatedProb: 0.64,
    category: "valor",
    categoryLabel: "🚀 Oro Puro (+EV)",
    stars: 4,
    edgePercent: "+15.2%",
    confidenceScore: 87,
    sportsbook: "Stake.com",
    reasoning: "En Stake la cuota de Baltimore paga @1.85 (zona de oro absoluto). Cleveland con fatiga de bullpen tras la serie en Baltimore."
  }
];

export const STAKE_PARLAY_PRESETS = {
  safe: {
    title: "🛡️ TICKET 1: Banquero Nocturno Stake (@2.68)",
    multiplier: 2.68,
    legs: [
      { id: "stk-giants-tonight", match: "Cardinals vs Giants (8:10 PM)", selection: "Giants ML (Logan Webb)", decimalOdds: 1.76, estimatedProb: 0.74 },
      { id: "stk-bluejays-tonight", match: "Blue Jays vs Athletics (10:05 PM)", selection: "Blue Jays ML (Dylan Cease)", decimalOdds: 1.52, estimatedProb: 0.76 }
    ],
    payoutExample: "Si apuestas $20 USD cobras $53.60 USD (+$33.60 USD netos en Binance USDT)"
  },
  opt: {
    title: "⚖️ TICKET 4: Tridente Defensivo Stake (+EV @4.95)",
    multiplier: 4.95,
    legs: [
      { id: "stk-giants-tonight", match: "Cardinals vs Giants (8:10 PM)", selection: "Giants ML", decimalOdds: 1.76, estimatedProb: 0.74 },
      { id: "stk-under-dodgers", match: "Reds vs Dodgers (9:10 PM)", selection: "Under 8.5 Carreras", decimalOdds: 1.85, estimatedProb: 0.66 },
      { id: "stk-bluejays-tonight", match: "Blue Jays vs Athletics (10:05 PM)", selection: "Blue Jays ML", decimalOdds: 1.52, estimatedProb: 0.76 }
    ],
    payoutExample: "Si apuestas $15 USD cobras $74.25 USD (+$59.25 USD netos)"
  },
  bomb: {
    title: "💣 TICKET 6: Mega Cuotón Stake USD (@10.66)",
    multiplier: 10.66,
    legs: [
      { id: "stk-giants-tonight", match: "Cardinals vs Giants (8:10 PM)", selection: "Giants ML", decimalOdds: 1.76, estimatedProb: 0.74 },
      { id: "stk-under-dodgers", match: "Reds vs Dodgers (9:10 PM)", selection: "Under 8.5 Carreras", decimalOdds: 1.85, estimatedProb: 0.66 },
      { id: "stk-bluejays-tonight", match: "Blue Jays vs Athletics (10:05 PM)", selection: "Blue Jays -1.5 Runline", decimalOdds: 1.95, estimatedProb: 0.60 },
      { id: "stk-redsox-tue", match: "Angels vs Red Sox (Martes 6:45 PM)", selection: "Red Sox ML", decimalOdds: 1.68, estimatedProb: 0.69 }
    ],
    payoutExample: "Si apuestas $10 USD cobras $106.60 USD (+$96.60 USD netos)"
  }
};
