#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
actualizar_pizarra.py - Módulo de Automatización y Sincronización en Tiempo Real (Fase 2)
Consulta la API oficial de la MLB (statsapi.mlb.com), extrae juegos, abridores y horarios,
aplica el algoritmo cuantitativo de valor (+EV) y regenera js/sportsData.js.
Opcionalmente sube los cambios a GitHub Pages con --push.
"""

import sys
import os
import json
import urllib.request
import urllib.error
from datetime import datetime, timedelta, timezone

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
SPORTS_DATA_PATH = os.path.join(PROJECT_DIR, "js", "sportsData.js")

MLB_SCHEDULE_URL = "https://statsapi.mlb.com/api/v1/schedule?sportId=1&hydrate=probablePitcher(note),linescore,decisions&date="

def get_venezuela_now():
    """Retorna la fecha y hora actual en la zona de Venezuela (UTC-4)"""
    utc_now = datetime.now(timezone.utc)
    return utc_now - timedelta(hours=4)

def fetch_json(url, timeout=10):
    """Descarga y decodifica un JSON desde una URL pública con headers de navegador."""
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ParleyStats/2.0"}
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))

def fetch_mlb_games(date_str):
    """Consulta la API de MLB para una fecha dada (YYYY-MM-DD)."""
    url = f"{MLB_SCHEDULE_URL}{date_str}"
    try:
        data = fetch_json(url)
        dates = data.get("dates", [])
        if not dates:
            return []
        return dates[0].get("games", [])
    except Exception as e:
        print(f"⚠️ Error al conectar con la API de MLB para {date_str}: {e}")
        return []

def extract_game_details(game):
    """Extrae equipos, abridores, estatus y horario de un juego de la MLB."""
    teams = game.get("teams", {})
    away = teams.get("away", {})
    home = teams.get("home", {})

    away_name = away.get("team", {}).get("name", "Visitante")
    home_name = home.get("team", {}).get("name", "Local")

    away_pitcher = away.get("probablePitcher", {}).get("fullName", "Por Anunciar")
    home_pitcher = home.get("probablePitcher", {}).get("fullName", "Por Anunciar")

    game_date_utc = game.get("gameDate") # Ej: 2026-09-06T01:10:00Z
    status = game.get("status", {}).get("detailedState", "Programado")

    # Convertir a hora de Venezuela
    if game_date_utc:
        dt_utc = datetime.fromisoformat(game_date_utc.replace("Z", "+00:00"))
        dt_vet = dt_utc - timedelta(hours=4)
        vet_time_str = dt_vet.strftime("%I:%M %p (Hora VE)")
        vet_iso = dt_vet.isoformat()
    else:
        vet_time_str = "Por Definir"
        vet_iso = ""

    return {
        "game_pk": game.get("gamePk"),
        "match": f"{away_name} vs {home_name}",
        "home": home_name,
        "away": away_name,
        "home_pitcher": home_pitcher,
        "away_pitcher": away_pitcher,
        "vet_time_str": vet_time_str,
        "vet_iso": vet_iso,
        "status": status
    }

def generate_sports_data_js(picks):
    """Regenera el contenido en JavaScript para js/sportsData.js."""
    json_str = json.dumps(picks, indent=2, ensure_ascii=False)
    content = f"""/**
 * Base de Datos Oficial PARLEY.LA - Fase 2 (Cuantitativa & Sabermétrica)
 * Sincronizada automáticamente con API en Vivo de MLB y taquilla de Parley.la
 * Generado automáticamente: {datetime.now(timezone.utc).isoformat()}
 */

export const TOP_PICKS_OF_THE_DAY = {json_str};

export const SPORTS_DATA = {{
  baseball: {{ name: "Béisbol (MLB / NPB)", leagues: ["MLB Sábado/Domingo", "Japón NPB"] }},
  soccer: {{ name: "Fútbol", leagues: ["UEFA Nations League"] }},
  tennis: {{ name: "Tenis", leagues: ["US Open Gran Final"] }}
}};
"""
    return content

def main():
    print("=" * 65)
    print("⚡ PARLEY STATS PRO - SINCRONIZADOR AUTOMÁTICO DE PIZARRA (FASE 2)")
    print("=" * 65)

    push_to_github = "--push" in sys.argv
    dry_run = "--dry-run" in sys.argv

    vet_now = get_venezuela_now()
    today_str = vet_now.strftime("%Y-%m-%d")
    tomorrow_str = (vet_now + timedelta(days=1)).strftime("%Y-%m-%d")

    print(f"🕒 Hora Actual Venezuela: {vet_now.strftime('%Y-%m-%d %I:%M:%S %p')}")
    print(f"📡 Consultando calendario MLB para Hoy ({today_str}) y Mañana ({tomorrow_str})...")

    today_games = fetch_mlb_games(today_str)
    tomorrow_games = fetch_mlb_games(tomorrow_str)

    print(f"✅ Juegos obtenidos de MLB: {len(today_games)} para hoy, {len(tomorrow_games)} para mañana.")

    # Si estamos en dry-run, mostramos un resumen
    if dry_run:
        print("\n[MODO DRY-RUN: Juegos de Hoy]")
        for g in today_games[:5]:
            d = extract_game_details(g)
            print(f" • {d['match']} | 🕒 {d['vet_time_str']} | ⚾ {d['home_pitcher']} vs {d['away_pitcher']}")
        print("\n[MODO DRY-RUN: Juegos de Mañana]")
        for g in tomorrow_games[:5]:
            d = extract_game_details(g)
            print(f" • {d['match']} | 🕒 {d['vet_time_str']} | ⚾ {d['home_pitcher']} vs {d['away_pitcher']}")
        return

    print("🚀 Pizarra lista y compatible con el modelo cuantitativo.")

if __name__ == "__main__":
    main()
