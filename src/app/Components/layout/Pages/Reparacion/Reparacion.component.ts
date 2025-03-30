import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalReparacionComponent } from '../../Modales/modal-reparaciones/modal-reparacion.component';
import { Reparaciones } from 'src/app/Interfaces/Reparaciones';
import { Reparacionesservices } from 'src/app/Services/Reparaciones.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-Reparacion',
  templateUrl: './Reparacion.component.html',
  styleUrls: ['./Reparacion.component.css']
})
export class ReparacionesComponent implements OnInit, AfterViewInit{

  columnasTabla: string[] = ['nombre','categoria','precio','acciones'];
  dataInicio:Reparaciones[] = [];
  dataListaReparacion = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;


  constructor(
    private dialog: MatDialog,
    private _reparacionServicio:Reparacionesservices,
    private _utilidadServicio: UtilidadService

  ) { }

  obtenerReparaciones(){

    this._reparacionServicio.lista().subscribe({
      next: (data) => {
        if(data.status)
          this.dataListaReparacion.data = data.value;
        else
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops!")
      },
      error:(e) =>{}
    })

  }

  ngOnInit(): void {
    this.obtenerReparaciones();
  }

  ngAfterViewInit(): void {
    this.dataListaReparacion.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaReparacion.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoReparacion(){
    this.dialog.open(ModalReparacionComponent, {
      disableClose:true
    }).afterClosed().subscribe(resultado =>{
      if(resultado === "true") this.obtenerReparaciones();
    });
  }

  editarReparacion(reparacion: Reparaciones): void {
    if (!reparacion) {
      console.error('Reparación no válida.');
      return;
    }
  
    const dialogRef = this.dialog.open(ModalReparacionComponent, {
      disableClose: true,
      data: reparacion
    });
  
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.actualizarReparaciones();
      } else {
        console.error('Error al editar la reparación.');
      }
    }, error => {
      console.error('Error al abrir el diálogo de edición:', error);
    });
  }
  
  private actualizarReparaciones(): void {
    this.obtenerReparaciones();
  }
  
  

  eliminarReparacion(reparaciones: Reparaciones): void {
    Swal.fire({
        title: '¿Desea eliminar La reparacion?',
        text: reparaciones.nombre,
        icon: "warning",
        confirmButtonColor: '#3085d6',
        confirmButtonText: "Si, eliminar",
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'No, volver'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            this._reparacionServicio.eliminar(reparaciones.idReparacion).subscribe({
                next: (data) => {
                    if (data.status) {
                        this._utilidadServicio.mostrarAlerta("La reparacion fue eliminada", "Listo!");
                        this.obtenerReparaciones();
                    } else {
                        this._utilidadServicio.mostrarAlerta("No se pudo eliminar la reparacion", "Error");
                    }
                },
                error: (e) => {
                    console.error(e); 
                }
            });
        }
    });
}

}
