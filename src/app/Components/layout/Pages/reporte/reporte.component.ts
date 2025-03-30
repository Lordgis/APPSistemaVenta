import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment'; 

import * as XLSX from "xlsx";

import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class ReporteComponent implements OnInit, AfterViewInit {

  formularioFiltro: FormGroup;
  listaVentasReporte: any[] = []; // Cambio en el tipo de datos para evitar IDs
  columnasTabla: string[] = ['fechaRegistro', 'numeroVenta', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource<any>(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
  @ViewChild(MatSort) sortTabla!: MatSort;

  productos = [{id: 1, nombre: 'Producto 1'}, {id: 2, nombre: 'Producto 2'}]; // Ejemplo de productos
  tiposPago = ['Efectivo', 'Tarjeta']; // Ejemplo de tipos de pago

  constructor(
    private fb: FormBuilder,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      producto: [''],
      tipoPago: ['']
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
    this.dataVentaReporte.sort = this.sortTabla;
  }

  // Buscar ventas con filtros y paginación
  buscarVentas(pageIndex: number = 0, pageSize: number = 10): void {
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio, 'DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin, 'DD/MM/YYYY');

    // Validar fechas
    if (!_fechaInicio.isValid() || !_fechaFin.isValid()) {
      this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas correctamente", "Oops!");
      return;
    }

    const filtros = {
      fechaInicio: _fechaInicio.format('DD/MM/YYYY'),
      fechaFin: _fechaFin.format('DD/MM/YYYY'),
      producto: this.formularioFiltro.value.producto,
      tipoPago: this.formularioFiltro.value.tipoPago,
      pageIndex: pageIndex,
      pageSize: pageSize
    };

    this._ventaServicio.reporte(filtros).subscribe({
      next: (data) => {
        if (data.status) {
          this.listaVentasReporte = data.value.map((venta: any) => ({
            fechaRegistro: venta.fechaRegistro,
            numeroVenta: venta.numeroDocumento,
            tipoPago: venta.tipoPago,
            total: venta.totalVenta,
            producto: venta.producto,
            cantidad: venta.cantidad,
            precio: venta.precio,
            totalProducto: venta.total
          }));
          this.dataVentaReporte.data = this.listaVentasReporte;
        } else {
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {
        console.error(e);
        this._utilidadServicio.mostrarAlerta("Hubo un error al obtener los datos", "Error");
      }
    });
  }

  // Exportar reporte a Excel
  exportarExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listaVentasReporte, {
      header: ['Fecha Registro', 'Número de Venta', 'Tipo de Pago', 'Total (S/.)', 'Producto', 'Cantidad', 'Precio Unitario (S/.)', 'Total por Producto (S/.)'],
      dateNF: 'dd/mm/yyyy;@', // Formato de fecha
      cellDates: true // Convertir fechas a formato de celda en Excel
    });

    // Convertir fechas a formato adecuado para Excel
    const range = XLSX.utils.decode_range(ws['!ref'] as string);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const fechaCell = ws[XLSX.utils.encode_cell({ r: R, c: 0 })];
      if (fechaCell && fechaCell.t === 'd') {
        fechaCell.z = XLSX.SSF.get_table()['14']; // Formato de fecha
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte Ventas");

    // Guardar archivo Excel
    XLSX.writeFile(wb, "Reporte_Ventas.xlsx");
  }
}
