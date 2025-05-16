import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cliente } from 'src/app/Interfaces/Cliente';
import { Component2Component } from './component2.component';
import { AppComponent } from '../app.component';
import { ClienteService } from '../Services/cliente.service';
import { ClientesComponent } from '../Components/layout/Pages/clientes/clientes.component';
import { ProductoComponent } from '../Components/layout/Pages/producto/producto.component';
import { UsuarioComponent } from '../Components/layout/Pages/usuario/usuario.component';
import { ModalUsuarioComponent } from '../Components/layout/Modales/modal-usuario/modal-usuario.component';
import { UsuarioService } from '../Services/usuario.service';

describe('Component2Component', () => {
  let component: Component2Component;
  let fixture: ComponentFixture<Component2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Component2Component]
    }).compileComponents();

    fixture = TestBed.createComponent(Component2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTrue();

  });
  //teste0
  //t('usuarios',()=>{
  //const fixture = TestBed.createComponent(AppComponent);
  //const app =fixture.componentInstance
  //fixture.detectChanges()
  //const uso = app.form.control[]
  //};
  it('valdidar cliente activo', () => {
    const fixture = TestBed.createComponent(ClientesComponent);
    const app = fixture.componentInstance;
    const ide = 0;
    expect(app).toBeGreaterThan(ide);
  });

  it('debería identificar productos sin stock', () => {
  const fixture = TestBed.createComponent(ProductoComponent);
  const app = fixture.componentInstance;

   const Producto = "Bateria";
    const stock = "5";
    const array = [Producto,stock];
     const contieneCorreo = array.some(elemento => elemento.includes("0"));//
    expect(contieneCorreo).toBeFalsy();//verifica si es false
  });

  it('contiene una palabra dentro del campo correo', () => {
  const fixture = TestBed.createComponent(UsuarioComponent);
  const app = fixture.componentInstance;

  const correo = "usuario@gmail.com"; // Ejemplo
  expect(correo).toContain("Usuario");
});


  it('revisa si en el arreglo encuentra un elemento especicfico', () => {
    const fixture = TestBed.createComponent(UsuarioComponent);
    const app = fixture.componentInstance;

    const nombreCompleto = "Juan Pérez";
    const correo = "usuario@gmail.com";
    const array = [nombreCompleto, correo]; // guarda los elementos en el array

    const contieneCorreo = array.some(elemento => elemento.includes("gmail"));//
    expect(contieneCorreo).toBeTruthy();//verifica si es true
  });
  //t
});
