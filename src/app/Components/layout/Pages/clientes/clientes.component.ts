import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from 'src/app/Interfaces/Cliente';
import { ClienteService } from 'src/app/Services/cliente.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { ModalClienteComponent } from '../../Modales/modal-cliente/modal-cliente.component';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['Nombre Completo', 'Telefono', 'correo', 'Direccion', 'acciones'];
  dataInicio: Cliente[] = [];
  dataListaCliente = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _Clienteservicio: ClienteService,
    private _utilidadServicio: UtilidadService
  ) { }

  ngOnInit(): void {
    this.obtenerCliente();
  }

  ngAfterViewInit(): void {
    this.dataListaCliente.paginator = this.paginacionTabla;
  }

  obtenerCliente(): void {
    this._Clienteservicio.lista().subscribe({
      next: (data) => {
        if (data.status)
          this.dataListaCliente.data = data.value;
        else
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
      },
      error: (e) => {
        console.error(e);
        this._utilidadServicio.mostrarAlerta("Error al obtener datos", "Error");
      }
    });
  }

  aplicarFiltroTabla(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaCliente.filter = filterValue.trim().toLowerCase();
  }

  nuevoCliente(): void {
    const dialogRef = this.dialog.open(ModalClienteComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.obtenerCliente();
    });
  }

  editarCliente(cliente: Cliente): void {
    this.dialog.open(ModalClienteComponent, {
      disableClose: true,
      data: cliente
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerCliente();
    });
  }

  eliminarCliente(clientes: Cliente): void {
    Swal.fire({
      title: '¿Desea eliminar el cliente?',
      text: clientes.nombres,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._Clienteservicio.eliminar(clientes.idCliente).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El cliente fue eliminado", "¡Listo!");
              this.obtenerCliente();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el cliente", "Error");
            }
          },
          error: (e) => {
            console.error(e);
            this._utilidadServicio.mostrarAlerta("Error al eliminar el cliente", "Error");
          }
        });
      }
    });
  }
}
