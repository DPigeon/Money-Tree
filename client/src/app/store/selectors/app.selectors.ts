import { createSelector } from '@ngrx/store';
import { State } from '../reducers/app.reducer';

interface AppState {
  appState: State;
}

export const selectAppState = (data: AppState) => data.appState;

export const selectCurrentStock = createSelector(
  selectAppState,
  (appState: State) => appState.currentStockLoaded
);
