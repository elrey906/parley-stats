/**
 * Renderizador de Gráficos con Chart.js
 */
export class ChartManager {
  constructor() {
    this.charts = {};
  }

  destroyChart(id) {
    if (this.charts[id]) {
      this.charts[id].destroy();
      delete this.charts[id];
    }
  }

  renderMonteCarloChart(canvasId, simResults) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const datasets = simResults.sampleTrajectories.map((traj, idx) => {
      const colors = [
        "rgba(16, 185, 129, 0.6)",
        "rgba(59, 130, 246, 0.6)",
        "rgba(139, 92, 246, 0.6)",
        "rgba(245, 158, 11, 0.6)",
        "rgba(236, 72, 153, 0.6)",
        "rgba(14, 165, 233, 0.6)",
        "rgba(168, 85, 247, 0.6)"
      ];
      const color = colors[idx % colors.length];
      return {
        label: `Simulación #${traj.id}`,
        data: traj.data,
        borderColor: color,
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        tension: 0.1
      };
    });

    // Etiquetas para eje X (Número de apuesta)
    const labels = Array.from({ length: simResults.numBets + 1 }, (_, i) => `Apuesta ${i}`);

    this.charts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#1e293b",
            titleColor: "#94a3b8",
            bodyColor: "#f8fafc",
            borderColor: "#334155",
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#94a3b8", maxTicksLimit: 10 }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94a3b8",
              callback: (value) => `$${value}`
            }
          }
        }
      }
    });
  }

  renderMonteCarloHistogram(canvasId, histogramData) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: histogramData.map(b => b.label),
        datasets: [{
          label: "Frecuencia de Bankrolls Finales",
          data: histogramData.map(b => b.count),
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "#10b981",
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e293b",
            titleColor: "#94a3b8",
            bodyColor: "#f8fafc"
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { size: 10 }, maxRotation: 45 }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#94a3b8" }
          }
        }
      }
    });
  }

  renderTrackerRoiChart(canvasId, bets) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const settled = bets
      .filter(b => b.status === "won" || b.status === "lost")
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningProfit = 0;
    const labels = ["Inicio"];
    const profitData = [0];

    settled.forEach((b, i) => {
      const p = b.status === "won" ? (b.stake * b.combinedOdds - b.stake) : -b.stake;
      runningProfit += p;
      labels.push(`Apuesta ${i + 1}`);
      profitData.push(parseFloat(runningProfit.toFixed(2)));
    });

    this.charts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Beneficio Neto Acumulado ($)",
          data: profitData,
          borderColor: runningProfit >= 0 ? "#10b981" : "#ef4444",
          backgroundColor: runningProfit >= 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: runningProfit >= 0 ? "#10b981" : "#ef4444"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e293b",
            titleColor: "#94a3b8",
            bodyColor: "#f8fafc",
            callbacks: {
              label: (context) => `Ganancia: $${context.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#94a3b8" }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94a3b8",
              callback: (val) => `$${val}`
            }
          }
        }
      }
    });
  }

  renderLegsWinRateChart(canvasId, legsMetrics) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: legsMetrics.map(m => m.legs),
        datasets: [
          {
            label: "Win Rate %",
            data: legsMetrics.map(m => m.winRate),
            backgroundColor: "rgba(59, 130, 246, 0.7)",
            borderColor: "#3b82f6",
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: "ROI %",
            data: legsMetrics.map(m => m.roi),
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderColor: "#10b981",
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#f8fafc" }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8" }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94a3b8",
              callback: (v) => `${v}%`
            }
          }
        }
      }
    });
  }
}
