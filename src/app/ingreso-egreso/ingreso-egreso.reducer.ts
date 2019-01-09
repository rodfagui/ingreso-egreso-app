import * as fromIngresoEgreso from './ingreso-egreso.actions';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AppState } from '../app.reducer';

export interface IngresoEgresoState {
  items: IngresoEgreso[];
}

const estadoInicial: IngresoEgresoState = {
  items: []
};

export interface AppState extends AppState {
  ingresoEgreso: IngresoEgresoState;
}

export function ingresoEgresoReducer ( state = estadoInicial, action: fromIngresoEgreso.Acciones ) {
  switch ( action.type ) {
    case fromIngresoEgreso.SET_ITEMS:
      return {
        items: [
          ...action.items.map( item => {
            return {
              ...item
            };
          })
        ]
      };
    case fromIngresoEgreso.UNSET_ITEMS:
      return {
        items: []
      };
    default:
      return state;
  }
}

