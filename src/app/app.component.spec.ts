import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './Components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { UsuarioComponent } from 'src/app/Components/layout/Pages/usuario/usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Usuario } from './Interfaces/usuario';
import { MatCardModule } from '@angular/material/card';
import { VentaComponent } from './Components/layout/Pages/venta/venta.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ProductoService } from 'src/app/Services/producto.service';
import { ClienteService } from 'src/app/Services/cliente.service';
import { VentaService } from 'src/app/Services/venta.service';
import Swal from 'sweetalert2';

import { DashBoardComponent } from './Components/layout/Pages/dash-board/dash-board.component';
import { DashBoardService } from 'src/app/Services/dash-board.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Chart } from 'chart.js';

describe('LoginCompo', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUsuarioService: any;
  let mockUtilidadService: any;
  let routerSpy: any;

  beforeEach(async () => {
    mockUsuarioService = {
      iniciarSesion: jasmine.createSpy('iniciarSesion').and.returnValue(of({ status: true, value: {} }))
    };

    mockUtilidadService = {
      guardarSesionUsuario: jasmine.createSpy('guardarSesionUsuario'),
      mostrarAlerta: jasmine.createSpy('mostrarAlerta')
    };

    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: UtilidadService, useValue: mockUtilidadService },
        { provide: Router, useValue: routerSpy }
      ]
      
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should login and navigate if credentials are correct', () => {
    component.formularioLogin.controls['email'].setValue('code@Example.com');
    component.formularioLogin.controls['password'].setValue('123');

    component.iniciarSesion();

    expect(mockUsuarioService.iniciarSesion).toHaveBeenCalled();
    expect(mockUtilidadService.guardarSesionUsuario).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['pages']);
    expect(component.isCheck).toBeTrue();  // Si agregaste `this.isCheck = true`
  });

  it('should show alert on login error', () => {
    mockUsuarioService.iniciarSesion.and.returnValue(throwError(() => new Error('Server error')));

    component.formularioLogin.controls['email'].setValue('fail@mail.com');
    component.formularioLogin.controls['password'].setValue('wrong');

    component.iniciarSesion();

    expect(mockUtilidadService.mostrarAlerta).toHaveBeenCalledWith('Hubo un error', 'Opps!');
  });
});

// venta

describe('LoginComponente', () => {
  let component: DashBoardComponent;
  let fixture: ComponentFixture<DashBoardComponent>;
  let mockDashboardService: jasmine.SpyObj<DashBoardService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Simulación de peticiones HTTP
      declarations: [DashBoardComponent],
     // providers: [{ provide: DashBoardService, useValue: mockDashboardService}],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashBoardComponent);
    component = fixture.componentInstance;
  });

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [ DashBoardComponent ],
    imports: [ MatCardModule ]  // Aquí importas el módulo necesario
  }).compileComponents();
});

  it('should create the componente', () => {
    expect(component).toBeTrue();
  });

  it('should initialize dashboard data correctly', () => {
    // Simular respuesta del servicio
  const mockData = {
  status: true,
  msg: 'Datos cargados correctamente', // Se agrega la propiedad msg
  value: {
    totalIngresos: '5000',
    totalVentas: '100',
    totalProductos: '50',
    ventasUltimaSemana: [
      { Fecha: '2025-05-01', Total: 10 },
      { Fecha: '2025-05-02', Total: 20 },
    ],
  },
};

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.totalIngresos).toEqual('5000');
    expect(component.totalVentas).toEqual('100');
    expect(component.totalProductos).toEqual('50');
    expect(component.ventasPorDia.length).toBeGreaterThan(0);
  });

  it('should generate bar chart correctly', () => {
   const labels = ['2025-05-01', '2025-05-02'];
   const data = [10, 20];

   component.mostrarGraficoBarras(labels, data);
   expect(component.chartBarras).toBeDefined();
   expect(component.chartBarras.data.labels).toEqual(labels);
  });

  it('should generate line chart correctly', () => {
   const labels = ['2025-05-01', '2025-05-02'];
   const data = [500, 1000];

    component.mostrarGraficoLineas(labels, data);
    expect(component.chartLineas).toBeDefined();
    expect(component.chartLineas.data.labels).toEqual(labels);
  });
  
  it('should destroy charts on component destroy', () => {
    spyOn(component.chartBarras, 'destroy');
    spyOn(component.chartLineas, 'destroy');

    component.ngOnDestroy();

    expect(component.chartBarras.destroy).toHaveBeenCalled();
    expect(component.chartLineas.destroy).toHaveBeenCalled();
  });
});