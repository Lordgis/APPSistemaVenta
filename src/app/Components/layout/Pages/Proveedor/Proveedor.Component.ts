import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { Proveedor } from 'src/app/Interfaces/Proveedor';
import { ProveedorService } from 'src/app/Services/Proveedor.service';
import { ModalProveedorComponent } from '../../Modales/modal-proveedor/modal-Proveedor.component';

@Component({
  selector: 'app-Proveedor',
  templateUrl: './Proveedor.component.html',
  styleUrls: ['./Proveedor.component.css']
})
export class ProveedorComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['NombreEmpresa', 'ContactoPersona', 'Telefono', 'Correo', 'Direccion', 'Estado', 'acciones'];
  
  dataListaProveedor = new MatTableDataSource<Proveedor>();

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private proveedorService: ProveedorService,
    private utilidadServicio: UtilidadService
  ) { }

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  ngAfterViewInit(): void {
    this.dataListaProveedor.paginator = this.paginacionTabla;
  }

  obtenerProveedores(): void {
    this.proveedorService.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaProveedor.data = data.value.filter((proveedor: Proveedor)=> proveedor.idProveedor);
        } else {
          this.utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {
        console.error(e);
        this.utilidadServicio.mostrarAlerta("Error al obtener datos", "Error");
      }
    });
  }

  aplicarFiltroTabla(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProveedor.filter = filterValue.trim().toLowerCase();
  }

  nuevoProveedor(): void {
    const dialogRef = this.dialog.open(ModalProveedorComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.obtenerProveedores();
      }
    });
  }

  editarProveedor(proveedor: Proveedor): void {
    this.dialog.open(ModalProveedorComponent, {
      disableClose: true,
      data: proveedor
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.obtenerProveedores();
      }
    });
  }

  eliminarProveedor(proveedor: Proveedor): void {
    Swal.fire({
      title: '¿Desea eliminar el Proveedor?',
      text: proveedor.NombreEmpresa,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.proveedorService.eliminar(proveedor.idProveedor).subscribe({
          next: (data) => {
            
              if (data.status) {
                this.utilidadServicio.mostrarAlerta("El Proveedor fue eliminado", "¡Listo!");
                this.obtenerProveedores();
              } else {
                this.utilidadServicio.mostrarAlerta("No se pudo eliminar el Proveedor", "Error");
              }
            },
            error: (e) => {
              console.error(e);
              this.utilidadServicio.mostrarAlerta("Error al eliminar el Proveedor", "Error");
            }
          });
        }
      });
    }
  }
  