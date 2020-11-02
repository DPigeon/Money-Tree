import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/app.reducer';
import { Stock } from 'src/app/interfaces/stock';

export const selectLoadedStock = (state: State) => state.currentStockLoaded;
