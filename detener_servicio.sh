#!/bin/bash
pkill -f "daemon_guardian.py" 2>/dev/null || true
pkill -f "server.py" 2>/dev/null || true
pkill -f "cloudflared tunnel" 2>/dev/null || true
echo "Servicio y túnel detenidos."
