/**
 * Base de Datos de Logros y Top Picks de PARLEY.LA (Pizarra Venezuela en Bolívares / Taquilla)
 * Cartelera Multideporte Oficial de HOY (05 de Septiembre) con Hora de Venezuela (VET)
 * Béisbol MLB + Fútbol (Nations League / MLS) + Tenis (US Open)
 */

export const TOP_PICKS_OF_THE_DAY = [
  // ==========================================
  // 🎾 TENIS - US OPEN (SEMIS Y FINALES DE HOY)
  // ==========================================
  {
    id: "pla-tn-1",
    sport: "tennis",
    sportName: "Tenis",
    sportIcon: "🎾",
    league: "US Open (Grand Slam)",
    match: "Jannik Sinner vs Jack Draper",
    gameDate: "Hoy 05 Sep",
    gameTime: "3:00 PM (Hora VE)",
    keyDetail: "Pista Rápida - Semifinal Masculina",
    selection: "Jannik Sinner a Ganar",
    decimalOdds: 1.18,
    americanOdds: "-550",
    estimatedProb: 0.86,
    category: "seguro",
    categoryLabel: "💎 Banquero Tenis",
    stars: 5,
    edgePercent: "+7.5%",
    confidenceScore: 98,
    reasoning: "El número 1 del mundo en su mejor superficie (cemento rápido de Flushing Meadows). Intratable al servicio y consistencia demoledora."
  },
  {
    id: "pla-tn-2",
    sport: "tennis",
    sportName: "Tenis",
    sportIcon: "🎾",
    league: "US Open (Grand Slam)",
    match: "Aryna Sabalenka vs Jessica Pegula",
    gameDate: "Hoy 05 Sep",
    gameTime: "4:00 PM (Hora VE)",
    keyDetail: "Gran Final Femenina de Nueva York",
    selection: "Aryna Sabalenka a Ganar",
    decimalOdds: 1.36,
    americanOdds: "-278",
    estimatedProb: 0.77,
    category: "seguro",
    categoryLabel: "💎 Gran Final Grand Slam",
    stars: 5,
    edgePercent: "+9.5%",
    confidenceScore: 92,
    reasoning: "Sabalenka llega como una locomotora conectando saques sobre 120 mph y récord de 11-1 en Flushing Meadows. Máxima favorita al trofeo."
  },

  // ==========================================
  // ⚽ FÚTBOL (NATIONS LEAGUE & MLS NOCHE)
  // ==========================================
  {
    id: "pla-fb-1",
    sport: "soccer",
    sportName: "Fútbol",
    sportIcon: "⚽",
    league: "UEFA Nations League",
    match: "Países Bajos vs Bosnia y Herzegovina",
    gameDate: "Hoy 05 Sep",
    gameTime: "2:45 PM (Hora VE)",
    keyDetail: "Fase de Grupos - Philips Stadion",
    selection: "Países Bajos a Ganar",
    decimalOdds: 1.22,
    americanOdds: "-455",
    estimatedProb: 0.83,
    category: "seguro",
    categoryLabel: "💎 Banquero Fútbol",
    stars: 5,
    edgePercent: "+8.5%",
    confidenceScore: 96,
    reasoning: "Gakpo, Reijnders y Simons comandan la ofensiva de la 'Oranje' ante una Bosnia en profunda reestructuración y débil en defensa."
  },
  {
    id: "pla-fb-2",
    sport: "soccer",
    sportName: "Fútbol",
    sportIcon: "⚽",
    league: "UEFA Nations League",
    match: "Alemania vs Hungría",
    gameDate: "Hoy 05 Sep",
    gameTime: "2:45 PM (Hora VE)",
    keyDetail: "Fase de Grupos - Düsseldorf Arena",
    selection: "Alemania a Ganar",
    decimalOdds: 1.28,
    americanOdds: "-357",
    estimatedProb: 0.80,
    category: "seguro",
    categoryLabel: "💎 Banquero Fútbol",
    stars: 5,
    edgePercent: "+9.0%",
    confidenceScore: 94,
    reasoning: "Jamal Musiala y Florian Wirtz lideran una Alemania dinámica y arrolladora como local frente al bloque húngaro."
  },
  {
    id: "pla-fb-3",
    sport: "soccer",
    sportName: "Fútbol",
    sportIcon: "⚽",
    league: "MLS (EE.UU. - Sábado Noche)",
    match: "Chicago Fire vs Inter Miami",
    gameDate: "Hoy 05 Sep",
    gameTime: "8:30 PM (Hora VE)",
    keyDetail: "Soldier Field (Chicago)",
    selection: "Inter Miami Gana o Empata (1X)",
    decimalOdds: 1.42,
    americanOdds: "-238",
    estimatedProb: 0.76,
    category: "valor",
    categoryLabel: "🚀 Alto Valor MLS",
    stars: 4,
    edgePercent: "+10.1%",
    confidenceScore: 89,
    reasoning: "Luis Suárez encendido como goleador e Inter Miami firme en la cima del Supporters' Shield ante un Chicago de los más flojos del torneo."
  },

  // ==========================================
  // ⚾ BÉISBOL (MLB GRANDES LIGAS HOY)
  // ==========================================
  {
    id: "pla-1",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (National League)",
    match: "Philadelphia Phillies vs Miami Marlins",
    gameDate: "Hoy 05 Sep",
    gameTime: "6:40 PM (Hora VE)",
    keyDetail: "Ranger Suárez (PHI) vs Adam Oller (MIA)",
    selection: "Philadelphia Phillies a Ganar (R. Suárez)",
    decimalOdds: 1.48,
    americanOdds: "-208",
    estimatedProb: 0.74,
    category: "seguro",
    categoryLabel: "💎 Banquero MLB",
    stars: 5,
    edgePercent: "+9.5%",
    confidenceScore: 94,
    reasoning: "El estelar zurdo venezolano Ranger Suárez sube a la lomita en gran momento ante la débil toletería de los Marlins (Adam Oller efectividad > 4.70)."
  },
  {
    id: "pla-2",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (National League)",
    match: "Washington Nationals vs Pittsburgh Pirates",
    gameDate: "Hoy 05 Sep",
    gameTime: "6:40 PM (Hora VE)",
    keyDetail: "Patrick Corbin (WSH) vs Bailey Falter (PIT)",
    selection: "Pittsburgh Pirates a Ganar (B. Falter)",
    decimalOdds: 1.63,
    americanOdds: "-159",
    estimatedProb: 0.68,
    category: "seguro",
    categoryLabel: "💎 Base Fija MLB",
    stars: 5,
    edgePercent: "+10.8%",
    confidenceScore: 90,
    reasoning: "Pirates en PNC Park con Bailey Falter en racha positiva enfrentando a Patrick Corbin, uno de los lanzadores más bateados de toda la MLB."
  },
  {
    id: "pla-3",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (American League)",
    match: "Los Angeles Angels vs Texas Rangers",
    gameDate: "Hoy 05 Sep",
    gameTime: "8:05 PM (Hora VE)",
    keyDetail: "Jack Kochanowicz (LAA) vs Cody Bradford (TEX)",
    selection: "Texas Rangers a Ganar (C. Bradford)",
    decimalOdds: 1.55,
    americanOdds: "-182",
    estimatedProb: 0.71,
    category: "seguro",
    categoryLabel: "💎 Base Fija MLB",
    stars: 5,
    edgePercent: "+10.0%",
    confidenceScore: 91,
    reasoning: "Cody Bradford con WHIP de 0.95 en Arlington dominando bateadores derechos ante unos Angels con su alineación plagada de lesiones."
  },
  {
    id: "pla-4",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (National League)",
    match: "Colorado Rockies vs Atlanta Braves",
    gameDate: "Hoy 05 Sep",
    gameTime: "7:20 PM (Hora VE)",
    keyDetail: "Austin Gomber (COL) vs Reynaldo López (ATL)",
    selection: "Atlanta Braves a Ganar (R. López)",
    decimalOdds: 1.40,
    americanOdds: "-250",
    estimatedProb: 0.77,
    category: "seguro",
    categoryLabel: "💎 Banquero MLB",
    stars: 5,
    edgePercent: "+7.8%",
    confidenceScore: 92,
    reasoning: "Reynaldo López llega con efectividad microscópica de 2.00 ante los Rockies fuera de Colorado, el peor equipo de visita en la Liga Nacional."
  },
  {
    id: "pla-5",
    sport: "baseball",
    sportName: "MLB",
    sportIcon: "⚾",
    league: "MLB (Interleague)",
    match: "Detroit Tigers vs San Diego Padres",
    gameDate: "Hoy 05 Sep",
    gameTime: "8:40 PM (Hora VE)",
    keyDetail: "Kenta Maeda (DET) vs Martín Pérez (SD)",
    selection: "San Diego Padres a Ganar (M. Pérez)",
    decimalOdds: 1.62,
    americanOdds: "-161",
    estimatedProb: 0.67,
    category: "valor",
    categoryLabel: "🚀 Alto Valor (+EV)",
    stars: 4,
    edgePercent: "+8.5%",
    confidenceScore: 86,
    reasoning: "El venezolano Martín Pérez lanzando en Petco Park con sólida ofensiva encabezada por Manny Machado y Jackson Merrill."
  }
];

export const SPORTS_DATA = {
  baseball: {
    name: "Baseball (MLB - Parley.la)",
    leagues: ["Major League Baseball"],
    teams: [],
    upcomingMatches: []
  },
  soccer: {
    name: "Fútbol (Nations League / MLS)",
    leagues: ["UEFA Nations League", "MLS"],
    teams: [],
    upcomingMatches: []
  },
  tennis: {
    name: "Tenis (US Open Grand Slam)",
    leagues: ["ATP / WTA US Open"],
    teams: [],
    upcomingMatches: []
  }
};
