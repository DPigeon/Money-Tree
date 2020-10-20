import { createAction, props } from '@ngrx/store';

export const loadActionss = createAction(
  '[Actions] Load Actionss'
);

export const loadActionssSuccess = createAction(
  '[Actions] Load Actionss Success',
  props<{ data: any }>()
);

export const loadActionssFailure = createAction(
  '[Actions] Load Actionss Failure',
  props<{ error: any }>()
);
