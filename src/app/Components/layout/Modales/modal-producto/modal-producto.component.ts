import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { Proveedor } from 'src/app/Interfaces/Proveedor';

import { ProveedorService } from 'src/app/Services/Proveedor.service';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {
  formularioProducto: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaCategorias: Categoria[] = [];
  listaProveedores: Proveedor[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _proveedorServicio:ProveedorService, 
    private _categoriaServicio: CategoriaService,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ) { 
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      precioVenta: ['', [Validators.required, Validators.min(0)]], 
      idProveedor: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });

    if (this.datosProducto != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

   /* this._categoriaServicio.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaCategorias = data.value;
      },
      error: (e) => {}
    });

    this._proveedorServicio.lista().subscribe({ 
      next: (data) => {
        if (data.status) this.listaProveedores = data.value;
      },
      error: (e) => {}
    });

    */

    forkJoin({
      categorias: this._categoriaServicio.lista(),
      proveedores: this._proveedorServicio.lista()
    }).subscribe({
      next: ({ categorias, proveedores }) => {
        if (categorias.status) {
          this.listaCategorias = categorias.value;
        }
        if (proveedores.status) {
          this.listaProveedores = proveedores.value;
        }
    
        /* Aquí puedes agregar el bloque if que depende de ambas listas
        if (this.listaCategorias.length > 0 && this.listaProveedores.length > 0) {
          console.log("Ambas listas se cargaron correctamente");
        }*/
      },
      error: (e) => {}
    });
  }
  

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        precioVenta: this.datosProducto.precioVenta,
        idProveedor:this.datosProducto.idProveedor, 
        esActivo: this.datosProducto.esActivo.toString()
      });
    }
  }

  guardarEditar_Producto() {
    const _producto: Producto = {
      idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria: "",
      precio: this.formularioProducto.value.precio,
      precioVenta: this.formularioProducto.value.precioVenta,
      stock: this.formularioProducto.value.stock,
      idProveedor: this.formularioProducto.value.idProveedor,
      descripcionProveedor: "",
      esActivo: parseInt(this.formularioProducto.value.esActivo),
    };

    if (this.datosProducto == null) {
      this._productoServicio.guardar(_producto).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta("El producto fue registrado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el producto", "Error");
          }
        },
        error: (e) => {}
      });
    } else {
      this._productoServicio.editar(_producto).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta("El producto fue editado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo editar el producto", "Error");
          }
        },
        error: (e) => {}
      });
    }
  }
}
