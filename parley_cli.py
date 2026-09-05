#!/usr/bin/env python3
"""
PARLEY STATS CLI - Herramienta de Terminal para Estadísticas, EV y Monte Carlo
"""
import sys
import math
import random
import argparse

def american_to_decimal(american):
    if american > 0:
        return (american / 100.0) + 1.0
    elif american < 0:
        return (100.0 / abs(american)) + 1.0
    return 1.0

def decimal_to_american(decimal):
    if decimal >= 2.0:
        return f"+{int(round((decimal - 1) * 100))}"
    elif decimal > 1.0:
        return f"{int(round(-100 / (decimal - 1)))}"
    return "+0"

def calculate_parlay(odds_list, probabilities=None, stake=10.0):
    combined_odds = 1.0
    combined_prob = 1.0
    for i, o in enumerate(odds_list):
        combined_odds *= o
        p = probabilities[i] if (probabilities and i < len(probabilities)) else (1.0 / o)
        combined_prob *= p
    
    payout = stake * combined_odds
    profit = payout - stake
    implied_prob = 1.0 / combined_odds
    ev = (combined_prob * profit) - ((1.0 - combined_prob) * stake)
    ev_pct = (ev / stake) * 100.0 if stake > 0 else 0.0

    return {
        "combined_odds": round(combined_odds, 3),
        "american_odds": decimal_to_american(combined_odds),
        "stake": stake,
        "payout": round(payout, 2),
        "profit": round(profit, 2),
        "implied_prob_pct": round(implied_prob * 100, 2),
        "real_prob_pct": round(combined_prob * 100, 2),
        "ev_pct": round(ev_pct, 2)
    }

def kelly_sizing(bankroll, decimal_odds, win_prob):
    b = decimal_odds - 1.0
    p = win_prob
    q = 1.0 - p
    kelly_f = max(0.0, (b * p - q) / b) if b > 0 else 0.0
    return {
        "full_kelly": round(bankroll * kelly_f, 2),
        "half_kelly": round(bankroll * (kelly_f / 2.0), 2),
        "quarter_kelly": round(bankroll * (kelly_f / 4.0), 2),
        "fraction_pct": round(kelly_f * 100.0, 2)
    }

def run_monte_carlo(bankroll=1000.0, stake=25.0, odds=4.5, win_prob=0.25, num_bets=100, sims=1000):
    final_bankrolls = []
    busts = 0
    profits = 0
    max_drawdown_global = 0.0

    for _ in range(sims):
        b = bankroll
        peak = b
        max_dd = 0.0
        for _ in range(num_bets):
            if b <= 1.0:
                b = 0.0
                break
            s = min(stake, b)
            if random.random() < win_prob:
                b += s * (odds - 1.0)
            else:
                b -= s
            if b > peak:
                peak = b
            dd = ((peak - b) / peak) * 100.0 if peak > 0 else 0.0
            if dd > max_dd:
                max_dd = dd
        if b <= 1.0:
            busts += 1
        if b > bankroll:
            profits += 1
        if max_dd > max_drawdown_global:
            max_drawdown_global = max_dd
        final_bankrolls.append(b)

    final_bankrolls.sort()
    p10 = final_bankrolls[int(sims * 0.10)]
    p50 = final_bankrolls[int(sims * 0.50)]
    p90 = final_bankrolls[int(sims * 0.90)]

    return {
        "bust_rate_pct": round((busts / sims) * 100.0, 2),
        "profit_prob_pct": round((profits / sims) * 100.0, 2),
        "median_bankroll": round(p50, 2),
        "p10_pessimistic": round(p10, 2),
        "p90_optimistic": round(p90, 2),
        "max_drawdown_pct": round(max_drawdown_global, 2)
    }

def main():
    parser = argparse.ArgumentParser(description="Parley Stats CLI - Análisis y Simulación de Apuestas")
    subparsers = parser.add_subparsers(dest="command")

    # Comando: calc
    calc_parser = subparsers.add_parser("calc", help="Calcula cuota combinada, EV y retorno de un parley")
    calc_parser.add_argument("-o", "--odds", nargs="+", type=float, required=True, help="Lista de cuotas decimales (ej: 1.85 2.10 1.95)")
    calc_parser.add_argument("-s", "--stake", type=float, default=10.0, help="Monto apostado ($)")
    calc_parser.add_argument("-p", "--probs", nargs="+", type=float, help="Probabilidades reales estimadas (0 a 1)")

    # Comando: sim
    sim_parser = subparsers.add_parser("sim", help="Ejecuta simulación Monte Carlo de series de parleys")
    sim_parser.add_argument("-b", "--bankroll", type=float, default=1000.0, help="Bankroll inicial ($)")
    sim_parser.add_argument("-s", "--stake", type=float, default=25.0, help="Monto por apuesta ($)")
    sim_parser.add_argument("-o", "--odds", type=float, default=4.5, help="Cuota promedio del parley")
    sim_parser.add_argument("-p", "--prob", type=float, default=0.25, help="Probabilidad de acierto (0 a 1)")
    sim_parser.add_argument("-n", "--bets", type=int, default=100, help="Número de apuestas por serie")
    sim_parser.add_argument("-i", "--sims", type=int, default=1000, help="Cantidad de iteraciones")

    args = parser.parse_args()

    if args.command == "calc":
        res = calculate_parlay(args.odds, args.probs, args.stake)
        print("=" * 55)
        print("         RESULTADOS DE PARLEY CALCULADO")
        print("=" * 55)
        print(f"  Cuotas individuales:   {args.odds}")
        print(f"  Cuota Combinada:       @{res['combined_odds']} ({res['american_odds']})")
        print(f"  Monto Apostado:        ${res['stake']}")
        print(f"  Pago Total Estimado:   ${res['payout']}")
        print(f"  Beneficio Neto:        +${res['profit']}")
        print(f"  Probabilidad Implícita: {res['implied_prob_pct']}%")
        print(f"  Probabilidad Real:     {res['real_prob_pct']}%")
        print(f"  Valor Esperado (EV):   {'+' if res['ev_pct'] > 0 else ''}{res['ev_pct']}%")
        print("=" * 55)

    elif args.command == "sim":
        print(f"Ejecutando {args.sims} simulaciones de {args.bets} parleys...")
        res = run_monte_carlo(args.bankroll, args.stake, args.odds, args.prob, args.bets, args.sims)
        print("=" * 55)
        print("         RESULTADOS SIMULACIÓN MONTE CARLO")
        print("=" * 55)
        print(f"  Bankroll Inicial:      ${args.bankroll}")
        print(f"  Riesgo de Quiebra:     {res['bust_rate_pct']}%")
        print(f"  Prob. de Ganancia:     {res['profit_prob_pct']}%")
        print(f"  Mediana Bankroll Final: ${res['median_bankroll']}")
        print(f"  P10 (Pesimista):       ${res['p10_pessimistic']}")
        print(f"  P90 (Optimista):        ${res['p90_optimistic']}")
        print(f"  Max Drawdown Histórico: {res['max_drawdown_pct']}%")
        print("=" * 55)

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
