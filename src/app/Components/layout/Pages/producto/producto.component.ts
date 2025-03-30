import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['nombre', 'categoria', 'proveedor', 'stock', 'precio', 'precioVenta', 'estado', 'acciones'];
  dataListaProductos = new MatTableDataSource<Producto>();
  productosBajoStock: Producto[] = []; // Para almacenar productos con poco stock
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
  @ViewChild(MatSort) sortTabla!: MatSort;

  constructor(
    private dialog: MatDialog,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
    this.dataListaProductos.sort = this.sortTabla;
  }

  // Lógica para obtener los productos y filtrar los que tienen poco stock
  obtenerProductos(): void {
    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaProductos.data = data.value;
          this.productosBajoStock = data.value.filter((producto: { stock: number; }) => producto.stock <= 5); // Filtrando productos con bajo stock
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {
        console.error(e);
        this._utilidadServicio.mostrarAlerta("Error al cargar los productos", "Error");
      }
    });
  }

  // Filtro para la tabla
  aplicarFiltroTabla(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();
  }

  // Función para asignar clases de advertencia en base al stock
  getClaseStock(stock: number): string {
    if (stock <= 5) {
      return 'poco-stock'; // Clase para poco stock
    } else if (stock <= 10) {
      return 'advertencia-stock'; // Clase para advertencia
    }
    return '';
  }

  // Crear un nuevo producto
  nuevoProducto(): void {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerProductos();
    });
  }

  // Editar un producto
  editarProducto(producto: Producto): void {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: producto
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerProductos();
    });
  }

  // Eliminar un producto
  eliminarProducto(producto: Producto): void {
    Swal.fire({
      title: '¿Desea eliminar el producto?',
      text: producto.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._productoServicio.eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El producto fue eliminado", "Listo!");
              this.obtenerProductos();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto", "Error");
            }
          },
          error: (e) => { }
        });
      }
    });
  }

}
