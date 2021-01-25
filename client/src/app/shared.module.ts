// Purpose of this file is to remove annoying redundent imports from our tests
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { initialState } from './store/reducers/app.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export const MATERIAL_MODULE_DEPENDENCIES = [
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatMenuModule,
  MatDividerModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  BrowserAnimationsModule,
  MatAutocompleteModule
];

export const NGRX_STORE_MODULE = provideMockStore({ initialState });

export const FORM_MODULE_DPENDENCEIES = [
  FormsModule,
  ReactiveFormsModule
];
