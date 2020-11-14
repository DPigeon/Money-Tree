// Purpose of this file is to remove annoying redundent imports from our tests

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { initialState } from './store/reducers/app.reducer';
import { provideMockStore } from '@ngrx/store/testing';
import {MatDividerModule} from '@angular/material/divider';

export const MATERIAL_MODULE_DEPENDENCIES = [
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule
];

export const NGRX_STORE_MODULE = provideMockStore({ initialState });
