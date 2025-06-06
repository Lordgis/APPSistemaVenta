import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { ReparacionesComponent } from './Pages/Reparacion/Reparacion.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ClientesComponent} from './Pages/clientes/clientes.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { ProveedorComponent } from './Pages/Proveedor/Proveedor.Component';



const routes: Routes = [{
  path:'',
  component:LayoutComponent,
  children: [
    {path:'dashboard',component:DashBoardComponent},
    {path:'usuarios',component:UsuarioComponent},
    {path:'clientes',component:ClientesComponent},
    {path:'proveedores',component:ProveedorComponent},
    {path:'productos',component:ProductoComponent},
    {path:'reparaciones',component:ReparacionesComponent},
    {path:'venta',component:VentaComponent},
    {path:'historial_venta',component:HistorialVentaComponent},
    {path:'reportes',component:ReporteComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
