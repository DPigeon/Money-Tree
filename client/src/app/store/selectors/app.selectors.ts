import { createSelector } from '@ngrx/store';
import { State } from '../reducers/app.reducer';
import { Stock } from 'src/app/interfaces/stock';

interface appState {
    appState: State
}

export const selectAppState = (data: appState) => data.appState;

export const selectCurrentStock = createSelector(
    selectAppState,
    (appState: State) => appState.currentStockLoaded
)
