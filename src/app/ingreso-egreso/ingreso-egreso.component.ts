import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  forma: FormGroup;
  tipo = 'ingreso';
  loadingSubs: Subscription = new Subscription();
  cargando: boolean;

  constructor( public ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState> ) { }

  ngOnInit() {
    this.forma = new FormGroup({
      'descripcion': new FormControl( '', Validators.required ),
      'monto': new FormControl( 0, Validators.min(0) )
    });
    this.loadingSubs = this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading );
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }

  crearIngresoEgreso() {
    const loadingAccion = new ActivarLoadingAction();
    const noLoadingAccion = new DesactivarLoadingAction();
    this.store.dispatch(loadingAccion);

    const ingresoEgreso = new IngresoEgreso({ ...this.forma.value, tipo: this.tipo });
    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso ).then(() => {
      this.store.dispatch(noLoadingAccion);
      Swal('Creado', ingresoEgreso.descripcion, 'success');
      this.forma.reset({
        monto: 0
      });
      this.tipo = 'ingreso';
    }).catch((error) => {
      this.store.dispatch(noLoadingAccion);
      Swal('Error', error.message, 'error');
    });
  }
}
