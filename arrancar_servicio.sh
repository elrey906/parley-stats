#!/bin/bash
# Limpiar procesos viejos
pkill -f "daemon_guardian.py" 2>/dev/null || true
pkill -f "server.py" 2>/dev/null || true
pkill -f "cloudflared tunnel" 2>/dev/null || true
sleep 1

# Lanzar con setsid y nohup para desacoplar totalmente de la terminal
setsid nohup python3 -u /home/h/Escritorio/RESPALDO/parley-stats/daemon_guardian.py > /home/h/Escritorio/RESPALDO/parley-stats/guardian_nohup.log 2>&1 &

echo "=========================================================="
echo "  🛡️ SERVICIO 24/7 Y GUARDIÁN ANTI-FALLAS INICIADOS"
echo "=========================================================="
echo "El sistema correrá de forma continua aunque cierres el chat."
echo "Enlace móvil guardado en: /home/h/Escritorio/ENLACE_PARLEY_MOVIL.txt"
echo "=========================================================="
