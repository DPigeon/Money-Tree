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
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

// echarts
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { UserService } from './services/user/user.service';
import { TransactionService } from './services/transaction/transaction.service';

export const MATERIAL_MODULE_DEPENDENCIES = [
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatMenuModule,
  MatDividerModule,
  MatButtonModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  BrowserAnimationsModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatSnackBarModule,
];

export const NGRX_STORE_MODULE = provideMockStore({ initialState });
export const USER_SERVICE = UserService;
export const TRANSACTION_SERVICE = TransactionService;

export const NGX_ECHART = NgxEchartsModule.forRoot({ echarts });

export const FORM_MODULE_DPENDENCEIES = [FormsModule, ReactiveFormsModule];
