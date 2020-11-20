// Purpose of this file is to remove annoying redundent imports from our tests
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { initialState } from './store/reducers/app.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const MATERIAL_MODULE_DEPENDENCIES = [
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatMenuModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  BrowserAnimationsModule
];

export const NGRX_STORE_MODULE = provideMockStore({ initialState });
