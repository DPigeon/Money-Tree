import { Action, createReducer, on } from '@ngrx/store';
import { User } from 'src/app/interfaces/user';


export const reducerFeatureKey = 'reducer';

export interface State {
  user: User;
}

export const initialState: State = {
  user: null
};


export const reducer = createReducer(
  initialState,

);

