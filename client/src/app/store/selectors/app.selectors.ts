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

export const selectCurrentUser = createSelector(
  selectAppState,
  (appState: State) => appState.user
);

export const selectAppError = createSelector(
  selectAppState,
  (appState: State) => appState.errorMessage
);
