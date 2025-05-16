import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { LayoutComponent } from './Components/layout/layout.component';

// Importar todos los módulos necesarios de Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';  
import { MatTableModule } from '@angular/material/table';  
import { MatPaginatorModule } from '@angular/material/paginator';  
import { MatDatepickerModule } from '@angular/material/datepicker';  // Agregar MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core';  // Agregar MatNativeDateModule


import { SharedModule } from './Reutilizable/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component2Component } from './component2/component2.component';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    Component2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule, 
    MatTableModule, 
    MatPaginatorModule,
    MatDatepickerModule,  // Importar MatDatepickerModule
    MatNativeDateModule,  // Importar MatNativeDateModule
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
