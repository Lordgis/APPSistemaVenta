import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import Swal from 'sweetalert2';
import { Cliente } from 'src/app/Interfaces/Cliente';
import { ClienteService } from 'src/app/Services/cliente.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  listaProductos: Producto[] = [];
  listaClientes: Cliente[] = [];
  listaProductosFiltro: Producto[] = [];
  listaClientesFiltro: Cliente[] = [];
  listaProductosParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;
  productoSeleccionado!: Producto;
  ClienteSelecccionado!: Cliente;
  tipodePagoPorDefecto: string = "Efectivo";
  totalPagar: number = 0;

  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'cliente', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource<DetalleVenta>(this.listaProductosParaVenta);

  constructor(
    private fb: FormBuilder,
    private productoServicio: ProductoService,
    private ventaServicio: VentaService,
    private clienteServicio: ClienteService,
    private utilidadServicio: UtilidadService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      precioVenta: [''],
      Cliente: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.cargarProductos();
    await this.cargarClientes();

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    });
  }

  async cargarProductos() {
    try {
      const data = await this.productoServicio.lista().toPromise();
      if (data && data.status) {
        this.listaProductos = data.value.filter((p: Producto) => p.esActivo === 1 && p.stock > 0);
      }
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  }

  async cargarClientes() {
    try {
      const data = await this.clienteServicio.lista().toPromise();
      if (data && data.status) {
        this.listaClientes = data.value;
      }
    } catch (error) {
      console.error("Error al obtener la lista de clientes:", error);
    }
  }

  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();
    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
    if (this.formularioProductoVenta && this.formularioProductoVenta.get('precioVenta')) {
      this.formularioProductoVenta.get('precioVenta')!.setValue(this.productoSeleccionado.precioVenta);
    }
  }

  ClienteParaVenta(event: any) {
    this.ClienteSelecccionado = event.option.value;
  }

  agregarProductoParaVenta() {
    const cantidad: number = this.formularioProductoVenta.value.cantidad;
    const precioVenta: number = this.productoSeleccionado.precioVenta;
    const total = cantidad * precioVenta;

    if (cantidad > this.productoSeleccionado.stock) {
      this.utilidadServicio.mostrarAlerta("La cantidad solicitada excede el stock disponible", "Stock insuficiente");
      return;
    }

    const idCliente: number = this.formularioProductoVenta.value.Cliente;
    const clienteSeleccionado = this.listaClientes.find(cliente => cliente.idCliente === idCliente);
    const descripcionCliente: string = clienteSeleccionado ? clienteSeleccionado.nombres + ' ' + clienteSeleccionado.apellidos : '';

    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: cantidad,
      precioTexto: this.productoSeleccionado.precioVenta.toString(),
      totalTexto: total.toString(),
      idCliente: idCliente,
      descripcionCliente: descripcionCliente
    });

    this.totalPagar += total;
    this.datosDetalleVenta.data = this.listaProductosParaVenta;

    this.formularioProductoVenta.patchValue({
      producto: '',
      precioVenta: '',
      cantidad: ''
    });
  }

  eliminarProducto(detalle: DetalleVenta) {
    this.totalPagar -= parseFloat(detalle.totalTexto);
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProducto !== detalle.idProducto);
    this.datosDetalleVenta.data = this.listaProductosParaVenta;

  }
  

  registrarVenta() {
    if (this.listaProductosParaVenta.length === 0) {
      this.utilidadServicio.mostrarAlerta("Debe agregar al menos un producto para registrar la venta", "Oops");
      return;
    }

    if (!this.ClienteSelecccionado) {
      this.utilidadServicio.mostrarAlerta("Debe seleccionar un cliente antes de registrar la venta", "Oops");
      return;
    }

    this.bloquearBotonRegistrar = true;

    const request: Venta = {
      tipoPago: this.tipodePagoPorDefecto,
      totalTexto: this.totalPagar.toFixed(2),
      detalleVenta: this.listaProductosParaVenta,
      idCliente: this.ClienteSelecccionado.idCliente
    };

    this.ventaServicio.registrar(request).subscribe({
      next: (response) => {
        if (response.status) {
          this.totalPagar = 0.00;
          this.listaProductosParaVenta = [];
          this.datosDetalleVenta.data = [];
          Swal.fire({
            icon: 'success',
            title: 'Venta Registrada!',
            text: `Numero de venta: ${response.value.numeroDocumento}`
          });
        } else {
          this.utilidadServicio.mostrarAlerta("No se pudo registrar la venta", "Oops");
        }
      },
      complete: () => {
        this.bloquearBotonRegistrar = false;
      },
      error: (e) => {
        console.error("Error al registrar la venta:", e);
        this.utilidadServicio.mostrarAlerta("Error al registrar la venta", "Oops");
        this.bloquearBotonRegistrar = false;
      }
    });
  }
}
