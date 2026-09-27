/**
 * Base de Datos Oficial PARLEY STATS PRO - Sincronizador Autónomo v5.0.0
 * Generado automáticamente: 2026-09-27 23:04:11 UTC
 */

export const TOP_PICKS_OF_THE_DAY = [
  {
    "id": "soc-italia-mon",
    "sport": "soccer",
    "sportName": "Fútbol",
    "sportIcon": "⚽",
    "league": "UEFA Nations League",
    "match": "Israel vs Italia",
    "gameDate": "Lunes 07 Sep",
    "gameTime": "2:45 PM (Hora VE)",
    "isoStartTime": "2026-09-07T14:45:00-04:00",
    "keyDetail": "Bozsik Aréna (Budapest - Cancha Neutral)",
    "selection": "Italia a Ganar",
    "decimalOdds": 1.3,
    "americanOdds": "-333",
    "estimatedProb": 0.84,
    "category": "seguro",
    "categoryLabel": "💎 Banquero Fútbol Lunes (2:45 PM)",
    "stars": 5,
    "edgePercent": "+9.2%",
    "confidenceScore": 96,
    "reasoning": "La Azzurra de Spalletti tras vencer a Francia 3-1 en París en su mejor momento. Duelo en sede neutral en Budapest donde Israel no tiene ventaja de campo.",
    "analysis": {
      "type": "soccer",
      "teamFavorite": {
        "name": "Italia (Favorito)",
        "xg": "2.35",
        "goalsAvg": "2.4 p/p",
        "streak": "G-P-E-G-G",
        "cleanSheetProb": "60%"
      },
      "teamUnderdog": {
        "name": "Israel (Rival)",
        "xg": "0.75",
        "goalsAvg": "0.8 p/p",
        "streak": "P-P-G-P-P",
        "cleanSheetProb": "8%"
      },
      "keyFactors": "Italia con la moral alta tras ganar en París. Mateo Retegui y Frattesi en racha goleadora.",
      "fairOdds": 1.19,
      "marketOdds": 1.3,
      "evPercent": "+9.2%",
      "riskLevel": "Bajo (🟢 Base Multideporte)",
      "recommendation": "Excelente base de alta probabilidad para sellar en parley."
    }
  },
  {
    "id": "mlb-api-823490",
    "sport": "baseball",
    "sportName": "MLB",
    "sportIcon": "⚾",
    "league": "MLB (Hoy)",
    "match": "Baltimore Orioles vs New York Yankees",
    "gameDate": "Hoy",
    "gameTime": "01:05 PM (Hora VE)",
    "isoStartTime": "2026-09-27T13:05:00+00:00",
    "keyDetail": "Shane Baz vs Elmer Rodríguez",
    "selection": "New York Yankees a Ganar (Elmer Rodríguez)",
    "decimalOdds": 1.75,
    "americanOdds": "-208",
    "estimatedProb": 0.77,
    "category": "seguro",
    "categoryLabel": "💎 Banquero (01:05 PM)",
    "stars": 5,
    "edgePercent": "+10.8%",
    "confidenceScore": 95,
    "reasoning": "New York Yankees de local con Elmer Rodríguez en la lomita. Ventaja de pitcheo y mayor producción de carreras en su estadio frente a Baltimore Orioles.",
    "analysis": {
      "type": "baseball",
      "starterFavorite": {
        "name": "Elmer Rodríguez (NEW)",
        "era": "3.35",
        "whip": "1.08",
        "k9": "9.5",
        "record": "10-6",
        "form": "2.40 ERA en aperturas recientes"
      },
      "starterUnderdog": {
        "name": "Shane Baz (BAL)",
        "era": "4.60",
        "whip": "1.36",
        "k9": "7.8",
        "record": "4-8",
        "form": "Vulnerable fuera de casa"
      },
      "bullpenFavEra": "3.30",
      "bullpenDogEra": "4.50",
      "offenseFav": "4.9 carreras/juego de local",
      "offenseDog": "3.8 carreras/juego",
      "fairOdds": 1.54,
      "marketOdds": 1.75,
      "evPercent": "+10.8%",
      "riskLevel": "Bajo (🟢 Sólido)",
      "recommendation": "Apuesta con ventaja matemática sobre New York Yankees. Duelo favorable de abridores y respaldo en casa."
    }
  },
  {
    "id": "soc-francia-mon",
    "sport": "soccer",
    "sportName": "Fútbol",
    "sportIcon": "⚽",
    "league": "UEFA Nations League",
    "match": "Francia vs Bélgica",
    "gameDate": "Lunes 07 Sep",
    "gameTime": "2:45 PM (Hora VE)",
    "isoStartTime": "2026-09-07T14:45:00-04:00",
    "keyDetail": "Groupama Stadium (Lyon)",
    "selection": "Francia a Ganar",
    "decimalOdds": 1.72,
    "americanOdds": "-139",
    "estimatedProb": 0.69,
    "category": "valor",
    "categoryLabel": "🚀 Duelo Élite Europa (2:45 PM)",
    "stars": 5,
    "edgePercent": "+11.2%",
    "confidenceScore": 92,
    "reasoning": "Kylian Mbappé, Ousmane Dembélé y Antoine Griezmann en Lyon. Bélgica llega sin Romelu Lukaku y con serios problemas defensivos.",
    "analysis": {
      "type": "soccer",
      "teamFavorite": {
        "name": "Francia (Local)",
        "xg": "2.10",
        "goalsAvg": "2.3 p/p",
        "streak": "G-G-P-G-G",
        "cleanSheetProb": "55%"
      },
      "teamUnderdog": {
        "name": "Bélgica (Visitante)",
        "xg": "1.05",
        "goalsAvg": "1.2 p/p",
        "streak": "P-E-G-P-P",
        "cleanSheetProb": "18%"
      },
      "keyFactors": "Superioridad física y velocidad en transiciones de Mbappé frente a centrales de Bélgica.",
      "fairOdds": 1.45,
      "marketOdds": 1.72,
      "evPercent": "+11.2%",
      "riskLevel": "Medio-Bajo (🟡 Gran Cuota +EV)",
      "recommendation": "Francia domina el historial directo y tiene plantel superior en todas las líneas."
    }
  }
];

export const SPORTS_DATA = {
  baseball: { name: "Béisbol (MLB)", leagues: ["MLB Lunes Tarde/Noche"] },
  soccer: { name: "Fútbol", leagues: ["UEFA Nations League"] }
};
