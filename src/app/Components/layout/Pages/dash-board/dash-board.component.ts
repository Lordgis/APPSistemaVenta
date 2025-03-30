import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashBoardService } from 'src/app/Services/dash-board.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit, OnDestroy {

  totalIngresos: string = "0";
  totalVentas: string = "0";
  totalProductos: string = "0";
  ventasPorDia: any[] = [];  // Ventas por día para el gráfico de barras
  ingresosPorDia: any[] = [];  // Ingresos por día para el gráfico de líneas
  chartBarras: any;  // Instancia del gráfico de barras
  chartLineas: any;  // Instancia del gráfico de líneas

  constructor(private _dashboardServicio: DashBoardService) { }

  // Función para mostrar/actualizar el gráfico de barras
  mostrarGraficoBarras(labels: string[], data: number[]): void {
    if (this.chartBarras) {
      this.chartBarras.destroy();
    }

    this.chartBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "# de Ventas",
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Función para mostrar/actualizar el gráfico de líneas
  mostrarGraficoLineas(labels: string[], data: number[]): void {
    if (this.chartLineas) {
      this.chartLineas.destroy();
    }

    this.chartLineas = new Chart('chartLineas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: "Ingresos por Día",
          data: data,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  ngOnInit(): void {
    this._dashboardServicio.resumen().subscribe({
      next: (data) => {
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          // Datos de ventas por día
          const ventasDia = data.value.ventasUltimaSemana;
          const labelsVentas = ventasDia.map((item: any) => item.Fecha);
          const dataVentas = ventasDia.map((item: any) => item.Total);

          // Datos de ingresos por día
          const ingresosDia = data.value.ventasUltimaSemana; // Usando la misma estructura de datos
          const labelsIngresos = ingresosDia.map((item: any) => item.Fecha);
          const dataIngresos = ingresosDia.map((item: any) => item.Total);  // Suponiendo que 'Total' es el ingreso del día

          // Mostrar los gráficos
          this.mostrarGraficoBarras(labelsVentas, dataVentas);
          this.mostrarGraficoLineas(labelsIngresos, dataIngresos);
        }
      },
      error: (e) => { console.error(e); }
    });
  }

  ngOnDestroy(): void {
    if (this.chartBarras) {
      this.chartBarras.destroy();
    }
    if (this.chartLineas) {
      this.chartLineas.destroy();
    }
  }
}
