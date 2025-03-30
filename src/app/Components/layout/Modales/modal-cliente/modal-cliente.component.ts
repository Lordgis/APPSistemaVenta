import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from 'src/app/Interfaces/Cliente';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ClienteService } from 'src/app/Services/cliente.service';

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css']
})
export class ModalClienteComponent {
  formularioCliente: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";

  constructor(
    private modalActual: MatDialogRef<ModalClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public clienteData: Cliente,
    private _clienteServicio: ClienteService,
    private fb: FormBuilder,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioCliente = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });

    if (this.clienteData != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  ngOnInit(): void {
    if (this.clienteData != null) {
      this.formularioCliente.patchValue({
        nombre: this.clienteData.nombres,
        apellidos: this.clienteData.apellidos,
        telefono: this.clienteData.telefono,
        correo: this.clienteData.correo,
        direccion: this.clienteData.direccion
      });
    }
  }

  guardarEditar_Cliente() {
    if (this.formularioCliente.invalid) {
      this._utilidadServicio.mostrarAlerta("Por favor complete el formulario correctamente", "Error");
      return;
    }

    const _cliente: Cliente = {
      idCliente: this.clienteData == null ? 0 : this.clienteData.idCliente,
      nombres: this.formularioCliente.value.nombre,
      apellidos: this.formularioCliente.value.apellidos,
      telefono: this.formularioCliente.value.telefono,
      correo: this.formularioCliente.value.correo,
      direccion: this.formularioCliente.value.direccion,
      esActivo: parseInt(this.formularioCliente.value.esActivo),
    };

    if (this.clienteData == null) {
      this._clienteServicio.guardar(_cliente).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta("El cliente fue registrado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el cliente", "Error");
          }
        },
        error: (e) => {
          console.error(e);
          this._utilidadServicio.mostrarAlerta("Ocurrió un error al registrar el cliente", "Error");
        }
      });
    } else {
      this._clienteServicio.editar(_cliente).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta("El cliente fue editado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mostrarAlerta("No se pudo editar el cliente", "Error");
          }
        },
        error: (e) => {
          console.error(e);
          this._utilidadServicio.mostrarAlerta("Ocurrió un error al editar el cliente", "Error");
        }
      });
    }
  }

  cerrarModal(): void {
    this.modalActual.close();
  }
}
