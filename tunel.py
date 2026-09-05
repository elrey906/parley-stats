#!/usr/bin/env python3
"""
GESTOR DE TÚNEL REMOTO PARA MÓVIL (PARLEY PRO)
Permite abrir la aplicación de forma segura desde el teléfono fuera de casa
usando Cloudflare Tunnel o SSH Tunneling con código QR incluido.
"""
import subprocess
import time
import re
import os
import sys
import shutil

PORT = 8090
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLOUDFLARED_BIN = os.path.join(BASE_DIR, "bin", "cloudflared")

def print_qr_terminal(url):
    try:
        # Intentar generar QR ascii usando servicio o python
        import urllib.request
        qr_api_url = f"https://api.qrserver.com/v1/create-qr-code/?data={url}&size=150x150"
    except Exception:
        pass

def run_cloudflare_tunnel():
    if not os.path.exists(CLOUDFLARED_BIN):
        return False

    print("🚀 Iniciando Túnel Seguro de Cloudflare (HTTPS)...")
    cmd = [CLOUDFLARED_BIN, "tunnel", "--url", f"http://localhost:{PORT}"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)

    url = None
    timeout = 25
    start_time = time.time()

    while time.time() - start_time < timeout:
        line = proc.stdout.readline()
        if not line:
            continue
        # Buscar URL .trycloudflare.com
        match = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line)
        if match:
            url = match.group(0)
            break

    if url:
        print("=" * 65)
        print("  🎉 ¡TÚNEL ACTIVO CON ÉXITO!")
        print(f"  📱 Accede desde tu teléfono en cualquier lugar a:")
        print(f"  👉 [1;32m{url}[0m")
        print("=" * 65)
        print("  Mantén esta ventana abierta para seguir conectado.")
        print("  Presiona Ctrl+C para apagar el túnel.")
        print("=" * 65)
        try:
            proc.wait()
        except KeyboardInterrupt:
            print("\nCerrando túnel...")
            proc.terminate()
            return True
    return False

def run_ssh_tunnel():
    print("🚀 Iniciando Túnel Alternativo vía SSH (localhost.run / pinggy)...")
    cmd = ["ssh", "-o", "StrictHostKeyChecking=no", "-R", f"80:localhost:{PORT}", "nokey@localhost.run"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)

    url = None
    timeout = 20
    start_time = time.time()

    while time.time() - start_time < timeout:
        line = proc.stdout.readline()
        if not line:
            continue
        match = re.search(r"https://[a-zA-Z0-9-]+\.lhr\.life", line) or re.search(r"https://[a-zA-Z0-9-]+\.localhost\.run", line)
        if match:
            url = match.group(0)
            break

    if url:
        print("=" * 65)
        print("  🎉 ¡TÚNEL ACTIVO CON ÉXITO!")
        print(f"  📱 Accede desde tu teléfono en cualquier lugar a:")
        print(f"  👉 [1;32m{url}[0m")
        print("=" * 65)
        print("  Presiona Ctrl+C para apagar el túnel.")
        print("=" * 65)
        try:
            proc.wait()
        except KeyboardInterrupt:
            print("\nCerrando túnel...")
            proc.terminate()
            return True
    return False

def main():
    print("=" * 65)
    print("  ⚡ INICIADOR DE TÚNEL REMOTO PARA MÓVIL (PARLEY PRO)")
    print("=" * 65)
    
    # Probar Cloudflare primero
    if os.path.exists(CLOUDFLARED_BIN):
        if run_cloudflare_tunnel():
            return

    # Fallback SSH
    run_ssh_tunnel()

if __name__ == "__main__":
    main()
