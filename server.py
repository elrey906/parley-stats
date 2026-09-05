#!/usr/bin/env python3
"""
Servidor Local para la Plataforma Parley Stats
"""
import http.server
import socketserver
import os
import sys

PORTS = [8090, 8095, 8888, 8081, 8080]
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]}")

def run_server():
    os.chdir(DIRECTORY)
    for port in PORTS:
        try:
            with socketserver.TCPServer(("", port), CustomHandler) as httpd:
                url = f"http://localhost:{port}"
                print("=" * 60)
                print(f"  ⚡ Servidor Parley Stats Pro activo")
                print(f"  🌐 URL Local: {url}")
                print(f"  📁 Directorio: {DIRECTORY}")
                print("  Presiona Ctrl+C para detener el servidor")
                print("=" * 60)
                try:
                    httpd.serve_forever()
                except KeyboardInterrupt:
                    print("\nServidor detenido.")
                    sys.exit(0)
        except OSError:
            continue

if __name__ == "__main__":
    run_server()
