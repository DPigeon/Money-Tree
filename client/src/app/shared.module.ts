import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
// Purpose of this file is to remove annoying redundent imports from our tests

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { initialState } from './store/reducers/app.reducer';
import { provideMockStore } from '@ngrx/store/testing';

export const MATERIAL_MODULE_DEPENDENCIES = [
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatMenuModule,
  MatButtonModule,
];

export const NGRX_STORE_MODULE = provideMockStore({ initialState });
