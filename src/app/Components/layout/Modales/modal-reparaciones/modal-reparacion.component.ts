import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/Interfaces/categoria';
import { Reparaciones } from 'src/app/Interfaces/Reparaciones';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { Reparacionesservices } from 'src/app/Services/Reparaciones.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-reparacion',
  templateUrl: './modal-reparacion.component.html',
  styleUrls: ['./modal-reparacion.component.css']
})
export class ModalReparacionComponent implements OnInit {
  formularioReparaciones: FormGroup; // Propiedad para el formulario de reparaciones
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalReparacionComponent>,
    @Inject(MAT_DIALOG_DATA) public datosReparacion: Reparaciones,
    private fb: FormBuilder,
    private categoriaServicio: CategoriaService,
    private reparacionServicio: Reparacionesservices,
    private utilidadServicio: UtilidadService
  ) {
    // Inicialización del formulario en el constructor
    this.formularioReparaciones = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      precio: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.datosReparacion != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
      this.formularioReparaciones.patchValue({
        nombre: this.datosReparacion.nombre,
        idCategoria: this.datosReparacion.idCategoria,
        precio: this.datosReparacion.precio
      });
    }

    this.categoriaServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.listaCategorias = data.value;
        }
      },
      error: (e) => {
        console.error("Error al obtener las categorías:", e);
      }
    });
  }

  guardarEditarReparacion() {
    const reparacion: Reparaciones = {
      idReparacion: this.datosReparacion == null ? 0 : this.datosReparacion.idReparacion,
      nombre: this.formularioReparaciones.value.nombre,
      idCategoria: this.formularioReparaciones.value.idCategoria,
      descripcionCategoria: "",
      precio: this.formularioReparaciones.value.precio
    };

    if (this.datosReparacion == null) {
      this.reparacionServicio.guardar(reparacion).subscribe({
        next: (data) => {
          if (data.status) {
            this.utilidadServicio.mostrarAlerta("La reparación fue registrada", "Exito");
            this.modalActual.close("true");
          } else {
            this.utilidadServicio.mostrarAlerta("No se pudo registrar la reparación", "Error");
          }
        },
        error: (e) => {
          console.error("Error al guardar la reparación:", e);
        }
      });
    } else {
      this.reparacionServicio.editar(reparacion).subscribe({
        next: (data) => {
          if (data.status) {
            this.utilidadServicio.mostrarAlerta("La reparación fue editada", "Exito");
            this.modalActual.close("true");
          } else {
            this.utilidadServicio.mostrarAlerta("No se pudo editar la reparación", "Error");
          }
        },
        error: (e) => {
          console.error("Error al editar la reparación:", e);
        }
      });
    }
  }
}
