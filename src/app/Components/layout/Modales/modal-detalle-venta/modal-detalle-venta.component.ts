import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import { Cliente } from 'src/app/Interfaces/Cliente';
import { FormBuilder } from '@angular/forms';
import { ClientesComponent } from '../../Pages/clientes/clientes.component';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit {

  fechaRegistro:string = "";
  numeroDocumento:string = "";
  tipoPago: string = "";
  total: string = "";
  cliente: string = "";
  detalleVenta: DetalleVenta[] = [];
  listaCliente: Cliente[] = [];
  columnasTabla :string[] = ['producto','cliente','cantidad','precio','total']

  constructor(  
    @Inject(MAT_DIALOG_DATA) public _venta: Venta,
    @Inject(MAT_DIALOG_DATA) public _Detalle: DetalleVenta,
    private modalActual: MatDialogRef<ModalDetalleVentaComponent>,
    private fb: FormBuilder

  ) { 
    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.total = _venta.totalTexto;
    this.detalleVenta = _venta.detalleVenta;
  }

  ngOnInit(): void {
  }

}
