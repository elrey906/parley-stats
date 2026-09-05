# ⚡ PARLEY STATS PRO - Plataforma de Estadísticas y Análisis de Parleys

Una suite integral y profesional para el análisis matemático, cálculo de Valor Esperado (EV), simulación Monte Carlo, gestión de Bankroll (Criterio de Kelly) y seguimiento de rendimiento (Bet Tracker) de apuestas combinadas (parleys / parlays).

---

## 🚀 Características Principales

### 1. 📊 Calculadora de Parleys & Motor de EV (Expected Value)
- Soporte multiformato de cuotas en tiempo real: **Decimal**, **Americana** (`+150`, `-110`) y **Fraccional** (`3/2`).
- Cálculo exacto de probabilidad implícita, probabilidad real ajustada sin overround (vig) y beneficio neto.
- Detección inteligente de **riesgo de correlación** (Same Game Parlays / selecciones del mismo partido).
- Sugerencia automática de tamaño de apuesta mediante Criterio de Kelly fraccional.

### 2. 🎲 Simulador de Riesgo Monte Carlo
- Ejecución estocástica de **1,000 a 5,000 trayectorias** de series de apuestas.
- Cálculo probabilístico de **Riesgo de Quiebra (Bust Rate)**, probabilidad de rentabilidad, drawdown máximo y racha más larga de pérdidas.
- Gráfico interactivo de trayectorias simultáneas y distribución percentil (P10 pesimista, P50 mediana, P90 optimista).

### 3. ⚽ Estadísticas Deportivas & Mercados con Valor
- Explorador de estadísticas para **Fútbol (Champions League, Premier League, LaLiga)**, **Baloncesto (NBA)** y **Béisbol (MLB)**.
- Rachas actuales, porcentajes Over/Under, cobertura contra la línea de puntos (ATS) y forma de los últimos 5 partidos.
- Añadido con un clic de selecciones al creador de parleys.

### 4. 🧠 Gestor de Bankroll & Criterio de Kelly
- Fórmulas de Kelly Completo (1.0x), Medio Kelly (0.5x) y Cuarto de Kelly (0.25x).
- Matriz de cálculo del Riesgo de Ruina matemático para evitar drawdowns catastróficos.

### 5. 📑 Historial de Apuestas, Métricas ROI y Exportación
- Registro persistente de apuestas mediante `localStorage`.
- Gráfico dinámico de evolución de ganancias acumuladas y Win Rate desglosado por cantidad de selecciones (2 legs, 3 legs, 4 legs, 5+ legs).
- Exportación e importación de datos en **CSV** y **JSON**.

---

## 💻 Formas de Ejecución

### Opción 1: Servidor Local Integrado (Recomendado)
Ejecuta el servidor web local con Python:
```bash
cd /home/h/Escritorio/RESPALDO/parley-stats
python3 server.py
```
Luego abre tu navegador en: **`http://localhost:8080`**

### Opción 2: Abrir Directamente en el Navegador
Puedes hacer doble clic en el archivo `index.html` o abrirlo directamente en cualquier navegador (Chrome, Firefox, Edge).

### Opción 3: CLI de Terminal (Python)
Para realizar cálculos o simulaciones rápidas directamente en tu terminal:

**Calcular un Parley:**
```bash
python3 parley_cli.py calc -o 1.85 2.10 1.95 -s 25
```

**Ejecutar Simulación Monte Carlo:**
```bash
python3 parley_cli.py sim -b 1000 -s 25 -o 4.5 -p 0.25 -n 100 -i 1000
```

---

## 📁 Estructura del Proyecto

```text
parley-stats/
├── index.html              # Interfaz de usuario SPA
├── server.py               # Servidor web local en Python
├── parley_cli.py           # CLI para cálculos y simulaciones en consola
├── README.md               # Documentación completa
├── css/
│   └── styles.css          # Tema Dark Sports Analytics, responsive y animaciones
├── js/
│   ├── app.js              # Controlador principal y enrutador de vistas
│   ├── oddsCalculator.js   # Conversión de cuotas, probabilidades, EV y Vig
│   ├── kellyCriterion.js   # Fórmulas de Kelly y gestión de riesgo
│   ├── monteCarlo.js       # Motor de simulación estocástica y percentiles
│   ├── sportsData.js       # Base de datos de ligas, estadísticas y partidos
│   ├── betTracker.js       # Gestión de historial, métricas ROI y persistencia
│   └── charts.js           # Integración con Chart.js para visualizaciones
```
