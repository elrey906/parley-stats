#!/usr/bin/env python3
"""
🛡️ GUARDIÁN ANTI-FALLAS 24/7 (PARLEY PRO - ROBUST v3.0)
- Supervisa permanentemente el Servidor Local y el Túnel Cloudflare.
- Lanza un thread no-bloqueante para capturar y mantener viva la salida de cloudflared.
- Detección de conectividad contra servidores DNS y HTTP globales.
- Si se cae el túnel, la luz o la red, se auto-recupera de inmediato.
- Guarda la URL activa en el Escritorio y directorio local.
"""
import subprocess
import time
import urllib.request
import re
import os
import sys
import threading

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_SCRIPT = os.path.join(BASE_DIR, "server.py")
CLOUDFLARED_BIN = os.path.join(BASE_DIR, "bin", "cloudflared")
PORT = 8090
LOG_FILE = os.path.join(BASE_DIR, "guardian_24_7.log")
URL_FILE_DESKTOP = "/home/h/Escritorio/ENLACE_PARLEY_MOVIL.txt"
URL_FILE_LOCAL = os.path.join(BASE_DIR, "ENLACE_MOVIL.txt")

current_tunnel_url = None

def log(msg):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    entry = f"[{ts}] {msg}"
    print(entry, flush=True)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(entry + "\n")
    except Exception:
        pass

def hay_internet():
    endpoints = ["https://1.1.1.1", "https://www.google.com", "https://cloudflare.com"]
    for url in endpoints:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=5) as response:
                return True
        except Exception:
            continue
    return False

def server_local_responde():
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{PORT}", timeout=3) as resp:
            return resp.status == 200
    except Exception:
        return False

def guardar_enlace_para_usuario(url):
    contenido = f"""====================================================
⚡ ENLACE DE ACCESO MÓVIL 24/7 - PARLEY STATS PRO
====================================================
📱 Abre este enlace en el navegador de tu teléfono:

   {url}

====================================================
🕒 Última sincronización: {time.strftime('%Y-%m-%d %H:%M:%S')}
🛡️ Guardián Anti-Fallas: ACTIVO Y VIGILANTE
====================================================
"""
    for ruta in [URL_FILE_DESKTOP, URL_FILE_LOCAL]:
        try:
            with open(ruta, "w", encoding="utf-8") as f:
                f.write(contenido)
            log(f"Enlace actualizado en: {ruta}")
        except Exception as e:
            log(f"Error escribiendo {ruta}: {e}")

def leer_salida_tunel(proc):
    global current_tunnel_url
    try:
        for line in iter(proc.stdout.readline, ''):
            if not line:
                break
            # Buscar URL del túnel
            m = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", line)
            if m:
                url_encontrada = m.group(0)
                if url_encontrada != current_tunnel_url and "api.trycloudflare.com" not in url_encontrada:
                    current_tunnel_url = url_encontrada
                    log(f"¡TÚNEL RESTAURADO Y ACTIVO! URL: {current_tunnel_url}")
                    guardar_enlace_para_usuario(current_tunnel_url)
    except Exception as e:
        log(f"Fin de lectura del túnel: {e}")

last_pizarra_sync = 0

def get_github_remote_url():
    token_file = os.path.join(BASE_DIR, ".token_git")
    if os.path.exists(token_file):
        try:
            with open(token_file, "r", encoding="utf-8") as f:
                t = f.read().strip()
                if t:
                    return f"https://elrey906:{t}@github.com/elrey906/parley-stats.git"
        except Exception:
            pass
    return "origin"

def auto_sincronizar_pizarra():
    global last_pizarra_sync
    # Sincronizar cada 2 horas (7200 segundos)
    now = time.time()
    if now - last_pizarra_sync < 7200:
        return

    log("Ejecutando auto-sincronización de pizarra deportiva en vivo...")
    try:
        script_sync = os.path.join(BASE_DIR, "actualizar_pizarra.py")
        res = subprocess.run([sys.executable, script_sync], cwd=BASE_DIR, capture_output=True, text=True, timeout=60)
        if res.returncode == 0:
            log("Pizarra local actualizada con éxito.")
            # Verificar si hay cambios en git
            st = subprocess.run(["git", "status", "--porcelain", "js/sportsData.js"], cwd=BASE_DIR, capture_output=True, text=True)
            if st.stdout.strip():
                log("Detectados nuevos partidos. Haciendo commit y push a GitHub...")
                subprocess.run(["git", "commit", "-m", "chore(guardian): auto-sincronizacion de cartelera en vivo", "js/sportsData.js"], cwd=BASE_DIR, capture_output=True)
                push_res = subprocess.run(["git", "push", get_github_remote_url(), "main"], cwd=BASE_DIR, capture_output=True, text=True, timeout=40)
                if push_res.returncode == 0:
                    log("¡Despliegue a GitHub Pages completado con éxito!")
                else:
                    log(f"Aviso push GitHub: {push_res.stderr.strip()}")
            else:
                log("Pizarra al día, no requirió push.")
            last_pizarra_sync = now
        else:
            log(f"Error ejecutando actualizar_pizarra.py: {res.stderr.strip()}")
    except Exception as e:
        log(f"Excepción en auto_sincronizar_pizarra: {e}")

def main():
    global current_tunnel_url
    log("Iniciando Guardián Anti-Fallas 24/7 para Parley Stats (v3.0)...")
    server_proc = None
    tunnel_proc = None

    while True:
        try:
            # 1. Asegurar Servidor Web Local en puerto 8090
            if not server_local_responde():
                if server_proc is None or server_proc.poll() is not None:
                    log("Servidor local caído o inactivo. Levantando server.py...")
                    server_proc = subprocess.Popen(
                        [sys.executable, SERVER_SCRIPT],
                        cwd=BASE_DIR,
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL
                    )
                    time.sleep(2)

            # 2. Verificar Conexión a Internet
            if not hay_internet():
                log("Sin conexión a Internet (corte de red / luz). Esperando que regrese...")
                if tunnel_proc and tunnel_proc.poll() is None:
                    try:
                        tunnel_proc.terminate()
                    except Exception:
                        pass
                    tunnel_proc = None
                    current_tunnel_url = None
                time.sleep(6)
                continue

            # 3. Si hay Internet y el Túnel está caído, levantarlo
            if tunnel_proc is None or tunnel_proc.poll() is not None:
                log("Internet disponible. Levantando Túnel Seguro Cloudflare...")
                cmd = [CLOUDFLARED_BIN, "tunnel", "--url", f"http://127.0.0.1:{PORT}"]
                tunnel_proc = subprocess.Popen(
                    cmd,
                    cwd=BASE_DIR,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    bufsize=1
                )
                current_tunnel_url = None
                t = threading.Thread(target=leer_salida_tunel, args=(tunnel_proc,), daemon=True)
                t.start()
                time.sleep(4)

            # 4. Chequeo de salud del túnel
            if current_tunnel_url:
                try:
                    req = urllib.request.Request(current_tunnel_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=10) as r:
                        if r.status != 200:
                            log(f"Túnel respondió status {r.status}, reiniciando...")
                            if tunnel_proc:
                                tunnel_proc.terminate()
                            tunnel_proc = None
                            current_tunnel_url = None
                except Exception:
                    # Falla transitoria de red, no tumbar de inmediato
                    pass

            # 5. Sincronizador Automático de Pizarra en Vivo (Fase 2 Pro)
            auto_sincronizar_pizarra()

            time.sleep(10)

        except Exception as e:
            log(f"Excepción en ciclo guardián: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
