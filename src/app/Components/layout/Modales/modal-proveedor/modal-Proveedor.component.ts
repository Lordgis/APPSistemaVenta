import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proveedor } from 'src/app/Interfaces/Proveedor';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ProveedorService } from 'src/app/Services/Proveedor.service';

@Component({
  selector: 'app-modal-proveedor',
  templateUrl: './modal-proveedor.component.html',
  styleUrls: ['./modal-proveedor.component.css']
})
export class ModalProveedorComponent implements OnInit {
  formularioProveedor: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public proveedorData: Proveedor,
    private proveedorService: ProveedorService,
    private fb: FormBuilder,
    private utilidadServicio: UtilidadService
  ) {
    this.formularioProveedor = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      contactoPersona: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });

    if (this.proveedorData != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    if (this.proveedorData != null) {
      this.formularioProveedor.patchValue({
        nombreEmpresa: this.proveedorData.NombreEmpresa,
        contactoPersona: this.proveedorData.ContactoPersona,
        celefono: this.proveedorData.Telefono,
        correo: this.proveedorData.Correo,
        direccion: this.proveedorData.Direccion,
        esActivo: this.proveedorData.esActivo.toString()
      });
    }
  }

  guardarEditarProveedor() {
    if (this.formularioProveedor.invalid) {
      this.utilidadServicio.mostrarAlerta("Por favor complete el formulario correctamente", "Error");
      return;
    }

    const _Proveedor: Proveedor = {
      idProveedor: this.proveedorData == null ? 0 : this.proveedorData.idProveedor,
      NombreEmpresa: this.formularioProveedor.value.nombreEmpresa,
      ContactoPersona: this.formularioProveedor.value.contactoPersona,
      Telefono: this.formularioProveedor.value.telefono,
      Correo: this.formularioProveedor.value.correo,
      Direccion: this.formularioProveedor.value.direccion,
      esActivo: parseInt(this.formularioProveedor.value.esActivo),
    };
    console.log('')
    if (this.proveedorData == null) {
      this.proveedorService.guardar(_Proveedor).subscribe({
        next: (data) => {
          if (data.status) {
            this.utilidadServicio.mostrarAlerta("El Proveedor fue registrado", "Exito");
            this.modalActual.close("true");
          } else {
            this.utilidadServicio.mostrarAlerta("No se pudo registrar el proveedor", "Error");
          }
        },
        error: (e) => {
          console.error(e);
          this.utilidadServicio.mostrarAlerta("Ocurrió un error al registrar el Proveedor", "Error");
        }
      });
    } else {
      this.proveedorService.editar(_Proveedor).subscribe({
        next: (data) => {
          if (data.status) {
            this.utilidadServicio.mostrarAlerta("El cliente fue editado", "Exito");
            this.modalActual.close("true");
          } else {
            this.utilidadServicio.mostrarAlerta("No se pudo editar el cliente", "Error");
          }
        },
        error: (e) => {
          console.error(e);
          this.utilidadServicio.mostrarAlerta("Ocurrió un error al editar el cliente", "Error");
        }
      });
    }
  }
  cerrarModal(): void {
    this.modalActual.close();
  }
}
