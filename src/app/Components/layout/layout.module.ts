import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule

import { LayoutRoutingModule } from './layout-routing.module';

import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ClientesComponent } from './Pages/clientes/clientes.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { ReparacionesComponent } from './Pages/Reparacion/Reparacion.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';

import { SharedModule } from 'src/app/Reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductoComponent } from './Modales/modal-producto/modal-producto.component';
import { ModalDetalleVentaComponent } from './Modales/modal-detalle-venta/modal-detalle-venta.component';
import { ProveedorComponent } from './Pages/Proveedor/Proveedor.Component';
import { ModalProveedorComponent } from './Modales/modal-proveedor/modal-Proveedor.component';
import { ModalClienteComponent } from './Modales/modal-cliente/modal-cliente.component';
import { ModalReparacionComponent } from './Modales/modal-reparaciones/modal-reparacion.component'; 

// Import Angular Material modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    ClientesComponent,
    ProveedorComponent,
    ReparacionesComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    ModalProductoComponent,
    ModalDetalleVentaComponent,
    ModalClienteComponent,
    ModalProveedorComponent,
    ModalReparacionComponent  
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    ReactiveFormsModule,  // Add ReactiveFormsModule
    MatDialogModule,  // Add MatDialogModule
    MatGridListModule,  // Add MatGridListModule
    MatButtonModule  // Add MatButtonModule
  ]
})
export class LayoutModule { }
