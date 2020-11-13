// Purpose of this file is to remove annoying redundent imports from our tests

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { initialState } from './store/reducers/app.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import { MatButtonModule } from '@angular/material/button';

export const MATERIAL_MODULE_DEPENDENCIES = [
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule
];

export const NGRX_STORE_MODULE = provideMockStore({ initialState });
