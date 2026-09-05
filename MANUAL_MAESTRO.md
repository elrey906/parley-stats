# 📖 MANUAL MAESTRO DE OPERACIONES: PARLEY STATS PRO
**Guía Integral de Apuestas Cuantitativas, Valor Esperado (+EV), Simulación y Operación Remota**

---

## 1. 🧭 FILOSOFÍA: APUESTAS CUANTITATIVAS VS AZAR

La mayoría de los apostadores pierden dinero a largo plazo en los parleys debido a tres errores fundamentales:
1. **El Margen de la Casa Multiplicado**: Al combinar 3 cuotas con 5% de comisión (*Vig*), el margen de la casa no se suma, se multiplica exponencialmente.
2. **Dimensionamiento de Apuesta Emocional**: Apostar montos aleatorios o excesivos provoca quiebra durante las rachas negativas inevitables.
3. **Apuestas sin Valor Esperado (+EV)**: Apostar por favoritismo en lugar de verificar si la probabilidad real supera a la probabilidad implícita.

**PARLEY STATS PRO** transforma las apuestas en una disciplina matemática, utilizando el **Criterio de Kelly** para proteger el bankroll y la **Simulación Monte Carlo** para conocer la expectativa real antes de arriesgar dinero.

---

## 2. 🖥️ GUÍA MÓDULO POR MÓDULO

### 🔹 Módulo 1: 🔥 Top Picks del Día (Seleccionador de Cuotas)
- **¿Qué es?**: Un catálogo clasificado de los mejores eventos deportivos del día con ventaja estadística detectada.
- **Categorías**:
  - 💎 **Picks Seguros / Bases Fijas**: Probabilidad estimada $>70\%$, cuotas entre $1.35$ y $1.70$. Ideales como ancla en combinadas.
  - 🚀 **Alto Valor (+EV)**: Cuotas medias ($1.70$ - $2.20$) donde la probabilidad real supera a la de la casa de apuestas.
  - 🔥 **Bombas / Cuotones**: Multiplicadores altos ($>2.30$) para buscar grandes retornos con mínimo capital.
- **Acción Rápida**: Puedes hacer clic en **"⚡ Añadir a Mi Parley"** en cualquier pick para enviarlo directo a la calculadora.
- **Auto-Parleys de 1 Clic**:
  - *Conservador (@2.28)*: 2 selecciones de alta certeza.
  - *Equilibrado (@4.41)*: 3 selecciones de valor positivo.
  - *Bomba (@10.36)*: 3 selecciones para multiplicar el capital por 10.

---

### 🔹 Módulo 2: 📊 Calculadora de Parleys y Motor de EV
- **Ingreso de Datos**:
  - Puedes modificar cuotas decimales y probabilidades estimadas en tiempo real.
  - Ingresa el monto a apostar (*Stake*).
- **Métricas Calculadas**:
  - **Cuota Combinada**: Multiplicación exacta de todas las selecciones.
  - **Probabilidad Implícita**: Lo que la casa de apuestas exige para ser rentable.
  - **Probabilidad Real Estimada**: La probabilidad matemática real de acierto.
  - **Valor Esperado (+/- EV%)**:
    - Si es **Verde (+EV)**: Tienes ventaja matemática sobre la casa.
    - Si es **Rojo (-EV)**: Estás en desventaja matemática.
  - **Alerta de Correlación**: Advierte si estás combinando selecciones dependientes del mismo partido (*Same Game Parlay*).

---

### 🔹 Módulo 3: 🎲 Simulador de Riesgo Monte Carlo
- **¿Para qué sirve?**: Ejecuta hasta 5,000 simulaciones de una serie de apuestas (ej. 100 parleys) antes de poner tu dinero en juego.
- **Controles**:
  - *Bankroll Inicial*: Tu capital total disponible.
  - *Tamaño de Apuesta*: Monto fijo en dólares o porcentaje dinámico.
  - *Cuota Media y Probabilidad de Acierto*: Parámetros esperados de tu estrategia.
- **Lectura de Resultados**:
  - **Riesgo de Quiebra (Bust Rate)**: Si es superior al **5%**, el tamaño de apuesta es demasiado alto para esa cuota.
  - **Percentil 10 (P10)**: El escenario pesimista (en el 90% de los casos te irá mejor que esto).
  - **Mediana (P50)**: El resultado estadísticamente más probable al final de la serie.
  - **Max Drawdown**: La caída máxima porcentual que experimentarás en tu capital durante una mala racha.

---

### 🔹 Módulo 4: 🧠 Bankroll y Criterio de Kelly
- **Fórmula de Kelly**:
  $$f^* = rac{b \cdot p - q}{b}$$
  *(Donde $b = 	ext{cuota} - 1$, $p = 	ext{probabilidad real}$, $q = 1 - p$)*.
- **Regla de Oro en Parleys**:
  - Utiliza siempre **Cuarto de Kelly (Quarter Kelly - 0.25x)**.
  - Reduce la volatilidad en un 75% manteniendo el 90% del crecimiento del capital a largo plazo.

---

### 🔹 Módulo 5: 📑 Historial de Apuestas (Bet Tracker)
- **Registro**: Guarda parleys directamente con el botón **"💾 Guardar en Historial"**.
- **Gestión**: Marca apuestas como **Ganada (✓)** o **Perdida (✕)**.
- **Auditoría**:
  - **Curva de Beneficio Neto ($)** en tiempo real.
  - **Rendimiento por Número de Selecciones**: Muestra si eres más rentable jugando 2 legs, 3 legs o 5+ legs.
- **Exportación**: Descarga en cualquier momento tu archivo `.csv` para Excel o `.json` para copia de seguridad.

---

## 3. 📱 OPERACIÓN REMOTA DESDE EL TELÉFONO FUERA DE CASA

Puedes controlar toda la plataforma desde tu smartphone en cualquier lugar mediante el túnel seguro de Cloudflare:

### 1. Iniciar el Túnel en tu Computadora:
Abre una terminal y ejecuta:
```bash
cd /home/h/Escritorio/RESPALDO/parley-stats
./iniciar_tunel.sh
```

### 2. Abrir en tu Teléfono:
Copia y abre el enlace HTTPS que genera el comando en tu navegador móvil (ej. `https://vancouver-cancer-wealth-needs.trycloudflare.com`).

---

## 4. 💻 HERRAMIENTA CLI DE TERMINAL (`parley_cli.py`)

Para análisis ultrarrápidos directamente desde la consola:

### Calcular un Parley:
```bash
python3 parley-stats/parley_cli.py calc -o 1.85 2.10 1.95 -s 25
```

### Simulación Monte Carlo:
```bash
python3 parley-stats/parley_cli.py sim -b 1000 -s 25 -o 4.5 -p 0.25 -n 100 -i 1000
```

---

## 5. 📚 GLOSARIO RÁPIDO

- **Leg (Pierna / Selección)**: Cada uno de los partidos o pronósticos individuales dentro de una apuesta combinada.
- **Parlay / Parley**: Apuesta combinada donde todas las selecciones deben cumplirse para ganar.
- **Expected Value (EV)**: El valor promedio esperado a ganar o perder por cada dólar apostado si la apuesta se repitiera infinitas veces.
- **Vig / Juice / Overround**: La comisión oculta que la casa de apuestas cobra inflando las probabilidades implícitas.
- **Drawdown**: La caída porcentual máxima desde el punto más alto del capital hasta el punto más bajo durante una racha de pérdidas.
- **Bust Rate**: Porcentaje de probabilidades de que el bankroll llegue a cero (bancarrota).
